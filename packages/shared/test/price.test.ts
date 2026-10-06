import { describe, expect, it } from 'vitest';
import {
  applyDiscount,
  discountPercent,
  formatBRL,
  parseBRL,
  priceParts,
  unitSuffix,
  validateOfferPrice,
  visibleDiscount,
} from '../src/price';

describe('formatBRL', () => {
  it('formats cents', () => {
    expect(formatBRL(899)).toBe('R$ 8,99');
    expect(formatBRL(249900)).toBe('R$ 2.499,00');
    expect(formatBRL(5)).toBe('R$ 0,05');
  });
  it('rejects non-integer', () => {
    expect(() => formatBRL(1.5)).toThrow();
  });
});

describe('priceParts', () => {
  it('splits for encarte style', () => {
    expect(priceParts(899)).toEqual({ currency: 'R$', reais: '8', cents: '99' });
    expect(priceParts(289900)).toEqual({ currency: 'R$', reais: '2.899', cents: '00' });
    expect(priceParts(1200)).toEqual({ currency: 'R$', reais: '12', cents: '00' });
  });
});

describe('unit', () => {
  it('suffixes', () => {
    expect(unitSuffix('kg')).toBe('/kg');
    expect(unitSuffix('L')).toBe('/L');
    expect(unitSuffix('m2')).toBe('/m²');
  });
});

describe('discount', () => {
  it('rounds', () => {
    expect(discountPercent(6990, 5490)).toBe(21);
    expect(discountPercent(1290, 949)).toBe(26);
    expect(discountPercent(undefined, 1200)).toBeNull();
  });
  it('hides < 5%', () => {
    expect(visibleDiscount(1000, 960)).toBeNull();
    expect(visibleDiscount(1000, 950)).toBe(5);
  });
});

describe('validateOfferPrice', () => {
  it('blocks por >= de', () => {
    expect(validateOfferPrice(1000, 1000).ok).toBe(false);
    expect(validateOfferPrice(1000, 1200).ok).toBe(false);
  });
  it('asks confirmation above 70%', () => {
    const r = validateOfferPrice(999, 99);
    expect(r).toMatchObject({ ok: true, needsConfirmation: true, discount: 90 });
    expect(validateOfferPrice(3290, 2699)).toMatchObject({ ok: true, needsConfirmation: false });
  });
  it('72% case-limit needs confirmation', () => {
    expect(validateOfferPrice(10000, 2800)).toMatchObject({
      ok: true,
      needsConfirmation: true,
      discount: 72,
    });
  });
});

describe('applyDiscount', () => {
  it('applies with rounding', () => {
    expect(applyDiscount(1290, 20)).toBe(1032);
    expect(applyDiscount(1290, 20, '99')).toBe(999);
    expect(applyDiscount(1290, 20, '90')).toBe(990);
    expect(applyDiscount(3290, 10, '99')).toBe(2899);
  });
});

describe('parseBRL', () => {
  it('parses', () => {
    expect(parseBRL('26,99')).toBe(2699);
    expect(parseBRL('R$ 2.499,00')).toBe(249900);
    expect(parseBRL('12')).toBe(1200);
    expect(parseBRL('9,5')).toBe(950);
    expect(parseBRL('abc')).toBeNull();
  });
});
