import { Component, output } from '@angular/core';
import { LogoComponent } from '../../components/logo/logo';
import { ButtonComponent } from '../../components/button/button';
import { ArrowComponent } from '../../components/arrow/arrow';
import { IdiomaService } from '../../idiomas/idioma.service';
import { LanguageSelectorComponent } from '../../components/language-selector/language-selector';

/**
 * Vista Home — Hero principal del restaurante.
 * Muestra el logo y los botones de navegación.
 */
@Component({
  selector: 'app-home',
  imports: [LogoComponent, ButtonComponent, ArrowComponent, LanguageSelectorComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  /** Evento que emite el id de la sección a la que hacer scroll */
  readonly scrollTo = output<string>();

  constructor(readonly idioma: IdiomaService) {}

  navigateTo(sectionId: string): void {
    this.scrollTo.emit(sectionId);
  }
}
