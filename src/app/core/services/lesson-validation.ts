import { ActivityField, Lesson, LessonAnswers } from '../models';

/** Regla única de validación de actividades, usada por formularios y servicios. */
export function fieldError(field: ActivityField, rawValue: string | null | undefined): string | null {
  const value = (rawValue ?? '').trim();
  if (field.required && value.length === 0) {
    return 'Este campo es obligatorio para completar el paso.';
  }
  if (value.length > 0 && field.minLength && value.length < field.minLength) {
    return `Escribe al menos ${field.minLength} caracteres (llevas ${value.length}).`;
  }
  if (field.maxLength && value.length > field.maxLength) {
    return `Usa como máximo ${field.maxLength} caracteres.`;
  }
  if (value.length > 0 && field.options && !field.options.includes(value)) {
    return 'Elige una de las opciones disponibles.';
  }
  return null;
}

export function validateLessonAnswers(lesson: Lesson, answers: LessonAnswers): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of lesson.activity.fields) {
    const error = fieldError(field, answers[field.id]);
    if (error) {
      errors[field.id] = error;
    }
  }
  return errors;
}
