import { describe, expect, it } from 'vitest';
import { bestInk, contrastRatio, readableText } from '../src/contrast';
import { displayUpper, sanitizeTemplateParam, smartLines, stripEmoji } from '../src/text';
import { legalText } from '../src/legal';
import { nextTemplate, runSeed } from '../src/random';
import { buildCaption } from '../src/caption';

describe('contrast', () => {
  it('computes WCAG ratio', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
  });
  it('light yellow brand on white falls back to dark ink', () => {
    expect(readableText('#FFF3B0', '#FFFFFF')).toEqual({ color: '#111111', plate: null });
    expect(bestInk('#FFF3B0')).toBe('#111111');
    expect(bestInk('#0B1E3F')).toBe('#FFFFFF');
  });
});

describe('text', () => {
  it('uppercases pt-BR and strips emoji', () => {
    expect(displayUpper('Feijão 🔥 carioca')).toBe('FEIJÃO CARIOCA');
    expect(stripEmoji('🍺 Cerveja')).toBe('Cerveja');
  });
  it('splits in balanced lines', () => {
    expect(smartLines('Refrigerante cola 2L')).toEqual(['Refrigerante', 'cola 2L']);
    expect(smartLines('Arroz')).toEqual(['Arroz']);
  });
  it('sanitizes WhatsApp params', () => {
    expect(sanitizeTemplateParam('a\nb\tc      d')).toBe('a b c   d');
  });
});

describe('legal', () => {
  it('modes', () => {
    expect(legalText('while_stock', '2026-10-06')).toBe(
      'Ofertas válidas para 06/10/2026 ou enquanto durarem os estoques. Imagens ilustrativas.',
    );
    expect(legalText('custom', '2026-10-06', '  ')).toBe('Ofertas válidas para 06/10/2026.');
  });
});

describe('random', () => {
  it('is deterministic', () => {
    expect(runSeed('t1', '2026-10-06')).toBe(runSeed('t1', '2026-10-06'));
    expect(runSeed('t1', '2026-10-06')).not.toBe(runSeed('t1', '2026-10-07'));
  });
  it('never repeats yesterday when possible', () => {
    for (let s = 0; s < 50; s++) {
      expect(nextTemplate(['A', 'B', 'C'], 'B', s)).not.toBe('B');
    }
    expect(nextTemplate(['A'], 'A', 1)).toBe('A');
  });
});

describe('caption', () => {
  it('uses only run data', () => {
    const c = buildCaption({
      storeName: 'Depósito Gelada Já',
      segment: 'beverages',
      city: 'São José',
      date: '2026-10-06',
      items: [
        {
          name: 'Cerveja long neck 330ml',
          unit: 'un',
          priceFromCents: 749,
          priceToCents: 599,
          isAlcoholic: true,
        },
        { name: 'Gelo 5kg', unit: 'un', priceToCents: 1200, isAlcoholic: false },
      ],
      legalText: 'Ofertas válidas para 06/10/2026.',
      seed: 3,
    });
    expect(c).toContain('de R$ 7,49 por R$ 5,99 (−20%)');
    expect(c).toContain('Gelo 5kg: por R$ 12,00');
    expect(c).toContain('BEBA COM MODERAÇÃO');
    expect(c).toContain('#saojose');
    expect(c).toContain('Terça, 06/10');
  });
});
