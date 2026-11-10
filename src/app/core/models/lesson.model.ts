export type ActivityFieldKind = 'text' | 'textarea' | 'select';

export interface ActivityField {
  readonly id: string;
  readonly label: string;
  readonly kind: ActivityFieldKind;
  readonly required: boolean;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly placeholder?: string;
  readonly hint?: string;
  readonly options?: readonly string[];
}

export interface LessonExample {
  readonly title: string;
  readonly intro: string;
  readonly items: readonly { readonly label: string; readonly value: string }[];
}

export interface Lesson {
  readonly id: string;
  readonly courseId: string;
  readonly order: number;
  readonly moduleLabel: string;
  readonly title: string;
  readonly objective: string;
  readonly explanation: readonly string[];
  readonly keyPoints: readonly string[];
  readonly example: LessonExample;
  readonly activity: {
    readonly instructions: string;
    readonly fields: readonly ActivityField[];
  };
  /** Respuestas de ejemplo que el alumno puede usar como punto de partida. */
  readonly sampleAnswers?: Readonly<Record<string, string>>;
}

export type LessonAnswers = Readonly<Record<string, string>>;
