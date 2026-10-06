import type { Segment, Unit } from '@promo/schema';
import { dateLabelLower } from './dates';
import { formatBRL, unitSuffix, visibleDiscount } from './price';
import { pickBySeed } from './random';
import { ALCOHOL_WARNING } from './legal';

export interface CaptionItem {
  name: string;
  unit: Unit;
  priceFromCents?: number;
  priceToCents: number;
  isAlcoholic: boolean;
}

export interface CaptionInput {
  storeName: string;
  segment: Segment;
  city?: string;
  date: string; // YYYY-MM-DD
  items: CaptionItem[];
  whatsappDisplay?: string;
  addressShort?: string;
  legalText: string;
  seed: number;
}

const OPENERS: Record<Segment, string[]> = {
  market: [
    '🛒 Ofertas fresquinhas de hoje no {loja}!',
    '🔥 Hoje tem preço baixo no {loja}!',
    '🥩 Bora economizar? Olha as ofertas do {loja}:',
    '📣 Ofertas do dia no {loja}, aproveita!',
  ],
  beverages: [
    '🧊 Gelada e com preço baixo no {loja}!',
    '🍻 Ofertas geladas de hoje no {loja}:',
    '🔥 Hoje tem promoção no {loja}!',
    '📣 Bebida gelada e barata é no {loja}:',
  ],
  fashion: [
    '✨ Seleção especial de hoje no {loja}:',
    '🛍️ Peças com preço especial no {loja}!',
    '💫 Novidades com desconto no {loja}:',
    '📣 Só hoje no {loja}:',
  ],
  hardware: [
    '🔧 Ofertas para a sua obra no {loja}!',
    '🧱 Preço baixo para construir e reformar no {loja}:',
    '🔨 Hoje tem oferta no {loja}:',
    '📣 Ofertas do dia no {loja}:',
  ],
  other: [
    '🔥 Ofertas de hoje no {loja}!',
    '📣 Aproveita as ofertas do {loja}:',
    '💥 Preço especial hoje no {loja}:',
  ],
};

const CLOSERS = [
  'Corre que é só hoje!',
  'Garanta o seu antes que acabe!',
  'Vem aproveitar!',
  'Te esperamos aqui!',
];

const SEGMENT_TAG: Record<Segment, string> = {
  market: 'mercado',
  beverages: 'bebidas',
  fashion: 'moda',
  hardware: 'construcao',
  other: 'promocao',
};

function hashtagify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();
}

function itemLine(i: CaptionItem): string {
  const to = `${formatBRL(i.priceToCents)}${i.unit === 'un' ? '' : unitSuffix(i.unit)}`;
  const d = visibleDiscount(i.priceFromCents, i.priceToCents);
  const from = i.priceFromCents ? `de ${formatBRL(i.priceFromCents)} por ` : 'por ';
  return `▪️ ${i.name}: ${from}${to}${d ? ` (−${d}%)` : ''}`;
}

/** Legenda determinística: só usa dados do run (nunca inventa preço). */
export function buildCaption(input: CaptionInput): string {
  const opener = pickBySeed(OPENERS[input.segment], input.seed, 1).replace(
    '{loja}',
    input.storeName,
  );
  const closer = pickBySeed(CLOSERS, input.seed, 2);
  const lines: string[] = [opener, '', ...input.items.map(itemLine), ''];
  lines.push(`📅 ${capitalize(dateLabelLower(input.date))}. ${closer}`);
  if (input.whatsappDisplay) lines.push(`📲 Pedidos: ${input.whatsappDisplay}`);
  if (input.addressShort) lines.push(`📍 ${input.addressShort}`);
  lines.push('', input.legalText);
  if (input.items.some((i) => i.isAlcoholic)) lines.push(ALCOHOL_WARNING);
  const tags = ['#ofertas', `#${SEGMENT_TAG[input.segment]}`];
  if (input.city) tags.push(`#${hashtagify(input.city)}`);
  tags.push(`#${hashtagify(input.storeName)}`);
  lines.push('', tags.join(' '));
  return lines.join('\n');
}

function capitalize(s: string): string {
  return s.charAt(0).toLocaleUpperCase('pt-BR') + s.slice(1);
}
