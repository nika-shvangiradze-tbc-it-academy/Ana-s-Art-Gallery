import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  PLATFORM_ID,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { ArtMain } from './layout/art-main/art-main';
import { SitePreloader } from './layout/site-preloader/site-preloader';
import { ContactModal } from './shared/contact-modal/contact-modal';

type PreloaderPhase = 'show' | 'fading' | 'gone';

@Component({
  selector: 'app-root',
  imports: [ArtMain, SitePreloader, ContactModal],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly preloaderPhase = signal<PreloaderPhase>('show');

  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        this.preloaderPhase.set('gone');
        return;
      }

    
      const nodeEnv = (
        globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }
      ).process?.env?.['VITEST'];
      if (nodeEnv === 'true') {
        this.preloaderPhase.set('gone');
        return;
      }

      const minMs = 420;
      const capMs = 2200;
      const t0 = performance.now();

      const waitLoad = new Promise<void>((resolve) => {
        if (document.readyState === 'complete') resolve();
        else window.addEventListener('load', () => resolve(), { once: true });
      });

      void Promise.race([
        waitLoad,
        new Promise<void>((r) => setTimeout(r, capMs)),
      ]).then(() => {
        const elapsed = performance.now() - t0;
        const waitRemain = Math.max(0, minMs - elapsed);
        window.setTimeout(() => this.preloaderPhase.set('fading'), waitRemain);
      });
    });
  }

  protected onPreloaderFaded(): void {
    this.preloaderPhase.set('gone');
  }
}
