import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="track"
      role="progressbar"
      [attr.aria-valuenow]="value()"
      aria-valuemin="0"
      aria-valuemax="100"
      [attr.aria-label]="label()"
    >
      <div class="fill" [style.width.%]="value()"></div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .track {
      height: 8px;
      border-radius: 999px;
      background: #e3edef;
      overflow: hidden;
    }
    .fill {
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, var(--c-turquesa), var(--c-lima));
      transition: width 0.4s ease;
    }
  `,
})
export class ProgressBar {
  readonly value = input.required<number>();
  readonly label = input('Progreso');
}
