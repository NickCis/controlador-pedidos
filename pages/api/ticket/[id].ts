// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
// import fs from 'fs';
import type Product from 'types/Product';

const Base = 'http://apps01.coto.com.ar/TicketMobile/Ticket';

function toNumber(str?: string): number {
  if (!str) return 0;
  return +str.replace(/\$/g, '').replace(/\./g, '').replace(/,/g, '.');
}

interface Data {
  products: Product[];
  subsidiary?: {
    name: string;
    address: string;
    date: string;
    time: string;
  };
  total?: {
    perceptions: {
      name: string;
      value: number;
    }[];
    total?: number;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;
  const url = `${Base}/${id}`;
  const response = await fetch(url);
  const text = await response.text();
  // const text = fs.readFileSync('/home/nickcis/repos/cotodigital/ticket.html').toString();
  const root = parse(text);
  const products = root.querySelectorAll('.product-li');

  const data: Data = {
    products: [],
  };

  const main = root.querySelector('.main');
  if (main) {
    data.subsidiary = {
      name: main.querySelector('.single-title')?.text?.trim() || '',
      address: main.querySelector('.info-direccion')?.text?.trim() || '',
      date:
        main
          .querySelector('.info-ticket-main .text-big-grey.text-left')
          ?.text?.replace('Fecha:', '')
          ?.trim() || '',
      time:
        main
          .querySelector('.info-ticket-main .text-big-grey.text-right')
          ?.text?.replace('Hora:', '')
          ?.trim() || '',
    };
  }

  for (const product of products) {
    const img = product.querySelector('.producto-img');
    const name = product.querySelector('.info-producto-h2');
    const codes = product.querySelector('.info-producto-codigos');
    const amount = product
      .querySelector('.info-cant')
      ?.text?.match(/([\d.,]+)\s*x\s*\$([\d.,]+)/);
    const price = product.querySelector('.info-producto-price');
    const discounts = [];
    const discountsInfo = product.querySelectorAll('.info-descuento');
    const discountsPrice = product.querySelectorAll('.precio-descuento');
    for (let i = 0; i < discountsInfo.length; i++) {
      discounts.push({
        name: discountsInfo[i].text || '',
        amount: toNumber(discountsPrice[i]?.text),
      });
    }

    const vat = product.querySelector('.info-iva');

    data.products.push({
      img: img?.attributes?.style?.match(/url\(["']?([^)]*)["']?\)/)?.[1] || '',
      name: name?.text?.trim() || '',
      code: {
        plu: codes?.querySelector('.plu')?.text || 'unknown',
        lean: codes?.querySelector('.lean')?.text || 'unknown',
      },
      amount: toNumber(amount?.[1]),
      price: {
        unit: toNumber(amount?.[2]),
        total: toNumber(price?.text),
        discount: discounts,
      },
      vat: vat?.text || '',
    });
  }

  data.total = {
    perceptions: [],
  };

  const total = root.querySelector('.total');
  if (total) {
    data.total.total = toNumber(
      total.querySelector('.info-total-border .text-right')?.text,
    );

    const perceptions = total.querySelectorAll('.info-total');
    for (let i = 0; i < perceptions.length - 1; i++) {
      const perception = perceptions[i];
      if (!perception) continue;

      data.total.perceptions.push({
        name: perception.querySelector('.text-left')?.text?.trim() || 'unknown',
        value: toNumber(perception.querySelector('.text-right')?.text),
      });
    }
  }

  res.status(200).json(data);
}
