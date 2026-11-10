import { computed, inject, Injectable } from '@angular/core';
import { Booking, BookingDraft, Specialist } from '../models';
import { SpecialistRepository } from '../repositories/content-repositories';
import { Clock } from '../utils/clock';
import { addDays, fromIsoDate, toIsoDate } from '../utils/dates';
import { createId } from '../utils/text';
import { LearnerStateStore } from './learner-state.store';

export const BOOKING_WINDOW_DAYS = 60;

export interface TimeSlot {
  readonly time: string;
  readonly available: boolean;
}

export type BookingResult = { readonly ok: true; readonly booking: Booking } | { readonly ok: false; readonly error: string };

/** Agenda simulada de asesorías: no realiza reservas reales ni envía correos. */
@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly store = inject(LearnerStateStore);
  private readonly specialists = inject(SpecialistRepository);
  private readonly clock = inject(Clock);

  readonly bookings = computed<readonly Booking[]>(() =>
    [...this.store.state().bookings].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)),
  );

  readonly upcomingBookings = computed(() => {
    const today = this.today();
    return this.bookings().filter((booking) => booking.date >= today);
  });

  today(): string {
    return toIsoDate(this.clock.now());
  }

  findById(id: string): Booking | undefined {
    return this.store.state().bookings.find((booking) => booking.id === id);
  }

  isBookableDate(specialist: Specialist, isoDate: string): boolean {
    const now = this.clock.now();
    const min = toIsoDate(addDays(now, 1));
    const max = toIsoDate(addDays(now, BOOKING_WINDOW_DAYS));
    return isoDate >= min && isoDate <= max && specialist.workingDays.includes(fromIsoDate(isoDate).getDay());
  }

  slotsFor(specialist: Specialist, isoDate: string, ignoreBookingId?: string): readonly TimeSlot[] {
    if (!this.isBookableDate(specialist, isoDate)) {
      return [];
    }
    return specialist.timeSlots.map((time) => ({
      time,
      available:
        !isSampleBusy(specialist.id, isoDate, time) && !this.isTakenByUser(specialist.id, isoDate, time, ignoreBookingId),
    }));
  }

  book(draft: BookingDraft): BookingResult {
    const error = this.validate(draft);
    if (error) {
      return { ok: false, error };
    }
    const booking: Booking = { ...draft, id: createId('asesoria'), createdAt: this.clock.now().toISOString() };
    const saved = this.store.update((state) => ({ ...state, bookings: [...state.bookings, booking] }));
    return saved ? { ok: true, booking } : { ok: false, error: 'Necesitas un perfil demo o continuar como invitado.' };
  }

  reschedule(bookingId: string, draft: BookingDraft): BookingResult {
    const existing = this.findById(bookingId);
    if (!existing) {
      return { ok: false, error: 'No encontramos la asesoría que quieres reprogramar.' };
    }
    const error = this.validate(draft, bookingId);
    if (error) {
      return { ok: false, error };
    }
    const updated: Booking = { ...existing, ...draft };
    this.store.update((state) => ({
      ...state,
      bookings: state.bookings.map((b) => (b.id === bookingId ? updated : b)),
    }));
    return { ok: true, booking: updated };
  }

  cancel(bookingId: string): void {
    this.store.update((state) => ({ ...state, bookings: state.bookings.filter((b) => b.id !== bookingId) }));
  }

  private validate(draft: BookingDraft, ignoreBookingId?: string): string | null {
    const specialist = this.specialists.getById(draft.specialistId);
    if (!specialist) {
      return 'Selecciona un especialista.';
    }
    if (!draft.date || !this.isBookableDate(specialist, draft.date)) {
      return 'Selecciona una fecha futura disponible para este especialista.';
    }
    if (!draft.time) {
      return 'Selecciona un horario.';
    }
    if (!draft.topic.trim()) {
      return 'Indica el tema de la asesoría.';
    }
    const slot = this.slotsFor(specialist, draft.date, ignoreBookingId).find((s) => s.time === draft.time);
    if (!slot?.available) {
      return 'Ese horario ya no está disponible. Elige otro.';
    }
    const duplicate = this.store
      .state()
      .bookings.some((b) => b.specialistId === draft.specialistId && b.id !== ignoreBookingId && b.date >= this.today());
    if (duplicate) {
      return `Ya tienes una asesoría con ${specialist.name}. Reprográmala o cancélala desde tu panel.`;
    }
    return null;
  }

  private isTakenByUser(specialistId: string, date: string, time: string, ignoreBookingId?: string): boolean {
    return this.store
      .state()
      .bookings.some((b) => b.id !== ignoreBookingId && b.specialistId === specialistId && b.date === date && b.time === time);
  }
}

/** Ocupación de ejemplo determinista para que el calendario se vea realista. */
export function isSampleBusy(specialistId: string, date: string, time: string): boolean {
  const seed = `${specialistId}|${date}|${time}`;
  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash % 4 === 0;
}
