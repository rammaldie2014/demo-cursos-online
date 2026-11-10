import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../shared/ui/icon/icon';
import { ProgressBar } from '../../shared/ui/progress-bar/progress-bar';

export interface SidebarLesson {
  readonly id: string;
  readonly label: string;
  readonly title: string;
  readonly done: boolean;
}

/** Índice del curso: lista de pasos, evaluación y certificado. Desplegable en móvil. */
@Component({
  selector: 'app-lesson-sidebar',
  imports: [RouterLink, Icon, ProgressBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lesson-sidebar.html',
  styleUrl: './lesson-sidebar.scss',
})
export class LessonSidebar {
  readonly courseSlug = input.required<string>();
  readonly lessons = input.required<readonly SidebarLesson[]>();
  readonly activeLessonId = input<string | null>(null);
  readonly percent = input.required<number>();
  readonly completed = input.required<number>();
  readonly assessmentUnlocked = input(false);
  readonly certificateReady = input(false);
  readonly onAssessment = input(false);

  protected readonly mobileOpen = signal(false);

  protected readonly sections = [
    { id: 'objetivo', label: 'Objetivo' },
    { id: 'explicacion', label: 'Explicación' },
    { id: 'ejemplo', label: 'Ejemplo' },
    { id: 'actividad', label: 'Actividad práctica' },
  ] as const;
}
