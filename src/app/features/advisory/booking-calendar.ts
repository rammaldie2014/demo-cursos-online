import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output } from '@angular/core';
import { formatLongDate, formatMonthYear, toIsoDate } from '../../core/utils/dates';
import { Icon } from '../../shared/ui/icon/icon';

interface CalendarCell {
  readonly iso: string;
  readonly day: number;
  readonly bookable: boolean;
  readonly label: string;
}

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

/** Calendario mensual accesible. La regla de disponibilidad se recibe como función. */
@Component({
  selector: 'app-booking-calendar',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cal">
      <div class="cal__head">
        <button type="button" class="icon-btn" aria-label="Mes anterior" [disabled]="!canGoBack()" (click)="shift(-1)">
          <app-icon name="chevron-left" />
        </button>
        <p class="cal__month" aria-live="polite">{{ monthLabel() }}</p>
        <button type="button" class="icon-btn" aria-label="Mes siguiente" [disabled]="!canGoForward()" (click)="shift(1)">
          <app-icon name="chevron-right" />
        </button>
      </div>
      <div class="cal__grid" role="group" [attr.aria-label]="'Días de ' + monthLabel()">
        @for (weekday of weekdays; track weekday) {
          <span class="cal__weekday" aria-hidden="true">{{ weekday }}</span>
        }
        @for (cell of cells(); track $index) {
          @if (cell) {
            <button
              type="button"
              class="cal__day"
              [class.is-selected]="cell.iso === selected()"
              [class.is-available]="cell.bookable"
              [disabled]="!cell.bookable"
              [attr.aria-pressed]="cell.iso === selected()"
              [attr.aria-label]="cell.label"
              (click)="selectDate.emit(cell.iso)"
            >
              {{ cell.day }}
            </button>
          } @else {
            <span aria-hidden="true"></span>
          }
        }
      </div>
      <p class="cal__legend hint"><span class="dot"></span> Días con horarios de ejemplo</p>
    </div>
  `,
  styleUrl: './booking-calendar.scss',
})
export class BookingCalendar {
  readonly today = input.required<Date>();
  readonly maxDate = input.required<Date>();
  readonly selected = input<string | null>(null);
  readonly isBookable = input.required<(iso: string) => boolean>();

  readonly selectDate = output<string>();

  protected readonly weekdays = WEEKDAYS;

  protected readonly month = linkedSignal(() => {
    const base = this.selected() ? new Date(`${this.selected()}T00:00:00`) : this.today();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  protected readonly monthLabel = computed(() => formatMonthYear(this.month()));

  protected readonly canGoBack = computed(() => {
    const t = this.today();
    return this.month() > new Date(t.getFullYear(), t.getMonth(), 1);
  });

  protected readonly canGoForward = computed(() => {
    const m = this.maxDate();
    return this.month() < new Date(m.getFullYear(), m.getMonth(), 1);
  });

  protected readonly cells = computed<readonly (CalendarCell | null)[]>(() => {
    const first = this.month();
    const year = first.getFullYear();
    const monthIndex = first.getMonth();
    const leading = (first.getDay() + 6) % 7; // semana inicia en lunes
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const isBookable = this.isBookable();
    const cells: (CalendarCell | null)[] = Array.from({ length: leading }, () => null);
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day);
      const iso = toIsoDate(date);
      const bookable = isBookable(iso);
      cells.push({ iso, day, bookable, label: `${formatLongDate(date)}${bookable ? '' : ', no disponible'}` });
    }
    return cells;
  });

  protected shift(delta: number): void {
    this.month.update((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
  }
}
