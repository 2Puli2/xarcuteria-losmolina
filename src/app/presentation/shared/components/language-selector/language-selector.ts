import { Component, HostListener, signal, inject } from '@angular/core';
import { IdiomaService, Lang } from '../../../../application/language/language.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  templateUrl: './language-selector.html',
  styleUrl: './language-selector.scss',
})
export class LanguageSelectorComponent {
  readonly idioma = inject(IdiomaService);
  readonly isOpen = signal(false);

  toggle(): void { this.isOpen.update(v => !v); }
  close(): void  { this.isOpen.set(false); }

  selectLang(lang: Lang): void {
    this.idioma.setLang(lang);
    this.close();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!(event.target as HTMLElement).closest('.lang-selector')) {
      this.close();
    }
  }
}
