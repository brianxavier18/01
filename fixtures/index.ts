import type { PromoItem, PromoProps, Segment, Theme } from '@promo/schema';
import { withDerivedLegal } from '@promo/schema';
import { dateLabel, legalText, runSeed } from '@promo/shared';

/**
 * Fixtures de QA (seção 17). Imagens usam `fixture://arquivo`, resolvido pelos templates
 * para packages/templates/public/fixtures.
 */
export const FIXTURE_DATE = '2026-10-06';

type ItemInput = Omit<PromoItem, 'imageMode' | 'isAlcoholic'> &
  Partial<Pick<PromoItem, 'imageMode' | 'isAlcoholic'>>;

function item(i: ItemInput): PromoItem {
  return { imageMode: 'cutout', isAlcoholic: false, ...i };
}

function store(opts: {
  id: string;
  name: string;
  segment: Segment;
  theme: Theme;
  items: [PromoItem, PromoItem, PromoItem];
  logo?: string;
  whatsapp?: string;
  address?: string;
  instagram?: string;
  headline?: string;
}): PromoProps {
  return withDerivedLegal({
    store: {
      name: opts.name,
      segment: opts.segment,
      logoUrl: opts.logo ? `fixture://${opts.logo}` : undefined,
      whatsappDisplay: opts.whatsapp,
      addressShort: opts.address,
      instagram: opts.instagram,
    },
    theme: opts.theme,
    dateLabel: dateLabel(FIXTURE_DATE),
    headline: opts.headline ?? 'OFERTAS DO DIA',
    items: opts.items,
    cta: { line1: 'CORRE QUE É SÓ HOJE!' },
    legal: { text: legalText('while_stock', FIXTURE_DATE), alcoholWarning: false },
    audio: { sfx: false },
    seed: runSeed(opts.id, FIXTURE_DATE),
  });
}

export const mercadoSerraVerde = store({
  id: 'mercado-serra-verde',
  name: 'Mercado Serra Verde',
  segment: 'market',
  logo: 'logo-serra-verde.svg',
  whatsapp: '(31) 99876-5432',
  address: 'Rua das Flores, 120 • Centro',
  instagram: 'mercadoserraverde',
  theme: {
    primary: '#D7141A',
    secondary: '#FFFFFF',
    accent: '#D7141A',
    background: '#FFD400',
    ink: '#1A1A1A',
  },
  items: [
    item({
      name: 'Picanha bovina',
      unit: 'kg',
      imageUrl: 'fixture://picanha.svg',
      priceFromCents: 6990,
      priceToCents: 5490,
    }),
    item({
      name: 'Arroz tipo 1 5kg',
      unit: 'un',
      imageUrl: 'fixture://arroz.svg',
      priceFromCents: 3290,
      priceToCents: 2699,
    }),
    item({
      name: 'Refrigerante cola 2L',
      unit: 'un',
      imageUrl: 'fixture://refri.svg',
      priceFromCents: 1290,
      priceToCents: 949,
    }),
  ],
});

export const depositoGeladaJa = store({
  id: 'deposito-gelada-ja',
  name: 'Depósito Gelada Já',
  segment: 'beverages',
  logo: 'logo-gelada-ja.svg',
  whatsapp: '(11) 97777-1234',
  address: 'Av. Brasil, 2000',
  instagram: 'geladaja',
  theme: {
    primary: '#0A3D91',
    secondary: '#7FD8FF',
    accent: '#FF3B30',
    background: '#E8F6FF',
    ink: '#06142E',
  },
  items: [
    item({
      name: 'Cerveja long neck 330ml',
      unit: 'un',
      imageUrl: 'fixture://cerveja.svg',
      priceFromCents: 749,
      priceToCents: 599,
      isAlcoholic: true,
    }),
    item({
      name: 'Gin 750ml',
      unit: 'un',
      imageUrl: 'fixture://gin.svg',
      priceFromCents: 15990,
      priceToCents: 12990,
      isAlcoholic: true,
    }),
    item({ name: 'Gelo 5kg', unit: 'un', imageUrl: 'fixture://gelo.svg', priceToCents: 1200 }),
  ],
});

export const atelieBella = store({
  id: 'atelie-bella',
  name: 'Ateliê Bella',
  segment: 'fashion',
  logo: 'logo-bella.svg',
  whatsapp: '(21) 98888-0000',
  instagram: 'ateliebella',
  theme: {
    primary: '#111111',
    secondary: '#F3EDE4',
    accent: '#B4533C',
    background: '#F7F2EA',
    ink: '#111111',
  },
  items: [
    item({
      name: 'Vestido midi linho',
      unit: 'un',
      imageUrl: 'fixture://vestido.svg',
      priceFromCents: 28990,
      priceToCents: 19990,
    }),
    item({
      name: 'Calça jeans wide leg',
      unit: 'un',
      imageUrl: 'fixture://calca.svg',
      priceFromCents: 21990,
      priceToCents: 15990,
    }),
    item({
      name: 'Blusa tricô',
      unit: 'un',
      imageUrl: 'fixture://blusa.svg',
      priceFromCents: 12990,
      priceToCents: 8990,
    }),
  ],
});

export const ferragensPedraForte = store({
  id: 'ferragens-pedra-forte',
  name: 'Ferragens Pedra Forte',
  segment: 'hardware',
  logo: 'logo-pedra-forte.svg',
  whatsapp: '(41) 3333-4444',
  address: 'Rod. BR-277, km 12',
  theme: {
    primary: '#F5B700',
    secondary: '#2B2B2B',
    accent: '#E4572E',
    background: '#D9D9D6',
    ink: '#161616',
  },
  items: [
    item({
      name: 'Furadeira de impacto 650W',
      unit: 'un',
      imageUrl: 'fixture://furadeira.svg',
      priceFromCents: 34990,
      priceToCents: 27990,
    }),
    item({
      name: 'Cimento CP-II 50kg',
      unit: 'un',
      imageUrl: 'fixture://cimento.svg',
      priceFromCents: 4290,
      priceToCents: 3690,
    }),
    item({
      name: 'Tinta acrílica 18L',
      unit: 'un',
      imageUrl: 'fixture://tinta.svg',
      priceFromCents: 38990,
      priceToCents: 29990,
    }),
  ],
});

/** Casos-limite: nome de 40 caracteres, 4 dígitos, desconto de 72%, foto sem recorte, sem logo, cor #FFF3B0. */
export const casosLimite = store({
  id: 'casos-limite',
  name: 'Loja Sem Logo Ltda',
  segment: 'other',
  whatsapp: '(85) 99999-0000',
  address: 'Rua Longa de Teste, 9999 • Bairro Novo',
  instagram: 'lojasemlogo',
  theme: {
    primary: '#FFF3B0',
    secondary: '#FFFFFF',
    accent: '#FFF3B0',
    background: '#FFFFFF',
    ink: '#FFF3B0',
  },
  items: [
    item({
      name: 'Refrigerador frost free duplex inox 480L',
      unit: 'un',
      imageUrl: 'fixture://geladeira.svg',
      priceFromCents: 289900,
      priceToCents: 249900,
    }),
    item({
      name: 'Sabão em pó 1,6kg',
      unit: 'un',
      imageUrl: 'fixture://foto-sabao.svg',
      imageMode: 'photo',
      priceFromCents: 2990,
      priceToCents: 837,
      badge: 'LEVE 3 PAGUE 2',
    }),
    item({
      name: 'Tomate italiano',
      unit: 'kg',
      imageUrl: 'fixture://tomate.svg',
      priceToCents: 799,
      badge: 'LEVE 3 PAGUE 2',
    }),
  ],
});

export const FIXTURES = {
  'mercado-serra-verde': mercadoSerraVerde,
  'deposito-gelada-ja': depositoGeladaJa,
  'atelie-bella': atelieBella,
  'ferragens-pedra-forte': ferragensPedraForte,
  'casos-limite': casosLimite,
} as const satisfies Record<string, PromoProps>;

export type FixtureId = keyof typeof FIXTURES;
