import { linearTiming, TransitionSeries } from '@remotion/transitions';
import { wipe } from '@remotion/transitions/wipe';
import type { PromoProps } from '@promo/schema';
import { Fragment } from 'react';
import { AbsoluteFill } from 'remotion';
import { MusicTrack } from '../../components';
import { FontGate } from '../../fonts';
import { CTA_FRAMES, INTRO_FRAMES, PRODUCT_FRAMES, TRANSITION_FRAMES } from '../../timing';
import { EncarteCta } from './Cta';
import { fontLoaders } from './fonts';
import { EncarteIntro } from './Intro';
import { encartePalette } from './palette';
import { EncarteProduct } from './ProductScene';

const transition = (
  <TransitionSeries.Transition
    presentation={wipe({ direction: 'from-top-left' })}
    timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
  />
);

/** Encarte Turbo — mercado/hortifrúti. Amarelo vivo, explosões vermelhas, preço sobre estrela de 16 pontas. */
export const EncarteTurbo: React.FC<PromoProps> = (props) => {
  const palette = encartePalette(props.theme);
  return (
    <AbsoluteFill style={{ background: palette.bookendBg }}>
      <FontGate loaders={fontLoaders} fallback={null}>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={INTRO_FRAMES}>
            <EncarteIntro props={props} palette={palette} />
          </TransitionSeries.Sequence>
          {props.items.map((item, i) => (
            <Fragment key={i}>
              {transition}
              <TransitionSeries.Sequence durationInFrames={PRODUCT_FRAMES}>
                <EncarteProduct props={props} item={item} index={i} palette={palette} />
              </TransitionSeries.Sequence>
            </Fragment>
          ))}
          {transition}
          <TransitionSeries.Sequence durationInFrames={CTA_FRAMES}>
            <EncarteCta props={props} palette={palette} />
          </TransitionSeries.Sequence>
        </TransitionSeries>
        <MusicTrack musicUrl={props.audio.musicUrl} />
      </FontGate>
    </AbsoluteFill>
  );
};
