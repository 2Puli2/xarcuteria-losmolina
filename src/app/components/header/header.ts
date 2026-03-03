import { Component, input, output } from '@angular/core';
import { LogoComponent } from '../logo/logo';
import { IdiomaService } from '../../idiomas/idioma.service';

/**
 * Componente header fijo del restaurante.
 * Muestra el logo en formato reducido y botón hamburguesa.
 */
@Component({
  selector: 'app-header',
  imports: [LogoComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  /** Controla si el header está en animación de ocultamiento */
  readonly hiding = input(false);

  /** Evento para abrir el sidebar */
  readonly openSidebar = output<void>();

  constructor(readonly idioma: IdiomaService) {}
}
