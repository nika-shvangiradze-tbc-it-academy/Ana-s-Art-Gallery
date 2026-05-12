import { Component } from '@angular/core';

import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-about',
  imports: [TranslatePipe],
  templateUrl: './art-about.html',
  styleUrl: './art-about.scss',
})
export class ArtAbout {}
