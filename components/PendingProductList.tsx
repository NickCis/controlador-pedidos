import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import DoneIcon from '@mui/icons-material/Done';
import AddIcon from '@mui/icons-material/Add';

import type { Product } from 'types/Product';
import ProductList from './ProductList';

function AddField({
  onClick,
  product,
}: {
  onClick: (v: number) => void;
  product: Product;
}) {
  const [value, setValue] = useState(Math.min(1, product.amount));
  const _value = `${value}`;
  return (
    <FormControl
      margin="dense"
      sx={{ width: `${5 + _value.length}ch` }}
      variant="standard"
    >
      <Input
        sx={{
          fontFamily: 'monospace',
        }}
        margin="dense"
        type="number"
        value={_value}
        onChange={(e) => setValue(Math.min(+e.target.value, product.amount))}
        endAdornment={
          <InputAdornment position="start" sx={{ margin: 0 }}>
            <IconButton onClick={() => onClick(value)}>
              <AddIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
}

export interface PendingProductListProps {
  products: Product[];
  onFullfill: (product: Product, amount?: number) => void;
}

function PendingProductList({ products, onFullfill }: PendingProductListProps) {
  return (
    <ProductList
      title="Productos Pendientes"
      products={products}
      emptyState={
        <Box sx={{ textAlign: 'center', p: 2 }}>
          <Box>
            <DoneIcon
              sx={{
                width: '32px',
                height: '32px',
                color: (theme) => theme.palette.success.main,
              }}
            />
          </Box>
          <Typography variant="body2">
            ¡Todos los productos fueron controlados!
          </Typography>
        </Box>
      }
      renderAction={(product) => (
        <>
          <AddField onClick={(v) => onFullfill(product, v)} product={product} />
          <IconButton
            edge="end"
            color="primary"
            onClick={() => onFullfill(product)}
          >
            <DoneIcon />
          </IconButton>
        </>
      )}
    />
  );
}

export default PendingProductList;
