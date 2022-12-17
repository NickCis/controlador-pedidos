# Coto digital crawler

```
python -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt
scrapy crawl cotodigital -o cotodigital.ljson --output-format jsonlines
python ./merge.py --merge ./cotodigital.ljson ../json/plu.json
```

## Avoid getting banned

- [Avoid getting banned](https://docs.scrapy.org/en/latest/topics/practices.html#avoiding-getting-banned)
- [Scraper api](https://www.scraperapi.com/)
