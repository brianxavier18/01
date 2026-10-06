// Renderiza frames-chave (e opcionalmente o MP4) de todas as fixtures × templates.
// Uso: node scripts/render-fixtures.mjs [--video] [--only=<compositionId>]
import { bundle } from '@remotion/bundler';
import { getCompositions, renderMedia, renderStill } from '@remotion/renderer';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const outDir = path.join(root, 'out');
const args = process.argv.slice(2);
const withVideo = args.includes('--video');
const only = args.find((a) => a.startsWith('--only='))?.slice('--only='.length);
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE || null;
const QA_FRAMES = { intro: 36, product1: 120, product2: 223, product3: 326, cta: 420 };

await mkdir(outDir, { recursive: true });
console.log('bundling…');
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), rootDir: root });
const compositions = (await getCompositions(serveUrl, { browserExecutable })).filter(
  (c) => c.id.includes('-') && (!only || c.id === only),
);

for (const composition of compositions) {
  for (const [label, frame] of Object.entries(QA_FRAMES)) {
    const output = path.join(
      outDir,
      composition.id,
      `${String(frame).padStart(3, '0')}-${label}.jpg`,
    );
    await renderStill({
      composition,
      serveUrl,
      frame,
      output,
      imageFormat: 'jpeg',
      jpegQuality: 85,
      browserExecutable,
    });
  }
  console.log(`stills ok: ${composition.id}`);
  if (withVideo) {
    const started = Date.now();
    const outputLocation = path.join(outDir, `${composition.id}.mp4`);
    await renderMedia({
      composition,
      serveUrl,
      codec: 'h264',
      outputLocation,
      crf: 22,
      pixelFormat: 'yuv420p',
      colorSpace: 'bt709',
      audioCodec: 'aac',
      imageFormat: 'jpeg',
      jpegQuality: 90,
      x264Preset: 'medium',
      timeoutInMilliseconds: 30_000,
      browserExecutable,
      isProduction: false,
    });
    console.log(`video ok: ${composition.id} in ${((Date.now() - started) / 1000).toFixed(1)}s`);
  }
}
