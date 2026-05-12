import { Component } from '@angular/core';

import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-art-header',
  imports: [TranslatePipe],
  templateUrl: './art-header.html',
  styleUrl: './art-header.scss',
})
export class ArtHeader {}
