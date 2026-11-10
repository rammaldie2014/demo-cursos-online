import { inject, Injectable } from '@angular/core';
import { Course } from '../../core/models';
import { CertificateService } from '../../core/services/certificate.service';
import { CourseProgressService } from '../../core/services/course-progress.service';
import { FileDownloadService } from '../../core/services/file-download.service';
import { LearnerStateStore } from '../../core/services/learner-state.store';
import { SessionStore } from '../../core/services/session.store';
import { buildWorkbookHtml } from '../../core/services/workbook-template';
import { Clock } from '../../core/utils/clock';

/** Caso de uso: descargar la plantilla del curso con las respuestas guardadas. */
@Injectable({ providedIn: 'root' })
export class CourseWorkbookService {
  private readonly progress = inject(CourseProgressService);
  private readonly store = inject(LearnerStateStore);
  private readonly session = inject(SessionStore);
  private readonly certificates = inject(CertificateService);
  private readonly downloader = inject(FileDownloadService);
  private readonly clock = inject(Clock);

  download(course: Course): void {
    const html = buildWorkbookHtml({
      course,
      lessons: this.progress.lessons(course.id),
      answers: this.store.state().lessonAnswers,
      learnerName: this.certificates.holderName(course.id) || this.session.displayName(),
      generatedAt: this.clock.now(),
    });
    this.downloader.download(`plantilla-${course.slug}.html`, html);
  }
}
