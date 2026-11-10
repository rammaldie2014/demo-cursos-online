import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from '../icon/icon';
import { IconName } from '../icon/icons';

@Component({
  selector: 'app-empty-state',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty">
      <span class="empty__icon"><app-icon [name]="icon()" [size]="26" /></span>
      <h3 class="empty__title">{{ title() }}</h3>
      @if (message()) {
        <p class="empty__msg">{{ message() }}</p>
      }
      <ng-content />
    </div>
  `,
  styles: `
    .empty {
      display: grid;
      justify-items: center;
      gap: 6px;
      padding: 28px 20px;
      border: 1.5px dashed var(--c-borde);
      border-radius: var(--radius);
      background: var(--c-fondo-suave);
      text-align: center;
    }
    .empty__icon {
      display: grid;
      place-items: center;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: var(--c-turquesa-100);
      color: var(--c-petroleo);
    }
    .empty__title {
      margin: 6px 0 0;
    }
    .empty__msg {
      margin: 0 0 8px;
      color: var(--c-texto-suave);
      max-width: 420px;
    }
  `,
})
export class EmptyState {
  readonly icon = input<IconName>('info');
  readonly title = input.required<string>();
  readonly message = input('');
}
