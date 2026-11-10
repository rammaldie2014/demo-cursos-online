import { COURSES } from '../data/courses.data';
import { LESSONS } from '../data/lessons.data';
import { buildWorkbookHtml } from './workbook-template';

describe('buildWorkbookHtml', () => {
  it('incluye instrucciones de los 4 pasos y escapa las respuestas', () => {
    const html = buildWorkbookHtml({
      course: COURSES[0],
      lessons: LESSONS,
      answers: { 'tu-idea': { producto: '<script>alert(1)</script> Postres' } },
      learnerName: 'Ana',
      generatedAt: new Date(2026, 10, 9),
    });

    for (const lesson of LESSONS) {
      expect(html).toContain(lesson.title);
    }
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>alert');
    expect(html).toContain('Sin respuesta guardada');
  });
});
