import { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';

import DoneIcon from '@mui/icons-material/Done';
import AddIcon from '@mui/icons-material/Add';

import type Product from 'types/Product';

function AddField({ onClick }: { onClick: (v: number) => void }) {
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
              <AddIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
}

export interface PendingProductsListProps {
  products: Product[];
  onFullfill: (product: Product, amount?: number) => void;
}

function Product({
  product,
  onFullfill,
}: {
  product: Product;
  onFullfill: PendingProductsListProps['onFullfill'];
}) {
  return (
    <ListItem
      secondaryAction={
        <>
          <AddField onClick={(v) => onFullfill(product, v)} />
          <IconButton
            edge="end"
            color="primary"
            onClick={() => onFullfill(product)}
          >
            <DoneIcon />
          </IconButton>
        </>
      }
    >
      <ListItemAvatar>
        <Avatar alt={product.name} src={product.img} />
      </ListItemAvatar>
      <ListItemText
        primary={product.name}
        secondary={`${product.amount} x $${product.price.unit}`}
      />
    </ListItem>
  );
}

function PendingProductsList({
  products,
  onFullfill,
}: PendingProductsListProps) {
  return (
    <List subheader={<ListSubheader>Productos Pendientes</ListSubheader>} dense>
      {products.map((p) => (
        <Product
          product={p}
          key={`${p.code.plu}-${p.code.lean}`}
          onFullfill={onFullfill}
        />
      ))}
    </List>
  );
}

export default PendingProductsList;
