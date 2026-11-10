import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, EmptyState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container page">
      <app-empty-state icon="search" title="No encontramos esta página" message="Revisa el enlace o vuelve al inicio.">
        <a routerLink="/" class="btn">Ir al inicio</a>
      </app-empty-state>
    </div>
  `,
})
export class NotFoundPage {}
