import {
  Component,
  ChangeDetectorRef,
  ElementRef,
  HostBinding,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-reveal-image',
  imports: [],
  templateUrl: './reveal-image.html',
  styleUrl: './reveal-image.scss',
})
export class RevealImage {
  /** `<img>` fallback (optimized JPEG recommended — run `npm run optimize-images`). */
  readonly src = input.required<string>();
  /** WebP candidate for `<source type="image/webp">` (browser skips if unsupported). */
  readonly webpSrc = input<string | undefined>(undefined);
  readonly alt = input.required<string>();
  readonly width = input.required<number>();
  readonly height = input.required<number>();
  readonly sizes = input<string>('');
  readonly loading = input<'lazy' | 'eager'>('lazy');
  readonly fetchPriority = input<'high' | 'low' | 'auto'>('auto');
  readonly fit = input<'cover' | 'contain'>('cover');

  protected readonly loaded = signal(false);

  protected readonly pictureWebp = computed(() => {
    const w = this.webpSrc()?.trim();
    return w?.length ? w : null;
  });

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly imgEl = viewChild<ElementRef<HTMLImageElement>>('imgEl');

  constructor() {
    afterNextRender(() => {
      requestAnimationFrame(() => this.syncAlreadyComplete());
    });
  }

  private syncAlreadyComplete(): void {
    const el = this.imgEl()?.nativeElement;
    if (el?.complete && el.naturalWidth > 0) {
      this.loaded.set(true);
      this.cdr.markForCheck();
    }
  }

  @HostBinding('class.reveal-image')
  protected readonly revealImageBase = true;

  @HostBinding('class.reveal-image--loaded')
  protected get loadedClass(): boolean {
    return this.loaded();
  }

  protected onImgLoad(): void {
    this.loaded.set(true);
    this.cdr.markForCheck();
  }

  protected onImgError(): void {
    this.loaded.set(true);
    this.cdr.markForCheck();
  }
}
