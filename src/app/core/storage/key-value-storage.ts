/**
 * Puerto de persistencia clave-valor. Los servicios dependen de esta abstracción
 * y no de `localStorage`, de modo que se pueda reemplazar por una API real.
 */
export abstract class KeyValueStorage {
  abstract read<T>(key: string): T | null;
  abstract write<T>(key: string, value: T): void;
  abstract remove(key: string): void;
  abstract keys(prefix: string): string[];
}
