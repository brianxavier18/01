import { fitText, measureText } from '@remotion/layout-utils';
import { Star } from '@remotion/shapes';
import { formatBRL } from '@promo/shared';
import type { PromoItem, PromoProps } from '@promo/schema';
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  AlcoholBar,
  KineticText,
  layoutPrice,
  ParticleBurst,
  PriceTag,
  ProductStage,
  StampBadge,
  StrikeLine,
} from '../../components';
import { deriveItem } from '../../derive';
import { PRODUCT_BEATS, pulsePeriod, SAFE, SAFE_WIDTH } from '../../timing';
import { EncarteBackground } from './Background';
import { BODY, DISPLAY } from './fonts';
import type { EncartePalette } from './palette';

const NAME_TOP = 340;
const PLATE = { cx: 540, cy: 830, d: 500 };
const FROM_TOP = 1088;
const PRICE_CENTER_Y = 1345;
const PRICE_BANNER_MAX = SAFE_WIDTH;

export const EncarteProduct: React.FC<{
  props: PromoProps;
  item: PromoItem;
  index: number;
  palette: EncartePalette;
}> = ({ props, item, index, palette }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = deriveItem(item);
  const seed = `${props.seed}-${index}`;

  // Nome: até 2 linhas, entre 64 e 110 px.
  const nameSize = Math.max(
    64,
    Math.min(
      d.nameLines.length > 1 ? 96 : 110,
      ...d.nameLines.map(
        (l) => fitText({ text: l, withinWidth: SAFE_WIDTH, fontFamily: DISPLAY }).fontSize,
      ),
    ),
  );

  // Preço novo: cabe na faixa, nunca abaixo de 190 px.
  const porLabelWidth = 96;
  const priceLayout = layoutPrice({
    cents: item.priceToCents,
    unit: item.unit,
    fontFamily: DISPLAY,
    maxWidth: PRICE_BANNER_MAX - 80 - porLabelWidth,
    maxFontSize: 210,
    minFontSize: 150,
  });

  // Slam: escala 2,2→1 + shake de câmera 4 px por 6 frames.
  const slam = spring({ frame: frame - d.slamFrame, fps, config: { damping: 12, mass: 0.7 } });
  const slamScale = interpolate(slam, [0, 1], [2.2, 1]);
  const shakeT = frame - d.slamFrame;
  const shake =
    shakeT >= 0 && shakeT < 6
      ? {
          x: (random(`${seed}-sx-${shakeT}`) - 0.5) * 8 * (1 - shakeT / 6),
          y: (random(`${seed}-sy-${shakeT}`) - 0.5) * 8 * (1 - shakeT / 6),
        }
      : { x: 0, y: 0 };

  // Pulso no hold: no máximo 2 por segundo, alinhado ao beat.
  const period = pulsePeriod(props.audio.bpm);
  const holdT = frame - d.holdStart;
  const wave =
    holdT >= 0 && frame < PRODUCT_BEATS.holdEnd
      ? 0.5 - 0.5 * Math.cos((2 * Math.PI * holdT) / period)
      : 0;
  const pulseScale = 1 + 0.06 * wave;

  const pill = spring({ frame: frame - PRODUCT_BEATS.pillIn, fps, config: { damping: 15 } });

  const fromText = item.priceFromCents ? `DE ${formatBRL(item.priceFromCents)}` : '';
  const fromSize = 58;
  const fromWidth = fromText
    ? measureText({ text: fromText, fontFamily: BODY, fontWeight: 800, fontSize: fromSize }).width
    : 0;
  const fromOpacity = interpolate(
    frame,
    [PRODUCT_BEATS.fromIn, PRODUCT_BEATS.fromIn + 8],
    [0, 0.6],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );

  const starRotation = frame * 0.35;
  const starIn = spring({ frame: frame - 2, fps, config: { damping: 16 } });

  return (
    <AbsoluteFill style={{ transform: `translate(${shake.x}px, ${shake.y}px)` }}>
      <EncarteBackground
        fill={palette.sceneBg}
        rays={palette.rays}
        bursts={palette.bursts}
        dots={palette.dots}
        seed={props.seed + index}
        center={{ x: PLATE.cx, y: PLATE.cy }}
      />

      {/* Pill 1/3 */}
      <div
        style={{
          position: 'absolute',
          left: SAFE.left,
          top: 268,
          height: 62,
          padding: '0 26px',
          borderRadius: 999,
          background: palette.chipBg,
          color: palette.chipInk,
          fontFamily: BODY,
          fontWeight: 800,
          fontSize: 34,
          display: 'flex',
          alignItems: 'center',
          transform: `translateX(${interpolate(pill, [0, 1], [-320, 0])}px)`,
        }}
      >
        {index + 1}/3
      </div>

      {/* Nome */}
      <KineticText
        lines={d.nameLines}
        startFrame={PRODUCT_BEATS.nameIn}
        style={{
          position: 'absolute',
          left: SAFE.left,
          width: SAFE_WIDTH,
          top: NAME_TOP,
          textAlign: 'center',
          fontFamily: DISPLAY,
          fontSize: nameSize,
          lineHeight: 1.04,
          color: palette.ink,
        }}
      />

      {/* Prato + produto */}
      <div
        style={{
          position: 'absolute',
          left: PLATE.cx - PLATE.d / 2,
          top: PLATE.cy - PLATE.d / 2,
          width: PLATE.d,
          height: PLATE.d,
          borderRadius: '50%',
          background: palette.plate,
          border: `14px solid ${palette.plateRing}`,
          transform: `scale(${spring({ frame, fps, config: { damping: 14 } })})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: PLATE.cx - 230,
          top: PLATE.cy - 238,
          width: 460,
          height: 460,
        }}
      >
        <ProductStage
          imageUrl={item.imageUrl}
          imageMode={item.imageMode}
          bbox={item.bbox}
          size={460}
          startFrame={PRODUCT_BEATS.productIn}
        />
      </div>

      {/* Estrela de 16 pontas atrás do preço */}
      <div
        style={{
          position: 'absolute',
          left: 540 - 330,
          top: PRICE_CENTER_Y - 330,
          transform: `rotate(${starRotation}deg) scale(${starIn})`,
        }}
      >
        <Star points={16} innerRadius={282} outerRadius={330} fill={palette.star} />
      </div>

      {/* "DE" + risco */}
      {fromText ? (
        <div
          style={{
            position: 'absolute',
            left: 540 - fromWidth / 2,
            top: FROM_TOP,
            width: fromWidth,
            height: fromSize * 1.1,
          }}
        >
          <div
            style={{
              fontFamily: BODY,
              fontWeight: 800,
              fontSize: fromSize,
              lineHeight: 1.1,
              color: palette.ink,
              opacity: fromOpacity,
              whiteSpace: 'nowrap',
            }}
          >
            {fromText}
          </div>
          <StrikeLine
            width={fromWidth + 24}
            height={fromSize * 1.1}
            color={palette.strike}
            startFrame={PRODUCT_BEATS.strikeIn}
            endFrame={PRODUCT_BEATS.strikeOut}
            thickness={9}
          />
        </div>
      ) : null}

      {/* Glow do pulso (gradiente estático, só a opacidade anima) */}
      <div
        style={{
          position: 'absolute',
          left: 540 - 520,
          top: PRICE_CENTER_Y - 260,
          width: 1040,
          height: 520,
          background: `radial-gradient(closest-side, ${palette.star}, rgba(255,255,255,0))`,
          opacity: wave * 0.9,
        }}
      />

      {/* POR + preço */}
      {frame >= d.slamFrame ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: '100%',
            top: PRICE_CENTER_Y - priceLayout.height / 2 - 20,
            display: 'flex',
            justifyContent: 'center',
            transform: `scale(${slamScale * pulseScale})`,
            opacity: Math.min(1, slam * 4),
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: palette.priceBg,
              borderRadius: 28,
              padding: '22px 40px 18px',
              transform: 'rotate(-3deg)',
              boxShadow: '0 14px 0 rgba(0,0,0,0.22)',
            }}
          >
            <div
              style={{
                width: porLabelWidth,
                fontFamily: BODY,
                fontWeight: 800,
                fontSize: 40,
                lineHeight: 1,
                color: palette.priceInk,
                alignSelf: 'center',
              }}
            >
              POR
            </div>
            <PriceTag
              cents={item.priceToCents}
              unit={item.unit}
              fontFamily={DISPLAY}
              fontSize={priceLayout.fontSize}
              color={palette.priceInk}
            />
          </div>
        </div>
      ) : null}

      <ParticleBurst
        x={540}
        y={PRICE_CENTER_Y}
        startFrame={d.slamFrame + 2}
        seed={seed}
        colors={[palette.priceBg, palette.star, palette.ink, palette.stampBg]}
        count={12 + Math.floor(random(`${seed}-pc`) * 3)}
      />

      {/* Selo de desconto / badge */}
      <StampBadge
        startFrame={PRODUCT_BEATS.badgeIn}
        size={210}
        x={862}
        y={690}
        background={palette.stampBg}
        style={{ border: `8px solid ${palette.plate}` }}
      >
        {d.stamp.kind === 'discount' ? (
          <div
            style={{
              fontFamily: DISPLAY,
              color: palette.stampInk,
              textAlign: 'center',
              lineHeight: 0.95,
            }}
          >
            <div style={{ fontSize: 82 }}>−{d.stamp.value}%</div>
            <div
              style={{ fontFamily: BODY, fontWeight: 800, fontSize: 28, letterSpacing: '0.08em' }}
            >
              OFF
            </div>
          </div>
        ) : (
          <StampText lines={d.stamp.lines} color={palette.stampInk} />
        )}
      </StampBadge>

      {item.isAlcoholic ? (
        <AlcoholBar background={palette.chipBg} color={palette.chipInk} fontFamily={BODY} />
      ) : null}
    </AbsoluteFill>
  );
};

const StampText: React.FC<{ lines: string[]; color: string }> = ({ lines, color }) => {
  const size = Math.min(
    60,
    ...lines.map((l) => fitText({ text: l, withinWidth: 160, fontFamily: DISPLAY }).fontSize),
  );
  return (
    <div style={{ fontFamily: DISPLAY, color, fontSize: size, lineHeight: 1, textAlign: 'center' }}>
      {lines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  );
};
