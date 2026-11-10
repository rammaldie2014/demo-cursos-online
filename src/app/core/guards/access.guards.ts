import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CourseRepository } from '../repositories/content-repositories';
import { EnrollmentService } from '../services/enrollment.service';
import { SessionStore } from '../services/session.store';

/** Requiere perfil demo o invitado; si no existe, lleva a la pantalla de acceso. */
export const profileGuard: CanActivateFn = (_route, state) => {
  const session = inject(SessionStore);
  const router = inject(Router);
  return session.hasProfile() ? true : router.createUrlTree(['/acceso'], { queryParams: { volver: state.url } });
};

/** Requiere estar inscrito en el curso de la ruta (`:slug`). */
export const enrollmentGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const course = inject(CourseRepository).getBySlug(route.paramMap.get('slug') ?? '');
  if (!course) {
    return router.createUrlTree(['/cursos']);
  }
  return inject(EnrollmentService).isEnrolled(course.id) ? true : router.createUrlTree(['/cursos', course.slug]);
};
