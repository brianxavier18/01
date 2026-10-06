import type { CSSProperties } from 'react';
import { ALCOHOL_WARNING } from '@promo/shared';
import { interpolate, useCurrentFrame } from 'remotion';
import { SAFE, SAFE_WIDTH } from '../timing';

/** Faixa fixa de advertência para bebida alcoólica (rodapé da zona segura). */
export const AlcoholBar: React.FC<{
  background: string;
  color: string;
  fontFamily: string;
  bottom?: number;
  style?: CSSProperties;
}> = ({ background, color, fontFamily, bottom = SAFE.bottom, style }) => (
  <div
    style={{
      position: 'absolute',
      left: SAFE.left,
      width: SAFE_WIDTH,
      top: bottom - 84,
      height: 84,
      background,
      color,
      fontFamily,
      fontWeight: 800,
      fontSize: 26,
      lineHeight: '32px',
      letterSpacing: '0.02em',
      flexDirection: 'column',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      borderRadius: 14,
      padding: '0 24px',
      ...style,
    }}
  >
    <div>
      {ALCOHOL_WARNING.split(' • ').map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  </div>
);

/** Texto legal (≥ 26 px) com fade-in. */
export const LegalBar: React.FC<{
  text: string;
  color: string;
  fontFamily: string;
  top: number;
  startFrame?: number;
  style?: CSSProperties;
}> = ({ text, color, fontFamily, top, startFrame = 20, style }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.left,
        width: SAFE_WIDTH,
        top,
        color,
        fontFamily,
        fontSize: 26,
        lineHeight: '34px',
        fontWeight: 500,
        textAlign: 'center',
        opacity,
        ...style,
      }}
    >
      {text}
    </div>
  );
};
