import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AssessmentAnswers } from '../../core/models';
import { CourseRepository } from '../../core/repositories/content-repositories';
import { AssessmentService, GradedAssessment } from '../../core/services/assessment.service';
import { CertificateService } from '../../core/services/certificate.service';
import { CourseProgressService } from '../../core/services/course-progress.service';
import { ToastService } from '../../core/services/toast.service';
import { formatShortDate } from '../../core/utils/dates';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';
import { Icon } from '../../shared/ui/icon/icon';

@Component({
  selector: 'app-assessment-page',
  imports: [RouterLink, EmptyState, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assessment-page.html',
  styleUrl: './assessment-page.scss',
})
export class AssessmentPage {
  readonly slug = input.required<string>();

  private readonly courses = inject(CourseRepository);
  private readonly assessment = inject(AssessmentService);
  private readonly progress = inject(CourseProgressService);
  private readonly certificates = inject(CertificateService);
  private readonly toast = inject(ToastService);

  protected readonly course = computed(() => this.courses.getBySlug(this.slug()));
  protected readonly definition = computed(() => {
    const course = this.course();
    return course ? this.assessment.definition(course.id) : undefined;
  });
  protected readonly unlocked = computed(() => {
    const course = this.course();
    return course ? this.assessment.isUnlocked(course.id) : false;
  });
  protected readonly previousResult = computed(() => {
    const course = this.course();
    return course ? this.assessment.result(course.id) : undefined;
  });
  protected readonly pendingSteps = computed(() => {
    const course = this.course();
    return course ? this.progress.lessons(course.id).filter((l) => !this.progress.isLessonCompleted(l.id)) : [];
  });
  protected readonly resumeLink = computed(() => {
    const course = this.course();
    const lesson = course ? this.progress.resumeLesson(course.id) : undefined;
    return course && lesson ? ['/aprender', course.slug, lesson.id] : ['/panel'];
  });

  protected readonly answers = signal<AssessmentAnswers>({});
  protected readonly graded = signal<GradedAssessment | null>(null);
  protected readonly attempted = signal(false);

  protected readonly allAnswered = computed(() => {
    const def = this.definition();
    return def ? def.questions.every((q) => this.answers()[q.id] !== undefined) : false;
  });

  protected formatDate(iso: string): string {
    return formatShortDate(iso);
  }

  protected choose(questionId: string, optionId: string): void {
    this.answers.update((current) => ({ ...current, [questionId]: optionId }));
  }

  protected isUnanswered(questionId: string): boolean {
    return this.attempted() && this.answers()[questionId] === undefined;
  }

  protected submit(): void {
    const course = this.course();
    this.attempted.set(true);
    if (!course || !this.allAnswered()) {
      return;
    }
    const result = this.assessment.submit(course.id, this.answers());
    this.graded.set(result);
    if (result?.passed) {
      this.toast.show('¡Aprobaste la evaluación! Tu certificado de demostración está disponible.');
    }
  }

  protected retry(): void {
    this.answers.set({});
    this.graded.set(null);
    this.attempted.set(false);
  }

  protected certificateAvailable(): boolean {
    const course = this.course();
    return course ? this.certificates.status(course.id).kind === 'available' : false;
  }
}
