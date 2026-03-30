import { Component, inject } from '@angular/core';
import { IdiomaService } from '../../../../application/language/language.service';

@Component({
  selector: 'app-legend',
  imports: [],
  templateUrl: './legend.html',
  styleUrl: './legend.scss',
})
export class LegendComponent {
  readonly idioma = inject(IdiomaService);
}
