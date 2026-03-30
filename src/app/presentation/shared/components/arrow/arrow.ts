import { Component, input, output, inject } from '@angular/core';
import { IdiomaService } from '../../../../application/language/language.service';

@Component({
  selector: 'app-arrow',
  templateUrl: './arrow.html',
  styleUrl: './arrow.scss',
})
export class ArrowComponent {
  readonly idioma = inject(IdiomaService);
  readonly direction = input<'down' | 'up'>('down');
  readonly clicked = output<void>();

  onClick(): void {
    this.clicked.emit();
  }
}
