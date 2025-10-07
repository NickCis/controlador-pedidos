'use client';

import { useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTour, type StepType } from '@reactour/tour';

import ReceiptQRImg from '@/img/receipt-qr.jpg';
//
// fix-vim-highlight = }

const Img = styled('img')({
  width: '100%',
  maxWidth: '250px',
  maxHeight: '300px',
  objectFit: 'contain',
});

const Key = 'SuperDigitalOnboarding';
type TourKeys = 'home-empty' | 'home-content';

let cache: Record<string, boolean> | undefined = undefined;

const Steps: Record<TourKeys, StepType[]> = {
  'home-empty': [
    {
      selector: 'header',
      position: 'center',
      content: () => (
        <>
          <Typography gutterBottom>
            Esta aplicación te permitirá controlar que están todos los productos
            facturados por supermercados.
          </Typography>
          <Typography gutterBottom>
            Para eso vas a usar la cámara para escanear el QR pequeño que esta
            al final de la factura y el códigos de barras de cada uno de los
            productos comprados.
          </Typography>
          <Box width="100%" display="flex" justifyContent="center">
            <Img src={ReceiptQRImg.src} alt="Ejemplo de QR" />
          </Box>
          <Typography variant="caption">
            Vas a tener que escanear el QR pequeño que esta al final de la
            factura
          </Typography>
        </>
      ),
    },
    {
      selector: '#empty-scan-button',
      content: () => (
        <Typography>Con este botón vas a poder escanear el QR.</Typography>
      ),
    },
    {
      selector: '#text-field-scan-button',
      content: () => (
        <Typography>
          Tambíen podes usar este botón para abrir el escaner!
        </Typography>
      ),
    },
    {
      selector: '#help-button',
      content: () => (
        <Typography>Si necesitas más ayuda, podes tocar este botón.</Typography>
      ),
      position: 'bottom',
    },
    {
      selector: '#report-bug-button',
      content: () => (
        <Typography>
          En el caso que te encontraste con un error en la aplicación, lo vas a
          poder reportar desde acá (vas a tener que registrarte a GitHub
          previamente).
        </Typography>
      ),
    },
  ],
  'home-content': [
    {
      selector: '#pending-product-list',
      content: () => (
        <Typography>
          En esta lista están los productos que todavía no escaneaste.
        </Typography>
      ),
    },
    {
      selector: '#fullfilled-product-list',
      content: () => (
        <Typography>
          En esta otra lista apareceran los productos que ya revisaste.
        </Typography>
      ),
    },
    {
      selector: '#scan-fab',
      content: () => (
        <Typography>
          Usa este botón para escanear los códigos de barra de los productos!.
        </Typography>
      ),
    },
    {
      selector: '.pending-product-list-fullfill-button',
      content: () => (
        <Typography>
          Con este botón vas a marcar que llegó todas las unidades del producto.
        </Typography>
      ),
    },
    {
      selector: '.pending-product-list-add-button',
      content: () => (
        <Typography>
          Este sirve para marcar que controlaste solo la cantidad que ves en la
          entrada de la izquierda (podes cambiar el número de ser necesario!).
        </Typography>
      ),
    },
    {
      selector: '#text-field-scan-button',
      content: () => (
        <Typography>Podes usar este botón para escanear otro ticket</Typography>
      ),
    },
    {
      selector: '#home-content-clear-button',
      content: () => (
        <Typography>
          Cuando terminaste, si queres borrar el pedido, toca este botón.
        </Typography>
      ),
    },
  ],
};

function readLocalStorage(): Record<string, boolean> {
  if (!cache) {
    cache = {};
    if (typeof window !== undefined) {
      try {
        cache = JSON.parse(window.localStorage.getItem(Key) || '{}') || {};
      } catch (e) {
        console.error(e);
      }
    }
  }

  return cache || {};
}

function useOnboarding(key: TourKeys) {
  const tour = useTour();
  const ref = useRef(tour);
  ref.current = tour;
  useEffect(() => {
    if (!ref.current) return;
    const state = readLocalStorage();
    const steps = Steps[key];
    if (state[key] || !steps || !ref.current) return;
    const { setSteps, setCurrentStep, setIsOpen } = ref.current;
    if (!setSteps || !setCurrentStep || !setIsOpen) return;
    setSteps(steps);
    setCurrentStep(0);
    setIsOpen(true);
    cache = {
      ...cache,
      [key]: true,
    };
    window.localStorage.setItem(Key, JSON.stringify(cache));
  }, [key]);
}

export default useOnboarding;
