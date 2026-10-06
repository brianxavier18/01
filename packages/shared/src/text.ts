const EMOJI = /\p{Extended_Pictographic}|[\u{1F1E6}-\u{1F1FF}]|\u{FE0F}|\u{200D}|\u{20E3}/gu;

export function stripEmoji(s: string): string {
  return s
    .replace(EMOJI, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** Caixa alta pt-BR sem emojis (evita glifos quebrados no vídeo). */
export function displayUpper(s: string): string {
  return stripEmoji(s).toLocaleUpperCase('pt-BR');
}

/**
 * Quebra um nome em até `maxLines` linhas equilibradas, por palavras.
 * Retorna a combinação que minimiza a linha mais longa.
 */
export function smartLines(text: string, maxLines = 2): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= 1 || maxLines <= 1) return [words.join(' ')];
  let best: string[] = [words.join(' ')];
  let bestLen = best[0]!.length;
  for (let i = 1; i < words.length; i++) {
    const lines = [words.slice(0, i).join(' '), words.slice(i).join(' ')];
    const longest = Math.max(...lines.map((l) => l.length));
    if (longest < bestLen) {
      best = lines;
      bestLen = longest;
    }
  }
  return best;
}

/** Sanitiza parâmetros de template do WhatsApp: sem \n, \t ou mais de 4 espaços seguidos. */
export function sanitizeTemplateParam(s: string): string {
  return s
    .replace(/[\n\r\t]+/g, ' ')
    .replace(/ {4,}/g, '   ')
    .trim();
}
