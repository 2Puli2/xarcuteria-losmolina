import { Component, input } from '@angular/core';
import { SanitizerPipe } from '../../../../infrastructure/pipes/sanitizer.pipe';

@Component({
  selector: 'app-map',
  imports: [SanitizerPipe],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class MapComponent {
  readonly latitude     = input<number>(41.3381);
  readonly longitude    = input<number>(2.0074);
  readonly zoom         = input<number>(15);
  readonly locationName = input<string>('Charcutería Los Molina');
  readonly address      = input<string>('Frederic Soler, 17, El Prat de Llobregat');

  getMapUrl(): string {
    const apiKey = 'AIzaSyBnWo0NDberDpZxN84TjzZerTkTmgueEJY';
    const params = new URLSearchParams({
      key: apiKey,
      q: this.address(),
      zoom: this.zoom().toString(),
    });
    return `https://www.google.com/maps/embed/v1/place?${params.toString()}`;
  }
}
