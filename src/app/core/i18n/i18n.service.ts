import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Injectable, NgZone, PLATFORM_ID, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import i18next from 'i18next';

import en from '../../../locale/en.json';
import ka from '../../../locale/ka.json';
import ru from '../../../locale/ru.json';

export const LANG_STORAGE_KEY = 'anart-lang';

export type AppLang = 'ka' | 'en' | 'ru';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly appRef = inject(ApplicationRef);

  /** Incremented when UI strings must refresh (translations / language). */
  readonly langTick = signal(0);

  readonly currentLang = signal<AppLang>('ka');

  /** Resolved after bundled dictionaries load (blocks bootstrap via APP_INITIALIZER). */
  readonly readyPromise: Promise<void>;

  constructor() {
    const lng = this.resolveInitialLang();

    i18next.on('languageChanged', () => {
      this.zone.run(() => {
        this.syncUiFromI18next();
      });
    });

    this.readyPromise = i18next
      .init({
        resources: {
          ka: { translation: ka },
          en: { translation: en },
          ru: { translation: ru },
        },
        lng,
        fallbackLng: 'ka',
        supportedLngs: ['ka', 'en', 'ru'],
        nonExplicitSupportedLngs: true,
        load: 'languageOnly',
        interpolation: { escapeValue: false },
      })
      .then(() => undefined);
  }

  changeLanguage(lng: AppLang): void {
    void i18next.changeLanguage(lng);
  }

  translate(key: string, options?: Record<string, unknown>): string {
    return i18next.t(key, options ?? {});
  }

  /** Map i18next / browser codes (e.g. ru-RU) to bundled app languages. */
  private normalizeAppLang(lng: string): AppLang {
    const base = String(lng).split(/[-_]/)[0]?.toLowerCase() ?? 'ka';
    if (base === 'en' || base === 'ru') return base;
    return 'ka';
  }

  private syncUiFromI18next(): void {
    const resolved = this.normalizeAppLang(i18next.language);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(LANG_STORAGE_KEY, resolved);
    }
    this.currentLang.set(resolved);
    this.langTick.update((n) => n + 1);
    this.applyDocumentLang(resolved);
    this.applyMetaTags();
    this.appRef.tick();
  }

  private resolveInitialLang(): AppLang {
    if (!isPlatformBrowser(this.platformId)) {
      return 'ka';
    }
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored) {
      return this.normalizeAppLang(stored);
    }
    return 'ka';
  }

  private applyDocumentLang(lng: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    document.documentElement.lang = lng === 'ka' ? 'ka' : lng;
  }

  private applyMetaTags(): void {
    this.title.setTitle(i18next.t('meta.title'));
    this.meta.updateTag({
      name: 'description',
      content: i18next.t('meta.description'),
    });
    this.meta.updateTag({
      property: 'og:title',
      content: i18next.t('meta.ogTitle'),
    });
    this.meta.updateTag({
      property: 'og:description',
      content: i18next.t('meta.ogDescription'),
    });
  }
}
