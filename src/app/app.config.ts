import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { I18nService } from './core/i18n/i18n.service';
import { routes } from './app.routes';

function i18nInitializer(i18n: I18nService): () => Promise<void> {
  return () => i18n.readyPromise;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: i18nInitializer,
      deps: [I18nService],
      multi: true,
    },
  ],
};
