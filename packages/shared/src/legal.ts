import { dateBR } from './dates';

export type LegalMode = 'date_only' | 'while_stock' | 'custom';

export const ALCOHOL_WARNING = 'BEBA COM MODERAÇÃO • VENDA PROIBIDA PARA MENORES DE 18 ANOS';

export function legalText(mode: LegalMode, date: string, custom?: string | null): string {
  const d = dateBR(date);
  switch (mode) {
    case 'date_only':
      return `Ofertas válidas para ${d}. Imagens ilustrativas.`;
    case 'while_stock':
      return `Ofertas válidas para ${d} ou enquanto durarem os estoques. Imagens ilustrativas.`;
    case 'custom': {
      const text = (custom ?? '').trim();
      return (text || `Ofertas válidas para ${d}.`).slice(0, 110);
    }
  }
}
