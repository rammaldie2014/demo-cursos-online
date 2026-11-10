import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProfileInput } from '../../core/models';
import { DemoAccessService } from '../../core/services/demo-access.service';
import { SessionStore } from '../../core/services/session.store';
import { Icon } from '../../shared/ui/icon/icon';
import { AuthLayout } from './auth-layout';
import { DemoProfileForm } from './demo-profile-form';
import { PostAccessNavigator } from './post-access-navigator';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, AuthLayout, DemoProfileForm, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-auth-layout>
      <h1>Regístrate en Aprende y Avanza</h1>
      <p class="muted">Crea un perfil de demostración con tu nombre. El registro es opcional.</p>

      <p class="notice notice--warn">
        <app-icon name="info" [size]="16" />
        <span>Registro simulado: no existe autenticación real, no se piden contraseñas y los datos quedan solo en este navegador.</span>
      </p>

      @if (session.isGuest()) {
        <p class="notice notice--ok">
          <app-icon name="check-circle" [size]="16" />
          <span>Estás como invitado: al registrarte conservarás tu avance actual.</span>
        </p>
      }

      <app-demo-profile-form submitLabel="Crear cuenta demo" (submitted)="register($event)" />

      @if (!session.hasProfile()) {
        <div class="divider"><span>o</span></div>
        <button type="button" class="btn btn--soft btn--block" (click)="continueAsGuest()">Continuar como invitado</button>
      }

      <p class="switch">
        ¿Ya tienes un perfil demo? <a routerLink="/iniciar-sesion" [queryParams]="params()">Iniciar sesión</a>
      </p>
    </app-auth-layout>
  `,
  styleUrl: './auth-page.scss',
})
export class RegisterPage {
  protected readonly session = inject(SessionStore);
  private readonly access = inject(DemoAccessService);
  private readonly navigator = inject(PostAccessNavigator);
  protected readonly params = toSignal(inject(ActivatedRoute).queryParams, { initialValue: {} });

  protected register(input: ProfileInput): void {
    const profile = this.access.register(input);
    this.navigator.complete(this.params(), `¡Bienvenido, ${profile.name}! Perfil demo creado.`);
  }

  protected continueAsGuest(): void {
    this.access.continueAsGuest();
    this.navigator.complete(this.params(), 'Continúas como invitado.');
  }
}
