import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-toast-outlet',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toasts no-print" aria-live="polite" aria-atomic="false">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="'toast toast--' + toast.tone" role="status">
          <app-icon [name]="toast.tone === 'error' ? 'info' : 'check-circle'" [size]="18" />
          <span>{{ toast.message }}</span>
          <button type="button" class="toast__close" aria-label="Cerrar aviso" (click)="toastService.dismiss(toast.id)">
            <app-icon name="x" [size]="16" />
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .toasts {
      position: fixed;
      right: 16px;
      bottom: 16px;
      left: 16px;
      z-index: 100;
      display: grid;
      justify-items: end;
      gap: 8px;
      pointer-events: none;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 10px;
      max-width: 420px;
      padding: 12px 12px 12px 16px;
      border-radius: 12px;
      background: var(--c-petroleo);
      color: #fff;
      font-size: 0.9rem;
      font-weight: 600;
      box-shadow: var(--shadow);
      pointer-events: auto;
    }
    .toast--info {
      background: #24434b;
    }
    .toast--error {
      background: var(--c-error);
    }
    .toast__close {
      display: grid;
      place-items: center;
      width: 32px;
      height: 32px;
      border: 0;
      border-radius: 8px;
      background: rgb(255 255 255 / 12%);
      color: #fff;
      cursor: pointer;
    }
  `,
})
export class ToastOutlet {
  protected readonly toastService = inject(ToastService);
}
