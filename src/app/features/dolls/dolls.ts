import { Component, inject } from '@angular/core';

import { ContactModalService } from '../../shared/contact-modal/contact-modal.service';

@Component({
  selector: 'app-dolls',
  imports: [],
  templateUrl: './dolls.html',
  styleUrl: './dolls.scss',
})
export class Dolls {
  protected readonly contactModal = inject(ContactModalService);

  protected openContactModal(): void {
    this.contactModal.open();
  }
}
