import { staticFile } from 'remotion';

/** Resolve URLs de fixtures (`fixture://arquivo`) para arquivos em public/fixtures. */
export function resolveAsset(url: string): string {
  if (url.startsWith('fixture://')) return staticFile(`fixtures/${url.slice('fixture://'.length)}`);
  return url;
}
