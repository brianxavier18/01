/** Hash FNV-1a 32 bits — determinístico entre Worker, Node e navegador. */
export function fnv1a(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Seed do run derivada de tenant + data. */
export function runSeed(tenantId: string, date: string): number {
  return fnv1a(`${tenantId}:${date}`) & 0x7fffffff;
}

/** Escolhe um elemento por seed (sem Math.random). */
export function pickBySeed<T>(list: readonly T[], seed: number, salt = 0): T {
  if (list.length === 0) throw new Error('lista vazia');
  return list[(fnv1a(`${seed}:${salt}`) >>> 0) % list.length]!;
}

/** Rodízio de templates: próximo permitido sem repetir o de ontem. */
export function nextTemplate(
  allowed: readonly string[],
  yesterday: string | null,
  seed: number,
): string {
  if (allowed.length === 0) throw new Error('nenhum template permitido');
  const pool = allowed.length > 1 && yesterday ? allowed.filter((t) => t !== yesterday) : allowed;
  return pickBySeed(pool, seed, 7);
}
