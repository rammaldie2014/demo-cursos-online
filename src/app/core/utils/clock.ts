import { Injectable } from '@angular/core';

/** Abstracción del reloj para poder controlar fechas en pruebas. */
@Injectable({ providedIn: 'root', useFactory: () => new SystemClock() })
export abstract class Clock {
  abstract now(): Date;
}

export class SystemClock extends Clock {
  now(): Date {
    return new Date();
  }
}

export class FixedClock extends Clock {
  constructor(private readonly fixed: Date) {
    super();
  }

  now(): Date {
    return new Date(this.fixed);
  }
}
