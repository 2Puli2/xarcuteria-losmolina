import { Component } from '@angular/core';
import { IdiomaService } from '../../../idiomas/idioma.service';

/**
 * Sub-componente "Degustación de productos" — Menú de degustación por categorías.
 */
@Component({
  selector: 'app-degustacion',
  templateUrl: './degustacion.html',
  styleUrl: './degustacion.scss',
})
export class DegustacionComponent {
  constructor(readonly idioma: IdiomaService) {}
}
