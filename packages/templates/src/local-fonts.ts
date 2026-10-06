import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';
import fontFiles from './font-files.json';

export type FontFamilyName = keyof typeof fontFiles;

const cache = new Map<string, Promise<void>>();

/**
 * Fontes servidas de public/fonts (baixadas por `pnpm fonts:fetch` a partir do catálogo do
 * Google Fonts, subset latin — cobre acentos e ç). O render não depende de rede.
 */
export function localFont(family: FontFamilyName): {
  fontFamily: string;
  load: () => Promise<void>;
} {
  const fontFamily = `PS ${family}`;
  return {
    fontFamily,
    load: () => {
      let p = cache.get(family);
      if (!p) {
        const weights = fontFiles[family] as Record<string, string>;
        p = Promise.all(
          Object.entries(weights).map(([weight, file]) =>
            loadFont({
              family: fontFamily,
              url: staticFile(`fonts/${file}`),
              weight,
              format: 'woff2',
            }),
          ),
        ).then(() => undefined);
        cache.set(family, p);
      }
      return p;
    },
  };
}
