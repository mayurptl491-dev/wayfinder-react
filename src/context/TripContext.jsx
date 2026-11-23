import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { FX, ORIGINS, ORIG } from '../data/destinations.js';

const TripContext = createContext(null);

const load = (key, fallback, valid) => {
  try {
    const v = localStorage.getItem(key);
    return v && valid(v) ? v : fallback;
  } catch {
    return fallback;
  }
};

export function TripProvider({ children }) {
  const [origin, setOrigin] = useState(() => load('wf-origin', 'del', (v) => !!ORIG[v]));
  const [cur, setCur] = useState(() => load('wf-cur', 'INR', (v) => !!FX[v]));

  useEffect(() => {
    try {
      localStorage.setItem('wf-origin', origin);
      localStorage.setItem('wf-cur', cur);
    } catch {
      /* ignore */
    }
  }, [origin, cur]);

  const money = useCallback(
    (usd) => {
      let n = usd * FX[cur];
      let step;
      if (cur === 'INR') step = n >= 100000 ? 1000 : n >= 20000 ? 500 : n >= 3000 ? 100 : 50;
      else step = n >= 1000 ? 50 : n >= 200 ? 10 : 5;
      n = Math.max(step, Math.round(n / step) * step);
      const sym = { INR: '₹', USD: '$', EUR: '€' }[cur];
      return sym + n.toLocaleString(cur === 'INR' ? 'en-IN' : 'en-US');
    },
    [cur]
  );

  return (
    <TripContext.Provider value={{ origin, setOrigin, cur, setCur, money, originCity: ORIG[origin], ORIGINS }}>
      {children}
    </TripContext.Provider>
  );
}

export const useTrip = () => useContext(TripContext);
