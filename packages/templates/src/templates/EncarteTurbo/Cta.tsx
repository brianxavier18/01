import { fitText } from '@remotion/layout-utils';
import { displayUpper, smartLines } from '@promo/shared';
import type { PromoProps } from '@promo/schema';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  AlcoholBar,
  AtIcon,
  ChatPhoneIcon,
  KineticText,
  LegalBar,
  PinIcon,
  StoreMark,
} from '../../components';
import { SAFE, SAFE_WIDTH } from '../../timing';
import { EncarteBackground } from './Background';
import { BODY, DISPLAY } from './fonts';
import type { EncartePalette } from './palette';

const ANIMATION_END = 60;

export const EncarteCta: React.FC<{ props: PromoProps; palette: EncartePalette }> = ({
  props,
  palette,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = smartLines(displayUpper(props.cta.line1 || 'CORRE QUE É SÓ HOJE!'), 2);
  const size = Math.min(
    170,
    ...lines.map(
      (l) => fitText({ text: l, withinWidth: SAFE_WIDTH, fontFamily: DISPLAY }).fontSize,
    ),
  );
  const headTop = 330;
  const headBottom = headTop + lines.length * size * 1.02;

  const contact = spring({ frame: frame - 18, fps, config: { damping: 13 } });
  const info = spring({ frame: frame - 28, fps, config: { damping: 15 } });
  const logo = spring({ frame: frame - 36, fps, config: { damping: 10, stiffness: 160 } });

  const line2Top = headBottom + 10;
  const contactTop = line2Top + (props.cta.line2 ? 90 : 30);
  const infoTop = contactTop + 160;
  const logoTop = infoTop + 150;
  const legalTop = 1340;
  const { addressShort, instagram, whatsappDisplay } = props.store;

  return (
    <AbsoluteFill>
      <EncarteBackground
        fill={palette.bookendBg}
        rays={palette.bookendInk}
        bursts={palette.sceneBg}
        dots={palette.bookendInk}
        seed={props.seed + 99}
        center={{ x: 540, y: 700 }}
        stopAt={ANIMATION_END}
      />
      <KineticText
        lines={lines}
        startFrame={6}
        stagger={4}
        damping={11}
        style={{
          position: 'absolute',
          left: SAFE.left,
          width: SAFE_WIDTH,
          top: headTop,
          textAlign: 'center',
          fontFamily: DISPLAY,
          fontSize: size,
          lineHeight: 1.02,
          color: palette.bookendInk,
        }}
      />
      {props.cta.line2 ? (
        <div
          style={{
            position: 'absolute',
            left: SAFE.left,
            width: SAFE_WIDTH,
            top: line2Top,
            textAlign: 'center',
            fontFamily: BODY,
            fontWeight: 700,
            fontSize: 44,
            color: palette.bookendInk,
            opacity: interpolate(frame, [16, 26], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          {props.cta.line2}
        </div>
      ) : null}
      {whatsappDisplay ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: '100%',
            top: contactTop,
            display: 'flex',
            justifyContent: 'center',
            transform: `scale(${contact})`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              background: '#FFFFFF',
              color: '#141414',
              borderRadius: 999,
              padding: '18px 44px 18px 26px',
              fontFamily: BODY,
              fontWeight: 800,
              fontSize: 62,
              boxShadow: '0 12px 0 rgba(0,0,0,0.2)',
            }}
          >
            <ChatPhoneIcon size={84} color="#16A34A" background="#FFFFFF" />
            {whatsappDisplay}
          </div>
        </div>
      ) : null}
      {addressShort || instagram ? (
        <div
          style={{
            position: 'absolute',
            left: SAFE.left,
            width: SAFE_WIDTH,
            top: infoTop,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            fontFamily: BODY,
            fontWeight: 700,
            fontSize: 42,
            color: palette.bookendInk,
            opacity: info,
            transform: `translateY(${interpolate(info, [0, 1], [40, 0])}px)`,
          }}
        >
          {addressShort ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <PinIcon size={44} color={palette.bookendInk} />
              {addressShort}
            </div>
          ) : null}
          {instagram ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AtIcon size={40} color={palette.bookendInk} />
              {instagram.startsWith('@') ? instagram : `@${instagram}`}
            </div>
          ) : null}
        </div>
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: 540 - 230,
          top: logoTop,
          width: 460,
          height: 200,
          background: '#FFFFFF',
          borderRadius: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${logo})`,
          boxShadow: '0 12px 0 rgba(0,0,0,0.2)',
        }}
      >
        <StoreMark
          logoUrl={props.store.logoUrl}
          name={props.store.name}
          maxWidth={390}
          maxHeight={150}
          fontFamily={DISPLAY}
          color="#141414"
        />
      </div>
      <LegalBar
        text={props.legal.text}
        color={palette.bookendInk}
        fontFamily={BODY}
        top={legalTop}
      />
      {props.legal.alcoholWarning ? (
        <AlcoholBar background={palette.chipBg} color={palette.chipInk} fontFamily={BODY} />
      ) : null}
    </AbsoluteFill>
  );
};
