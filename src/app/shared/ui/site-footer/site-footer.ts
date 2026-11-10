import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DemoAccessService } from '../../../core/services/demo-access.service';
import { ToastService } from '../../../core/services/toast.service';
import { BrandLogo } from '../brand-logo/brand-logo';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink, BrandLogo, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer no-print">
      <div class="container footer__inner">
        <div>
          <app-brand-logo [inverse]="true" size="sm" />
          <p class="footer__note">
            Nombre provisional de demostración. Contenidos, especialistas y precios son de ejemplo.
          </p>
        </div>
        <nav aria-label="Enlaces del pie de página">
          <ul class="footer__links">
            <li><a routerLink="/cursos">Cursos</a></li>
            <li><a routerLink="/asesorias">Asesorías</a></li>
            <li><a routerLink="/panel">Mi panel</a></li>
          </ul>
        </nav>
        <div class="footer__reset">
          <button type="button" class="btn btn--sm btn--light" (click)="reset()">
            <app-icon name="refresh" [size]="16" /> Reiniciar datos de la demo
          </button>
          <span class="footer__hint">Borra perfiles, avance y reservas guardados en este navegador.</span>
        </div>
      </div>
    </footer>
  `,
  styles: `
    .footer {
      margin-top: 48px;
      background: var(--c-petroleo);
      color: #cfe6e8;
      font-size: 0.85rem;
    }
    .footer__inner {
      display: grid;
      gap: 20px;
      padding-block: 28px;
    }
    .footer__note {
      margin: 8px 0 0;
      max-width: 380px;
    }
    .footer__links {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 18px;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .footer__links a {
      color: #fff;
      text-decoration: none;
    }
    .footer__links a:hover {
      text-decoration: underline;
    }
    .footer__reset {
      display: grid;
      gap: 6px;
      justify-items: start;
    }
    .footer__hint {
      font-size: 0.75rem;
    }
    @media (min-width: 768px) {
      .footer__inner {
        grid-template-columns: 1.4fr 1fr 1fr;
        align-items: center;
      }
    }
  `,
})
export class SiteFooter {
  private readonly access = inject(DemoAccessService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  protected reset(): void {
    const confirmed = window.confirm('¿Reiniciar la demo? Se borrarán perfiles, respuestas, progreso y reservas de este navegador.');
    if (!confirmed) {
      return;
    }
    this.access.resetDemo();
    this.toast.show('Datos de la demo reiniciados.', 'info');
    void this.router.navigateByUrl('/');
  }
}
