import { computed, inject, Injectable } from '@angular/core';
import { Course } from '../models';
import { CourseRepository } from '../repositories/content-repositories';
import { Clock } from '../utils/clock';
import { LearnerStateStore } from './learner-state.store';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private readonly store = inject(LearnerStateStore);
  private readonly courses = inject(CourseRepository);
  private readonly clock = inject(Clock);

  readonly enrolledCourses = computed<readonly Course[]>(() =>
    this.store
      .state()
      .enrollments.map((enrollment) => this.courses.getById(enrollment.courseId))
      .filter((course): course is Course => course !== undefined),
  );

  isEnrolled(courseId: string): boolean {
    return this.store.state().enrollments.some((e) => e.courseId === courseId);
  }

  /** Inscribe al perfil activo. Devuelve `false` si no hay perfil o el curso no está disponible. */
  enroll(courseId: string): boolean {
    const course = this.courses.getById(courseId);
    if (!course?.hasFullDemo) {
      return false;
    }
    if (this.isEnrolled(courseId)) {
      return true;
    }
    return this.store.update((state) => ({
      ...state,
      enrollments: [...state.enrollments, { courseId, enrolledAt: this.clock.now().toISOString() }],
    }));
  }
}
