# Crawler

Crawler de productos.

```
python -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt
scrapy crawl cotodigital -o cotodigital.ljson:jsonlines
python ./merge.py --merge ./cotodigital.ljson ../json/plu.json
```

## Aviso de responsabilidad y uso legítimo (Fair Use)

Este proyecto ha sido desarrollado únicamente con fines didácticos, experimentales y de investigación sobre técnicas de análisis y automatización de datos públicos.

No tiene ninguna relación, patrocinio, respaldo ni afiliación con COTO CICSA, sus marcas registradas o sus plataformas digitales (incluyendo “COTO Digital”).

El código fuente se ofrece con propósitos educativos, bajo el amparo del principio de uso legítimo (fair use), aplicable al análisis, ingeniería inversa y estudio de interfaces públicas con fines de aprendizaje y compatibilidad técnica.

Este software no reproduce ni distribuye material propietario, ni busca suplantar servicios oficiales.
