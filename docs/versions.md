# Versões e verificações (seção 3)

Verificado em 2026-10-06.

## Remotion

- Versão estável mais recente no npm: **4.0.533** (a linha 4.1 ainda está em alpha). Não há 5.x estável.
- `remotion` e todos os `@remotion/*` estão fixados em `4.0.533`, sem `^` (`.npmrc` tem `save-exact=true`).
- Como estamos na 4.x, as notas de migração da 5.x (`weights`/`subsets` obrigatórios em `@remotion/google-fonts`,
  depreciação de `@remotion/starburst` e `@remotion/light-leaks`) não se aplicam ainda. Mesmo assim, o código já
  passa `weights` e `subsets` e não usa os pacotes depreciados.

### Fontes: auto-hospedadas (desvio intencional da seção 2)

Os templates **não** carregam fontes do CDN do Google em tempo de render. `pnpm --filter @promo/templates fonts:fetch`
usa o catálogo do `@remotion/google-fonts` (subset `latin`, que cobre acentos e ç) para baixar os `.woff2` para
`packages/templates/public/fonts`. Os arquivos ficam versionados e são carregados com `@remotion/fonts`.

Por quê: render depender de `fonts.gstatic.com` é um ponto de falha (princípio 4, robustez) e quebra a regra
"boot não pode depender de rede". Isso apareceu na prática: o Chrome headless deste ambiente não conseguiu
buscar as fontes pelo proxy. Todas as fontes são OFL.

Para adicionar uma fonte: inclua a família e os pesos em `src/font-catalog.json` e rode `fonts:fetch`.

## Licença Remotion: a confirmar antes da produção

- Uso gratuito para pessoas físicas e empresas de até 3 pessoas. Acima disso, render automatizado em SaaS cai em
  **Remotion for Automators** (cobrança por render com mínimo mensal).
- O renderer deve passar `licenseKey: env.REMOTION_LICENSE_KEY` e `isProduction: env.APP_ENV === 'production'`.
  O script local `render-fixtures.mjs` já usa `isProduction: false`.
- Thumbnail sai do MP4 via FFmpeg, nunca de `renderStill()`. O `renderStill` do script de QA é só para
  desenvolvimento.
- **PENDENTE:** confirmar na documentação vigente se `licenseKey` é obrigatório na 4.0.533 e qual valor usar na
  Free License.

## Cloudflare Containers / Queues: a verificar na fase 4

- API do `@cloudflare/containers` (`Container`, `getContainer`, `sleepAfter`, `instance_type`): a verificar.
- Se uma requisição em andamento conta como atividade para o `sleepAfter`: a verificar.
- Limite de duração de consumers de Queue: a verificar.

## WhatsApp Cloud API: a verificar na fase 6

- Versão da Graph API em `META_GRAPH_VERSION`. Vídeo: MP4 H.264 + AAC, até 16 MB. Regras de templates.

## Cloudflare Images (`segment: "foreground"`): a verificar na fase 4

- Disponibilidade na conta. Fallback: `CutoutProvider` (seção 9.6).

## Demais dependências fixadas

| Pacote                  | Versão                                                        |
| ----------------------- | ------------------------------------------------------------- |
| typescript              | 5.9.3 (a 7.x nativa ainda não é suportada por todo o tooling) |
| zod                     | 4.6.5                                                         |
| react / react-dom       | 19.2.8                                                        |
| date-fns / @date-fns/tz | 4.4.0 / 1.5.0                                                 |
| vitest                  | 4.1.11                                                        |
| turbo                   | 2.11.7                                                        |
| eslint                  | 9.39.5                                                        |

## Medições

| Data       | Fixture            | Máquina          | Render 15 s | Tamanho | Probe                                                  |
| ---------- | ------------------ | ---------------- | ----------- | ------- | ------------------------------------------------------ |
| 2026-10-06 | deposito-gelada-ja | 4 vCPU (sandbox) | 46,2 s      | 4,25 MB | h264, yuv420p, 1080×1920, 30 fps, 450 frames, 15,000 s |
