# Promo Studio

SaaS multi-tenant que entrega todo dia, no WhatsApp do lojista, um vídeo de ofertas (Stories/Reels 9:16, 15 s)
feito com Remotion.

## Estrutura

```
packages/schema     contratos zod (PromoProps, RenderInput, …)
packages/shared     preço BRL, desconto, fuso/marcos do dia, contraste WCAG, texto legal, legenda, seeds
packages/templates  composições Remotion (EncarteTurboV1), componentes de motion, fontes locais
fixtures            lojas de teste (4 segmentos + casos-limite)
docs                versões/verificações e runbooks
```

## Comandos

```bash
pnpm install
pnpm lint && pnpm typecheck && pnpm test

# Remotion Studio
pnpm --filter @promo/templates studio

# Frames-chave (36, 120, 223, 326, 420) de todas as fixtures em packages/templates/out
# (--video também gera o MP4). Para usar um Chrome já instalado:
REMOTION_BROWSER_EXECUTABLE=/caminho/headless_shell pnpm --filter @promo/templates render:fixtures
```

## Status por fase (seção 16 do prompt mestre)

- [x] Fase 0: monorepo, TS strict, ESLint/Prettier, Turborepo, CI, `docs/versions.md`
- [x] Fase 1: `schema` + `shared`, com testes (preço, desconto, 3 fusos, contraste, legal, legenda)
- [x] Fase 2: timing (450 frames, testado), componentes base, template **Encarte Turbo**, fixtures, render local
- [ ] Fase 3: `apps/renderer` + Dockerfile + validação ffprobe + thumbnail
- [ ] Fases 4–9
