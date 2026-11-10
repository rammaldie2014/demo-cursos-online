import { Course, Lesson, LessonAnswers } from '../models';
import { formatShortDate } from '../utils/dates';
import { escapeHtml } from '../utils/text';

export interface WorkbookInput {
  readonly course: Course;
  readonly lessons: readonly Lesson[];
  readonly answers: Readonly<Record<string, LessonAnswers>>;
  readonly learnerName: string;
  readonly generatedAt: Date;
}

/**
 * Construye un documento HTML autocontenido con las instrucciones de cada
 * paso y la ficha con las respuestas guardadas por el alumno.
 */
export function buildWorkbookHtml(input: WorkbookInput): string {
  const sections = input.lessons.map((lesson) => renderLesson(lesson, input.answers[lesson.id] ?? {})).join('\n');
  const title = `Plantilla de trabajo · ${input.course.title}`;
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
  body { font-family: system-ui, sans-serif; color: #0d2a33; max-width: 820px; margin: 0 auto; padding: 32px 20px; line-height: 1.5; }
  h1 { color: #004d58; margin-bottom: 4px; }
  h2 { color: #004d58; border-bottom: 2px solid #a8d600; padding-bottom: 4px; margin-top: 32px; }
  .meta { color: #4a6670; font-size: 14px; }
  .note { background: #eef7f7; border-left: 4px solid #008f95; padding: 10px 14px; border-radius: 6px; font-size: 14px; }
  .answer { border: 1px solid #cfe1e3; border-radius: 8px; padding: 10px 14px; margin: 8px 0 14px; min-height: 40px; white-space: pre-wrap; }
  .empty { color: #8aa0a6; font-style: italic; }
  dt { font-weight: 600; margin-top: 10px; }
  @media print { .note { break-inside: avoid; } h2 { break-after: avoid; } }
</style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p class="meta">Alumno: ${escapeHtml(input.learnerName || 'Invitado')} · Generado el ${escapeHtml(formatShortDate(input.generatedAt))} · Aprende y Avanza (demo)</p>
  <p class="note">Documento de demostración. Completa cada paso con los datos de tu negocio. Las respuestas que guardaste en la plataforma aparecen en los recuadros; los vacíos puedes llenarlos a mano.</p>
  ${sections}
</body>
</html>`;
}

function renderLesson(lesson: Lesson, answers: LessonAnswers): string {
  const fields = lesson.activity.fields
    .map((field) => {
      const value = answers[field.id]?.trim();
      const content = value ? escapeHtml(value) : '<span class="empty">Sin respuesta guardada</span>';
      return `<dt>${escapeHtml(field.label)}${field.required ? ' *' : ''}</dt><dd class="answer">${content}</dd>`;
    })
    .join('');
  return `<section>
    <h2>${escapeHtml(lesson.moduleLabel)}: ${escapeHtml(lesson.title)}</h2>
    <p><strong>Objetivo:</strong> ${escapeHtml(lesson.objective)}</p>
    <p><strong>Instrucciones:</strong> ${escapeHtml(lesson.activity.instructions)}</p>
    <dl>${fields}</dl>
  </section>`;
}
