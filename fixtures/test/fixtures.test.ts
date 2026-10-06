import { describe, expect, it } from 'vitest';
import { PromoProps } from '@promo/schema';
import { discountPercent } from '@promo/shared';
import { casosLimite, depositoGeladaJa, FIXTURES, mercadoSerraVerde } from '../index';

describe('fixtures', () => {
  it.each(Object.entries(FIXTURES))('%s is valid PromoProps', (_id, props) => {
    const r = PromoProps.safeParse(props);
    if (!r.success) console.error(r.error.issues);
    expect(r.success).toBe(true);
  });

  it('alcohol warning is derived', () => {
    expect(depositoGeladaJa.legal.alcoholWarning).toBe(true);
    expect(mercadoSerraVerde.legal.alcoholWarning).toBe(false);
  });

  it('edge cases cover the required scenarios', () => {
    const [fridge, soap] = casosLimite.items;
    expect(fridge!.name).toHaveLength(40);
    expect(fridge!.priceToCents).toBe(249900);
    expect(discountPercent(soap!.priceFromCents, soap!.priceToCents)).toBe(72);
    expect(soap!.imageMode).toBe('photo');
    expect(casosLimite.store.logoUrl).toBeUndefined();
    expect(casosLimite.theme.primary).toBe('#FFF3B0');
  });
});
