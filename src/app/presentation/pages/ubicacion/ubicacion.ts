import { Component, inject } from '@angular/core';
import { TitleComponent } from '../../shared/components/title/title';
import { MapComponent } from '../../shared/components/map/map';
import { IdiomaService } from '../../../application/language/language.service';

@Component({
  selector: 'app-ubicacion',
  imports: [TitleComponent, MapComponent],
  templateUrl: './ubicacion.html',
  styleUrl: './ubicacion.scss',
})
export class UbicacionComponent {
  readonly idioma = inject(IdiomaService);
}
