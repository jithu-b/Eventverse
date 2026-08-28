// Defensive patch for environments where window.fetch has only a getter
try {
  if (typeof window !== 'undefined') {
    const origFetch = window.fetch;
    let customFetch = origFetch ? origFetch.bind(window) : undefined;
    Object.defineProperty(window, 'fetch', {
      get: () => customFetch,
      set: (fn) => {
        customFetch = fn;
      },
      configurable: true,
      enumerable: true,
    });
  }
} catch {
  // safe fallback
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
