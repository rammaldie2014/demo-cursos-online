import { Injectable } from '@angular/core';
import { ASSESSMENTS } from '../data/assessments.data';
import { COURSES } from '../data/courses.data';
import { LESSONS } from '../data/lessons.data';
import { SPECIALISTS } from '../data/specialists.data';
import { AssessmentDefinition, Course, Lesson, Specialist } from '../models';
import { AssessmentRepository, CourseRepository, LessonRepository, SpecialistRepository } from './content-repositories';

@Injectable()
export class LocalCourseRepository extends CourseRepository {
  getAll(): readonly Course[] {
    return COURSES;
  }

  getBySlug(slug: string): Course | undefined {
    return COURSES.find((course) => course.slug === slug);
  }

  getById(id: string): Course | undefined {
    return COURSES.find((course) => course.id === id);
  }
}

@Injectable()
export class LocalLessonRepository extends LessonRepository {
  getByCourse(courseId: string): readonly Lesson[] {
    return LESSONS.filter((lesson) => lesson.courseId === courseId).sort((a, b) => a.order - b.order);
  }
}

@Injectable()
export class LocalAssessmentRepository extends AssessmentRepository {
  getByCourse(courseId: string): AssessmentDefinition | undefined {
    return ASSESSMENTS.find((assessment) => assessment.courseId === courseId);
  }
}

@Injectable()
export class LocalSpecialistRepository extends SpecialistRepository {
  getAll(): readonly Specialist[] {
    return SPECIALISTS;
  }

  getById(id: string): Specialist | undefined {
    return SPECIALISTS.find((specialist) => specialist.id === id);
  }
}
