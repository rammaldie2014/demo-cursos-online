import { TestBed } from '@angular/core/testing';
import { SPECIALISTS } from '../data/specialists.data';
import { BookingDraft } from '../models';
import { configureDemoTestBed } from '../testing/test-providers';
import { addDays, toIsoDate } from '../utils/dates';
import { TEST_NOW } from '../testing/test-providers';
import { BookingService } from './booking.service';
import { DemoAccessService } from './demo-access.service';

const carlos = SPECIALISTS[0];

describe('BookingService', () => {
  let service: BookingService;

  beforeEach(() => {
    configureDemoTestBed();
    TestBed.inject(DemoAccessService).continueAsGuest();
    service = TestBed.inject(BookingService);
  });

  function firstAvailableDraft(specialistId = carlos.id): BookingDraft {
    const specialist = SPECIALISTS.find((s) => s.id === specialistId)!;
    for (let offset = 1; offset < 30; offset++) {
      const date = toIsoDate(addDays(TEST_NOW, offset));
      const slot = service.slotsFor(specialist, date).find((s) => s.available);
      if (slot) {
        return { specialistId, date, time: slot.time, topic: specialist.topics[0] };
      }
    }
    throw new Error('Sin horarios de ejemplo');
  }

  it('no permite fechas pasadas ni el día de hoy', () => {
    expect(service.isBookableDate(carlos, toIsoDate(TEST_NOW))).toBe(false);
    expect(service.isBookableDate(carlos, toIsoDate(addDays(TEST_NOW, -3)))).toBe(false);
  });

  it('crea una reserva válida y la lista como próxima', () => {
    const result = service.book(firstAvailableDraft());
    expect(result.ok).toBe(true);
    expect(service.upcomingBookings().length).toBe(1);
  });

  it('evita duplicar reservas con el mismo especialista', () => {
    service.book(firstAvailableDraft());
    const second = service.book(firstAvailableDraft());
    expect(second.ok).toBe(false);
    expect(service.bookings().length).toBe(1);
  });

  it('valida campos obligatorios', () => {
    const result = service.book({ specialistId: carlos.id, date: '', time: '', topic: '' });
    expect(result.ok).toBe(false);
  });

  it('permite reprogramar y cancelar', () => {
    const created = service.book(firstAvailableDraft());
    if (!created.ok) throw new Error(created.error);

    const later = toIsoDate(addDays(TEST_NOW, 8));
    const slot = service.slotsFor(carlos, later, created.booking.id).find((s) => s.available);
    if (slot) {
      const moved = service.reschedule(created.booking.id, { ...firstAvailableDraft(), date: later, time: slot.time });
      expect(moved.ok).toBe(true);
      expect(service.findById(created.booking.id)?.date).toBe(later);
    }

    service.cancel(created.booking.id);
    expect(service.bookings().length).toBe(0);
  });
});
