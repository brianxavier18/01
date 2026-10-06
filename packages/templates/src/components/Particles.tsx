import { interpolate, random, useCurrentFrame } from 'remotion';

/** Explosão de partículas determinística (seed) a partir de um ponto. */
export const ParticleBurst: React.FC<{
  x: number;
  y: number;
  startFrame: number;
  seed: number | string;
  colors: string[];
  count?: number;
  duration?: number;
  spread?: number;
}> = ({ x, y, startFrame, seed, colors, count = 12, duration = 22, spread = 420 }) => {
  const frame = useCurrentFrame();
  const t = frame - startFrame;
  if (t < 0 || t > duration) return null;
  const progress = t / duration;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + random(`${seed}-a-${i}`) * 0.6;
        const dist = spread * (0.55 + random(`${seed}-d-${i}`) * 0.45);
        const ease = 1 - (1 - progress) ** 3;
        const px = x + Math.cos(angle) * dist * ease;
        const py = y + Math.sin(angle) * dist * ease + 160 * progress * progress;
        const size = 14 + random(`${seed}-s-${i}`) * 18;
        const rot = random(`${seed}-r-${i}`) * 360 + t * 18;
        const opacity = interpolate(progress, [0, 0.6, 1], [1, 1, 0]);
        const square = i % 3 === 0;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: px - size / 2,
              top: py - size / 2,
              width: size,
              height: square ? size : size * 0.45,
              borderRadius: square ? 4 : size,
              background: colors[i % colors.length],
              opacity,
              transform: `rotate(${rot}deg)`,
            }}
          />
        );
      })}
    </>
  );
};
