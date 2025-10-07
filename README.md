# Control de entregas de pedidos

> **Nota importante**: Este proyecto *no está afiliado, patrocinado ni respaldado* por **COTO CICSA** ni sus subsidiarias o marcas asociadas.
> “COTO” y “COTO Digital” son marcas registradas de sus respectivos titulares.

---

## Descripción

Esta herramienta permite al usuario verificar si los productos de un pedido fueron efectivamente entregados, comparando lo facturado con lo recibido, usando funciones como escaneo de QR y códigos de barras.

Este software opera de forma independiente y no actúa en nombre de las empresas que administran la plataformas de pedidos.

Plataformas implementadas (**no hay ninguna afiliación con ellas**):

- [COTO DIGITAL](https://www.cotodigital.com.ar/)

## Como usar

https://github.com/NickCis/controlador-pedidos/assets/174561/9d5b55e2-67fe-4905-94d6-dba32fba858c

1. Entra en [https://controlador-pedidos.vercel.app/](https://controlador-pedidos.vercel.app/)
2. Toca el botón "ESCANEAR" que esta en la mitad de la pantalla
3. Escanea el [QR de la factura](https://github.com/NickCis/controlador-pedidos?tab=readme-ov-file#de-que-qr-me-hablas)
4. Usa el botón de abajo a la derecha para activar el escaner de códigos de barra.
5. Escanea todos los productos
6. Revisa si faltó alguno!

## FAQs

### ¿De que QR me hablas?

Las facturas emitidas por la plataforma de pedidos tienen dos códigos QR al final. El primero (más pequeño) contiene los datos del pedido y es el que debe escanearse. El segundo es información fiscal (AFIP) y no es utilizado por esta aplicación.

![QR al final de la factura](./img/receipt-qr.jpg)

### No funciona el escaner de QR, ¿Que puedo hacer?

Si tenes problemas escaneando el QR, utiliza cualquier escaner de QR (la cámara en iOS o Android), copia y pegá el link en la entrada de texto que esta arriba de todo.

## TODO

- [x] Agregar producto mediante scannear no debería dejar agregar productos más que el existente
- [ ] Chequear que no se re marque un producto que ya fue marcado
- [x] Header: agregar link a github con explicación de como usar
- [x] Github: agregar explicación de como usar
- [x] Header: clear (con confirm)
- [x] Home empty state
- [x] Home loading state
- [ ] Home error state
- [x] Pending Product List empty state
- [x] Fullfilled Product List empty state
- [ ] Mejorar ScannerDialog ([ver](https://m2.material.io/design/machine-learning/barcode-scanning.html#components))
- [ ] Limpiar componente de fab
- [ ] FavIcon / Meta Title
- [ ] `grep --exclude-dir=.next --exclude-dir=node_modules --exclude-dir=crawler -nHr 'TODO'`
- [x] Arreglar splash inicial de empty states de listas de productos
- [x] Cache en localstorage de última sesión (ticket, `useFetchCart`, `useCart`):
- [ ] Service Worker (cache de imagenes e instalar)
- [x] Onboarding

---

## Aclaraciones legales

- Esta herramienta funciona exclusivamente con datos públicos proporcionados por las plataformas de pedidos, sin acceso privado o interno.
- No tiene acceso privilegiado ni integra funciones oficiales específicas de la empresas propietarias de las marcas.

