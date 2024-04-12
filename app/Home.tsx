'use client';

import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button, { ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import BugReportIcon from '@mui/icons-material/BugReport';
import ReceiptIcon from '@mui/icons-material/Receipt';
import QrCode2Icon from '@mui/icons-material/QrCode2';

import Frame from '@/components/Frame';
import TextFieldScan, {
  type TextFieldHandle,
} from '@/components/TextFieldScan';
import PendingProductList from '@/components/PendingProductList';
import FullfilledProductList from '@/components/FullfilledProductList';
import useFetchCart from '@/hooks/useFetchCart';
import useSesionState from '@/hooks/useSesionState';
import useCart, { Cart, CartSetter } from '@/hooks/useCart';
import type { Product } from '@/types/Product';
import BarCodeScannerIcon from '@/icons/BarCodeScanner';
import ScannerDialog from '@/components/ScannerDialog';
import { Html5QrcodeSupportedFormats } from '@/components/Scanner';
import ProductBottomSheet, {
  ProductBottomSheetProps,
} from '@/components/ProductBottomSheet';
import ClearButton from '@/components/ClearButton';
import useOnboarding from '@/hooks/useOnboarding';

// fix-vim-highlight = }

function Empty({ onClick }: { onClick?: ButtonProps['onClick'] }) {
  useOnboarding('home-empty');
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <ReceiptIcon sx={{ fontSize: '4em', marginBottom: 2 }} />
        <Typography variant="h6" gutterBottom>
          ¡Controla tu pedido!
        </Typography>
        <Box width="100%" px={1}>
          <Typography variant="body2" gutterBottom align="center">
            Para empezar a controlar el pedido escanea el QR pequeño que esta al
            final de la factura.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<QrCode2Icon />}
          sx={{ marginBottom: 1, marginTop: 2 }}
          onClick={onClick}
          id="empty-scan-button"
        >
          Escanear
        </Button>
        <Typography variant="caption">
          ¿No lo encontrás?{' '}
          <Link
            href="https://github.com/NickCis/cotodigital#como-usar"
            target="_blank"
          >
            Has click aquí
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}

function ScanFab({
  cart,
  onFullfill,
}: {
  cart: Cart;
  onFullfill: ProductBottomSheetProps['onFullfill'];
}) {
  const [open, setOpen] = useState(false);
  const [ean, setEan] = useState<string | undefined>();

  return (
    <>
      <ScannerDialog
        config={{
          formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13],
        }}
        open={open}
        onScanSuccess={(code: string) => {
          if (!ean) setEan(code);
        }}
        onClose={() => {
          setOpen(false);
        }}
      />
      <ProductBottomSheet
        cart={cart}
        ean={ean}
        onClose={() => setEan(undefined)}
        onFullfill={onFullfill}
      />
      <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <Fab color="primary" onClick={() => setOpen(true)} id="scan-fab">
          <BarCodeScannerIcon />
        </Fab>
      </Box>
    </>
  );
}

function Content({ cart, setCart }: { cart: Cart; setCart: CartSetter }) {
  useOnboarding('home-content');
  return (
    <Box sx={{ flex: 1 }}>
      <PendingProductList
        products={cart.pending}
        onFullfill={(product, amount) => {
          setCart('pending', product.code.plu, amount);
        }}
      />
      <FullfilledProductList
        products={cart.fullfilled}
        onClear={(product, amount) => {
          setCart('fullfilled', product.code.plu, amount);
        }}
      />
      <ScanFab
        cart={cart}
        onFullfill={(product, amount) => {
          setCart('pending', product.code.plu, amount);
        }}
      />
    </Box>
  );
}

export default function Home() {
  const textFieldScanRef = useRef<TextFieldHandle>(null);
  const [ticket, setTicket] = useSesionState('__ticket__', '');
  const { data, loading } = useFetchCart(ticket);
  const [cart, setCart, clearCart] = useCart(data);
  const isLoading = !!(loading || (ticket && data && !cart));
  const hasData = ticket && data && cart;

  return (
    <Frame
      p={1}
      pt={2}
      pb={9}
      sx={{ display: 'flex', flexDirection: 'column' }}
      header={
        <>
          <Tooltip title="Reportar un error">
            <IconButton
              color="inherit"
              component="a"
              target="_blank"
              href="https://github.com/NickCis/cotodigital/issues/new?assignees=NickCis&labels=bug&projects=&template=reporte-de-error.md&title="
              id="report-bug-button"
            >
              <BugReportIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="¿Como usar?">
            <IconButton
              color="inherit"
              component="a"
              target="_blank"
              href="https://github.com/NickCis/cotodigital#como-usar"
              id="help-button"
            >
              <QuestionMarkIcon />
            </IconButton>
          </Tooltip>
          {hasData ? (
            <ClearButton
              id="home-content-clear-button"
              onClick={() => {
                setTicket('');
                clearCart();
              }}
            />
          ) : null}
        </>
      }
    >
      <TextFieldScan
        ref={textFieldScanRef}
        value={ticket}
        onChange={(t) => setTicket(t)}
        label="Ticket de compra"
        disabled={isLoading}
        iconButtonId="text-field-scan-button"
      />
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <CircularProgress />
        </Box>
      ) : hasData ? (
        <Content cart={cart} setCart={setCart} />
      ) : (
        <Empty onClick={() => textFieldScanRef.current?.open()} />
      )}
    </Frame>
  );
}
