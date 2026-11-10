import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Profile, ProfileInput } from '../../core/models';
import { DemoAccessService } from '../../core/services/demo-access.service';
import { SessionStore } from '../../core/services/session.store';
import { Icon } from '../../shared/ui/icon/icon';
import { AuthLayout } from './auth-layout';
import { DemoProfileForm } from './demo-profile-form';
import { PostAccessNavigator } from './post-access-navigator';

@Component({
  selector: 'app-sign-in-page',
  imports: [RouterLink, AuthLayout, DemoProfileForm, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-auth-layout headline="Retoma tu ruta de aprendizaje">
      <h1>Iniciar sesión (demo)</h1>
      <p class="muted">Ingresa con tu nombre para recuperar el avance guardado en este navegador.</p>

      <p class="notice notice--warn">
        <app-icon name="info" [size]="16" />
        <span>Inicio de sesión simulado: no hay contraseñas ni verificación real.</span>
      </p>

      @if (session.savedProfiles().length > 0) {
        <h2 class="subtitle">Perfiles demo en este navegador</h2>
        <ul class="profiles">
          @for (profile of session.savedProfiles(); track profile.id) {
            <li>
              <button type="button" class="profile" (click)="resume(profile)">
                <span class="avatar">{{ profile.name.charAt(0) }}</span>
                <span class="profile__text">
                  <strong>{{ profile.name }}</strong>
                  <span class="hint">{{ profile.email ?? 'Sin correo' }}</span>
                </span>
                <app-icon name="arrow-right" />
              </button>
            </li>
          }
        </ul>
        <div class="divider"><span>o usa otro perfil</span></div>
      }

      <app-demo-profile-form submitLabel="Iniciar sesión demo" (submitted)="signIn($event)" />

      @if (!session.hasProfile()) {
        <div class="divider"><span>o</span></div>
        <button type="button" class="btn btn--soft btn--block" (click)="continueAsGuest()">Continuar como invitado</button>
      }

      <p class="switch">
        ¿Aún no tienes perfil? <a routerLink="/registro" [queryParams]="params()">Regístrate</a>
      </p>
    </app-auth-layout>
  `,
  styleUrl: './auth-page.scss',
})
export class SignInPage {
  protected readonly session = inject(SessionStore);
  private readonly access = inject(DemoAccessService);
  private readonly navigator = inject(PostAccessNavigator);
  protected readonly params = toSignal(inject(ActivatedRoute).queryParams, { initialValue: {} });

  protected signIn(input: ProfileInput): void {
    const profile = this.access.signIn(input);
    this.navigator.complete(this.params(), `Hola de nuevo, ${profile.name}.`);
  }

  protected resume(profile: Profile): void {
    this.access.switchTo(profile);
    this.navigator.complete(this.params(), `Hola de nuevo, ${profile.name}.`);
  }

  protected continueAsGuest(): void {
    this.access.continueAsGuest();
    this.navigator.complete(this.params(), 'Continúas como invitado.');
  }
}
