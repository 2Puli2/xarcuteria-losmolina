import { Component, input, output } from '@angular/core';
import { IdiomaService } from '../../idiomas/idioma.service';

/**
 * Componente de flecha para indicar scroll.
 * Se usa principalmente en el hero/home para invitar al usuario a bajar.
 */
@Component({
  selector: 'app-arrow',
  templateUrl: './arrow.html',
  styleUrl: './arrow.scss',
})
export class ArrowComponent {
  /** Dirección de la flecha: 'down' | 'up' */
  readonly direction = input<'down' | 'up'>('down');

  /** Evento emitido al hacer clic */
  readonly clicked = output<void>();

  constructor(readonly idioma: IdiomaService) {}

  onClick(): void {
    this.clicked.emit();
  }
}
