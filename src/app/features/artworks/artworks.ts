import {
  Component,
  HostListener,
  computed,
  inject,
  DestroyRef,
  signal,
} from '@angular/core';
import { BodyScrollLock } from '../../shared/body-scroll-lock/body-scroll-lock';
import { ContactModalService } from '../../shared/contact-modal/contact-modal.service';
import { RevealImage } from '../../shared/reveal-image/reveal-image';
import { GALLERY_ARTWORKS } from './gallery-artwork';

@Component({
  selector: 'app-artworks',
  imports: [RevealImage],
  templateUrl: './artworks.html',
  styleUrl: './artworks.scss',
})
export class Artworks {
  protected readonly artworks = GALLERY_ARTWORKS;
  protected readonly lightboxIndex = signal<number | null>(null);

  protected readonly lightboxArtwork = computed(() => {
    const i = this.lightboxIndex();
    if (i === null) return null;
    return this.artworks[i] ?? null;
  });

  protected readonly galleryImgSizes =
    '(max-width: 520px) 88vw, (max-width: 900px) 44vw, 260px';

  private readonly galleryPageSize = 8;
  protected readonly galleryPage = signal(0);

  protected readonly galleryPageCount = computed(() =>
    Math.max(1, Math.ceil(this.artworks.length / this.galleryPageSize)),
  );

  protected readonly galleryPagerVisible = computed(
    () => this.artworks.length > this.galleryPageSize,
  );

  protected readonly galleryVisible = computed(() => {
    const start = this.galleryPage() * this.galleryPageSize;
    return this.artworks.slice(start, start + this.galleryPageSize).map((artwork, i) => {
      const index = start + i;
      return {
        artwork,
        index,
        key: `gallery-slot-${index}`,
      };
    });
  });

  /** Intrinsic size for thumbnails (matches ~520w WebP thumb, 4:3). */
  readonly galleryThumbDims = { w: 520, h: 390 } as const;
  /** Lightbox intrinsic hint (optimized WebP capped ~1280w). */
  readonly lightboxImgDims = { w: 1280, h: 960 } as const;

  /** Grid: small WebP; falls back to original JPEG if variants missing (e.g. before `optimize-images`). */
  protected thumbWebp(canonicalSrc: string): string {
    return canonicalSrc.replace(/\.(jpe?g)$/i, '-thumb.webp');
  }

  /** Lightbox / full-quality WebP beside JPEG original. */
  protected displayWebp(canonicalSrc: string): string {
    if (/\.webp$/i.test(canonicalSrc)) return canonicalSrc;
    return canonicalSrc.replace(/\.(jpe?g)$/i, '.webp');
  }

  private readonly destroyRef = inject(DestroyRef);
  private readonly bodyScrollLock = inject(BodyScrollLock);
  protected readonly contactModal = inject(ContactModalService);

  protected openContactModal(): void {
    this.contactModal.open();
  }

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.lightboxIndex() !== null) {
        this.bodyScrollLock.release();
      }
    });
  }

  protected galleryPagerNext(): void {
    const last = this.galleryPageCount() - 1;
    this.galleryPage.update((p) => Math.min(last, p + 1));
  }

  protected galleryPagerPrev(): void {
    this.galleryPage.update((p) => Math.max(0, p - 1));
  }

  protected openLightbox(index: number): void {
    if (this.lightboxIndex() === null) {
      this.bodyScrollLock.acquire();
    }
    this.lightboxIndex.set(index);
  }

  protected closeLightbox(): void {
    if (this.lightboxIndex() === null) return;
    this.lightboxIndex.set(null);
    this.bodyScrollLock.release();
  }

  protected lightboxNext(): void {
    const i = this.lightboxIndex();
    if (i === null) return;
    this.lightboxIndex.set((i + 1) % this.artworks.length);
  }

  protected lightboxPrev(): void {
    const i = this.lightboxIndex();
    if (i === null) return;
    const len = this.artworks.length;
    this.lightboxIndex.set((i - 1 + len) % len);
  }

  @HostListener('document:keydown', ['$event'])
  protected onDocumentKey(ev: KeyboardEvent): void {
    if (this.lightboxIndex() === null) return;
    switch (ev.key) {
      case 'Escape':
        ev.preventDefault();
        this.closeLightbox();
        return;
      case 'ArrowRight':
        if (this.artworks.length > 1) {
          ev.preventDefault();
          this.lightboxNext();
        }
        return;
      case 'ArrowLeft':
        if (this.artworks.length > 1) {
          ev.preventDefault();
          this.lightboxPrev();
        }
        return;
      default:
    }
  }

}
