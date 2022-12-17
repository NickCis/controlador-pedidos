import { useState, useEffect } from 'react';
import type { FetchCart } from './useFetchCart';
import type { Product } from 'types/Product';

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
        setCart((cart) => {
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
      } else if (action === 'fullfilled') {
        setCart((cart) => {
          const fullfilled: Product[] = [];
          let item: Product | undefined;

          for (const f of cart.fullfilled) {
            if (f.code.plu !== code) {
              fullfilled.push(f);
              continue;
            }

            item = f;
            const newAmount = f.amount - (amount || f.amount);

            if (newAmount > 0)
              fullfilled.push({
                ...f,
                amount: newAmount,
              });
          }

          if (!item) return cart;

          const pending: Product[] = [];
          const fixedAmount = Math.min(item.amount, amount || item.amount);
          let found = false;
          for (const p of cart.pending) {
            if (p.code.plu !== code) {
              pending.push(p);
              continue;
            }

            found = true;
            pending.push({
              ...p,
              amount: p.amount + fixedAmount,
            });
          }

          if (!found)
            pending.push({
              ...item,
              amount: fixedAmount,
            });

          return {
            pending,
            fullfilled,
          };
        });
      } else {
        throw new Error(`Unknown action: '${action}'`);
      }
    },
  ];
}

export default useCart;
