// Baixa (uma vez, no desenvolvimento) os woff2 do subset latin das fontes do catálogo para
// public/fonts. Os arquivos são versionados: o render não depende de rede (fontes OFL).
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(readFileSync(path.join(root, 'src/font-catalog.json'), 'utf8'));
const outDir = path.join(root, 'public/fonts');
mkdirSync(outDir, { recursive: true });

const manifest = {};
for (const [family, { module, weights }] of Object.entries(catalog)) {
  const info = require(`@remotion/google-fonts/${module}`).getInfo();
  manifest[family] = {};
  for (const weight of weights) {
    const url = info.fonts.normal?.[weight]?.latin;
    if (!url) throw new Error(`${family} ${weight} latin não encontrado`);
    const file = `${family}-${path.basename(new URL(url).pathname)}`;
    const dest = path.join(outDir, file);
    if (!existsSync(dest)) {
      // curl respeita HTTPS_PROXY e o bundle de CA do sistema.
      execFileSync('curl', ['-fsSL', '-o', dest, url], { stdio: 'inherit' });
      console.log(`baixado ${file}`);
    }
    manifest[family][weight] = file;
  }
}
writeFileSync(path.join(root, 'src/font-files.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log('ok');
