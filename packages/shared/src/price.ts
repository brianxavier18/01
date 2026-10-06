import type { Unit } from '@promo/schema';

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const intPart = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0, useGrouping: true });

/** "R$ 2.499,00" — sempre com espaço comum (Intl usa NBSP). */
export function formatBRL(cents: number): string {
  assertCents(cents);
  return brl.format(cents / 100).replace(/\u00a0/g, ' ');
}

export interface PriceParts {
  currency: 'R$';
  /** Reais com separador de milhar: "2.499" */
  reais: string;
  /** Sempre 2 dígitos: "00", "99" */
  cents: string;
}

/** Partes para o estilo encarte: R$ menor, reais grandes, centavos sobrescritos. */
export function priceParts(cents: number): PriceParts {
  assertCents(cents);
  const reais = Math.floor(cents / 100);
  return {
    currency: 'R$',
    reais: intPart.format(reais).replace(/\u00a0/g, ' '),
    cents: String(cents % 100).padStart(2, '0'),
  };
}

const UNIT_SUFFIX: Record<Unit, string> = {
  un: '/un',
  kg: '/kg',
  g: '/g',
  L: '/L',
  ml: '/ml',
  pct: '/pct',
  cx: '/cx',
  par: '/par',
  m: '/m',
  m2: '/m²',
};

export function unitSuffix(unit: Unit): string {
  return UNIT_SUFFIX[unit];
}

export const MIN_DISCOUNT_TO_SHOW = 5;
export const DISCOUNT_CONFIRM_THRESHOLD = 70;

/** Desconto inteiro em %, ou null se não houver "de" válido. */
export function discountPercent(fromCents: number | undefined, toCents: number): number | null {
  if (!fromCents || fromCents <= 0 || toCents >= fromCents) return null;
  return Math.round((1 - toCents / fromCents) * 100);
}

/** Desconto exibível no vídeo (≥ 5%), ou null. */
export function visibleDiscount(fromCents: number | undefined, toCents: number): number | null {
  const d = discountPercent(fromCents, toCents);
  return d !== null && d >= MIN_DISCOUNT_TO_SHOW ? d : null;
}

export type PriceCheck =
  { ok: true; needsConfirmation: boolean; discount: number | null } | { ok: false; error: string };

/** Validação usada no painel antes de confirmar a oferta. */
export function validateOfferPrice(fromCents: number | undefined, toCents: number): PriceCheck {
  if (!Number.isInteger(toCents) || toCents <= 0) {
    return { ok: false, error: 'Informe o preço "por".' };
  }
  if (fromCents !== undefined && toCents >= fromCents) {
    return { ok: false, error: 'O preço "por" precisa ser menor que o "de".' };
  }
  const discount = discountPercent(fromCents, toCents);
  return {
    ok: true,
    discount,
    needsConfirmation: discount !== null && discount > DISCOUNT_CONFIRM_THRESHOLD,
  };
}

export type RoundingMode = 'none' | '99' | '90';

/** Aplica desconto percentual sobre o preço regular, com arredondamento opcional para ,99/,90 (para baixo). */
export function applyDiscount(
  regularCents: number,
  percent: number,
  rounding: RoundingMode = 'none',
): number {
  assertCents(regularCents);
  const raw = Math.round(regularCents * (1 - percent / 100));
  if (rounding === 'none') return raw;
  const target = rounding === '99' ? 99 : 90;
  let rounded = Math.floor(raw / 100) * 100 + target;
  if (rounded > raw) rounded -= 100;
  return rounded > 0 ? rounded : raw;
}

/** Converte "26,99" / "2.499,00" / "R$ 9,49" em centavos. */
export function parseBRL(input: string): number | null {
  const clean = input.replace(/R\$|\s/g, '');
  if (!/^\d{1,3}(\.\d{3})*(,\d{1,2})?$|^\d+(,\d{1,2})?$/.test(clean)) return null;
  const [int, dec = ''] = clean.replace(/\./g, '').split(',');
  return Number(int) * 100 + Number(dec.padEnd(2, '0'));
}

function assertCents(cents: number): void {
  if (!Number.isInteger(cents) || cents < 0)
    throw new RangeError(`valor inválido em centavos: ${cents}`);
}
