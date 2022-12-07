import { useState, useEffect } from 'react';
import Frame from 'components/Frame';
import TextFieldScan from 'components/TextFieldScan';
import PendingProductList from 'components/PendingProductList';
import useFetchCart from 'hooks/useFetchCart';
import useCart from 'hooks/useCart';

export default function Home() {
  const [ticket, setTicket] = useState('');
  const { data, loading } = useFetchCart(ticket);
  const [cart, setCart] = useCart(data);

  return (
    <Frame p={1} pt={2}>
      <TextFieldScan
        value={ticket}
        onChange={(t) => setTicket(t)}
        label="Ticket de compra"
        disabled={!!loading}
      />
      {data && cart.pending && (
        <PendingProductList
          products={cart.pending}
          onFullfill={(product, amount) => {
            setCart('pending', product.code.plu, amount);
          }}
        />
      )}
    </Frame>
  );
}
