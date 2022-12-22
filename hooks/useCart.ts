import { useState, useEffect } from 'react';
import type { FetchCart } from './useFetchCart';
import type { Product } from 'types/Product';

export interface Cart {
  id: string;
  pending: Product[];
  fullfilled: Product[];
}

type SetterAction = 'pending' | 'fullfilled';
export type CartSetter = (
  action: SetterAction,
  code: string,
  amount?: number,
) => void;
export type CartClearer = () => void;

const Key = '__cart__';

function useCart(
  data?: FetchCart['data'],
): [Cart | null, CartSetter, CartClearer] {
  const [cart, setCart] = useState<Cart | null>(null);

  useEffect(() => {
    if (!data) return;
    const stored = localStorage.getItem(Key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Cart;
        if (data.id === parsed.id) {
          setCart(parsed);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    setCart({
      id: data.id,
      pending: data.products || [],
      fullfilled: [],
    });
  }, [data]);

  return [
    cart,
    (action: SetterAction, code: string, amount?: number) => {
      if (action === 'pending') {
        setCart((cart) => {
          if (!cart) return cart;
          const pending: Product[] = [];
          const fullfilled: Product[] = [];
          for (const p of cart.pending) {
            if (p.code.plu !== code) {
              pending.push(p);
              continue;
            }

            const cappedAmount = Math.min(p.amount, amount || p.amount);
            const newAmount = p.amount - cappedAmount;
            if (newAmount > 0)
              pending.push({
                ...p,
                amount: newAmount,
              });

            fullfilled.push({
              ...p,
              amount: cappedAmount,
            });
          }

          if (fullfilled.length === 0) return cart;

          for (const f of cart.fullfilled) {
            if (f.code.plu !== code) {
              fullfilled.push(f);
              continue;
            }

            if (code === fullfilled[0].code.plu) {
              fullfilled[0].amount += f.amount;
            }
          }

          const newCart: Cart = {
            id: cart.id,
            pending,
            fullfilled,
          };

          localStorage.setItem(Key, JSON.stringify(newCart));
          return newCart;
        });
      } else if (action === 'fullfilled') {
        setCart((cart) => {
          if (!cart) return cart;
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

          const newCart: Cart = {
            id: cart.id,
            pending,
            fullfilled,
          };
          localStorage.setItem(Key, JSON.stringify(newCart));
          return newCart;
        });
      } else {
        throw new Error(`Unknown action: '${action}'`);
      }
    },
    () => {
      setCart(null);
    },
  ];
}

export default useCart;
