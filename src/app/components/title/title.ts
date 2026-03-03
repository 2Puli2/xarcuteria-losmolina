import { Component, input } from '@angular/core';

/**
 * Componente de título reutilizable.
 * Permite configurar el texto, nivel de heading y color.
 */
@Component({
  selector: 'app-title',
  templateUrl: './title.html',
  styleUrl: './title.scss',
})
export class TitleComponent {
  /** Texto del título */
  readonly text = input.required<string>();

  /** Subtítulo opcional */
  readonly subtitle = input<string>('');

  /** Variante de color: 'dark' | 'light' | 'primary' */
  readonly variant = input<'dark' | 'light' | 'primary'>('dark');
}
