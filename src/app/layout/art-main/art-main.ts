import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  PLATFORM_ID,
  HostListener,
  afterNextRender,
  inject,
  DestroyRef,
  signal,
} from '@angular/core';
import { ArtAbout } from '../art-about/art-about';
import { ArtFaq } from '../art-faq/art-faq';
import { ArtFooter } from '../art-footer/art-footer';
import { Artworks } from '../../features/artworks/artworks';
import { BodyScrollLock } from '../../shared/body-scroll-lock/body-scroll-lock';
import { AppLang, I18nService } from '../../core/i18n/i18n.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { ContactModalService } from '../../shared/contact-modal/contact-modal.service';
import { RevealImage } from '../../shared/reveal-image/reveal-image';
import { Dolls } from '../../features/dolls/dolls';

@Component({
  selector: 'app-art-main',
  imports: [ArtFooter, RevealImage, Artworks, ArtAbout, Dolls, ArtFaq, TranslatePipe],
  templateUrl: './art-main.html',
  styleUrl: './art-main.scss',
})
export class ArtMain {
  protected readonly currentSlide = signal(0);
  protected readonly navOpen = signal(false);

  protected readonly i18n = inject(I18nService);

  protected readonly heroSlides = [
    '/assets/main/landing/landing-3.jpg',
    '/assets/main/landing/landing-5.jpg',
    '/assets/main/landing/landing-2.jpg',
  ];

  /** WebP sibling for hero `<picture>` (see `npm run optimize-images`). */
  protected heroLandingWebp(jpegPath: string): string {
    return jpegPath.replace(/\.(jpe?g)$/i, '.webp');
  }

  protected readonly heroImgSizes = '100vw';
  readonly heroImgDims = { w: 1920, h: 1080 } as const;

  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly bodyScrollLock = inject(BodyScrollLock);
  private readonly contactModal = inject(ContactModalService);

  protected openHeroContact(ev: MouseEvent): void {
    ev.preventDefault();
    this.contactModal.open();
    this.closeNav();
  }

  protected setLang(lng: AppLang): void {
    this.i18n.changeLanguage(lng);
  }

  constructor() {
    const len = this.heroSlides.length;
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      const slideTimerId = setInterval(() => {
        this.currentSlide.update((n) => (n + 1) % len);
      }, 5000);
      this.destroyRef.onDestroy(() => clearInterval(slideTimerId));
    });
    this.destroyRef.onDestroy(() => {
      if (this.navOpen()) {
        this.bodyScrollLock.release();
      }
    });
  }

  protected toggleNav(): void {
    const next = !this.navOpen();
    if (next) {
      this.bodyScrollLock.acquire();
    } else {
      this.bodyScrollLock.release();
    }
    this.navOpen.set(next);
  }

  protected closeNav(): void {
    if (!this.navOpen()) return;
    this.bodyScrollLock.release();
    this.navOpen.set(false);
  }

  @HostListener('document:keydown', ['$event'])
  protected onDocumentKey(ev: KeyboardEvent): void {
    if (ev.key === 'Escape' && this.navOpen()) {
      ev.preventDefault();
      this.closeNav();
    }
  }

}
