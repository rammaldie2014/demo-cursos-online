import { AssessmentResult } from './assessment.model';
import { Booking } from './advisory.model';
import { LessonAnswers } from './lesson.model';

export interface Enrollment {
  readonly courseId: string;
  readonly enrolledAt: string;
}

/** Todo lo que la demo guarda por perfil en el navegador. */
export interface LearnerState {
  readonly enrollments: readonly Enrollment[];
  readonly lessonAnswers: Readonly<Record<string, LessonAnswers>>;
  readonly completedLessonIds: readonly string[];
  readonly lastLessonByCourse: Readonly<Record<string, string>>;
  readonly assessmentResults: Readonly<Record<string, AssessmentResult>>;
  readonly certificateNames: Readonly<Record<string, string>>;
  readonly bookings: readonly Booking[];
}

export const EMPTY_LEARNER_STATE: LearnerState = {
  enrollments: [],
  lessonAnswers: {},
  completedLessonIds: [],
  lastLessonByCourse: {},
  assessmentResults: {},
  certificateNames: {},
  bookings: [],
};
