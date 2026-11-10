import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FallbackImage } from '../../shared/ui/fallback-image/fallback-image';
import { Icon } from '../../shared/ui/icon/icon';

/** Composición visual de las pantallas de acceso: panel ilustrado + formulario. */
@Component({
  selector: 'app-auth-layout',
  imports: [FallbackImage, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container page">
      <div class="auth card">
        <aside class="auth__side">
          <app-fallback-image class="auth__photo" [image]="photo" fallbackIcon="user" />
          <div class="auth__pitch">
            <p class="auth__headline">{{ headline() }}</p>
            <ul>
              <li><app-icon name="check-circle" [size]="18" /> Acceso a cursos y asesorías</li>
              <li><app-icon name="check-circle" [size]="18" /> Seguimiento de tu avance</li>
              <li><app-icon name="check-circle" [size]="18" /> Certificados de demostración</li>
            </ul>
          </div>
        </aside>
        <section class="auth__content">
          <ng-content />
        </section>
      </div>
    </div>
  `,
  styles: `
    .auth {
      display: grid;
      grid-template-columns: 0.9fr 1fr;
      max-width: 940px;
      margin-inline: auto;
      overflow: hidden;
    }
    .auth__side {
      position: relative;
      display: flex;
      flex-direction: column;
      background: linear-gradient(170deg, var(--c-turquesa), var(--c-petroleo));
      color: #fff;
    }
    .auth__photo {
      height: 300px;
    }
    .auth__pitch {
      padding: 24px 28px 32px;
    }
    .auth__headline {
      margin: 0 0 14px;
      font-size: 1.5rem;
      font-weight: 800;
      line-height: 1.2;
    }
    ul {
      display: grid;
      gap: 10px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    li {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      font-size: 0.92rem;
    }
    li app-icon {
      color: var(--c-lima);
    }
    .auth__content {
      padding: 32px;
    }
    @media (max-width: 767px) {
      .auth {
        grid-template-columns: 1fr;
      }
      .auth__side {
        display: none;
      }
      .auth__content {
        padding: 24px 18px;
      }
    }
  `,
})
export class AuthLayout {
  readonly headline = input('Crea tu cuenta y comienza a aprender');

  protected readonly photo = {
    src: 'images/registro.webp',
    alt: 'Emprendedora sonriente usando su laptop',
  };
}
