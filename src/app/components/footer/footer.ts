import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageSelectorComponent } from '../language-selector/language-selector';
import { IdiomaService } from '../../idiomas/idioma.service';

/**
 * Componente footer del restaurante.
 * Muestra información de contacto, copyright, redes sociales y selector de idioma.
 */
@Component({
  selector: 'app-footer',
  imports: [RouterLink, LanguageSelectorComponent],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();

  constructor(readonly idioma: IdiomaService) {}
}
