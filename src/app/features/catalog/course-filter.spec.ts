import { COURSES } from '../../core/data/courses.data';
import { EMPTY_CRITERIA, filterCourses, hasActiveFilters } from './course-filter';

describe('filterCourses', () => {
  it('sin filtros devuelve los 4 cursos con el curso completo primero', () => {
    const result = filterCourses(COURSES, EMPTY_CRITERIA);
    expect(result.length).toBe(4);
    expect(result[0].title).toBe('Crea tu marca desde cero');
  });

  it('busca sin distinguir tildes ni mayúsculas', () => {
    const result = filterCourses(COURSES, { ...EMPTY_CRITERIA, query: 'MARCA' });
    expect(result.map((c) => c.id)).toEqual(['crea-tu-marca']);
  });

  it('combina categoría y nivel', () => {
    const result = filterCourses(COURSES, { ...EMPTY_CRITERIA, categories: ['marca', 'finanzas'], levels: ['inicial'] });
    expect(result.map((c) => c.id).sort()).toEqual(['crea-tu-marca', 'finanzas-emprendedores']);
  });

  it('devuelve vacío cuando nada coincide', () => {
    expect(filterCourses(COURSES, { ...EMPTY_CRITERIA, query: 'astronomía' })).toEqual([]);
  });

  it('detecta filtros activos', () => {
    expect(hasActiveFilters(EMPTY_CRITERIA)).toBe(false);
    expect(hasActiveFilters({ ...EMPTY_CRITERIA, levels: ['intermedio'] })).toBe(true);
  });
});
