// https://nextjs.org/docs/app/building-your-application/routing/route-handlers
import { type NextRequest } from 'next/server';
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import type { Product } from 'types/Product';

// https://www.cotodigital.com.ar/sitios/cdigi/categoria?Nr=product.eanPrincipal:<ean>
async function getCotoDigitalProduct(ean: string): Promise<any | undefined> {
  const url = `https://www.cotodigital.com.ar/sitios/cdigi/categoria?Nr=product.eanPrincipal:${encodeURIComponent(
    ean,
  )}&format=json`;
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
      'Accept-Language': 'es-AR,es',
    },
  });
  const json = (await response.json()) as any;

  for (const content of json.contents) {
    if (content['@type'] !== 'Category_LandingPage') continue;
    const main = content.Main || [];
    for (const m of main) {
      if (m['@type'] !== 'Main_Slot') continue;
      const contents = m.contents || [];
      for (const c of contents) {
        if (c['@type'] !== 'Category_ResultsList') continue;
        const records = c.records || [];
        for (const record of records) {
          const recordRecords = record.records || [];
          for (const rr of recordRecords) {
            const product: any = { code: { ean } };
            const url = rr.detailsAction?.recordState;
            if (url)
              product.url =
                'https://www.cotodigital.com.ar/sitios/cdigi/productos' + url;
            const attributes = rr.attributes || {};
            for (const key of [
              'product.displayName',
              'sku.displayName',
              'product.description',
              'sku.description',
            ]) {
              const name = attributes[key]?.[0];
              if (name) {
                product['name'] = name;
                break;
              }
            }

            const image = attributes['product.largeImage.url']?.[0];
            if (image) product.image = image;
            let plu = attributes['product.repositoryId']?.[0];
            if (!plu) plu = attributes['sku.repositoryId']?.[0];
            if (plu) product.code.plu = plu;
            const price = attributes['sku.activePrice']?.[0];
            if (price) product.price = price;

            const by_kg = attributes['product.unidades.esPesable']?.[0];
            if (parseInt(by_kg, 10)) product.by_kg = true;

            return product;
          }
        }
      }
    }
  }
}

function safeTrim(str: string | undefined): string {
  return (str || '').trim();
}

function fixImageUrl(url?: string): string {
  if (url) {
    const match = url.match(
      /https:\/\/static\.cotodigital3\.com\.ar\/sitios\/fotos\/[^/]+\/([^/]*?)\/([^/]*?)\.jpg/,
    );

    if (match) return `/api/img/${match[1]}-${match[2]}`;
  }

  return '';
}

export async function GET(
  req: NextRequest,
  { params }: { params: { ean: string } },
) {
  const { ean } = params;
  if (!ean || Array.isArray(ean)) return Response.json({}, { status: 404 });

  const product = await getCotoDigitalProduct(ean);

  if (!product) return Response.json({}, { status: 404 });
  if (product.image) {
    product.image_cdn = product.image;
    product.image = fixImageUrl(product.image);
  }

  return Response.json(product, {
    status: 200,
    headers: {
      'Cache-Control': 'public, immutable, max-age=86400',
    },
  });
}
