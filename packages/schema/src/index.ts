import { z } from 'zod';

export const Segment = z.enum(['market', 'beverages', 'fashion', 'hardware', 'other']);
export type Segment = z.infer<typeof Segment>;

export const Unit = z.enum(['un', 'kg', 'g', 'L', 'ml', 'pct', 'cx', 'par', 'm', 'm2']);
export type Unit = z.infer<typeof Unit>;

export const BBox = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  w: z.number().gt(0).max(1),
  h: z.number().gt(0).max(1),
  /** Proporção largura/altura da imagem inteira; o painel calcula junto com o bbox. */
  aspect: z.number().positive().optional(),
});
export type BBox = z.infer<typeof BBox>;

export const PromoItem = z
  .object({
    name: z.string().min(2).max(40),
    unit: Unit,
    imageUrl: z.string().url(),
    imageMode: z.enum(['cutout', 'photo']),
    bbox: BBox.optional(),
    priceFromCents: z.number().int().positive().optional(),
    priceToCents: z.number().int().positive(),
    badge: z.string().max(18).optional(),
    isAlcoholic: z.boolean(),
  })
  .refine((i) => !i.priceFromCents || i.priceToCents < i.priceFromCents, {
    message: 'preço "por" deve ser menor que o "de"',
    path: ['priceToCents'],
  });
export type PromoItem = z.infer<typeof PromoItem>;

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'cor deve estar no formato #RRGGBB');

export const Theme = z.object({
  primary: hexColor,
  secondary: hexColor,
  accent: hexColor,
  background: hexColor,
  ink: hexColor,
});
export type Theme = z.infer<typeof Theme>;

export const StoreInfo = z.object({
  name: z.string().min(1).max(40),
  logoUrl: z.string().url().optional(),
  whatsappDisplay: z.string().max(24).optional(),
  addressShort: z.string().max(40).optional(),
  instagram: z.string().max(30).optional(),
  segment: Segment,
});
export type StoreInfo = z.infer<typeof StoreInfo>;

export const PromoProps = z.object({
  store: StoreInfo,
  theme: Theme,
  /** Ex.: "TERÇA • 06/10" */
  dateLabel: z.string().max(24),
  /** Ex.: "OFERTAS DO DIA" */
  headline: z.string().min(1).max(22),
  items: z.array(PromoItem).length(3),
  cta: z.object({ line1: z.string().max(26), line2: z.string().max(40).optional() }),
  legal: z.object({ text: z.string().max(110), alcoholWarning: z.boolean() }),
  audio: z.object({
    musicUrl: z.string().url().optional(),
    bpm: z.number().positive().optional(),
    sfx: z.boolean(),
  }),
  seed: z.number().int(),
});
export type PromoProps = z.infer<typeof PromoProps>;

export const RenderInput = z.object({
  jobId: z.string().min(1),
  runId: z.string().min(1),
  /** Ex.: "EncarteTurboV1" */
  compositionId: z.string().min(1),
  props: PromoProps,
  output: z.object({ videoPutUrl: z.string().url(), thumbPutUrl: z.string().url() }),
  quality: z
    .object({
      crf: z.number().int().min(1).max(51).default(22),
      maxBytes: z.number().int().positive().default(15_000_000),
    })
    .prefault({}),
  isProduction: z.boolean(),
});
export type RenderInput = z.infer<typeof RenderInput>;

export const RenderResult = z.object({
  sizeBytes: z.number().int(),
  durationMs: z.number().int(),
  probe: z.record(z.string(), z.unknown()),
});
export type RenderResult = z.infer<typeof RenderResult>;

/**
 * O aviso de álcool é derivado dos itens no backend; nunca confie no valor vindo do cliente.
 */
export function withDerivedLegal(props: PromoProps): PromoProps {
  return {
    ...props,
    legal: { ...props.legal, alcoholWarning: props.items.some((i) => i.isAlcoholic) },
  };
}
