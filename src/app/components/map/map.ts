import { Component, input } from '@angular/core';
import { SanitizerPipe } from '../../shared/pipes/sanitizer.pipe';

/**
 * Componente de mapa de Google Maps embebido.
 * Muestra la ubicación del negocio.
 */
@Component({
  selector: 'app-map',
  imports: [SanitizerPipe],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class MapComponent {
  /** Coordenadas de latitud */
  readonly latitude = input<number>(41.3381);

  /** Coordenadas de longitud */
  readonly longitude = input<number>(2.0074);

  /** Nivel de zoom del mapa */
  readonly zoom = input<number>(15);

  /** Nombre del lugar */
  readonly locationName = input<string>('Charcutería Los Molina');

  /** Dirección completa */
  readonly address = input<string>('Frederic Soler, 17, El Prat de Llobregat');

  /**
   * Genera la URL de embedición del mapa de Google.
   * Nota: Requiere API key válida
   */
  getMapUrl(): string {
    const apiKey = 'AIzaSyBnWo0NDberDpZxN84TjzZerTkTmgueEJY';
    const params = new URLSearchParams({
      key: apiKey,
      q: `${this.address()}`,
      zoom: this.zoom().toString(),
    });
    return `https://www.google.com/maps/embed/v1/place?${params.toString()}`;
  }
}
