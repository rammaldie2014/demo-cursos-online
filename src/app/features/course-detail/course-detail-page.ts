import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LEVEL_LABELS } from '../../core/models';
import { CourseRepository } from '../../core/repositories/content-repositories';
import { CourseProgressService } from '../../core/services/course-progress.service';
import { DemoAccessService } from '../../core/services/demo-access.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { SessionStore } from '../../core/services/session.store';
import { ToastService } from '../../core/services/toast.service';
import { PriceLabelPipe } from '../../shared/pipes/price-label.pipe';
import { AccessDialog } from '../../shared/ui/access-dialog/access-dialog';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';
import { FallbackImage } from '../../shared/ui/fallback-image/fallback-image';
import { Icon } from '../../shared/ui/icon/icon';
import { ProgressBar } from '../../shared/ui/progress-bar/progress-bar';

type DetailTab = 'descripcion' | 'modulos' | 'certificado';

@Component({
  selector: 'app-course-detail-page',
  imports: [RouterLink, AccessDialog, EmptyState, FallbackImage, Icon, ProgressBar, PriceLabelPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './course-detail-page.html',
  styleUrl: './course-detail-page.scss',
})
export class CourseDetailPage {
  /** Parámetro de ruta `:slug`. */
  readonly slug = input.required<string>();

  private readonly courses = inject(CourseRepository);
  private readonly enrollment = inject(EnrollmentService);
  private readonly progress = inject(CourseProgressService);
  private readonly access = inject(DemoAccessService);
  private readonly toast = inject(ToastService);
  private readonly document = inject(DOCUMENT);
  protected readonly session = inject(SessionStore);

  protected readonly course = computed(() => this.courses.getBySlug(this.slug()));
  protected readonly levelLabel = computed(() => {
    const course = this.course();
    return course ? LEVEL_LABELS[course.level] : '';
  });
  protected readonly isEnrolled = computed(() => {
    const course = this.course();
    return course ? this.enrollment.isEnrolled(course.id) : false;
  });
  protected readonly progressPercent = computed(() => {
    const course = this.course();
    return course ? this.progress.progressPercent(course.id) : 0;
  });
  protected readonly resumeLink = computed(() => {
    const course = this.course();
    const lesson = course ? this.progress.resumeLesson(course.id) : undefined;
    return course && lesson ? ['/aprender', course.slug, lesson.id] : null;
  });

  protected readonly activeTab = signal<DetailTab>('descripcion');
  protected readonly openModule = signal<number | null>(0);
  protected readonly dialogOpen = signal(false);

  protected readonly tabs: readonly { readonly id: DetailTab; readonly label: string }[] = [
    { id: 'descripcion', label: 'Descripción' },
    { id: 'modulos', label: 'Módulos' },
    { id: 'certificado', label: 'Certificado' },
  ];

  protected readonly dialogParams = computed(() => ({
    volver: `/cursos/${this.slug()}`,
    inscribir: this.course()?.id,
  }));

  protected selectTab(tab: DetailTab): void {
    this.activeTab.set(tab);
  }

  protected onTabKeydown(event: KeyboardEvent, index: number): void {
    const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (delta === 0) {
      return;
    }
    const next = (index + delta + this.tabs.length) % this.tabs.length;
    this.activeTab.set(this.tabs[next].id);
    this.document.getElementById(`tab-${this.tabs[next].id}`)?.focus();
  }

  protected toggleModule(index: number): void {
    this.openModule.update((current) => (current === index ? null : index));
  }

  protected requestEnrollment(): void {
    if (this.session.hasProfile()) {
      this.enroll();
    } else {
      this.dialogOpen.set(true);
    }
  }

  protected continueAsGuest(): void {
    this.access.continueAsGuest();
    this.dialogOpen.set(false);
    this.enroll();
  }

  private enroll(): void {
    const course = this.course();
    if (course && this.enrollment.enroll(course.id)) {
      this.toast.show(`¡Listo! Te inscribiste en «${course.title}».`);
    }
  }
}
