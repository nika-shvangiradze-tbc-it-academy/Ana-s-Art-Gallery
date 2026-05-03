import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

/** Coordinates `body.style.overflow`; multiple callers can hold the lock at once. */
@Injectable({ providedIn: 'root' })
export class BodyScrollLock {
  private readonly doc = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private depth = 0;

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    const w = this.doc.defaultView;
    w?.addEventListener('pagehide', () => this.reset());
  }

  acquire(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.depth++;
    if (this.depth === 1) {
      this.doc.body.style.overflow = 'hidden';
    }
  }

  release(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.depth = Math.max(0, this.depth - 1);
    if (this.depth === 0) {
      this.doc.body.style.overflow = '';
    }
  }

  reset(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.depth = 0;
    this.doc.body.style.overflow = '';
  }
}
