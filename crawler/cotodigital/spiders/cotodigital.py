import json
import scrapy

class Cotodigital(scrapy.Spider):
    name = "cotodigital"
    start_urls = [
        'https://www.cotodigital3.com.ar/sitios/cdigi/browse',
    ]

    def parse(self, response):
        has_next = False
        has_ld = False

        for a in response.css('div.product_info_container > a'):
            yield response.follow(a.attrib['href'], self.parse_product)

        next_link = response.css('a[title="Siguiente"]::attr(href)').get()
        if next_link:
            yield response.follow(next_link, self.parse)

    def parse_product(self, response):
        codes = response.css('.span_codigoplu::text').getall()
        yield {
            'url': response.request.url,
            'name': response.css('h1.product_page::text').get().strip(),
            'code': {
                'plu': codes[0].strip(),
                'ean': codes[1].strip(),
            },
            'img': response.css('img.zoomImage1::attr(src)').get(),
            'price': response.css('.atg_store_newPrice::text').get().strip(),
            'by_kg': response.css('section.unit_products::text').get().lower() == 'en kg:',
        }
