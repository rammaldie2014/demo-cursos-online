import { ChangeDetectionStrategy, Component, computed, effect, inject, input, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LessonAnswers } from '../../core/models';
import { CourseRepository } from '../../core/repositories/content-repositories';
import { AssessmentService } from '../../core/services/assessment.service';
import { CertificateService } from '../../core/services/certificate.service';
import { CourseProgressService } from '../../core/services/course-progress.service';
import { ToastService } from '../../core/services/toast.service';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';
import { Icon } from '../../shared/ui/icon/icon';
import { ProgressBar } from '../../shared/ui/progress-bar/progress-bar';
import { CourseWorkbookService } from './course-workbook.service';
import { LessonActivityForm } from './lesson-activity-form';
import { LessonSidebar, SidebarLesson } from './lesson-sidebar';

@Component({
  selector: 'app-lesson-page',
  imports: [RouterLink, EmptyState, Icon, ProgressBar, LessonActivityForm, LessonSidebar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lesson-page.html',
  styleUrl: './lesson-page.scss',
})
export class LessonPage {
  /** Parámetros de ruta. */
  readonly slug = input.required<string>();
  readonly lessonId = input.required<string>();

  private readonly courses = inject(CourseRepository);
  private readonly progress = inject(CourseProgressService);
  private readonly assessment = inject(AssessmentService);
  private readonly certificates = inject(CertificateService);
  private readonly workbook = inject(CourseWorkbookService);
  private readonly toast = inject(ToastService);

  protected readonly course = computed(() => this.courses.getBySlug(this.slug()));
  protected readonly lessons = computed(() => {
    const course = this.course();
    return course ? this.progress.lessons(course.id) : [];
  });
  protected readonly index = computed(() => this.lessons().findIndex((l) => l.id === this.lessonId()));
  protected readonly lesson = computed(() => this.lessons()[this.index()]);
  protected readonly previous = computed(() => this.lessons()[this.index() - 1]);
  protected readonly next = computed(() => this.lessons()[this.index() + 1]);

  protected readonly percent = computed(() => {
    const course = this.course();
    return course ? this.progress.progressPercent(course.id) : 0;
  });
  protected readonly completedCount = computed(() => {
    const course = this.course();
    return course ? this.progress.completedCount(course.id) : 0;
  });
  protected readonly isCompleted = computed(() => {
    const lesson = this.lesson();
    return lesson ? this.progress.isLessonCompleted(lesson.id) : false;
  });
  protected readonly answers = computed<LessonAnswers>(() => {
    const lesson = this.lesson();
    return lesson ? this.progress.answersFor(lesson.id) : {};
  });
  protected readonly assessmentUnlocked = computed(() => {
    const course = this.course();
    return course ? this.assessment.isUnlocked(course.id) : false;
  });
  protected readonly certificateReady = computed(() => {
    const course = this.course();
    return course ? this.certificates.status(course.id).kind === 'available' : false;
  });

  protected readonly sidebarLessons = computed<readonly SidebarLesson[]>(() =>
    this.lessons().map((lesson) => ({
      id: lesson.id,
      label: lesson.moduleLabel,
      title: lesson.title,
      done: this.progress.isLessonCompleted(lesson.id),
    })),
  );

  constructor() {
    effect(() => {
      const lesson = this.lesson();
      if (lesson) {
        untracked(() => this.progress.markVisited(lesson));
      }
    });
  }

  protected onSave(answers: LessonAnswers): void {
    const lesson = this.lesson();
    const course = this.course();
    if (!lesson || !course) {
      return;
    }
    const wasCompleted = this.progress.isCourseCompleted(course.id);
    const result = this.progress.saveLesson(lesson, answers);
    if (!result.ok) {
      this.toast.show('Revisa los campos obligatorios antes de guardar.', 'error');
      return;
    }
    if (!wasCompleted && this.progress.isCourseCompleted(course.id)) {
      this.toast.show('¡Completaste los 4 pasos! La evaluación final ya está habilitada.');
    } else {
      this.toast.show(`${lesson.moduleLabel} guardado. Avance: ${this.progress.progressPercent(course.id)}%.`);
    }
  }

  protected downloadWorkbook(): void {
    const course = this.course();
    if (course) {
      this.workbook.download(course);
      this.toast.show('Plantilla descargada con tus respuestas guardadas.', 'info');
    }
  }
}
