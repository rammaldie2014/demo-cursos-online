import { inject, Injectable } from '@angular/core';
import { Profile, ProfileInput } from '../models';
import { LearnerStateStore } from './learner-state.store';
import { SessionStore } from './session.store';

/**
 * Casos de uso de acceso simulado: invitado, inicio de sesión demo,
 * registro demo y salida. Coordina la sesión con el estado del alumno.
 */
@Injectable({ providedIn: 'root' })
export class DemoAccessService {
  private readonly session = inject(SessionStore);
  private readonly learnerState = inject(LearnerStateStore);

  continueAsGuest(): Profile {
    const current = this.session.profile();
    if (current) {
      return current;
    }
    const guest = this.session.createGuestProfile();
    this.session.activate(guest);
    return guest;
  }

  signIn(input: ProfileInput): Profile {
    const profile = this.session.createDemoProfile(input);
    this.session.activate(profile);
    return profile;
  }

  /** Registra un perfil demo. Si había un invitado, conserva su avance. */
  register(input: ProfileInput): Profile {
    const profile = this.session.createDemoProfile(input);
    const current = this.session.profile();
    if (current?.kind === 'guest') {
      this.learnerState.transfer(current.id, profile.id);
    }
    this.session.activate(profile);
    return profile;
  }

  switchTo(profile: Profile): void {
    this.session.activate(profile);
  }

  signOut(): void {
    this.session.clear();
  }

  resetDemo(): void {
    this.learnerState.resetAll();
    this.session.forgetAll();
  }
}
