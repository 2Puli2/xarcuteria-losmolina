import { Component, HostListener, signal, computed } from '@angular/core';
import { IdiomaService, Lang } from '../../idiomas/idioma.service';

/**
 * Selector de idioma — Desplegable con banderas.
 */
@Component({
  selector: 'app-language-selector',
  standalone: true,
  templateUrl: './language-selector.html',
  styleUrl: './language-selector.scss',
})
export class LanguageSelectorComponent {
  readonly isOpen = signal(false);

  constructor(readonly idioma: IdiomaService) {}

  toggle(): void {
    this.isOpen.update((v) => !v);
  }

  close(): void {
    this.isOpen.set(false);
  }

  selectLang(lang: Lang): void {
    this.idioma.setLang(lang);
    this.close();
  }

  /** Cierra el dropdown al hacer clic fuera */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.lang-selector')) {
      this.close();
    }
  }
}
