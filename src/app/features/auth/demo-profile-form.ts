import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ProfileInput } from '../../core/models';
import { isValidEmail } from '../../core/utils/text';
import { Icon } from '../../shared/ui/icon/icon';

const SAMPLE_PROFILE: ProfileInput = { name: 'María Fernández', email: 'maria.demo@example.com' };

function optionalEmail(control: AbstractControl<string>): ValidationErrors | null {
  const value = control.value.trim();
  return value === '' || isValidEmail(value) ? null : { email: true };
}

/** Formulario de perfil demo: solo nombre y, opcionalmente, correo. Sin contraseñas. */
@Component({
  selector: 'app-demo-profile-form',
  imports: [ReactiveFormsModule, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
      <div class="field">
        <label for="pf-nombre">Nombre completo <span class="req" aria-hidden="true">*</span></label>
        <div class="with-icon">
          <app-icon name="user" class="with-icon__icon" />
          <input
            id="pf-nombre"
            class="input"
            formControlName="name"
            autocomplete="name"
            placeholder="Ej.: María Fernández"
            [attr.aria-invalid]="showError('name')"
            aria-describedby="pf-nombre-error"
          />
        </div>
        @if (showError('name')) {
          <span id="pf-nombre-error" class="error-text">Escribe tu nombre (entre 3 y 60 caracteres).</span>
        }
      </div>

      <div class="field">
        <label for="pf-correo">Correo de demostración <span class="muted">(opcional)</span></label>
        <div class="with-icon">
          <app-icon name="message" class="with-icon__icon" />
          <input
            id="pf-correo"
            class="input"
            type="email"
            formControlName="email"
            autocomplete="email"
            placeholder="nombre@example.com"
            [attr.aria-invalid]="showError('email')"
            aria-describedby="pf-correo-ayuda pf-correo-error"
          />
        </div>
        <span id="pf-correo-ayuda" class="hint">Solo identifica tu perfil en este navegador. No se envían correos.</span>
        @if (showError('email')) {
          <span id="pf-correo-error" class="error-text">Revisa el formato del correo (ej.: nombre&#64;example.com).</span>
        }
      </div>

      <button type="submit" class="btn btn--block btn--lg">{{ submitLabel() }}</button>
      <button type="button" class="btn btn--outline btn--block sample" (click)="useSample()">
        Usar usuario demo de ejemplo
      </button>
    </form>
  `,
  styles: `
    .with-icon {
      position: relative;
    }
    .with-icon__icon {
      position: absolute;
      left: 12px;
      top: 13px;
      color: var(--c-texto-suave);
    }
    .with-icon .input {
      padding-left: 40px;
    }
    .sample {
      margin-top: 10px;
    }
  `,
})
export class DemoProfileForm {
  readonly submitLabel = input('Continuar');
  readonly submitted = output<ProfileInput>();

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly attempted = signal(false);

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
    email: ['', [optionalEmail]],
  });

  protected showError(control: 'name' | 'email'): boolean {
    const ctrl = this.form.controls[control];
    return ctrl.invalid && (ctrl.touched || this.attempted());
  }

  protected useSample(): void {
    this.form.setValue({ name: SAMPLE_PROFILE.name, email: SAMPLE_PROFILE.email ?? '' });
  }

  protected submit(): void {
    this.attempted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const { name, email } = this.form.getRawValue();
    this.submitted.emit({ name: name.trim(), email: email.trim() || undefined });
  }
}
