export type ProfileKind = 'guest' | 'demo';

export interface Profile {
  readonly id: string;
  readonly name: string;
  readonly email?: string;
  readonly kind: ProfileKind;
  readonly createdAt: string;
}

export interface ProfileInput {
  readonly name: string;
  readonly email?: string;
}

export const GUEST_PROFILE_ID = 'invitado';
