import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Booking, Course } from '../../core/models';
import { SpecialistRepository } from '../../core/repositories/content-repositories';
import { AssessmentService } from '../../core/services/assessment.service';
import { BookingService } from '../../core/services/booking.service';
import { CertificateService } from '../../core/services/certificate.service';
import { CourseProgressService } from '../../core/services/course-progress.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { SessionStore } from '../../core/services/session.store';
import { ToastService } from '../../core/services/toast.service';
import { formatLongDate } from '../../core/utils/dates';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';
import { FallbackImage } from '../../shared/ui/fallback-image/fallback-image';
import { Icon } from '../../shared/ui/icon/icon';
import { ProgressBar } from '../../shared/ui/progress-bar/progress-bar';
import { LearnerSidebar } from './learner-sidebar';

interface EnrolledCourseView {
  readonly course: Course;
  readonly percent: number;
  readonly completed: number;
  readonly total: number;
  readonly resumeLink: readonly string[];
  readonly resumeTitle: string;
  readonly certificateReady: boolean;
  readonly assessmentUnlocked: boolean;
  readonly activities: readonly { readonly id: string; readonly label: string; readonly done: boolean; readonly link: readonly string[] }[];
}

interface BookingView {
  readonly booking: Booking;
  readonly specialistName: string;
  readonly dateLabel: string;
}

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, EmptyState, FallbackImage, Icon, ProgressBar, LearnerSidebar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage {
  protected readonly session = inject(SessionStore);
  private readonly enrollment = inject(EnrollmentService);
  private readonly progress = inject(CourseProgressService);
  private readonly assessment = inject(AssessmentService);
  private readonly certificates = inject(CertificateService);
  private readonly bookingService = inject(BookingService);
  private readonly specialists = inject(SpecialistRepository);
  private readonly toast = inject(ToastService);

  protected readonly greetingName = computed(() =>
    this.session.isGuest() ? 'Invitado' : this.session.displayName().split(' ')[0],
  );

  protected readonly courses = computed<readonly EnrolledCourseView[]>(() =>
    this.enrollment.enrolledCourses().map((course) => this.toCourseView(course)),
  );

  protected readonly overallPercent = computed(() => {
    const list = this.courses();
    return list.length === 0 ? 0 : Math.round(list.reduce((sum, c) => sum + c.percent, 0) / list.length);
  });

  protected readonly bookings = computed<readonly BookingView[]>(() =>
    this.bookingService.upcomingBookings().map((booking) => ({
      booking,
      specialistName: this.specialists.getById(booking.specialistId)?.name ?? 'Especialista',
      dateLabel: formatLongDate(booking.date),
    })),
  );

  protected readonly nextBooking = computed(() => this.bookings()[0] ?? null);

  protected readonly certificateCount = computed(() => this.courses().filter((c) => c.certificateReady).length);

  protected cancel(view: BookingView): void {
    const confirmed = window.confirm(`¿Cancelar la asesoría con ${view.specialistName} del ${view.dateLabel}?`);
    if (confirmed) {
      this.bookingService.cancel(view.booking.id);
      this.toast.show('Asesoría cancelada (simulación).', 'info');
    }
  }

  private toCourseView(course: Course): EnrolledCourseView {
    const lessons = this.progress.lessons(course.id);
    const resume = this.progress.resumeLesson(course.id);
    return {
      course,
      percent: this.progress.progressPercent(course.id),
      completed: this.progress.completedCount(course.id),
      total: lessons.length,
      resumeLink: resume ? ['/aprender', course.slug, resume.id] : ['/cursos', course.slug],
      resumeTitle: resume ? `${resume.moduleLabel}: ${resume.title}` : '',
      certificateReady: this.certificates.status(course.id).kind === 'available',
      assessmentUnlocked: this.assessment.isUnlocked(course.id),
      activities: lessons.map((lesson) => ({
        id: lesson.id,
        label: `${lesson.moduleLabel}: ${lesson.title}`,
        done: this.progress.isLessonCompleted(lesson.id),
        link: ['/aprender', course.slug, lesson.id],
      })),
    };
  }
}
