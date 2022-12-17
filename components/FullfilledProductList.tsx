import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';

import ClearIcon from '@mui/icons-material/Clear';
import RemoveIcon from '@mui/icons-material/Remove';

import type { Product } from 'types/Product';
import ProductList from './ProductList';

function RemoveField({ onClick }: { onClick: (v: number) => void }) {
  const [value, setValue] = useState(1);
  return (
    <FormControl
      margin="dense"
      sx={{ width: `${7 + `${value}`.length}ch` }}
      variant="standard"
    >
      <Input
        margin="dense"
        type="number"
        value={+value}
        onChange={(e) => setValue(+e.target.value)}
        endAdornment={
          <InputAdornment position="start" sx={{ margin: 0 }}>
            <IconButton onClick={() => onClick(value)}>
              <RemoveIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
}

export interface FullfilledProductListProps {
  products: Product[];
  onClear: (product: Product, amount?: number) => void;
}

function FullfilledProductList({ products, onClear }: FullfilledProductListProps) {
  return (
    <ProductList
      title="Productos controlados"
      products={products}
      renderAction={(product) => (
        <>
          <RemoveField onClick={(v) => onClear(product, v)} />
          <IconButton
            edge="end"
            color="primary"
            onClick={() => onClear(product)}
          >
            <ClearIcon />
          </IconButton>
        </>
      )}
    />
  );
}

export default FullfilledProductList;
