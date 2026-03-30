import { Component, output, inject } from '@angular/core';
import { LogoComponent } from '../../shared/components/logo/logo';
import { ButtonComponent } from '../../shared/components/button/button';
import { ArrowComponent } from '../../shared/components/arrow/arrow';
import { IdiomaService } from '../../../application/language/language.service';
import { LanguageSelectorComponent } from '../../shared/components/language-selector/language-selector';

@Component({
  selector: 'app-home',
  imports: [LogoComponent, ButtonComponent, ArrowComponent, LanguageSelectorComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  readonly idioma = inject(IdiomaService);
  readonly scrollTo = output<string>();

  navigateTo(sectionId: string): void {
    this.scrollTo.emit(sectionId);
  }
}
