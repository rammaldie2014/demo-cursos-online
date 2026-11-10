import { inject, Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import { CourseRepository } from '../../core/repositories/content-repositories';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { ToastService } from '../../core/services/toast.service';

const DEFAULT_DESTINATION = '/panel';

/**
 * Tras acceder (invitado, inicio de sesión o registro) completa la acción
 * pendiente —p. ej., la inscripción— y regresa a la pantalla de origen.
 */
@Injectable({ providedIn: 'root' })
export class PostAccessNavigator {
  private readonly router = inject(Router);
  private readonly enrollment = inject(EnrollmentService);
  private readonly courses = inject(CourseRepository);
  private readonly toast = inject(ToastService);

  complete(params: Params, welcome: string): void {
    const courseId = typeof params['inscribir'] === 'string' ? params['inscribir'] : null;
    const course = courseId ? this.courses.getById(courseId) : undefined;
    if (course && this.enrollment.enroll(course.id)) {
      this.toast.show(`${welcome} Te inscribiste en «${course.title}».`);
    } else {
      this.toast.show(welcome);
    }
    void this.router.navigateByUrl(safeReturnUrl(params['volver']));
  }
}

/** Evita redirecciones a otros dominios: solo rutas internas. */
export function safeReturnUrl(value: unknown): string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : DEFAULT_DESTINATION;
}
