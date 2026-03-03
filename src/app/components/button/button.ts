import { Component, input, output } from '@angular/core';

/**
 * Componente de botón reutilizable.
 * Acepta texto, variante de estilo y emite un evento al hacer clic.
 */
@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class ButtonComponent {
  /** Texto que se muestra en el botón */
  readonly label = input.required<string>();

  /** Variante visual: 'primary' | 'secondary' | 'outline' */
  readonly variant = input<'primary' | 'secondary' | 'outline'>('primary');

  /** Evento emitido al hacer clic */
  readonly clicked = output<void>();

  onClick(): void {
    this.clicked.emit();
  }
}
