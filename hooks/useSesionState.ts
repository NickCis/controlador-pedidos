import { useState, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';

function useSesionState<S>(
  key: string,
  initialState: S,
): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState<S>(initialState);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) setState(JSON.parse(stored) as T);
    } catch (e) {}
  }, [key]);

  return [
    state,
    (value: SetStateAction<S>) => {
      setState((s) => {
        const v = typeof value === 'function' ? value(s) : value;
        localStorage.setItem(key, JSON.stringify(v));
        return v;
      });
    },
  ];
}

export default useSesionState;
