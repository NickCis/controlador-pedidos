import { useState, useEffect } from 'react';
import type Product from 'types/Product';

export interface FetchCart {
  loading?: boolean;
  data?: {
    products: Product[];
  };
}

// http://apps01.coto.com.ar/TicketMobile/Ticket/Nzk0OS83NTE3LzIwMjIxMDE3LzEwNy8wMDA0NDQ2NDQx
function useFetchCart(ticket: string): FetchCart {
  const [data, setData] = useState<FetchCart>({});
  useEffect(() => {
    const match = ticket.match(
      /(https?:\/\/)?apps01.coto.com.ar\/TicketMobile\/Ticket\/(.*?)$/i,
    );
    if (!match) return;
    const id = match[2].trim();

    if (!id) return;

    const controller = new AbortController();
    setData({ loading: true });
    (async () => {
      const req = await fetch(`/api/ticket/${id}`);
      const data = await req.json();
      setData({
        data,
      });
    })();

    return () => {
      controller.abort();
    };
  }, [ticket]);

  return data;
}

export default useFetchCart;
