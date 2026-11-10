import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Logo tipográfico provisional «Aprende y Avanza». */
@Component({
  selector: 'app-brand-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="logo" [class.logo--sm]="size() === 'sm'" [class.logo--inverse]="inverse()">
      <span class="logo__text">APRENDE <span class="logo__y">y</span> AVANZA</span>
      <svg class="logo__mark" viewBox="0 0 34 24" aria-hidden="true" focusable="false">
        <path d="M3 13l8 8L31 3" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M3 13l8 8" fill="none" stroke="#008f95" stroke-width="6" stroke-linecap="round" />
      </svg>
    </span>
  `,
  styles: `
    .logo {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--c-texto);
      font-weight: 800;
      font-size: 1.15rem;
      letter-spacing: -0.02em;
      white-space: nowrap;
    }
    .logo__y {
      color: var(--c-turquesa);
      font-weight: 700;
      text-transform: lowercase;
    }
    .logo__mark {
      width: 26px;
      height: 19px;
      color: var(--c-lima);
    }
    .logo--sm {
      font-size: 0.95rem;
    }
    .logo--sm .logo__mark {
      width: 20px;
      height: 15px;
    }
    .logo--inverse {
      color: #fff;
    }
    .logo--inverse .logo__y {
      color: var(--c-lima);
    }
  `,
})
export class BrandLogo {
  readonly size = input<'md' | 'sm'>('md');
  readonly inverse = input(false);
}
