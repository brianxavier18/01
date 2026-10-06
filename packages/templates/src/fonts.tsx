import { useEffect, useState, type ReactNode } from 'react';
import { continueRender, delayRender } from 'remotion';

type Loader = () => Promise<unknown>;

/**
 * Segura o render até as fontes carregarem. Medições (fitText/measureText) só podem
 * acontecer depois disso — o cache do layout-utils guardaria larguras com fonte errada.
 */
export const FontGate: React.FC<{
  loaders: Loader[];
  fallback: ReactNode;
  children: ReactNode;
}> = ({ loaders, fallback, children }) => {
  const [handle] = useState(() => delayRender('Carregando fontes'));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    Promise.all(loaders.map((l) => l()))
      .then(() => alive && setReady(true))
      .catch((err: unknown) => {
        console.error('falha ao carregar fontes', err);
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
    // Os loaders são estáveis por template.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ready) continueRender(handle);
  }, [ready, handle]);

  return <>{ready ? children : fallback}</>;
};
