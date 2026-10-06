import type { Theme } from '@promo/schema';
import { bestInk, contrastRatio, MIN_CONTRAST } from '@promo/shared';
import { distinctSurface, pickReadable } from '../../theme';

export const ENCARTE_DEFAULT_THEME: Theme = {
  primary: '#E30613',
  secondary: '#FFFFFF',
  accent: '#E30613',
  background: '#FFD400',
  ink: '#141414',
};

export interface EncartePalette {
  /** Fundo das cenas de produto. */
  sceneBg: string;
  /** Fundo da intro e do CTA (bookends). */
  bookendBg: string;
  rays: string;
  bursts: string;
  dots: string;
  /** Texto sobre sceneBg. */
  ink: string;
  /** Texto sobre bookendBg. */
  bookendInk: string;
  /** Faixa do preço e texto sobre ela. */
  priceBg: string;
  priceInk: string;
  star: string;
  strike: string;
  stampBg: string;
  stampInk: string;
  plate: string;
  plateRing: string;
  chipBg: string;
  chipInk: string;
  /** Chip de data sobre o bookend. */
  bookendChipBg: string;
  bookendChipInk: string;
}

/** Deriva a paleta do template garantindo contraste ≥ 4,5 em todo texto. */
export function encartePalette(theme: Theme): EncartePalette {
  const sceneBg = theme.background;
  const ink = pickReadable(sceneBg, [theme.ink]);
  const bookendBg = distinctSurface(theme.primary, sceneBg, ink);
  const bookendInk = pickReadable(bookendBg, [theme.background, theme.secondary, '#FFFFFF']);
  const priceBg = distinctSurface(theme.primary, sceneBg, ink);
  const priceInk = pickReadable(priceBg, ['#FFFFFF', theme.secondary, theme.background]);
  const strike = contrastRatio(theme.accent, sceneBg) >= 2 ? theme.accent : priceBg;
  const stampBg = distinctSurface(theme.accent, sceneBg, priceBg);
  const stampInk = pickReadable(stampBg, ['#FFFFFF', theme.background]);
  // A estrela fica atrás do "DE R$ …" (texto em `ink`): precisa contrastar com a tinta.
  const starCandidates = [theme.secondary, theme.primary, theme.background, '#FFFFFF', '#F2F2F2'];
  const star =
    starCandidates.find(
      (c) => contrastRatio(c, ink) >= MIN_CONTRAST && contrastRatio(c, sceneBg) >= 1.05,
    ) ?? bestInk(ink);
  return {
    sceneBg,
    bookendBg,
    rays: theme.primary,
    bursts: contrastRatio(theme.primary, sceneBg) >= 1.6 ? theme.primary : ink,
    dots: ink,
    ink,
    bookendInk,
    priceBg,
    priceInk,
    star,
    strike,
    stampBg,
    stampInk,
    plate: '#FFFFFF',
    plateRing: priceBg,
    chipBg: ink,
    chipInk: bestInk(ink),
    bookendChipBg: bookendInk,
    bookendChipInk: bestInk(bookendInk),
  };
}
