import { fitText } from '@remotion/layout-utils';
import { contrastRatio, displayUpper, MIN_CONTRAST, smartLines } from '@promo/shared';
import type { PromoProps } from '@promo/schema';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FallingLetters, StoreMark } from '../../components';
import { SAFE, SAFE_WIDTH } from '../../timing';
import { EncarteBackground } from './Background';
import { BODY, DISPLAY } from './fonts';
import type { EncartePalette } from './palette';

export const EncarteIntro: React.FC<{ props: PromoProps; palette: EncartePalette }> = ({
  props,
  palette,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = smartLines(displayUpper(props.headline), 2);
  const fontSize = Math.min(
    250,
    ...lines.map(
      (l) => fitText({ text: l, withinWidth: SAFE_WIDTH, fontFamily: DISPLAY }).fontSize,
    ),
  );
  const lineHeight = fontSize * 1.02;
  const headlineTop = 470;

  const chip = spring({ frame: frame - 18, fps, config: { damping: 14 } });
  const logo = spring({ frame: frame - 20, fps, config: { damping: 10, stiffness: 160 } });
  const line2Color =
    contrastRatio(palette.sceneBg, palette.bookendBg) >= MIN_CONTRAST
      ? palette.sceneBg
      : palette.bookendInk;
  const chipTop = headlineTop + lineHeight * lines.length + 50;

  return (
    <AbsoluteFill>
      <EncarteBackground
        fill={palette.bookendBg}
        rays={palette.bookendInk}
        bursts={palette.sceneBg}
        dots={palette.bookendInk}
        seed={props.seed}
        center={{ x: 540, y: 760 }}
        openingWipe={palette.sceneBg}
      />
      {lines.map((line, i) => (
        <FallingLetters
          key={i}
          text={line}
          startFrame={2 + i * 6}
          style={{
            position: 'absolute',
            left: SAFE.left,
            width: SAFE_WIDTH,
            top: headlineTop + i * lineHeight,
            textAlign: 'center',
            fontFamily: DISPLAY,
            fontSize,
            lineHeight: `${lineHeight}px`,
            color: i === 0 ? palette.bookendInk : line2Color,
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: '100%',
          top: chipTop,
          display: 'flex',
          justifyContent: 'center',
          transform: `translateX(${interpolate(chip, [0, 1], [-700, 0])}px)`,
          opacity: chip,
        }}
      >
        <div
          style={{
            background: palette.bookendChipBg,
            color: palette.bookendChipInk,
            fontFamily: BODY,
            fontWeight: 800,
            fontSize: 54,
            padding: '14px 40px',
            borderRadius: 999,
            letterSpacing: '0.04em',
          }}
        >
          {props.dateLabel}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 540 - 260,
          top: chipTop + 150,
          width: 520,
          height: 260,
          background: '#FFFFFF',
          borderRadius: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${logo}) rotate(${interpolate(logo, [0, 1], [-10, 0])}deg)`,
          boxShadow: '0 16px 0 rgba(0,0,0,0.18)',
        }}
      >
        <StoreMark
          logoUrl={props.store.logoUrl}
          name={props.store.name}
          maxWidth={440}
          maxHeight={200}
          fontFamily={DISPLAY}
          color="#141414"
        />
      </div>
    </AbsoluteFill>
  );
};
