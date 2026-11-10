import { ChangeDetectionStrategy, Component, effect, ElementRef, input, output, viewChild } from '@angular/core';
import { Params, RouterLink } from '@angular/router';
import { Icon } from '../icon/icon';

/**
 * Diálogo que ofrece acceso demo, registro demo o continuar como invitado
 * cuando una acción necesita un perfil (inscripción, reserva).
 */
@Component({
  selector: 'app-access-dialog',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog #dialog class="dialog" aria-labelledby="access-title" (close)="closed.emit()" (cancel)="closed.emit()">
      <button type="button" class="dialog__close icon-btn" aria-label="Cerrar" (click)="closed.emit()">
        <app-icon name="x" [size]="18" />
      </button>
      <h2 id="access-title">¿Cómo quieres continuar?</h2>
      <p class="muted">{{ reason() }}</p>

      <button type="button" class="btn btn--block btn--lg" (click)="guest.emit()">
        <app-icon name="user" /> Continuar como invitado
      </button>
      <p class="hint dialog__hint">Tu progreso se guarda solo en este navegador y puede perderse si borras sus datos.</p>

      <div class="dialog__alt">
        <a class="btn btn--outline" routerLink="/iniciar-sesion" [queryParams]="queryParams()">Iniciar sesión demo</a>
        <a class="btn btn--soft" routerLink="/registro" [queryParams]="queryParams()">Registrarme (demo)</a>
      </div>
      <p class="notice dialog__notice">
        <app-icon name="info" [size]="16" />
        <span>No existe autenticación real: no se piden contraseñas ni se envían correos.</span>
      </p>
    </dialog>
  `,
  styles: `
    .dialog {
      position: fixed;
      width: min(460px, calc(100vw - 32px));
      max-height: calc(100vh - 32px);
      padding: 28px 24px 24px;
      border: 0;
      border-radius: var(--radius-lg);
      box-shadow: 0 20px 60px rgb(0 0 0 / 25%);
      color: var(--c-texto);
    }
    .dialog::backdrop {
      background: rgb(0 40 46 / 55%);
    }
    .dialog__close {
      position: absolute;
      top: 14px;
      right: 14px;
    }
    h2 {
      padding-right: 40px;
    }
    .dialog__hint {
      margin: 8px 0 18px;
      text-align: center;
    }
    .dialog__alt {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .dialog__notice {
      margin: 16px 0 0;
    }
    @media (max-width: 420px) {
      .dialog__alt {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class AccessDialog {
  readonly open = input(false);
  readonly reason = input('Para guardar tu avance necesitas un perfil demo o continuar como invitado.');
  readonly queryParams = input<Params>({});

  readonly guest = output<void>();
  readonly closed = output<void>();

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      const element = this.dialog().nativeElement;
      if (this.open() && !element.open) {
        element.showModal();
      } else if (!this.open() && element.open) {
        element.close();
      }
    });
  }
}
