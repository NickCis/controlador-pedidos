import type { ReactNode } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

import type { Product } from 'types/Product';

export interface ProductListProps {
  title?: ReactNode;
  products: Product[];
  renderAction?: (p: Product) => ReactNode;
  emptyState?: ReactNode;
}

function ProductItem({
  product,
  renderAction,
}: {
  product: Product;
  renderAction?: ProductListProps['renderAction'];
}) {
  return (
    <ListItem
      sx={{
        contentVisibility: 'auto',
        containIntrinsicSize: '0 60px',
      }}
      secondaryAction={renderAction ? renderAction(product) : undefined}
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

function ProductList({
  title,
  products,
  renderAction,
  emptyState,
}: ProductListProps) {
  return (
    <List subheader={title && <ListSubheader>{title}</ListSubheader>} dense>
      {products.length > 0
        ? products.map((p) => (
            <ProductItem
              key={`${p.code.plu}-${p.code.ean}`}
              product={p}
              renderAction={renderAction}
            />
          ))
        : emptyState || null}
    </List>
  );
}

export default ProductList;
