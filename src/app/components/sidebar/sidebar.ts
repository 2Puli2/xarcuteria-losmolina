import { Component, output, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IdiomaService } from '../../idiomas/idioma.service';
import { LanguageSelectorComponent } from "../language-selector/language-selector";

/**
 * Sidebar de navegación — Menú lateral fino y elegante.
 */
@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, LanguageSelectorComponent],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  /** Estado abierto/cerrado */
  readonly isOpen = signal(false);

  /** Evento de navegación */
  readonly navigate = output<string>();

  constructor(readonly idioma: IdiomaService) {}

  /** Enlaces de navegación (reactivos al idioma) */
  readonly navLinks = computed(() => {
    const t = this.idioma.t();
    return [
      { label: t.sidebar.home, sectionId: 'home' },
      { label: t.sidebar.about, sectionId: 'quienes-somos' },
      { label: t.sidebar.offer, sectionId: 'que-ofrecemos' },
      { label: t.sidebar.find, sectionId: 'ubicacion' },
    ];
  });

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggle(): void {
    this.isOpen.update(v => !v);
  }

  onNavigate(sectionId: string): void {
    this.navigate.emit(sectionId);
    this.close();
  }
}
