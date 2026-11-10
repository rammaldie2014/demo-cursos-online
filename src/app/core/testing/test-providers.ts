import { EnvironmentProviders, Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideDemoInfrastructure } from '../providers';
import { KeyValueStorage } from '../storage/key-value-storage';
import { MemoryStorage } from '../storage/memory-storage';
import { Clock, FixedClock } from '../utils/clock';

/** Lunes 9 de noviembre de 2026, 10:00 (hora local). */
export const TEST_NOW = new Date(2026, 10, 9, 10, 0, 0);

export function configureDemoTestBed(storage = new MemoryStorage()): MemoryStorage {
  const providers: (Provider | EnvironmentProviders)[] = [
    provideDemoInfrastructure(),
    { provide: KeyValueStorage, useValue: storage },
    { provide: Clock, useValue: new FixedClock(TEST_NOW) },
  ];
  TestBed.configureTestingModule({ providers });
  return storage;
}
