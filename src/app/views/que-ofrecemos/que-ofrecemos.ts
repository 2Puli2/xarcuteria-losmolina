import { Component, signal } from '@angular/core';
import { TitleComponent } from '../../components/title/title';
import { SomosCharcuteriaComponent } from './somos-charcuteria/somos-charcuteria';
import { DegustacionComponent } from './degustacion/degustacion';
import { IdiomaService } from '../../idiomas/idioma.service';

type TabType = 'charcuteria' | 'degustacion';

/**
 * Vista "¿Qué ofrecemos?" — Dos pestañas: Somos Charcutería y Degustación de productos.
 */
@Component({
  selector: 'app-que-ofrecemos',
  imports: [TitleComponent, SomosCharcuteriaComponent, DegustacionComponent],
  templateUrl: './que-ofrecemos.html',
  styleUrl: './que-ofrecemos.scss',
})
export class QueOfrecemosComponent {
  readonly activeTab = signal<TabType>('charcuteria');

  constructor(readonly idioma: IdiomaService) {}

  setTab(tab: TabType): void {
    this.activeTab.set(tab);
  }
}
