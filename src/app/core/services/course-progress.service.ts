import { inject, Injectable } from '@angular/core';
import { Lesson, LessonAnswers } from '../models';
import { LessonRepository } from '../repositories/content-repositories';
import { LearnerStateStore } from './learner-state.store';
import { validateLessonAnswers } from './lesson-validation';

export type SaveLessonResult = { readonly ok: true } | { readonly ok: false; readonly errors: Record<string, string> };

/** Calcula y registra el avance de los instructivos. */
@Injectable({ providedIn: 'root' })
export class CourseProgressService {
  private readonly store = inject(LearnerStateStore);
  private readonly lessonRepository = inject(LessonRepository);

  lessons(courseId: string): readonly Lesson[] {
    return this.lessonRepository.getByCourse(courseId);
  }

  answersFor(lessonId: string): LessonAnswers {
    return this.store.state().lessonAnswers[lessonId] ?? {};
  }

  isLessonCompleted(lessonId: string): boolean {
    return this.store.state().completedLessonIds.includes(lessonId);
  }

  completedCount(courseId: string): number {
    return this.lessons(courseId).filter((lesson) => this.isLessonCompleted(lesson.id)).length;
  }

  /** Progreso = lecciones completadas / total × 100. */
  progressPercent(courseId: string): number {
    const total = this.lessons(courseId).length;
    return total === 0 ? 0 : Math.round((this.completedCount(courseId) / total) * 100);
  }

  isCourseCompleted(courseId: string): boolean {
    const total = this.lessons(courseId).length;
    return total > 0 && this.completedCount(courseId) === total;
  }

  /** Lección para «Continuar»: la última visitada o, si no existe, la primera pendiente. */
  resumeLesson(courseId: string): Lesson | undefined {
    const lessons = this.lessons(courseId);
    const lastId = this.store.state().lastLessonByCourse[courseId];
    return (
      lessons.find((lesson) => lesson.id === lastId) ??
      lessons.find((lesson) => !this.isLessonCompleted(lesson.id)) ??
      lessons[0]
    );
  }

  markVisited(lesson: Lesson): void {
    if (this.store.state().lastLessonByCourse[lesson.courseId] === lesson.id) {
      return;
    }
    this.store.update((state) => ({
      ...state,
      lastLessonByCourse: { ...state.lastLessonByCourse, [lesson.courseId]: lesson.id },
    }));
  }

  /** Guarda las respuestas y marca el paso como completado si cumplen las reglas. */
  saveLesson(lesson: Lesson, answers: LessonAnswers): SaveLessonResult {
    const errors = validateLessonAnswers(lesson, answers);
    if (Object.keys(errors).length > 0) {
      return { ok: false, errors };
    }
    const cleaned = Object.fromEntries(
      lesson.activity.fields.map((field) => [field.id, (answers[field.id] ?? '').trim()]),
    );
    this.store.update((state) => ({
      ...state,
      lessonAnswers: { ...state.lessonAnswers, [lesson.id]: cleaned },
      completedLessonIds: state.completedLessonIds.includes(lesson.id)
        ? state.completedLessonIds
        : [...state.completedLessonIds, lesson.id],
      lastLessonByCourse: { ...state.lastLessonByCourse, [lesson.courseId]: lesson.id },
    }));
    return { ok: true };
  }
}
