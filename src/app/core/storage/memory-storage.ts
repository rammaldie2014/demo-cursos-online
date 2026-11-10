import { KeyValueStorage } from './key-value-storage';

/** Implementación en memoria, útil para pruebas unitarias. */
export class MemoryStorage extends KeyValueStorage {
  private readonly data = new Map<string, string>();

  read<T>(key: string): T | null {
    const raw = this.data.get(key);
    return raw === undefined ? null : (JSON.parse(raw) as T);
  }

  write<T>(key: string, value: T): void {
    this.data.set(key, JSON.stringify(value));
  }

  remove(key: string): void {
    this.data.delete(key);
  }

  keys(prefix: string): string[] {
    return [...this.data.keys()].filter((k) => k.startsWith(prefix));
  }
}
