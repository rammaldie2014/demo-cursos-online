/** Prefijo común para poder reiniciar todos los datos de la demo. */
export const STORAGE_PREFIX = 'ayv:';

export const StorageKeys = {
  session: `${STORAGE_PREFIX}session`,
  profiles: `${STORAGE_PREFIX}profiles`,
  learnerState: (profileId: string) => `${STORAGE_PREFIX}state:${profileId}`,
} as const;
