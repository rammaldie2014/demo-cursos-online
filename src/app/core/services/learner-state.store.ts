import { computed, inject, Injectable, linkedSignal } from '@angular/core';
import { EMPTY_LEARNER_STATE, LearnerState } from '../models';
import { KeyValueStorage } from '../storage/key-value-storage';
import { STORAGE_PREFIX, StorageKeys } from '../storage/storage-keys';
import { SessionStore } from './session.store';

/**
 * Fuente única del estado del alumno (inscripciones, respuestas, progreso,
 * evaluación y reservas) para el perfil activo. Persiste en el navegador.
 */
@Injectable({ providedIn: 'root' })
export class LearnerStateStore {
  private readonly storage = inject(KeyValueStorage);
  private readonly session = inject(SessionStore);

  private readonly profileId = computed(() => this.session.profile()?.id ?? null);

  private readonly current = linkedSignal<string | null, LearnerState>({
    source: this.profileId,
    computation: (id) => (id ? this.load(id) : EMPTY_LEARNER_STATE),
  });

  readonly state = this.current.asReadonly();

  update(mutate: (state: LearnerState) => LearnerState): boolean {
    const id = this.profileId();
    if (!id) {
      return false;
    }
    const next = mutate(this.current());
    this.current.set(next);
    this.storage.write(StorageKeys.learnerState(id), next);
    return true;
  }

  /** Copia el avance de un perfil a otro (p. ej., de invitado a perfil registrado). */
  transfer(fromId: string, toId: string): void {
    if (fromId === toId) {
      return;
    }
    const source = this.load(fromId);
    const target = this.load(toId);
    const merged: LearnerState = isEmpty(target) ? source : target;
    this.storage.write(StorageKeys.learnerState(toId), merged);
    this.storage.remove(StorageKeys.learnerState(fromId));
  }

  /** Elimina todos los datos de la demo guardados en este navegador. */
  resetAll(): void {
    this.storage.keys(STORAGE_PREFIX).forEach((key) => this.storage.remove(key));
    this.current.set(EMPTY_LEARNER_STATE);
  }

  private load(profileId: string): LearnerState {
    const stored = this.storage.read<Partial<LearnerState>>(StorageKeys.learnerState(profileId));
    return { ...EMPTY_LEARNER_STATE, ...stored };
  }
}

function isEmpty(state: LearnerState): boolean {
  return state.enrollments.length === 0 && state.bookings.length === 0 && state.completedLessonIds.length === 0;
}
