import { Routes } from '@angular/router';
import { enrollmentGuard, profileGuard } from './core/guards/access.guards';

const TITLE = 'Aprende y Avanza';

export const routes: Routes = [
  { path: '', title: `${TITLE} · Inicio`, loadComponent: () => import('./features/home/home-page').then((m) => m.HomePage) },
  {
    path: 'cursos',
    title: `${TITLE} · Catálogo de cursos`,
    loadComponent: () => import('./features/catalog/catalog-page').then((m) => m.CatalogPage),
  },
  {
    path: 'cursos/:slug',
    title: `${TITLE} · Detalle del curso`,
    loadComponent: () => import('./features/course-detail/course-detail-page').then((m) => m.CourseDetailPage),
  },
  {
    path: 'acceso',
    title: `${TITLE} · Acceso demo`,
    loadComponent: () => import('./features/auth/access-page').then((m) => m.AccessPage),
  },
  {
    path: 'iniciar-sesion',
    title: `${TITLE} · Iniciar sesión`,
    loadComponent: () => import('./features/auth/sign-in-page').then((m) => m.SignInPage),
  },
  {
    path: 'registro',
    title: `${TITLE} · Registro`,
    loadComponent: () => import('./features/auth/register-page').then((m) => m.RegisterPage),
  },
  {
    path: 'panel',
    title: `${TITLE} · Mi panel`,
    canActivate: [profileGuard],
    loadComponent: () => import('./features/dashboard/dashboard-page').then((m) => m.DashboardPage),
  },
  {
    path: 'perfil',
    title: `${TITLE} · Mi perfil`,
    canActivate: [profileGuard],
    loadComponent: () => import('./features/profile/profile-page').then((m) => m.ProfilePage),
  },
  {
    path: 'aprender/:slug/evaluacion',
    title: `${TITLE} · Evaluación`,
    canActivate: [profileGuard, enrollmentGuard],
    loadComponent: () => import('./features/assessment/assessment-page').then((m) => m.AssessmentPage),
  },
  {
    path: 'aprender/:slug/:lessonId',
    title: `${TITLE} · Instructivo`,
    canActivate: [profileGuard, enrollmentGuard],
    loadComponent: () => import('./features/lesson/lesson-page').then((m) => m.LessonPage),
  },
  {
    path: 'certificado/:slug',
    title: `${TITLE} · Mi certificado`,
    canActivate: [profileGuard],
    loadComponent: () => import('./features/certificate/certificate-page').then((m) => m.CertificatePage),
  },
  {
    path: 'asesorias',
    title: `${TITLE} · Asesorías`,
    loadComponent: () => import('./features/advisory/advisory-page').then((m) => m.AdvisoryPage),
  },
  {
    path: '**',
    title: `${TITLE} · Página no encontrada`,
    loadComponent: () => import('./features/not-found/not-found-page').then((m) => m.NotFoundPage),
  },
];
