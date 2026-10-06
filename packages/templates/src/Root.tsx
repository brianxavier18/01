import { FIXTURES, mercadoSerraVerde } from '@promo/fixtures';
import { Composition, Folder } from 'remotion';
import { TEMPLATES } from './registry';
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from './timing';

export const RemotionRoot: React.FC = () => (
  <>
    {TEMPLATES.map((t) => (
      <Composition
        key={t.compositionId}
        id={t.compositionId}
        component={t.component}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={mercadoSerraVerde}
      />
    ))}
    <Folder name="Fixtures">
      {TEMPLATES.flatMap((t) =>
        Object.entries(FIXTURES).map(([fixtureId, props]) => (
          <Composition
            key={`${t.compositionId}-${fixtureId}`}
            id={`${t.compositionId}-${fixtureId}`}
            component={t.component}
            durationInFrames={TOTAL_FRAMES}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
            defaultProps={props}
          />
        )),
      )}
    </Folder>
  </>
);
