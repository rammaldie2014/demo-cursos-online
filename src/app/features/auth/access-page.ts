import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Profile } from '../../core/models';
import { DemoAccessService } from '../../core/services/demo-access.service';
import { SessionStore } from '../../core/services/session.store';
import { Icon } from '../../shared/ui/icon/icon';
import { PostAccessNavigator } from './post-access-navigator';

/** Punto de entrada para elegir o cambiar el perfil demo. */
@Component({
  selector: 'app-access-page',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container page">
      <h1>Elige cómo continuar</h1>
      <p class="muted">Todo es simulado: no hay autenticación real y tu avance se guarda solo en este navegador.</p>

      @if (session.profile(); as current) {
        <p class="notice">
          <app-icon name="user" [size]="16" />
          <span>Perfil actual: <strong>{{ session.displayName() }}</strong>.
            <button type="button" class="linkish" (click)="signOut()">Salir de este perfil</button></span>
        </p>
      }

      <div class="options">
        <article class="option card">
          <span class="option__icon"><app-icon name="user" [size]="24" /></span>
          <h2>Continuar como invitado</h2>
          <p class="muted">Sin registro. Puedes inscribirte, avanzar y agendar asesorías.</p>
          <button type="button" class="btn btn--block" (click)="continueAsGuest()" [disabled]="session.isGuest()">
            {{ session.isGuest() ? 'Ya estás como invitado' : 'Continuar como invitado' }}
          </button>
        </article>
        <article class="option card">
          <span class="option__icon"><app-icon name="log-out" [size]="24" /></span>
          <h2>Iniciar sesión demo</h2>
          <p class="muted">Recupera un perfil demo creado antes en este navegador.</p>
          <a routerLink="/iniciar-sesion" [queryParams]="params()" class="btn btn--outline btn--block">Iniciar sesión</a>
        </article>
        <article class="option card">
          <span class="option__icon"><app-icon name="edit" [size]="24" /></span>
          <h2>Registrarme (demo)</h2>
          <p class="muted">Solo tu nombre y, si quieres, un correo de ejemplo. Sin contraseñas.</p>
          <a routerLink="/registro" [queryParams]="params()" class="btn btn--soft btn--block">Registrarme</a>
        </article>
      </div>

      @if (otherProfiles().length > 0) {
        <h2 class="subtitle section">Cambiar a otro perfil demo</h2>
        <ul class="profiles">
          @for (profile of otherProfiles(); track profile.id) {
            <li>
              <button type="button" class="profile" (click)="switchTo(profile)">
                <span class="avatar">{{ profile.name.charAt(0) }}</span>
                <span class="profile__text"><strong>{{ profile.name }}</strong><span class="hint">{{ profile.email ?? 'Sin correo' }}</span></span>
                <app-icon name="arrow-right" />
              </button>
            </li>
          }
        </ul>
      }
    </div>
  `,
  styleUrl: './auth-page.scss',
  styles: `
    .linkish {
      padding: 0;
      border: 0;
      background: none;
      color: var(--c-turquesa);
      font: inherit;
      font-weight: 700;
      text-decoration: underline;
      cursor: pointer;
    }
    .profiles {
      max-width: 520px;
    }
  `,
})
export class AccessPage {
  protected readonly session = inject(SessionStore);
  private readonly access = inject(DemoAccessService);
  private readonly navigator = inject(PostAccessNavigator);
  protected readonly params = toSignal(inject(ActivatedRoute).queryParams, { initialValue: {} });

  protected otherProfiles(): readonly Profile[] {
    const currentId = this.session.profile()?.id;
    return this.session.savedProfiles().filter((profile) => profile.id !== currentId);
  }

  protected continueAsGuest(): void {
    this.access.signOut();
    this.access.continueAsGuest();
    this.navigator.complete(this.params(), 'Continúas como invitado.');
  }

  protected switchTo(profile: Profile): void {
    this.access.switchTo(profile);
    this.navigator.complete(this.params(), `Cambiaste al perfil de ${profile.name}.`);
  }

  protected signOut(): void {
    this.access.signOut();
  }
}
