import scrapy


class Cotodigital(scrapy.Spider):
    name = "cotodigital"
    start_urls = [
        'https://www.cotodigital.com.ar/sitios/cdigi/categoria?format=json',
    ]

    def parse(self, response):
        data = response.json()
        next_page = ''
        for content in data['contents']:
            type_ = content.get('@type')
            if type_ != 'Category_LandingPage':
                continue
            main = content.get('Main', [])
            for m in main:
                mtype = m.get('@type')
                if mtype != 'Main_Slot':
                    continue
                contents = m.get('contents', [])
                for c in contents:
                    ctype = c.get('@type')
                    if ctype != 'Category_ResultsList':
                        continue
                    # XXX: para ver como construye las url buscar siguiente código:
                    # for (let t = 0; t < this.cantidadPaginas; t++) {
                    navigation_state = c.get('pagingActionTemplate', {}).get(
                        'navigationState', '')
                    recs_per_page = int(c.get('recsPerPage', 1))
                    split = navigation_state.split('%7Boffset%7D')
                    first_rec_num = int(c.get('firstRecNum', 24))
                    next_i = 1 + first_rec_num // recs_per_page
                    pages_amount = int(
                        c.get('totalNumRecs', 0)) / recs_per_page
                    if next_i < pages_amount:
                        next_page = f'{split[0]}{next_i * recs_per_page}{split[1].replace("%7BrecordsPerPage%7D", str(recs_per_page))}'

                    records = c.get('records', [])
                    for record in records:
                        record_records = record.get('records', [])
                        for rr in record_records:
                            product = {}
                            url = rr.get('detailsAction', {}).get(
                                'recordState')
                            if url:
                                product['url'] = 'https://www.cotodigital.com.ar/sitios/cdigi/productos' + url

                            attributes = rr.get('attributes', {})
                            for key in ['product.displayName', 'sku.displayName', 'product.description', 'sku.description']:
                                name = attributes.get(key, [''])[0]
                                if name:
                                    product['name'] = name
                                    break

                            image = attributes.get(
                                'product.largeImage.url', [''])[0]
                            if image:
                                product['image'] = image

                            ean = attributes.get(
                                'product.eanPrincipal', [''])[0]
                            plu = attributes.get(
                                'product.repositoryId', [''])[0]
                            if not plu:
                                plu = attributes.get(
                                    'sku.repositoryId', [''])[0]

                            if ean or plu:
                                product['code'] = {}
                                if ean:
                                    product['code']['ean'] = ean

                                if plu:
                                    product['code']['plu'] = str(
                                        int(plu.replace('prod', '').replace('sku', '')))

                            price = attributes.get('sku.activePrice', [''])[0]
                            if price:
                                product['price'] = price

                            by_kg = attributes.get(
                                'product.unidades.esPesable', ['0'])[0]
                            if int(by_kg):
                                product['by_kg'] = True

                            if len(product.keys()):
                                yield product

        if next_page:
            yield response.follow(next_page, self.parse)
