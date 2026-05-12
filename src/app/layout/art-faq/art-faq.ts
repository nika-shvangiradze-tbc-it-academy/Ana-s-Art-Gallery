import { Component, inject, signal } from '@angular/core';

import { I18nService } from '../../core/i18n/i18n.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-faq',
  imports: [TranslatePipe],
  templateUrl: './art-faq.html',
  styleUrl: './art-faq.scss',
})
export class ArtFaq {
  protected readonly openId = signal<string | null>(null);

  private readonly i18n = inject(I18nService);

  /** Keys under `faq.items.{id}` in locale JSON */
  protected readonly faqIds = [
    'faq-1',
    'faq-2',
    'faq-3',
    'faq-4',
    'faq-5',
    'faq-6',
    'faq-7',
    'faq-8',
  ] as const;

  protected faqQuestionKey(id: string): string {
    void this.i18n.langTick();
    return `faq.items.${id}.question`;
  }

  protected faqAnswerKey(id: string): string {
    void this.i18n.langTick();
    return `faq.items.${id}.answer`;
  }

  protected toggle(id: string): void {
    this.openId.update((cur) => (cur === id ? null : id));
  }

  protected isOpen(id: string): boolean {
    return this.openId() === id;
  }
}
