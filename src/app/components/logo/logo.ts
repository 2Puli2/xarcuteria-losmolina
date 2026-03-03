import { Component, input } from '@angular/core';
import { IdiomaService } from '../../idiomas/idioma.service';

/**
 * Componente del logo del restaurante.
 * Muestra el nombre estilizado y un subtítulo.
 */
@Component({
  selector: 'app-logo',
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
})
export class LogoComponent {
  /** Tamaño del logo: 'sm' | 'md' | 'lg' */
  readonly size = input<'sm' | 'md' | 'lg'>('lg');

  constructor(readonly idioma: IdiomaService) {}
}
