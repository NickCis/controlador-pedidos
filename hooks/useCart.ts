import { useState, useEffect } from 'react';
import type { FetchCart } from './useFetchCart';
import type Product from 'types/Product';

export interface Cart {
  pending: Product[];
  fullfilled: Product[];
}

type SetterAction = 'pending' | 'fullfilled';
export type CartSetter = (
  action: SetterAction,
  code: string,
  amount?: number,
) => void;

function useCart(data?: FetchCart['data']): [Cart, CartSetter] {
  const [cart, setCart] = useState<Cart>({ pending: [], fullfilled: [] });

  useEffect(() => {
    if (!data) return;
    setCart({
      pending: data.products,
      fullfilled: [],
    });
  }, [data]);

  return [
    cart,
    (action: SetterAction, code: string, amount?: number) => {
      if (action === 'pending') {
        setCart(cart => {
          const pending: Product[] = [];
          const fullfilled: Product[] = [];
          for (const p of cart.pending) {
            if (p.code.plu !== code) {
              pending.push(p);
              continue;
            }

            const newAmount = p.amount - (amount || p.amount);
            if (newAmount > 0)
              pending.push({
                ...p,
                amount: newAmount,
              });

            fullfilled.push({
              ...p,
              amount: amount || p.amount,
            });
          }

          for (const f of cart.fullfilled) {
            if (f.code.plu !== code) {
              fullfilled.push(f);
              continue;
            }

            if (code === fullfilled[0]?.code.plu) {
              fullfilled[0].amount += f.amount;
            }
          }

          return {
            pending,
            fullfilled,
          };
        });
      }
    },
  ];
}

export default useCart;
