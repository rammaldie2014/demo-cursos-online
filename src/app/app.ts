import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteFooter } from './shared/ui/site-footer/site-footer';
import { SiteHeader } from './shared/ui/site-header/site-header';
import { ToastOutlet } from './shared/ui/toast-outlet/toast-outlet';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter, ToastOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip-link" href="#contenido">Saltar al contenido</a>
    <app-site-header />
    <main id="contenido" tabindex="-1">
      <router-outlet />
    </main>
    <app-site-footer />
    <app-toast-outlet />
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    main {
      flex: 1;
      outline: none;
    }
    .skip-link {
      position: absolute;
      left: 12px;
      top: -60px;
      z-index: 200;
      padding: 10px 14px;
      border-radius: 8px;
      background: var(--c-petroleo);
      color: #fff;
    }
    .skip-link:focus {
      top: 12px;
    }
  `,
})
export class App {}
