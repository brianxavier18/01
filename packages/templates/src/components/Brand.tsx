import type { CSSProperties } from 'react';
import { Img } from 'remotion';
import { displayUpper } from '@promo/shared';
import { fitText } from '@remotion/layout-utils';
import { resolveAsset } from '../assets';

/** Logo da loja contido numa caixa; sem logo vira wordmark tipográfico com o nome. */
export const StoreMark: React.FC<{
  logoUrl?: string;
  name: string;
  maxWidth: number;
  maxHeight: number;
  fontFamily: string;
  color: string;
  style?: CSSProperties;
}> = ({ logoUrl, name, maxWidth, maxHeight, fontFamily, color, style }) => {
  if (logoUrl) {
    return (
      <div
        style={{
          width: maxWidth,
          height: maxHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
      >
        <Img
          src={resolveAsset(logoUrl)}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        />
      </div>
    );
  }
  const text = displayUpper(name);
  const { fontSize } = fitText({ text, withinWidth: maxWidth * 0.94, fontFamily });
  return (
    <div
      style={{
        width: maxWidth,
        height: maxHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily,
        color,
        fontSize: Math.min(fontSize, maxHeight * 0.8),
        lineHeight: 1,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {text}
    </div>
  );
};
