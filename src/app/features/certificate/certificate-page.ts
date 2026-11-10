import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CourseRepository } from '../../core/repositories/content-repositories';
import { CertificateService } from '../../core/services/certificate.service';
import { CourseProgressService } from '../../core/services/course-progress.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { ToastService } from '../../core/services/toast.service';
import { formatShortDate } from '../../core/utils/dates';
import { CertificatePreview } from '../../shared/ui/certificate-preview/certificate-preview';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';
import { Icon } from '../../shared/ui/icon/icon';

const NAME_MIN = 3;
const NAME_MAX = 60;

@Component({
  selector: 'app-certificate-page',
  imports: [RouterLink, CertificatePreview, EmptyState, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './certificate-page.html',
  styleUrl: './certificate-page.scss',
})
export class CertificatePage {
  readonly slug = input.required<string>();

  private readonly courses = inject(CourseRepository);
  private readonly certificates = inject(CertificateService);
  private readonly progress = inject(CourseProgressService);
  private readonly enrollment = inject(EnrollmentService);
  private readonly toast = inject(ToastService);

  protected readonly course = computed(() => this.courses.getBySlug(this.slug()));
  protected readonly status = computed(() => {
    const course = this.course();
    return course ? this.certificates.status(course.id) : null;
  });
  protected readonly savedName = computed(() => {
    const course = this.course();
    return course ? this.certificates.holderName(course.id) : '';
  });
  protected readonly isEnrolled = computed(() => {
    const course = this.course();
    return course ? this.enrollment.isEnrolled(course.id) : false;
  });
  protected readonly nextLink = computed(() => {
    const course = this.course();
    if (!course) {
      return ['/cursos'];
    }
    if (!this.isEnrolled()) {
      return ['/cursos', course.slug];
    }
    if (this.progress.isCourseCompleted(course.id)) {
      return ['/aprender', course.slug, 'evaluacion'];
    }
    const lesson = this.progress.resumeLesson(course.id);
    return lesson ? ['/aprender', course.slug, lesson.id] : ['/cursos', course.slug];
  });

  /** Borrador editable del nombre; `null` = usar el nombre guardado. */
  protected readonly draftName = signal<string | null>(null);
  protected readonly nameValue = computed(() => this.draftName() ?? this.savedName());
  protected readonly nameError = computed(() => {
    const value = this.nameValue().trim();
    if (value.length < NAME_MIN) {
      return `Escribe el nombre que aparecerá en el certificado (mínimo ${NAME_MIN} caracteres).`;
    }
    return value.length > NAME_MAX ? `Usa como máximo ${NAME_MAX} caracteres.` : null;
  });
  protected readonly showNameError = signal(false);
  protected readonly canDownload = computed(() => this.savedName().trim().length >= NAME_MIN);

  protected formatDate(iso: string): string {
    return formatShortDate(iso);
  }

  protected saveName(): void {
    const course = this.course();
    this.showNameError.set(true);
    if (!course || this.nameError()) {
      return;
    }
    this.certificates.setHolderName(course.id, this.nameValue());
    this.draftName.set(null);
    this.showNameError.set(false);
    this.toast.show('Nombre del certificado guardado.');
  }

  /** Abre la vista de impresión del navegador para guardar el certificado como PDF. */
  protected print(): void {
    if (this.draftName() !== null && !this.nameError()) {
      this.saveName();
    }
    if (!this.canDownload()) {
      this.showNameError.set(true);
      return;
    }
    window.print();
  }
}
