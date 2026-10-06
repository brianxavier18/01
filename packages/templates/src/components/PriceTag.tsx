import type { CSSProperties } from 'react';
import { measureText } from '@remotion/layout-utils';
import { priceParts, unitSuffix } from '@promo/shared';
import type { Unit } from '@promo/schema';

export interface PriceLayout {
  fontSize: number;
  width: number;
  height: number;
}

const CURRENCY_RATIO = 0.3;
const CENTS_RATIO = 0.42;
const UNIT_RATIO = 0.2;

/**
 * Calcula o maior tamanho de fonte (≤ maxFontSize) para o preço caber em `maxWidth`.
 * Larguras escalam linearmente com o tamanho da fonte, então mede uma vez em 100 px.
 */
export function layoutPrice(opts: {
  cents: number;
  unit: Unit;
  fontFamily: string;
  fontWeight?: number | string;
  maxWidth: number;
  maxFontSize: number;
  minFontSize?: number;
}): PriceLayout {
  const { reais, cents } = priceParts(opts.cents);
  const m = (text: string, ratio: number) =>
    measureText({
      text,
      fontFamily: opts.fontFamily,
      fontWeight: opts.fontWeight ?? 400,
      fontSize: 100 * ratio,
    }).width;
  const showUnit = opts.unit !== 'un';
  const tailWidth = Math.max(
    m(`,${cents}`, CENTS_RATIO),
    showUnit ? m(unitSuffix(opts.unit), UNIT_RATIO) : 0,
  );
  const per100 = m('R$', CURRENCY_RATIO) + 0.06 * 100 + m(reais, 1) + 0.03 * 100 + tailWidth;
  const fit = (opts.maxWidth / per100) * 100;
  const fontSize = Math.max(opts.minFontSize ?? 0, Math.min(opts.maxFontSize, fit));
  return { fontSize, width: (per100 * fontSize) / 100, height: fontSize * 0.9 };
}

/** Preço estilo encarte: R$ menor, reais grandes, centavos sobrescritos e unidade abaixo deles. */
export const PriceTag: React.FC<{
  cents: number;
  unit: Unit;
  fontFamily: string;
  fontSize: number;
  color: string;
  fontWeight?: number | string;
  style?: CSSProperties;
}> = ({ cents, unit, fontFamily, fontSize, color, fontWeight = 400, style }) => {
  const parts = priceParts(cents);
  const showUnit = unit !== 'un';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        fontFamily,
        fontWeight,
        color,
        lineHeight: 0.9,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <span
        style={{
          fontSize: fontSize * CURRENCY_RATIO,
          marginTop: fontSize * 0.1,
          marginRight: fontSize * 0.06,
        }}
      >
        {parts.currency}
      </span>
      <span style={{ fontSize, letterSpacing: '-0.01em' }}>{parts.reais}</span>
      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          marginLeft: fontSize * 0.03,
          marginTop: fontSize * 0.04,
        }}
      >
        <span style={{ fontSize: fontSize * CENTS_RATIO }}>,{parts.cents}</span>
        {showUnit ? (
          <span
            style={{ fontSize: fontSize * UNIT_RATIO, marginTop: fontSize * 0.04, opacity: 0.9 }}
          >
            {unitSuffix(unit)}
          </span>
        ) : null}
      </span>
    </div>
  );
};
