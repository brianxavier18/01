import { Star } from '@remotion/shapes';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { HEIGHT, WIDTH } from '../../timing';

const RAYS = 22;

/** Raios de explosão girando devagar a partir de um centro. */
const Sunburst: React.FC<{
  color: string;
  opacity: number;
  cx: number;
  cy: number;
  stopAt?: number;
}> = ({ color, opacity, cx, cy, stopAt = 10_000 }) => {
  const frame = useCurrentFrame();
  const rotation = Math.min(frame, stopAt) * 0.12;
  const r = 1800;
  const wedges = Array.from({ length: RAYS }, (_, i) => {
    const a0 = (i / RAYS) * Math.PI * 2;
    const a1 = a0 + Math.PI / RAYS;
    return `M ${cx} ${cy} L ${cx + Math.cos(a0) * r} ${cy + Math.sin(a0) * r} L ${cx + Math.cos(a1) * r} ${cy + Math.sin(a1) * r} Z`;
  }).join(' ');
  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      style={{ position: 'absolute', inset: 0 }}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
    >
      <g transform={`rotate(${rotation} ${cx} ${cy})`}>
        <path d={wedges} fill={color} opacity={opacity} />
      </g>
    </svg>
  );
};

/** Retícula (halftone) estática — padrão SVG, barato de rasterizar. */
const Halftone: React.FC<{ color: string; opacity: number }> = ({ color, opacity }) => (
  <svg width={WIDTH} height={HEIGHT} style={{ position: 'absolute', inset: 0 }}>
    <defs>
      <pattern
        id="ht"
        width="22"
        height="22"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(20)"
      >
        <circle cx="11" cy="11" r="4.2" fill={color} />
      </pattern>
      <linearGradient id="htfade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="1" />
        <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.7" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#fff" stopOpacity="1" />
      </linearGradient>
      <mask id="htmask">
        <rect width={WIDTH} height={HEIGHT} fill="url(#htfade)" />
      </mask>
    </defs>
    <rect width={WIDTH} height={HEIGHT} fill="url(#ht)" opacity={opacity} mask="url(#htmask)" />
  </svg>
);

/** Explosões decorativas nos cantos (posições variam pela seed). */
const CornerBursts: React.FC<{ color: string; seed: number; stopAt?: number }> = ({
  color,
  seed,
  stopAt = 10_000,
}) => {
  const frame = useCurrentFrame();
  const spots = [
    { x: -60, y: 120 },
    { x: WIDTH + 40, y: 1700 },
  ];
  return (
    <>
      {spots.map((s, i) => {
        const r = 170 + random(`${seed}-cb-${i}`) * 70;
        const rot = random(`${seed}-cbr-${i}`) * 360 + Math.min(frame, stopAt) * (i ? -0.3 : 0.3);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: s.x - r,
              top: s.y - r,
              transform: `rotate(${rot}deg)`,
            }}
          >
            <Star points={12} innerRadius={r * 0.62} outerRadius={r} fill={color} />
          </div>
        );
      })}
    </>
  );
};

export const EncarteBackground: React.FC<{
  fill: string;
  rays: string;
  bursts: string;
  dots: string;
  seed: number;
  center?: { x: number; y: number };
  stopAt?: number;
  /** Faixa diagonal que varre a tela nos frames 0–4 (abertura). */
  openingWipe?: string;
}> = ({ fill, rays, bursts, dots, seed, center = { x: 540, y: 860 }, stopAt, openingWipe }) => {
  const frame = useCurrentFrame();
  const wipe = openingWipe
    ? interpolate(frame, [0, 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 1;
  return (
    <AbsoluteFill style={{ background: fill, overflow: 'hidden' }}>
      <Sunburst color={rays} opacity={0.16} cx={center.x} cy={center.y} stopAt={stopAt} />
      <Halftone color={dots} opacity={0.14} />
      <CornerBursts color={bursts} seed={seed} stopAt={stopAt} />
      {openingWipe && wipe < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: -600,
            top: -600,
            width: WIDTH + 1200,
            height: HEIGHT + 1200,
            background: openingWipe,
            transform: `rotate(-24deg) translateY(${(0.3 + wipe * 0.7) * (HEIGHT + 1400)}px)`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
