import { useEffect, useState } from 'react';

export const aviso = (texto) => window.dispatchEvent(new CustomEvent('odl-toast', { detail: texto }));

export function useToast() {
  const [t, setT] = useState('');
  useEffect(() => {
    let timer;
    const f = (e) => { setT(e.detail); clearTimeout(timer); timer = setTimeout(() => setT(''), 3200); };
    window.addEventListener('odl-toast', f);
    return () => { window.removeEventListener('odl-toast', f); clearTimeout(timer); };
  }, []);
  return t;
}
