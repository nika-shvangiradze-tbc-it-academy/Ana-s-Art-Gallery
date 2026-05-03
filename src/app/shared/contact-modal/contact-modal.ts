import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  DestroyRef,
  PLATFORM_ID,
  afterNextRender,
  effect,
  inject,
} from '@angular/core';

import { BodyScrollLock } from '../body-scroll-lock/body-scroll-lock';
import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  CONTACT_PHONE_DISPLAY,
  CONTACT_WHATSAPP_URL,
} from './contact-detail';
import { ContactModalService } from './contact-modal.service';

@Component({
  selector: 'app-contact-modal',
  imports: [],
  templateUrl: './contact-modal.html',
  styleUrl: './contact-modal.scss',
})
export class ContactModal {
  protected readonly CONTACT_EMAIL = CONTACT_EMAIL;
  protected readonly CONTACT_MAILTO = CONTACT_MAILTO;
  protected readonly CONTACT_PHONE_DISPLAY = CONTACT_PHONE_DISPLAY;
  protected readonly CONTACT_WHATSAPP_URL = CONTACT_WHATSAPP_URL;

  protected readonly modal = inject(ContactModalService);
  private readonly bodyScroll = inject(BodyScrollLock);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
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
}
