import { TestBed } from '@angular/core/testing';
import { ASSESSMENTS } from '../data/assessments.data';
import { MAIN_COURSE_ID } from '../data/courses.data';
import { configureDemoTestBed } from '../testing/test-providers';
import { AssessmentService, gradeAssessment } from './assessment.service';
import { CertificateService } from './certificate.service';
import { CourseProgressService } from './course-progress.service';
import { DemoAccessService } from './demo-access.service';
import { EnrollmentService } from './enrollment.service';

const definition = ASSESSMENTS[0];
const allCorrect = Object.fromEntries(definition.questions.map((q) => [q.id, q.correctOptionId]));
const wrongOption = (correct: string) => (correct === 'a' ? 'b' : 'a');

describe('gradeAssessment', () => {
  it('aprueba con 2 de 3 respuestas correctas', () => {
    const [q1, q2, q3] = definition.questions;
    const result = gradeAssessment(definition, {
      [q1.id]: q1.correctOptionId,
      [q2.id]: q2.correctOptionId,
      [q3.id]: wrongOption(q3.correctOptionId),
    });
    expect(result.score).toBe(2);
    expect(result.passed).toBe(true);
  });

  it('desaprueba con 1 de 3', () => {
    const [q1, q2, q3] = definition.questions;
    const result = gradeAssessment(definition, {
      [q1.id]: q1.correctOptionId,
      [q2.id]: wrongOption(q2.correctOptionId),
      [q3.id]: wrongOption(q3.correctOptionId),
    });
    expect(result.passed).toBe(false);
  });
});

describe('AssessmentService + CertificateService', () => {
  let assessment: AssessmentService;
  let certificates: CertificateService;

  beforeEach(() => {
    configureDemoTestBed();
    TestBed.inject(DemoAccessService).continueAsGuest();
    TestBed.inject(EnrollmentService).enroll(MAIN_COURSE_ID);
    assessment = TestBed.inject(AssessmentService);
    certificates = TestBed.inject(CertificateService);
  });

  function completeAllLessons(): void {
    const progress = TestBed.inject(CourseProgressService);
    for (const lesson of progress.lessons(MAIN_COURSE_ID)) {
      const answers = Object.fromEntries(
        lesson.activity.fields.map((f) => [f.id, f.options?.[0] ?? 'Texto de prueba suficientemente largo.']),
      );
      progress.saveLesson(lesson, answers);
    }
  }

  it('la evaluación está bloqueada hasta completar los 4 pasos', () => {
    expect(assessment.isUnlocked(MAIN_COURSE_ID)).toBe(false);
    expect(assessment.submit(MAIN_COURSE_ID, allCorrect)).toBeNull();
    completeAllLessons();
    expect(assessment.isUnlocked(MAIN_COURSE_ID)).toBe(true);
  });

  it('el certificado se habilita solo tras aprobar y se conserva al reintentar', () => {
    completeAllLessons();
    expect(certificates.status(MAIN_COURSE_ID).kind).toBe('locked');

    const failing = Object.fromEntries(definition.questions.map((q) => [q.id, wrongOption(q.correctOptionId)]));
    assessment.submit(MAIN_COURSE_ID, failing);
    expect(certificates.status(MAIN_COURSE_ID).kind).toBe('locked');

    assessment.submit(MAIN_COURSE_ID, allCorrect);
    expect(certificates.status(MAIN_COURSE_ID).kind).toBe('available');

    assessment.submit(MAIN_COURSE_ID, failing);
    expect(certificates.status(MAIN_COURSE_ID).kind).toBe('available');
    expect(assessment.result(MAIN_COURSE_ID)?.attempts).toBe(3);
  });
});
