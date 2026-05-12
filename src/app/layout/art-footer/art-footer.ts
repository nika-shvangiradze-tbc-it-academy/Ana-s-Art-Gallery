import { Component } from '@angular/core';

import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-art-footer',
  imports: [TranslatePipe],
  templateUrl: './art-footer.html',
  styleUrl: './art-footer.scss',
})
export class ArtFooter {}
