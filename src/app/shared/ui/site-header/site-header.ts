import { ChangeDetectionStrategy, Component, ElementRef, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DemoAccessService } from '../../../core/services/demo-access.service';
import { SessionStore } from '../../../core/services/session.store';
import { ToastService } from '../../../core/services/toast.service';
import { initialsOf } from '../../../core/utils/text';
import { BrandLogo } from '../brand-logo/brand-logo';
import { Icon } from '../icon/icon';

type MenuId = 'asesorias' | 'programas' | 'usuario';

interface NavGroup {
  readonly id: Exclude<MenuId, 'usuario'>;
  readonly label: string;
  readonly links: readonly { readonly label: string; readonly route: string; readonly fragment?: string }[];
}

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive, BrandLogo, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'closeAll()',
  },
})
export class SiteHeader {
  protected readonly session = inject(SessionStore);
  private readonly access = inject(DemoAccessService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly openMenu = signal<MenuId | null>(null);
  protected readonly mobileOpen = signal(false);

  protected readonly groups: readonly NavGroup[] = [
    {
      id: 'asesorias',
      label: 'Asesorías',
      links: [
        { label: 'Especialistas y temas', route: '/asesorias' },
        { label: 'Agendar una asesoría', route: '/asesorias', fragment: 'agendar' },
      ],
    },
    {
      id: 'programas',
      label: 'Programas',
      links: [
        { label: 'Ruta de aprendizaje', route: '/', fragment: 'ruta' },
        { label: 'Curso gratuito: Crea tu marca', route: '/cursos/crea-tu-marca' },
        { label: 'Certificado de ejemplo', route: '/', fragment: 'certificado' },
      ],
    },
  ];

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.closeAll());
  }

  protected initials(): string {
    return this.session.isGuest() ? 'IN' : initialsOf(this.session.displayName());
  }

  protected toggle(menu: MenuId): void {
    this.openMenu.update((current) => (current === menu ? null : menu));
  }

  protected toggleMobile(): void {
    this.mobileOpen.update((open) => !open);
  }

  protected signOut(): void {
    this.access.signOut();
    this.toast.show('Saliste del perfil demo. Tu avance sigue guardado en este navegador.', 'info');
    void this.router.navigateByUrl('/');
  }

  protected closeAll(): void {
    this.openMenu.set(null);
    this.mobileOpen.set(false);
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.closeAll();
    }
  }
}
