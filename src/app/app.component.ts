import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { TranslationService } from './services/translation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  constructor(
    private readonly themeService: ThemeService,
    private readonly translationService: TranslationService
  ) {
    this.themeService.initializeTheme();
    this.translationService.initializeLanguage();
  }
}
