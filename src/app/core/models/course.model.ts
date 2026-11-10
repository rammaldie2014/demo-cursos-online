export type CourseLevel = 'inicial' | 'intermedio' | 'avanzado';
export type CourseCategory = 'marca' | 'marketing' | 'finanzas' | 'ventas';

export interface ImageAsset {
  readonly src: string;
  readonly alt: string;
}

export interface CourseModuleSummary {
  readonly title: string;
  readonly topics: readonly string[];
}

export interface Course {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly shortDescription: string;
  readonly description: string;
  readonly category: CourseCategory;
  readonly level: CourseLevel;
  readonly durationHours: number;
  /** Precio de ejemplo en soles. 0 = gratuito. */
  readonly priceSoles: number;
  /** Indica si el curso tiene recorrido completo dentro de la demo. */
  readonly hasFullDemo: boolean;
  readonly featured: boolean;
  readonly image: ImageAsset;
  readonly modality: string;
  readonly objectives: readonly string[];
  readonly modules: readonly CourseModuleSummary[];
  readonly materials: readonly string[];
  readonly certificateCriteria: readonly string[];
}

export const CATEGORY_LABELS: Readonly<Record<CourseCategory, string>> = {
  marca: 'Marca y diseño',
  marketing: 'Marketing digital',
  finanzas: 'Finanzas',
  ventas: 'Ventas',
};

export const LEVEL_LABELS: Readonly<Record<CourseLevel, string>> = {
  inicial: 'Inicial',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
};
