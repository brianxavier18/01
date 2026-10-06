import type { CSSProperties } from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * Revelação palavra a palavra por máscara: cada palavra sobe de translateY(100%) a 0
 * dentro de um recorte, com stagger. Uma entrada por linha em `lines`.
 */
export const KineticText: React.FC<{
  lines: string[];
  startFrame: number;
  stagger?: number;
  style?: CSSProperties;
  lineStyle?: CSSProperties;
  damping?: number;
}> = ({ lines, startFrame, stagger = 3, style, lineStyle, damping = 14 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let wordIndex = 0;
  return (
    <div style={style}>
      {lines.map((line, li) => (
        <div key={li} style={{ display: 'block', whiteSpace: 'nowrap', ...lineStyle }}>
          {line.split(' ').map((word, wi) => {
            const delay = startFrame + wordIndex++ * stagger;
            const p = spring({ frame: frame - delay, fps, config: { damping, mass: 0.6 } });
            return (
              <span
                key={wi}
                style={{
                  display: 'inline-block',
                  overflow: 'hidden',
                  verticalAlign: 'top',
                  marginRight: '0.22em',
                  paddingTop: '0.04em',
                  paddingBottom: '0.04em',
                }}
              >
                <span
                  style={{ display: 'inline-block', transform: `translateY(${(1 - p) * 110}%)` }}
                >
                  {word}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Letras caindo em stagger (usado na manchete da intro). */
export const FallingLetters: React.FC<{
  text: string;
  startFrame: number;
  stagger?: number;
  style?: CSSProperties;
}> = ({ text, startFrame, stagger = 2, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ whiteSpace: 'pre', ...style }}>
      {Array.from(text).map((ch, i) => {
        const p = spring({
          frame: frame - startFrame - i * stagger,
          fps,
          config: { damping: 11, mass: 0.5 },
        });
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: Math.min(1, p * 2),
              transform: `translateY(${(1 - p) * -140}px) rotate(${(1 - p) * (i % 2 ? 12 : -12)}deg)`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};
