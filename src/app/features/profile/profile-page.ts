import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DemoAccessService } from '../../core/services/demo-access.service';
import { SessionStore } from '../../core/services/session.store';
import { ToastService } from '../../core/services/toast.service';
import { formatShortDate } from '../../core/utils/dates';
import { Icon } from '../../shared/ui/icon/icon';
import { LearnerSidebar } from '../dashboard/learner-sidebar';

@Component({
  selector: 'app-profile-page',
  imports: [RouterLink, Icon, LearnerSidebar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container page">
      <div class="shell">
        <aside><app-learner-sidebar /></aside>
        <div>
          <h1>Mi perfil</h1>
          @if (session.profile(); as profile) {
            <section class="card card--pad profile">
              <span class="avatar avatar--lg">{{ session.isGuest() ? 'IN' : profile.name.charAt(0) }}</span>
              <dl>
                <div><dt>Nombre</dt><dd>{{ session.displayName() }}</dd></div>
                <div><dt>Correo de demostración</dt><dd>{{ profile.email ?? 'No indicado' }}</dd></div>
                <div><dt>Tipo de perfil</dt><dd>{{ session.isGuest() ? 'Invitado' : 'Perfil demo' }}</dd></div>
                <div><dt>Creado el</dt><dd>{{ created(profile.createdAt) }}</dd></div>
              </dl>
            </section>

            <p class="notice notice--warn">
              <app-icon name="info" [size]="16" />
              <span>Tus datos se guardan solo en este navegador. No hay sincronización entre dispositivos ni autenticación real.</span>
            </p>

            <div class="actions">
              @if (session.isGuest()) {
                <a routerLink="/registro" class="btn">Registrarme y conservar mi avance</a>
              }
              <a routerLink="/acceso" class="btn btn--outline"><app-icon name="refresh" [size]="16" /> Cambiar perfil demo</a>
              <button type="button" class="btn btn--outline" (click)="signOut()"><app-icon name="log-out" [size]="16" /> Salir</button>
              <button type="button" class="btn btn--danger" (click)="reset()"><app-icon name="trash" [size]="16" /> Reiniciar datos de la demo</button>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    .shell {
      display: grid;
      grid-template-columns: 220px 1fr;
      gap: 28px;
      align-items: start;
    }
    .profile {
      display: flex;
      gap: 20px;
      align-items: flex-start;
    }
    .avatar--lg {
      width: 64px;
      height: 64px;
      font-size: 1.4rem;
    }
    dl {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px 24px;
      flex: 1;
      margin: 0;
    }
    dt {
      font-size: 0.8rem;
      color: var(--c-texto-suave);
    }
    dd {
      margin: 0;
      font-weight: 700;
      overflow-wrap: anywhere;
    }
    .notice {
      margin: 16px 0;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    @media (max-width: 899px) {
      .shell {
        grid-template-columns: minmax(0, 1fr);
        gap: 16px;
      }
      .shell > * {
        min-width: 0;
      }
    }
    @media (max-width: 599px) {
      .profile {
        flex-direction: column;
      }
      dl {
        grid-template-columns: 1fr;
      }
      .actions > * {
        width: 100%;
      }
    }
  `,
})
export class ProfilePage {
  protected readonly session = inject(SessionStore);
  private readonly access = inject(DemoAccessService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  protected created(iso: string): string {
    return formatShortDate(iso);
  }

  protected signOut(): void {
    this.access.signOut();
    this.toast.show('Saliste del perfil demo.', 'info');
    void this.router.navigateByUrl('/');
  }

  protected reset(): void {
    if (window.confirm('¿Reiniciar la demo? Se borrarán perfiles, respuestas, progreso y reservas de este navegador.')) {
      this.access.resetDemo();
      this.toast.show('Datos de la demo reiniciados.', 'info');
      void this.router.navigateByUrl('/');
    }
  }
}
