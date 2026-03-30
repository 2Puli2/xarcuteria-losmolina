import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageSelectorComponent } from '../../shared/components/language-selector/language-selector';
import { IdiomaService } from '../../../application/language/language.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, LanguageSelectorComponent],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class FooterComponent {
  readonly idioma = inject(IdiomaService);
  readonly currentYear = new Date().getFullYear();
}
