import { Injectable, signal } from '@angular/core';

export type ToastTone = 'success' | 'info' | 'error';

export interface Toast {
  readonly id: number;
  readonly message: string;
  readonly tone: ToastTone;
}

const TOAST_DURATION_MS = 4500;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  private readonly items = signal<readonly Toast[]>([]);

  readonly toasts = this.items.asReadonly();

  show(message: string, tone: ToastTone = 'success'): void {
    const toast: Toast = { id: this.nextId++, message, tone };
    this.items.update((list) => [...list, toast]);
    setTimeout(() => this.dismiss(toast.id), TOAST_DURATION_MS);
  }

  dismiss(id: number): void {
    this.items.update((list) => list.filter((toast) => toast.id !== id));
  }
}
