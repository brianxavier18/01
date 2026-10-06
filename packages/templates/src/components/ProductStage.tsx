import type { CSSProperties } from 'react';
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { BBox } from '@promo/schema';
import { resolveAsset } from '../assets';

/** Posiciona a imagem para que o retângulo útil (bbox) preencha a caixa `size`×`size`. */
export function framingFor(size: number, bbox?: BBox): CSSProperties {
  if (!bbox) {
    return {
      position: 'absolute',
      left: 0,
      top: 0,
      width: size,
      height: size,
      objectFit: 'contain',
    };
  }
  const aspect = bbox.aspect ?? 1;
  const width = size / Math.max(bbox.w, bbox.h / aspect);
  const height = width / aspect;
  return {
    position: 'absolute',
    width,
    height,
    left: size / 2 - (bbox.x + bbox.w / 2) * width,
    top: size / 2 - (bbox.y + bbox.h / 2) * height,
  };
}

/**
 * Produto entrando com spring (escala 0,6→1, y +120→0, rotação −8°→0), sombra de contato
 * crescendo e flutuação leve depois. Modo `photo` usa card arredondado.
 */
export const ProductStage: React.FC<{
  imageUrl: string;
  imageMode: 'cutout' | 'photo';
  bbox?: BBox;
  size: number;
  startFrame: number;
  cardColor?: string;
  shadowColor?: string;
}> = ({
  imageUrl,
  imageMode,
  bbox,
  size,
  startFrame,
  cardColor = '#FFFFFF',
  shadowColor = 'rgba(0,0,0,0.28)',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - startFrame, fps, config: { damping: 13, mass: 0.7 } });
  const settled = Math.max(0, frame - startFrame - 18);
  const float = Math.sin(settled / 14) * 6 * Math.min(1, settled / 10);
  const scale = interpolate(p, [0, 1], [0.6, 1]);
  const y = interpolate(p, [0, 1], [120, 0]) + float;
  const rotation = interpolate(p, [0, 1], [-8, 0]);
  const src = resolveAsset(imageUrl);

  const shadow = (
    <div
      style={{
        position: 'absolute',
        left: size * 0.18,
        width: size * 0.64,
        top: size * 0.9,
        height: size * 0.1,
        borderRadius: '50%',
        background: `radial-gradient(closest-side, ${shadowColor}, rgba(0,0,0,0))`,
        transform: `scaleX(${interpolate(p, [0, 1], [0.3, 1]) * (1 - float / 120)})`,
        opacity: p,
      }}
    />
  );

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {shadow}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: Math.min(1, p * 3),
          transform: `translateY(${y}px) scale(${scale}) rotate(${rotation}deg)`,
        }}
      >
        {imageMode === 'cutout' ? (
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <Img src={src} style={framingFor(size, bbox)} />
          </div>
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: size * 0.06,
              borderRadius: 36,
              overflow: 'hidden',
              background: cardColor,
              boxShadow: '0 18px 40px rgba(0,0,0,0.25)',
              border: `10px solid ${cardColor}`,
            }}
          >
            <Img
              src={src}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 26 }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
