import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Booking, Specialist } from '../../core/models';
import { SpecialistRepository } from '../../core/repositories/content-repositories';
import { BOOKING_WINDOW_DAYS, BookingService } from '../../core/services/booking.service';
import { DemoAccessService } from '../../core/services/demo-access.service';
import { SessionStore } from '../../core/services/session.store';
import { ToastService } from '../../core/services/toast.service';
import { Clock } from '../../core/utils/clock';
import { addDays, formatLongDate } from '../../core/utils/dates';
import { AccessDialog } from '../../shared/ui/access-dialog/access-dialog';
import { Icon } from '../../shared/ui/icon/icon';
import { BookingCalendar } from './booking-calendar';

@Component({
  selector: 'app-advisory-page',
  imports: [RouterLink, AccessDialog, Icon, BookingCalendar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './advisory-page.html',
  styleUrl: './advisory-page.scss',
})
export class AdvisoryPage {
  /** Query param `?reprogramar=<id>`. */
  readonly reprogramar = input<string | undefined>();

  private readonly specialistRepository = inject(SpecialistRepository);
  private readonly bookingService = inject(BookingService);
  private readonly access = inject(DemoAccessService);
  private readonly toast = inject(ToastService);
  private readonly clock = inject(Clock);
  protected readonly session = inject(SessionStore);

  protected readonly specialists = this.specialistRepository.getAll();
  protected readonly today = this.clock.now();
  protected readonly maxDate = addDays(this.today, BOOKING_WINDOW_DAYS);

  protected readonly specialistId = signal<string | null>(null);
  protected readonly date = signal<string | null>(null);
  protected readonly time = signal<string | null>(null);
  protected readonly topic = signal('');
  protected readonly error = signal<string | null>(null);
  protected readonly confirmed = signal<Booking | null>(null);
  protected readonly dialogOpen = signal(false);

  protected readonly rescheduling = computed(() => {
    const id = this.reprogramar();
    return id ? (this.bookingService.findById(id) ?? null) : null;
  });

  protected readonly specialist = computed<Specialist | null>(() => {
    const id = this.specialistId();
    return id ? (this.specialistRepository.getById(id) ?? null) : null;
  });

  protected readonly isBookable = computed(() => {
    const specialist = this.specialist();
    return (iso: string) => (specialist ? this.bookingService.isBookableDate(specialist, iso) : false);
  });

  protected readonly slots = computed(() => {
    const specialist = this.specialist();
    const date = this.date();
    return specialist && date ? this.bookingService.slotsFor(specialist, date, this.rescheduling()?.id) : [];
  });

  protected readonly step = computed(() => (!this.specialist() ? 1 : !this.date() || !this.time() ? 2 : 3));

  protected readonly dateLabel = computed(() => {
    const date = this.date();
    return date ? formatLongDate(date) : '';
  });

  constructor() {
    // Solo reacciona al id de la URL: si dependiera de la reserva, al guardar
    // la reprogramación se volvería a ejecutar y borraría la confirmación.
    effect(() => {
      const id = this.reprogramar();
      const booking = id ? untracked(() => this.bookingService.findById(id)) : undefined;
      if (booking) {
        untracked(() => {
          this.specialistId.set(booking.specialistId);
          this.topic.set(booking.topic);
          this.date.set(null);
          this.time.set(null);
          this.confirmed.set(null);
        });
      }
    });
  }

  protected chooseSpecialist(specialist: Specialist): void {
    if (this.specialistId() === specialist.id) {
      return;
    }
    this.specialistId.set(specialist.id);
    this.topic.set(specialist.topics[0] ?? '');
    this.date.set(null);
    this.time.set(null);
    this.error.set(null);
  }

  protected chooseDate(iso: string): void {
    this.date.set(iso);
    this.time.set(null);
    this.error.set(null);
  }

  protected chooseTime(time: string): void {
    this.time.set(time);
    this.error.set(null);
  }

  protected confirm(): void {
    if (!this.session.hasProfile()) {
      this.dialogOpen.set(true);
      return;
    }
    const draft = {
      specialistId: this.specialistId() ?? '',
      date: this.date() ?? '',
      time: this.time() ?? '',
      topic: this.topic(),
    };
    const current = this.rescheduling();
    const result = current ? this.bookingService.reschedule(current.id, draft) : this.bookingService.book(draft);
    if (!result.ok) {
      this.error.set(result.error);
      return;
    }
    this.error.set(null);
    this.confirmed.set(result.booking);
    this.toast.show(current ? 'Asesoría reprogramada (simulación).' : 'Asesoría agendada (simulación).');
  }

  protected continueAsGuest(): void {
    this.access.continueAsGuest();
    this.dialogOpen.set(false);
    this.confirm();
  }

  protected startOver(): void {
    this.confirmed.set(null);
    this.specialistId.set(null);
    this.date.set(null);
    this.time.set(null);
    this.topic.set('');
  }

  protected specialistName(id: string): string {
    return this.specialistRepository.getById(id)?.name ?? '';
  }

  protected formatDate(iso: string): string {
    return formatLongDate(iso);
  }
}
