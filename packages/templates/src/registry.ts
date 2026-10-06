import type { PromoProps } from '@promo/schema';
import type { ComponentType } from 'react';
import { EncarteTurbo } from './templates/EncarteTurbo/EncarteTurbo';

export interface TemplateDefinition {
  /** Slug guardado em `templates.id` / `runs.template_id`. */
  id: string;
  name: string;
  version: number;
  compositionId: string;
  segments: PromoProps['store']['segment'][];
  component: ComponentType<PromoProps>;
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'encarte-turbo',
    name: 'Encarte Turbo',
    version: 1,
    compositionId: 'EncarteTurboV1',
    segments: ['market', 'other'],
    component: EncarteTurbo,
  },
];

export function templateByComposition(compositionId: string): TemplateDefinition | undefined {
  return TEMPLATES.find((t) => t.compositionId === compositionId);
}
