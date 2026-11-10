import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course, LEVEL_LABELS } from '../../../core/models';
import { PriceLabelPipe } from '../../pipes/price-label.pipe';
import { FallbackImage } from '../fallback-image/fallback-image';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-course-card',
  imports: [RouterLink, FallbackImage, Icon, PriceLabelPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card course">
      <a class="course__media" [routerLink]="['/cursos', course().slug]" tabindex="-1" aria-hidden="true">
        <app-fallback-image [image]="course().image" fallbackIcon="book" />
        @if (!course().hasFullDemo) {
          <span class="chip chip--demo course__flag">Curso de ejemplo</span>
        } @else {
          <span class="chip chip--lima course__flag">Recorrido completo</span>
        }
      </a>
      <div class="course__body">
        <h3 class="course__title">
          <a [routerLink]="['/cursos', course().slug]">{{ course().title }}</a>
        </h3>
        <p class="course__desc">{{ course().shortDescription }}</p>
        @if (showPrice()) {
          <p class="course__price" [class.course__price--free]="course().priceSoles === 0">
            {{ course().priceSoles | priceLabel }}
          </p>
        }
        <div class="course__footer">
          <div class="meta-row">
            <span class="chip">Curso</span>
            <span><app-icon name="clock" [size]="14" /> {{ course().durationHours }} horas</span>
            <span><app-icon name="level" [size]="14" /> Nivel: {{ levelLabel() }}</span>
          </div>
          <a class="icon-btn" [routerLink]="['/cursos', course().slug]" [attr.aria-label]="'Ver ' + course().title">
            <app-icon name="arrow-right" [size]="16" />
          </a>
        </div>
      </div>
    </article>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }
    .course {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .course:hover {
      box-shadow: var(--shadow);
      transform: translateY(-2px);
    }
    .course__media {
      position: relative;
      display: block;
      aspect-ratio: 380 / 150;
      background: var(--c-fondo-suave);
    }
    .course__media app-fallback-image {
      height: 100%;
    }
    .course__flag {
      position: absolute;
      top: 10px;
      left: 10px;
      box-shadow: var(--shadow-sm);
    }
    .course__body {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 14px 16px 14px;
    }
    .course__title {
      margin: 0 0 4px;
      font-size: 1.08rem;
    }
    .course__title a {
      color: var(--c-texto);
      text-decoration: none;
    }
    .course__title a:hover {
      color: var(--c-turquesa);
    }
    .course__desc {
      margin: 0 0 10px;
      font-size: 0.88rem;
      color: var(--c-texto-suave);
    }
    .course__price {
      margin: 0 0 10px;
      font-weight: 800;
      color: var(--c-petroleo);
    }
    .course__price--free {
      color: var(--c-lima-700);
    }
    .course__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-top: auto;
    }
    .icon-btn {
      flex: none;
    }
  `,
})
export class CourseCard {
  readonly course = input.required<Course>();
  readonly showPrice = input(false);

  protected readonly levelLabel = computed(() => LEVEL_LABELS[this.course().level]);
}
