import { Component, output, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IdiomaService } from '../../../application/language/language.service';
import { LanguageSelectorComponent } from '../../shared/components/language-selector/language-selector';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, LanguageSelectorComponent],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  readonly idioma = inject(IdiomaService);
  readonly isOpen = signal(false);
  readonly scrollTo = output<string>();

  readonly navLinks = computed(() => {
    const t = this.idioma.t();
    return [
      { label: t.sidebar.home,  sectionId: 'home' },
      { label: t.sidebar.about, sectionId: 'quienes-somos' },
      { label: t.sidebar.offer, sectionId: 'que-ofrecemos' },
      { label: t.sidebar.find,  sectionId: 'ubicacion' },
    ];
  });

  open(): void  { this.isOpen.set(true); }
  close(): void { this.isOpen.set(false); }
  toggle(): void { this.isOpen.update(v => !v); }

  onNavigate(sectionId: string): void {
    this.scrollTo.emit(sectionId);
    this.close();
  }
}
