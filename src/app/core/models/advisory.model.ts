export interface Specialist {
  readonly id: string;
  readonly name: string;
  readonly initials: string;
  readonly specialty: string;
  readonly description: string;
  readonly topics: readonly string[];
  /** Días de la semana con atención (0 = domingo … 6 = sábado). */
  readonly workingDays: readonly number[];
  /** Horarios de ejemplo en formato HH:mm. */
  readonly timeSlots: readonly string[];
}

export interface Booking {
  readonly id: string;
  readonly specialistId: string;
  /** Fecha en formato ISO YYYY-MM-DD. */
  readonly date: string;
  readonly time: string;
  readonly topic: string;
  readonly createdAt: string;
}

export type BookingDraft = Omit<Booking, 'id' | 'createdAt'>;
