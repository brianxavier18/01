import { Audio, interpolate, useVideoConfig } from 'remotion';
import { resolveAsset } from '../assets';

/** Trilha com fade-in 0–10 f, fade-out nos últimos 15 f, volume 0,8. */
export const MusicTrack: React.FC<{ musicUrl?: string }> = ({ musicUrl }) => {
  const { durationInFrames } = useVideoConfig();
  if (!musicUrl) return null;
  return (
    <Audio
      src={resolveAsset(musicUrl)}
      volume={(f) =>
        interpolate(f, [0, 10, durationInFrames - 15, durationInFrames], [0, 0.8, 0.8, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      }
    />
  );
};
