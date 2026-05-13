import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  DestroyRef,
  PLATFORM_ID,
  afterNextRender,
  effect,
  inject,
  signal,
} from '@angular/core';

import { BodyScrollLock } from '../body-scroll-lock/body-scroll-lock';
import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  CONTACT_PHONE_CLIPBOARD,
  CONTACT_PHONE_DISPLAY,
  CONTACT_WHATSAPP_URL,
} from './contact-detail';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { ContactModalService } from './contact-modal.service';

@Component({
  selector: 'app-contact-modal',
  imports: [TranslatePipe],
  templateUrl: './contact-modal.html',
  styleUrl: './contact-modal.scss',
})
export class ContactModal {
  protected readonly CONTACT_EMAIL = CONTACT_EMAIL;
  protected readonly CONTACT_MAILTO = CONTACT_MAILTO;
  protected readonly CONTACT_PHONE_CLIPBOARD = CONTACT_PHONE_CLIPBOARD;
  protected readonly CONTACT_PHONE_DISPLAY = CONTACT_PHONE_DISPLAY;
  protected readonly CONTACT_WHATSAPP_URL = CONTACT_WHATSAPP_URL;

  protected readonly copyFlash = signal<'email' | 'phone' | null>(null);

  protected readonly modal = inject(ContactModalService);
  private readonly bodyScroll = inject(BodyScrollLock);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private copyFlashTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.copyFlashTimer != null) {
        clearTimeout(this.copyFlashTimer);
        this.copyFlashTimer = null;
      }
    });

    effect(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      if (this.modal.isOpen()) this.bodyScroll.acquire();
      else this.bodyScroll.release();
    });

    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      const onKey = (ev: KeyboardEvent) => {
        if (ev.key !== 'Escape' || !this.modal.isOpen()) return;
        ev.preventDefault();
        ev.stopImmediatePropagation();
        this.modal.close();
      };
      document.addEventListener('keydown', onKey, true);
      this.destroyRef.onDestroy(() => document.removeEventListener('keydown', onKey, true));
    });
  }

  protected close(): void {
    this.modal.close();
  }

  /** Defer close so the browser still handles `mailto:` before the overlay unmounts. */
  protected onEmailRowClick(): void {
    setTimeout(() => this.modal.close(), 0);
  }

  protected async copyToClipboard(
    text: string,
    kind: 'email' | 'phone',
    ev: MouseEvent,
  ): Promise<void> {
    ev.preventDefault();
    ev.stopPropagation();
    if (!isPlatformBrowser(this.platformId)) return;

    const ok = await this.writeClipboard(text);
    if (!ok) return;

    if (this.copyFlashTimer != null) clearTimeout(this.copyFlashTimer);
    this.copyFlash.set(kind);
    this.copyFlashTimer = setTimeout(() => {
      this.copyFlash.set(null);
      this.copyFlashTimer = null;
    }, 2200);
  }

  private async writeClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      /* fallback below */
    }

    const doc = document;
    const ta = doc.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.top = '0';
    doc.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    try {
      return doc.execCommand('copy');
    } catch {
      return false;
    } finally {
      doc.body.removeChild(ta);
    }
  }
}
