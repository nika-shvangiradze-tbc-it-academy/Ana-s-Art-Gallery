import { Component, inject } from '@angular/core';

import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { ContactModalService } from '../../shared/contact-modal/contact-modal.service';

@Component({
  selector: 'app-dolls',
  imports: [TranslatePipe],
  templateUrl: './dolls.html',
  styleUrl: './dolls.scss',
})
export class Dolls {
  protected readonly contactModal = inject(ContactModalService);

  protected openContactModal(): void {
    this.contactModal.open();
  }
}
