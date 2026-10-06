/** Contraste WCAG 2.x entre cores hexadecimais #RRGGBB. */

export const MIN_CONTRAST = 4.5;

export function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex.trim());
  if (!m) throw new Error(`cor inválida: ${hex}`);
  return [parseInt(m[1]!, 16), parseInt(m[2]!, 16), parseInt(m[3]!, 16)];
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export const INK_DARK = '#111111';
export const INK_LIGHT = '#FFFFFF';

/** Melhor tinta (clara/escura) para texto sobre `background`. */
export function bestInk(background: string, dark = INK_DARK, light = INK_LIGHT): string {
  return contrastRatio(background, dark) >= contrastRatio(background, light) ? dark : light;
}

export interface ReadableText {
  color: string;
  /** Cor de placa a desenhar atrás do texto quando nem a cor pedida nem as tintas passam. */
  plate: string | null;
}

/**
 * Garante texto legível: usa `preferred` se passar; senão a melhor tinta;
 * em último caso devolve uma placa atrás do texto.
 */
export function readableText(
  preferred: string,
  background: string,
  min = MIN_CONTRAST,
): ReadableText {
  if (contrastRatio(preferred, background) >= min) return { color: preferred, plate: null };
  const ink = bestInk(background);
  if (contrastRatio(ink, background) >= min) return { color: ink, plate: null };
  return { color: INK_LIGHT, plate: INK_DARK };
}
