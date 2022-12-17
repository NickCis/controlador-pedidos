import type { PropsWithChildren, ReactNode } from 'react';
import { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import BottomSheet, {
  BottomSheetTitle,
  BottomSheetContent,
  BottomSheetActions,
  BottomSheetProps,
} from 'components/BottomSheet';
import type { Product, ApiProduct } from 'types/Product';
import type { Cart } from 'hooks/useCart';

interface ProductDetail {
  product: {
    name: string;
    img: string;
  };
  ean: string;
}

interface StateFound {
  product: Product;
  ean: string;
  type: 'plu' | 'sku' | 'ean';
  amount: number;
}
interface StateLoading {
  state: 'loading';
}
interface StateError {
  state: 'error';
  message?: string;
}
interface StateNotFound {
  state: 'not-found';
  product: {
    name: string;
    img: string;
  };
  ean: string;
}

type State = StateLoading | StateError | StateNotFound | StateFound;

function stateIsLoading(state: State): state is StateLoading {
  return (state as StateLoading).state === 'loading';
}

function stateIsError(state: State): state is StateError {
  return (state as StateError).state === 'error';
}
function stateIsNotFound(state: State): state is StateNotFound {
  return (state as StateNotFound).state === 'not-found';
}

export interface ProductBottomSheetProps {
  ean?: string;
  cart: Cart;
  onFullfill: (product: Product, amount: number) => void;
}

export interface ProductBottomSheetContentProps {
  ean: string;
  cart: Cart;
  onClose: BottomSheetProps['onClose'];
  onFullfill: ProductBottomSheetProps['onFullfill'];
}

const ProductCache: Record<string, ApiProduct> = {};

async function fetchProduct(
  ean: string,
  signal?: AbortSignal,
): Promise<ApiProduct | undefined> {
  if (!ProductCache[ean]) {
    const response = await fetch(`/api/product/${ean}`, { signal });
    if (response.ok) {
      const json = await response.json();
      // TODO: validate
      ProductCache[ean] = json as ApiProduct;
    }
  }

  return ProductCache[ean];
}

function ProductSheet({
  name = '',
  description = '',
  children,
  img = '',
}: PropsWithChildren<{
  name?: ReactNode;
  description?: ReactNode;
  img?: string;
}>) {
  return (
    <BottomSheetContent>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ height: 96 }}>
          <Box
            component="img"
            sx={{ height: '100%', display: 'block' }}
            src={img}
          />
        </Box>
        <Box pl={1} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle2" sx={{ flex: 1, pt: 1 }}>
            {name}
          </Typography>
          <Typography variant="body2" sx={{ pb: 0.5 }}>
            {description}
          </Typography>
        </Box>
      </Box>
      {children}
    </BottomSheetContent>
  );
}

function ProductFound({
  onClose,
  state,
  onFullfill,
}: {
  onClose: BottomSheetProps['onClose'];
  state: StateFound;
  onFullfill: ProductBottomSheetProps['onFullfill'];
}) {
  const [amount, setAmount] = useState<number>(state.amount);
  return (
    <>
      <BottomSheetTitle onClose={onClose}>
        Se encontr&oacute; un producto
      </BottomSheetTitle>
      <ProductSheet
        name={state.product.name}
        img={state.product.img}
        description={`EAN: ${state.ean}`}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 4,
            mb: 1,
          }}
        >
          <Box sx={{ mx: 1 }}>
            <IconButton onClick={() => setAmount((a) => Math.max(a - 1, 0))}>
              <RemoveIcon />
            </IconButton>
          </Box>
          <TextField
            label="Cantidad"
            value={amount}
            onChange={(e) => setAmount(+e.target.value)}
            variant="outlined"
            type="number"
          />
          <Box sx={{ mx: 1 }}>
            <IconButton onClick={() => setAmount((a) => a + 1)}>
              <AddIcon />
            </IconButton>
          </Box>
        </Box>
      </ProductSheet>
      <BottomSheetActions>
        <Button
          variant="contained"
          onClick={(e) => {
            onFullfill(state.product, amount);
            onClose && onClose(e, 'backdropClick');
          }}
        >
          Agregar
        </Button>
      </BottomSheetActions>
    </>
  );
}

function ProductBottomSheetContent({
  ean,
  cart,
  onClose,
  onFullfill,
}: ProductBottomSheetContentProps) {
  // TODO: mejorar derivaci`on inicial de estado
  const [state, setState] = useState<State | null>(null);
  const cartRef = useRef<Cart | null>(null);
  cartRef.current = cart;

  useEffect(() => {
    const cart = cartRef.current;
    if (!ean || !cart) return;
    // https://www.activebarcode.com/codes/ean13_laenderpraefixe
    // Los EAN-13 que estan en los productos pueden ser un "plu" / "sku" disfrazado:
    // - Si el producto es por peso (plu)
    // - Si son unos productos de coto (sku)
    // Son todos los ean que arranquen con 20 - 29
    const code = ean.substring(0, 2);
    let sku = '';
    let plu = '';
    let amount = 1;

    if ('20' <= code && code <= '29') {
      // 2800001369100
      // KKSSSSSSSSSSC -> K=country code | S -> SKU | C -> CRC
      sku = `${parseInt(ean.substring(2, 12), 10)}`.padStart(14, '0');
      // 2627090012782
      // KKPPPPPWWWWWC -> K=country code | P -> PLU | W -> weight | C -> CRC
      plu = ean.substring(2, 7).padStart(14, '0');
      amount = parseInt(ean.substring(7, 12), 10) / 1000;
    }

    for (const pending of cart.pending) {
      if (pending.code.plu === sku) {
        setState({
          product: pending,
          type: 'sku',
          amount: 1,
          ean,
        });
        return;
      }

      if (pending.code.plu === plu) {
        setState({
          product: pending,
          type: 'plu',
          amount,
          ean,
        });
        return;
      }

      if (pending.code.ean === ean) {
        setState({
          product: pending,
          type: 'ean',
          amount: 1,
          ean,
        });
        return;
      }
    }

    let cancel = false;
    const controller = new AbortController();

    // TODO: chequear que no se este scaneando un producto ya procesado!

    (async () => {
      setState({ state: 'loading' });
      const product = await fetchProduct(ean, controller.signal);
      if (cancel) return;
      if (!product) {
        setState({ state: 'error' });
        return;
      }

      const sku = product.code.plu.padStart(14, '0');
      for (const pending of cart.pending) {
        if (pending.code.plu === sku) {
          setState({
            product: pending,
            type: 'ean',
            amount: 1,
            ean,
          });
          return;
        }
      }

      setState({ state: 'not-found', product, ean });
    })();

    return () => {
      cancel = true;
      controller.abort();
    };
  }, [ean]);

  if (!state) return null;

  if (stateIsError(state))
    return (
      <>
        <BottomSheetTitle onClose={onClose}>Error</BottomSheetTitle>
        <BottomSheetContent sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="body2" mt={4} align="center">
            Hubo un error
          </Typography>
        </BottomSheetContent>
        <BottomSheetActions>
          <Button
            variant="contained"
            onClick={onClose ? (e) => onClose(e, 'backdropClick') : undefined}
          >
            Cerrar
          </Button>
        </BottomSheetActions>
      </>
    );

  if (stateIsNotFound(state))
    return (
      <>
        <BottomSheetTitle onClose={onClose}>
          Producto desconocido
        </BottomSheetTitle>
        <ProductSheet
          name={state.product.name}
          img={state.product.img}
          description={`EAN: ${state.ean}`}
        >
          <Typography variant="body2" mt={4} align="center">
            El producto no se encuentra en la lista de productos comprados
          </Typography>
        </ProductSheet>
        <BottomSheetActions>
          <Button
            variant="contained"
            onClick={onClose ? (e) => onClose(e, 'backdropClick') : undefined}
          >
            Cerrar
          </Button>
        </BottomSheetActions>
      </>
    );

  if (stateIsLoading(state))
    return (
      <>
        <BottomSheetTitle onClose={onClose}>Cargando...</BottomSheetTitle>
        <BottomSheetContent sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </BottomSheetContent>
      </>
    );

  return (
    <ProductFound onClose={onClose} state={state} onFullfill={onFullfill} />
  );
}

function ProductBottomSheet({
  ean,
  cart,
  onFullfill,
  ...props
}: ProductBottomSheetProps & Omit<BottomSheetProps, 'open'>) {
  const memory = useRef<string | null>(null);
  if (ean) memory.current = ean;
  const _ean = ean || memory.current;

  return (
    <BottomSheet {...props} open={!!ean}>
      {!!_ean && (
        <ProductBottomSheetContent
          ean={_ean}
          cart={cart}
          onClose={props.onClose}
          onFullfill={onFullfill}
        />
      )}
    </BottomSheet>
  );
}

export default ProductBottomSheet;
