import { inject, Injectable } from '@angular/core';
import { AssessmentService } from './assessment.service';
import { CourseProgressService } from './course-progress.service';
import { EnrollmentService } from './enrollment.service';
import { LearnerStateStore } from './learner-state.store';
import { SessionStore } from './session.store';

export const CERTIFICATE_ISSUER = 'Aprende y Avanza';
export const CERTIFICATE_DISCLAIMER = 'Certificado de demostración sin validez académica oficial';

export type CertificateStatus =
  | { readonly kind: 'locked'; readonly pending: readonly string[] }
  | { readonly kind: 'available'; readonly issuedAt: string };

@Injectable({ providedIn: 'root' })
export class CertificateService {
  private readonly enrollment = inject(EnrollmentService);
  private readonly progress = inject(CourseProgressService);
  private readonly assessment = inject(AssessmentService);
  private readonly store = inject(LearnerStateStore);
  private readonly session = inject(SessionStore);

  status(courseId: string): CertificateStatus {
    const passedAt = this.assessment.result(courseId)?.passedAt;
    if (passedAt) {
      return { kind: 'available', issuedAt: passedAt };
    }
    const pending: string[] = [];
    if (!this.enrollment.isEnrolled(courseId)) {
      pending.push('Inscribirte en el curso.');
    }
    const total = this.progress.lessons(courseId).length;
    const done = this.progress.completedCount(courseId);
    if (done < total) {
      pending.push(`Completar los instructivos (${done} de ${total} completados).`);
    }
    pending.push('Aprobar la evaluación final con al menos 2 de 3 respuestas correctas.');
    return { kind: 'locked', pending };
  }

  holderName(courseId: string): string {
    const saved = this.store.state().certificateNames[courseId];
    if (saved) {
      return saved;
    }
    const profile = this.session.profile();
    return profile?.kind === 'demo' ? profile.name : '';
  }

  setHolderName(courseId: string, name: string): void {
    this.store.update((state) => ({
      ...state,
      certificateNames: { ...state.certificateNames, [courseId]: name.trim() },
    }));
  }
}
