export interface AssessmentOption {
  readonly id: string;
  readonly text: string;
}

export interface AssessmentQuestion {
  readonly id: string;
  readonly prompt: string;
  readonly options: readonly AssessmentOption[];
  readonly correctOptionId: string;
  readonly feedback: string;
}

export interface AssessmentDefinition {
  readonly courseId: string;
  readonly passingScore: number;
  readonly questions: readonly AssessmentQuestion[];
}

export interface AssessmentResult {
  readonly score: number;
  readonly total: number;
  readonly passed: boolean;
  readonly attempts: number;
  readonly lastAttemptAt: string;
  /** Fecha de la primera aprobación; se conserva aunque se repita la evaluación. */
  readonly passedAt?: string;
}

export type AssessmentAnswers = Readonly<Record<string, string>>;
