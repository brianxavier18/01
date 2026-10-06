/** Timeline global (seção 8.2). Soma das cenas − sobreposições das transições = 450. */
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const INTRO_FRAMES = 50;
export const PRODUCT_FRAMES = 113;
export const CTA_FRAMES = 101;
export const TRANSITION_FRAMES = 10;
export const PRODUCT_COUNT = 3;

export const TOTAL_FRAMES =
  INTRO_FRAMES +
  PRODUCT_FRAMES * PRODUCT_COUNT +
  CTA_FRAMES -
  TRANSITION_FRAMES * (PRODUCT_COUNT + 1);

/** Frame global em que cada cena começa (após a sobreposição da transição de entrada). */
export const SCENE_STARTS = {
  intro: 0,
  products: Array.from(
    { length: PRODUCT_COUNT },
    (_, i) => INTRO_FRAMES - TRANSITION_FRAMES + i * (PRODUCT_FRAMES - TRANSITION_FRAMES),
  ),
  cta: INTRO_FRAMES + PRODUCT_COUNT * PRODUCT_FRAMES - (PRODUCT_COUNT + 1) * TRANSITION_FRAMES,
} as const;

/** Frames-chave usados nos snapshots de QA (seção 17). */
export const QA_FRAMES = {
  intro: 36,
  product1: 120,
  product2: 223,
  product3: 326,
  cta: 420,
} as const;

/** Frame do thumbnail (manchete, data e logo completos, antes da 1ª transição). */
export const THUMBNAIL_FRAME = 35;

/** Micro-timeline da cena de produto (frames locais, seção 8.3). */
export const PRODUCT_BEATS = {
  pillIn: 0,
  productIn: 4,
  nameIn: 10,
  fromIn: 22,
  strikeIn: 30,
  strikeOut: 40,
  slam: 40,
  slamNoFrom: 30,
  badgeIn: 46,
  holdStart: 52,
  holdEnd: 102,
} as const;

/** Zona segura para texto essencial (UI do Instagram por cima). */
export const SAFE = { left: 72, right: 1008, top: 260, bottom: 1580 } as const;
export const SAFE_WIDTH = SAFE.right - SAFE.left;

/** Máximo de 2 pulsos por segundo (acessibilidade). */
export const MIN_PULSE_PERIOD = FPS / 2;

/** Período do pulso do preço, alinhado ao beat quando houver BPM. */
export function pulsePeriod(bpm?: number): number {
  if (!bpm || bpm <= 0) return 20;
  let period = (FPS * 60) / bpm;
  while (period < MIN_PULSE_PERIOD) period *= 2;
  return period;
}
