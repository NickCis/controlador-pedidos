import { useState, useEffect } from 'react';
import type { Product } from 'types/Product';

export interface FetchCart {
  loading?: boolean;
  data?: {
    id: string;
    products: Product[];
  };
}

const Key = '__fetch_cart__';

interface FetchCartStorage {
  data: FetchCart['data'];
  id: string;
}

function useFetchCart(ticket: string): FetchCart {
  const [data, setData] = useState<FetchCart>({});
  useEffect(() => {
    const match = ticket.match(
      /(https?:\/\/)?apps01.coto.com.ar\/TicketMobile\/Ticket\/(.*?)$/i,
    );
    if (!match) return;
    const id = match[2].trim();
    if (!id) return;

    const stored = localStorage.getItem(Key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as FetchCartStorage;
        if (id === parsed.id) {
          setData({ data: { ...parsed.data, id } });
          return;
        }
      } catch (e) {}
    }

    const controller = new AbortController();
    setData({ loading: true });
    (async () => {
      const req = await fetch(`/api/ticket/${id}`);
      const data = await req.json();
      setData({
        data: {
          ...data,
          id,
        },
      });
      localStorage.setItem(
        Key,
        JSON.stringify({
          id,
          data,
        }),
      );
    })();

    return () => {
      controller.abort();
    };
  }, [ticket]);

  return data;
}

export default useFetchCart;
