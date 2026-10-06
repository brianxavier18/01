import { evolvePath } from '@remotion/paths';
import { Easing, interpolate, useCurrentFrame } from 'remotion';

/** Risco desenhado da esquerda para a direita sobre o preço antigo (inclinação −6°). */
export const StrikeLine: React.FC<{
  width: number;
  height: number;
  color: string;
  startFrame: number;
  endFrame: number;
  thickness?: number;
}> = ({ width, height, color, startFrame, endFrame, thickness = 8 }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const rise = Math.tan((6 * Math.PI) / 180) * width;
  const path = `M 0 ${height / 2 + rise / 2} L ${width} ${height / 2 - rise / 2}`;
  const evolved = evolvePath(progress, path);
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}
    >
      <path
        d={path}
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={evolved.strokeDasharray}
        strokeDashoffset={evolved.strokeDashoffset}
      />
    </svg>
  );
};
