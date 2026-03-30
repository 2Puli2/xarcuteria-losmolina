import { Component, signal, inject } from '@angular/core';
import { TitleComponent } from '../../shared/components/title/title';
import { SomosCharcuteriaComponent } from './somos-charcuteria/somos-charcuteria';
import { DegustacionComponent } from './degustacion/degustacion';
import { IdiomaService } from '../../../application/language/language.service';

type TabType = 'charcuteria' | 'degustacion';

@Component({
  selector: 'app-que-ofrecemos',
  imports: [TitleComponent, SomosCharcuteriaComponent, DegustacionComponent],
  templateUrl: './que-ofrecemos.html',
  styleUrl: './que-ofrecemos.scss',
})
export class QueOfrecemosComponent {
  readonly idioma = inject(IdiomaService);
  readonly activeTab = signal<TabType>('charcuteria');

  setTab(tab: TabType): void {
    this.activeTab.set(tab);
  }
}
