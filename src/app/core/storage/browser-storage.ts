import { Injectable } from '@angular/core';
import { KeyValueStorage } from './key-value-storage';

/**
 * Adaptador sobre `localStorage`. Si el navegador bloquea el almacenamiento
 * (modo privado, políticas), continúa en memoria para que la demo no falle.
 */
@Injectable()
export class BrowserStorage extends KeyValueStorage {
  private readonly memory = new Map<string, string>();
  private readonly native = BrowserStorage.resolveNativeStorage();

  read<T>(key: string): T | null {
    const raw = this.getRaw(key);
    if (raw === null) {
      return null;
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  write<T>(key: string, value: T): void {
    const raw = JSON.stringify(value);
    this.memory.set(key, raw);
    try {
      this.native?.setItem(key, raw);
    } catch {
      // Cuota llena o almacenamiento bloqueado: se conserva la copia en memoria.
    }
  }

  remove(key: string): void {
    this.memory.delete(key);
    try {
      this.native?.removeItem(key);
    } catch {
      // Sin acción: la copia en memoria ya se eliminó.
    }
  }

  keys(prefix: string): string[] {
    const found = new Set<string>([...this.memory.keys()].filter((k) => k.startsWith(prefix)));
    try {
      for (let i = 0; i < (this.native?.length ?? 0); i++) {
        const key = this.native?.key(i);
        if (key?.startsWith(prefix)) {
          found.add(key);
        }
      }
    } catch {
      // Ignorado: se devuelven solo las claves en memoria.
    }
    return [...found];
  }

  private getRaw(key: string): string | null {
    try {
      const value = this.native?.getItem(key);
      if (value !== null && value !== undefined) {
        return value;
      }
    } catch {
      // Se usa la copia en memoria.
    }
    return this.memory.get(key) ?? null;
  }

  private static resolveNativeStorage(): Storage | null {
    try {
      return typeof window !== 'undefined' ? window.localStorage : null;
    } catch {
      return null;
    }
  }
}
