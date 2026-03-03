import { Component } from '@angular/core';
import { TitleComponent } from '../../components/title/title';
import { MapComponent } from '../../components/map/map';
import { IdiomaService } from '../../idiomas/idioma.service';

/**
 * Vista Ubicación — Información de contacto, localización y reseñas.
 */
@Component({
  selector: 'app-ubicacion',
  imports: [TitleComponent, MapComponent],
  templateUrl: './ubicacion.html',
  styleUrl: './ubicacion.scss',
})
export class UbicacionComponent {
  constructor(readonly idioma: IdiomaService) {}
}
