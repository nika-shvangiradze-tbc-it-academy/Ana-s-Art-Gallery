import { Pipe, PipeTransform, inject } from '@angular/core';
import i18next from 'i18next';

import { I18nService } from './i18n.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(key: string, options?: Record<string, unknown>): string {
    this.i18n.langTick();
    return i18next.t(key, options ?? {});
  }
}
