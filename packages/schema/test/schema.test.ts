import { describe, expect, it } from 'vitest';
import { PromoItem, RenderInput, withDerivedLegal, type PromoProps } from '../src/index';

const item = {
  name: 'Arroz 5kg',
  unit: 'un' as const,
  imageUrl: 'https://example.com/a.webp',
  imageMode: 'cutout' as const,
  priceFromCents: 3290,
  priceToCents: 2699,
  isAlcoholic: false,
};

const props: PromoProps = {
  store: { name: 'Mercado', segment: 'market' },
  theme: {
    primary: '#FF0000',
    secondary: '#FFD400',
    accent: '#111111',
    background: '#FFFFFF',
    ink: '#111111',
  },
  dateLabel: 'TERÇA • 06/10',
  headline: 'OFERTAS DO DIA',
  items: [item, item, { ...item, isAlcoholic: true }],
  cta: { line1: 'CORRE QUE É SÓ HOJE!' },
  legal: { text: 'Ofertas válidas para 06/10/2026.', alcoholWarning: false },
  audio: { sfx: false },
  seed: 42,
};

describe('PromoItem', () => {
  it('accepts a valid item', () => {
    expect(PromoItem.safeParse(item).success).toBe(true);
  });
  it('rejects "por" >= "de"', () => {
    const r = PromoItem.safeParse({ ...item, priceToCents: 3290 });
    expect(r.success).toBe(false);
  });
  it('accepts item without "de"', () => {
    const { priceFromCents: _omit, ...noFrom } = item;
    expect(PromoItem.safeParse(noFrom).success).toBe(true);
  });
  it('rejects names over 40 chars', () => {
    expect(PromoItem.safeParse({ ...item, name: 'x'.repeat(41) }).success).toBe(false);
  });
});

describe('RenderInput', () => {
  it('applies quality defaults', () => {
    const r = RenderInput.parse({
      jobId: 'j',
      runId: 'r',
      compositionId: 'EncarteTurboV1',
      props,
      output: { videoPutUrl: 'https://r2/v', thumbPutUrl: 'https://r2/t' },
      isProduction: false,
    });
    expect(r.quality).toEqual({ crf: 22, maxBytes: 15_000_000 });
  });
});

describe('withDerivedLegal', () => {
  it('derives alcohol warning from items', () => {
    expect(withDerivedLegal(props).legal.alcoholWarning).toBe(true);
  });
});
