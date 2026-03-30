import { Component, inject } from '@angular/core';
import { IdiomaService } from '../../../../application/language/language.service';

@Component({
  selector: 'app-degustacion',
  templateUrl: './degustacion.html',
  styleUrl: './degustacion.scss',
})
export class DegustacionComponent {
  readonly idioma = inject(IdiomaService);
}
