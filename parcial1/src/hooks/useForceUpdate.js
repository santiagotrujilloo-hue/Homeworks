import { useCallback, useState } from 'react';

// Las listas enlazadas viven fuera del estado de React (son mutables),
// así que este hook nos da una forma de decirle a React "algo cambió,
// vuelve a pintar" después de mutar cualquiera de las 4 estructuras.
export function useForceUpdate() {
  const [, setTick] = useState(0);
  return useCallback(() => setTick((t) => t + 1), []);
}
