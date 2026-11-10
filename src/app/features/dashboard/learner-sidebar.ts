import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MAIN_COURSE_ID } from '../../core/data/courses.data';
import { Icon } from '../../shared/ui/icon/icon';
import { IconName } from '../../shared/ui/icon/icons';

interface SidebarLink {
  readonly label: string;
  readonly icon: IconName;
  readonly route: string;
  readonly fragment?: string;
}

@Component({
  selector: 'app-learner-sidebar',
  imports: [RouterLink, RouterLinkActive, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="side" aria-label="Secciones del alumno">
      <ul>
        @for (link of links; track link.label; let first = $first) {
          <li>
            <a
              [routerLink]="link.route"
              [fragment]="link.fragment"
              routerLinkActive="is-active"
              [routerLinkActiveOptions]="{ exact: true }"
              [class.is-primary]="first"
            >
              <app-icon [name]="link.icon" [size]="18" /> {{ link.label }}
            </a>
          </li>
        }
      </ul>
    </nav>
  `,
  styles: `
    .side ul {
      display: grid;
      gap: 4px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    a {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 42px;
      padding: 8px 14px;
      border-radius: 10px;
      color: var(--c-texto);
      font-weight: 600;
      font-size: 0.92rem;
      text-decoration: none;
    }
    a:hover {
      background: var(--c-turquesa-50);
    }
    a.is-active.is-primary,
    a.is-active:not([href*='#']) {
      background: var(--c-turquesa);
      color: #fff;
    }
    @media (max-width: 899px) {
      .side ul {
        display: flex;
        overflow-x: auto;
        gap: 6px;
        padding-bottom: 4px;
      }
      a {
        white-space: nowrap;
        border: 1px solid var(--c-borde);
        background: #fff;
      }
    }
  `,
})
export class LearnerSidebar {
  protected readonly links: readonly SidebarLink[] = [
    { label: 'Mi aprendizaje', icon: 'grid', route: '/panel' },
    { label: 'Mis cursos', icon: 'book', route: '/panel', fragment: 'mis-cursos' },
    { label: 'Mis asesorías', icon: 'users', route: '/panel', fragment: 'mis-asesorias' },
    { label: 'Certificados', icon: 'award', route: `/certificado/${MAIN_COURSE_ID}` },
    { label: 'Mi perfil', icon: 'user', route: '/perfil' },
  ];
}
