import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AssessmentRepository, CourseRepository, LessonRepository, SpecialistRepository } from './repositories/content-repositories';
import {
  LocalAssessmentRepository,
  LocalCourseRepository,
  LocalLessonRepository,
  LocalSpecialistRepository,
} from './repositories/local-content-repositories';
import { BrowserStorage } from './storage/browser-storage';
import { KeyValueStorage } from './storage/key-value-storage';

/**
 * Punto único de composición (inversión de dependencias): para integrar
 * servicios reales basta con sustituir las implementaciones aquí.
 */
export function provideDemoInfrastructure(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: KeyValueStorage, useClass: BrowserStorage },
    { provide: CourseRepository, useClass: LocalCourseRepository },
    { provide: LessonRepository, useClass: LocalLessonRepository },
    { provide: AssessmentRepository, useClass: LocalAssessmentRepository },
    { provide: SpecialistRepository, useClass: LocalSpecialistRepository },
  ]);
}
