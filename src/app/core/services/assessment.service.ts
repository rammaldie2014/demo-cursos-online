import { inject, Injectable } from '@angular/core';
import { AssessmentAnswers, AssessmentDefinition, AssessmentResult } from '../models';
import { AssessmentRepository } from '../repositories/content-repositories';
import { Clock } from '../utils/clock';
import { CourseProgressService } from './course-progress.service';
import { LearnerStateStore } from './learner-state.store';

export interface GradedAssessment {
  readonly score: number;
  readonly total: number;
  readonly passed: boolean;
  readonly correctByQuestion: Readonly<Record<string, boolean>>;
}

/** Función pura de calificación: fácil de probar y reutilizar. */
export function gradeAssessment(definition: AssessmentDefinition, answers: AssessmentAnswers): GradedAssessment {
  const correctByQuestion = Object.fromEntries(
    definition.questions.map((q) => [q.id, answers[q.id] === q.correctOptionId]),
  );
  const score = Object.values(correctByQuestion).filter(Boolean).length;
  return { score, total: definition.questions.length, passed: score >= definition.passingScore, correctByQuestion };
}

@Injectable({ providedIn: 'root' })
export class AssessmentService {
  private readonly repository = inject(AssessmentRepository);
  private readonly progress = inject(CourseProgressService);
  private readonly store = inject(LearnerStateStore);
  private readonly clock = inject(Clock);

  definition(courseId: string): AssessmentDefinition | undefined {
    return this.repository.getByCourse(courseId);
  }

  isUnlocked(courseId: string): boolean {
    return this.definition(courseId) !== undefined && this.progress.isCourseCompleted(courseId);
  }

  result(courseId: string): AssessmentResult | undefined {
    return this.store.state().assessmentResults[courseId];
  }

  hasPassed(courseId: string): boolean {
    return this.result(courseId)?.passedAt !== undefined;
  }

  submit(courseId: string, answers: AssessmentAnswers): GradedAssessment | null {
    const definition = this.definition(courseId);
    if (!definition || !this.isUnlocked(courseId)) {
      return null;
    }
    const graded = gradeAssessment(definition, answers);
    const previous = this.result(courseId);
    const now = this.clock.now().toISOString();
    const result: AssessmentResult = {
      score: graded.score,
      total: graded.total,
      passed: graded.passed,
      attempts: (previous?.attempts ?? 0) + 1,
      lastAttemptAt: now,
      passedAt: previous?.passedAt ?? (graded.passed ? now : undefined),
    };
    this.store.update((state) => ({
      ...state,
      assessmentResults: { ...state.assessmentResults, [courseId]: result },
    }));
    return graded;
  }
}
