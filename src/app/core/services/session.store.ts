import { computed, inject, Injectable, signal } from '@angular/core';
import { GUEST_PROFILE_ID, Profile, ProfileInput } from '../models';
import { KeyValueStorage } from '../storage/key-value-storage';
import { StorageKeys } from '../storage/storage-keys';
import { Clock } from '../utils/clock';
import { slugify } from '../utils/text';

/**
 * Estado de la sesión simulada. No existe autenticación real:
 * solo se guarda un perfil de demostración en este navegador.
 */
@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly storage = inject(KeyValueStorage);
  private readonly clock = inject(Clock);

  private readonly current = signal<Profile | null>(this.storage.read<Profile>(StorageKeys.session));
  private readonly saved = signal<readonly Profile[]>(this.storage.read<Profile[]>(StorageKeys.profiles) ?? []);

  readonly profile = this.current.asReadonly();
  readonly savedProfiles = this.saved.asReadonly();
  readonly hasProfile = computed(() => this.current() !== null);
  readonly isGuest = computed(() => this.current()?.kind === 'guest');
  readonly displayName = computed(() => {
    const profile = this.current();
    if (!profile) {
      return '';
    }
    return profile.kind === 'guest' ? 'Invitado' : profile.name;
  });

  createGuestProfile(): Profile {
    return { id: GUEST_PROFILE_ID, name: 'Invitado', kind: 'guest', createdAt: this.clock.now().toISOString() };
  }

  createDemoProfile(input: ProfileInput): Profile {
    const email = input.email?.trim() || undefined;
    const id = `demo-${slugify(email ?? input.name)}`;
    const existing = this.saved().find((p) => p.id === id);
    return {
      id,
      name: input.name.trim(),
      email,
      kind: 'demo',
      createdAt: existing?.createdAt ?? this.clock.now().toISOString(),
    };
  }

  activate(profile: Profile): void {
    this.current.set(profile);
    this.storage.write(StorageKeys.session, profile);
    if (profile.kind === 'demo') {
      this.remember(profile);
    }
  }

  clear(): void {
    this.current.set(null);
    this.storage.remove(StorageKeys.session);
  }

  forgetAll(): void {
    this.clear();
    this.saved.set([]);
  }

  private remember(profile: Profile): void {
    const others = this.saved().filter((p) => p.id !== profile.id);
    const next = [profile, ...others];
    this.saved.set(next);
    this.storage.write(StorageKeys.profiles, next);
  }
}
