import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { ImageAsset } from '../../../core/models';
import { Icon } from '../icon/icon';
import { IconName } from '../icon/icons';

/** Imagen con alternativa visual si el recurso no carga. */
@Component({
  selector: 'app-fallback-image',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!failed()) {
      <img
        [src]="image().src"
        [alt]="image().alt"
        [attr.loading]="eager() ? 'eager' : 'lazy'"
        decoding="async"
        (error)="failed.set(true)"
      />
    } @else {
      <div class="fallback" role="img" [attr.aria-label]="image().alt">
        <app-icon [name]="fallbackIcon()" [size]="40" [stroke]="1.5" />
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      overflow: hidden;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .fallback {
      display: grid;
      place-items: center;
      width: 100%;
      height: 100%;
      min-height: 120px;
      background: linear-gradient(135deg, var(--c-turquesa-100), #eef8cc);
      color: var(--c-petroleo);
    }
  `,
})
export class FallbackImage {
  readonly image = input.required<ImageAsset>();
  readonly eager = input(false);
  readonly fallbackIcon = input<IconName>('briefcase');

  protected readonly failed = signal(false);
}
