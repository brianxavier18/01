import type { CSSProperties } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/** Selo/carimbo: escala 0→1,15→1 e rotação 20°→−8°. */
export const StampBadge: React.FC<{
  startFrame: number;
  size: number;
  x: number;
  y: number;
  background: string;
  children: React.ReactNode;
  style?: CSSProperties;
  finalRotation?: number;
}> = ({ startFrame, size, x, y, background, children, style, finalRotation = -8 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 9, stiffness: 180, mass: 0.6 },
  });
  const rotation = interpolate(p, [0, 1], [20, finalRotation]);
  if (frame < startFrame) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: '50%',
        background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${p}) rotate(${rotation}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
