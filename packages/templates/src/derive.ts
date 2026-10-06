import type { PromoItem } from '@promo/schema';
import { displayUpper, smartLines, visibleDiscount } from '@promo/shared';
import { PRODUCT_BEATS } from './timing';

export interface DerivedItem {
  nameLines: string[];
  discount: number | null;
  /** Texto do selo: "−31%", badge do lojista ou "OFERTA". */
  stamp: { kind: 'discount'; value: number } | { kind: 'text'; lines: string[] };
  hasFrom: boolean;
  slamFrame: number;
  holdStart: number;
}

export function deriveItem(item: PromoItem): DerivedItem {
  const discount = visibleDiscount(item.priceFromCents, item.priceToCents);
  const hasFrom = Boolean(item.priceFromCents);
  const slamFrame = hasFrom ? PRODUCT_BEATS.slam : PRODUCT_BEATS.slamNoFrom;
  return {
    nameLines: smartLines(displayUpper(item.name), 2),
    discount,
    stamp:
      discount !== null
        ? { kind: 'discount', value: discount }
        : { kind: 'text', lines: smartLines(displayUpper(item.badge?.trim() || 'OFERTA'), 2) },
    hasFrom,
    slamFrame,
    holdStart: slamFrame + (PRODUCT_BEATS.holdStart - PRODUCT_BEATS.slam),
  };
}
