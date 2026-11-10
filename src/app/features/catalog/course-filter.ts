import { Course, CourseCategory, CourseLevel } from '../../core/models';
import { normalizeForSearch } from '../../core/utils/text';

export type DurationBucket = 'corto' | 'medio';
export type CourseSort = 'relevancia' | 'duracion' | 'precio';

export interface CourseFilterCriteria {
  readonly query: string;
  readonly categories: readonly CourseCategory[];
  readonly levels: readonly CourseLevel[];
  readonly durations: readonly DurationBucket[];
  readonly sort: CourseSort;
}

export const EMPTY_CRITERIA: CourseFilterCriteria = {
  query: '',
  categories: [],
  levels: [],
  durations: [],
  sort: 'relevancia',
};

export const DURATION_LABELS: Readonly<Record<DurationBucket, string>> = {
  corto: 'Hasta 4 horas',
  medio: 'De 5 a 10 horas',
};

export function durationBucketOf(hours: number): DurationBucket {
  return hours <= 4 ? 'corto' : 'medio';
}

export function filterCourses(courses: readonly Course[], criteria: CourseFilterCriteria): Course[] {
  const query = normalizeForSearch(criteria.query);
  const matches = courses.filter(
    (course) =>
      (query === '' || searchableText(course).includes(query)) &&
      (criteria.categories.length === 0 || criteria.categories.includes(course.category)) &&
      (criteria.levels.length === 0 || criteria.levels.includes(course.level)) &&
      (criteria.durations.length === 0 || criteria.durations.includes(durationBucketOf(course.durationHours))),
  );
  return sortCourses(matches, criteria.sort);
}

export function hasActiveFilters(criteria: CourseFilterCriteria): boolean {
  return (
    criteria.query.trim() !== '' ||
    criteria.categories.length > 0 ||
    criteria.levels.length > 0 ||
    criteria.durations.length > 0
  );
}

function sortCourses(courses: Course[], sort: CourseSort): Course[] {
  switch (sort) {
    case 'duracion':
      return [...courses].sort((a, b) => a.durationHours - b.durationHours);
    case 'precio':
      return [...courses].sort((a, b) => a.priceSoles - b.priceSoles);
    default:
      return [...courses].sort((a, b) => Number(b.hasFullDemo) - Number(a.hasFullDemo));
  }
}

function searchableText(course: Course): string {
  return normalizeForSearch(
    [course.title, course.shortDescription, course.description, ...course.modules.map((m) => m.title)].join(' '),
  );
}
