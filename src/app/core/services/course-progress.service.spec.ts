import { TestBed } from '@angular/core/testing';
import { MAIN_COURSE_ID } from '../data/courses.data';
import { LearnerState, Lesson } from '../models';
import { StorageKeys } from '../storage/storage-keys';
import { configureDemoTestBed } from '../testing/test-providers';
import { CourseProgressService } from './course-progress.service';
import { DemoAccessService } from './demo-access.service';
import { EnrollmentService } from './enrollment.service';
import { MemoryStorage } from '../storage/memory-storage';

function validAnswers(lesson: Lesson): Record<string, string> {
  return Object.fromEntries(
    lesson.activity.fields.map((field) => [field.id, field.options?.[0] ?? 'Respuesta válida de prueba.']),
  );
}

describe('CourseProgressService', () => {
  let progress: CourseProgressService;
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = configureDemoTestBed();
    TestBed.inject(DemoAccessService).continueAsGuest();
    TestBed.inject(EnrollmentService).enroll(MAIN_COURSE_ID);
    progress = TestBed.inject(CourseProgressService);
  });

  it('el curso principal tiene exactamente 4 instructivos', () => {
    expect(progress.lessons(MAIN_COURSE_ID).map((l) => l.title)).toEqual([
      'Tu idea',
      'Tu cliente ideal',
      'Tu propuesta de valor',
      'Tu marca',
    ]);
  });

  it('rechaza guardar si faltan campos obligatorios y no marca el paso', () => {
    const [first] = progress.lessons(MAIN_COURSE_ID);
    const result = progress.saveLesson(first, { producto: '' });

    expect(result.ok).toBe(false);
    expect(progress.isLessonCompleted(first.id)).toBe(false);
    expect(progress.progressPercent(MAIN_COURSE_ID)).toBe(0);
  });

  it('calcula el progreso como completadas / 4 × 100', () => {
    const lessons = progress.lessons(MAIN_COURSE_ID);
    const expected = [25, 50, 75, 100];

    lessons.forEach((lesson, i) => {
      expect(progress.saveLesson(lesson, validAnswers(lesson)).ok).toBe(true);
      expect(progress.progressPercent(MAIN_COURSE_ID)).toBe(expected[i]);
    });
    expect(progress.isCourseCompleted(MAIN_COURSE_ID)).toBe(true);
  });

  it('persiste respuestas y avance en el almacenamiento del perfil', () => {
    const [first] = progress.lessons(MAIN_COURSE_ID);
    progress.saveLesson(first, validAnswers(first));

    const saved = storage.read<LearnerState>(StorageKeys.learnerState('invitado'));
    expect(saved?.completedLessonIds).toContain(first.id);
    expect(saved?.lessonAnswers[first.id]['producto']).toContain('Respuesta');
  });

  it('«Continuar» apunta a la última lección visitada', () => {
    const lessons = progress.lessons(MAIN_COURSE_ID);
    progress.markVisited(lessons[2]);
    expect(progress.resumeLesson(MAIN_COURSE_ID)?.id).toBe(lessons[2].id);
  });
});

