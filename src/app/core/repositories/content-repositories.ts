import { AssessmentDefinition, Course, Lesson, Specialist } from '../models';

/*
 * Contratos de lectura de contenido (principio de segregación de interfaces).
 * Hoy se resuelven con datos locales; mañana pueden apuntar a una API.
 */

export abstract class CourseRepository {
  abstract getAll(): readonly Course[];
  abstract getBySlug(slug: string): Course | undefined;
  abstract getById(id: string): Course | undefined;
}

export abstract class LessonRepository {
  abstract getByCourse(courseId: string): readonly Lesson[];
}

export abstract class AssessmentRepository {
  abstract getByCourse(courseId: string): AssessmentDefinition | undefined;
}

export abstract class SpecialistRepository {
  abstract getAll(): readonly Specialist[];
  abstract getById(id: string): Specialist | undefined;
}
