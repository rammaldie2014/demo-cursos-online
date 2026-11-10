import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CourseRepository } from '../../core/repositories/content-repositories';
import { CourseCard } from '../../shared/ui/course-card/course-card';
import { CertificatePreview } from '../../shared/ui/certificate-preview/certificate-preview';
import { FallbackImage } from '../../shared/ui/fallback-image/fallback-image';
import { Icon } from '../../shared/ui/icon/icon';
import { IconName } from '../../shared/ui/icon/icons';

interface RouteStep {
  readonly title: string;
  readonly description: string;
  readonly icon: IconName;
}

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, CourseCard, CertificatePreview, FallbackImage, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  private readonly courses = inject(CourseRepository);

  protected readonly featured = computed(() => this.courses.getAll().filter((course) => course.featured).slice(0, 4));

  protected readonly steps: readonly RouteStep[] = [
    { title: 'Aprende', description: 'Adquiere conocimientos prácticos con instructivos breves.', icon: 'graduation' },
    { title: 'Aplica', description: 'Pon en práctica lo aprendido con actividades y plantillas.', icon: 'tool' },
    { title: 'Recibe asesoría', description: 'Obtén orientación de especialistas según tus objetivos.', icon: 'users' },
    { title: 'Haz crecer tu negocio', description: 'Consolida tus ideas, mejora tus resultados y escala.', icon: 'trending-up' },
  ];

  protected readonly advisoryTopics: readonly { readonly label: string; readonly icon: IconName }[] = [
    { label: 'Asesoría en modelo de negocio', icon: 'user' },
    { label: 'Asesoría en marketing digital', icon: 'level' },
    { label: 'Asesoría en estrategia de ventas', icon: 'target' },
  ];

  protected readonly heroImage = {
    src: 'images/hero-emprendedor.webp',
    alt: 'Emprendedor sonriente trabajando en su laptop en una oficina con plantas',
  };

  protected readonly advisoryImage = {
    src: 'images/asesorias.webp',
    alt: 'Especialista conversando con una emprendedora frente a una laptop',
  };
}
