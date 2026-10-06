import type { Theme } from '@promo/schema';
import { bestInk, contrastRatio, MIN_CONTRAST, readableText } from '@promo/shared';

/** Escolhe a primeira cor candidata com contraste suficiente; senão, a melhor tinta. */
export function pickReadable(background: string, candidates: string[]): string {
  for (const c of candidates) if (contrastRatio(c, background) >= MIN_CONTRAST) return c;
  return bestInk(background);
}

/** Garante que a "superfície" (cor de fundo de um bloco) não se confunda com o fundo da cena. */
export function distinctSurface(surface: string, background: string, fallback: string): string {
  return contrastRatio(surface, background) >= 1.6 ? surface : fallback;
}

export { readableText };
export type { Theme };
