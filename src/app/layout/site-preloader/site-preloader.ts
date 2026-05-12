import { Component, ElementRef, HostBinding, HostListener, inject, input, output } from '@angular/core';

import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-site-preloader',
  imports: [TranslatePipe],
  templateUrl: './site-preloader.html',
  styleUrl: './site-preloader.scss',
})
export class SitePreloader {
  readonly exiting = input(false);
  readonly faded = output<void>();

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  @HostBinding('class.site-preloader--exiting')
  get exitingClass(): boolean {
    return this.exiting();
  }

  @HostBinding('attr.role')
  protected readonly role = 'status';

  @HostBinding('attr.aria-live')
  protected readonly ariaLive = 'polite';

  @HostBinding('attr.aria-busy')
  get ariaBusy(): boolean {
    return !this.exiting();
  }

  @HostListener('transitionend', ['$event'])
  protected onHostTransitionEnd(ev: TransitionEvent): void {
    if (!this.exiting()) return;
    if (ev.propertyName !== 'opacity') return;
    if (ev.target !== this.el.nativeElement) return;
    this.faded.emit();
  }
}
