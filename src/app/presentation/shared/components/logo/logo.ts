import { Component, input, inject } from '@angular/core';
import { IdiomaService } from '../../../../application/language/language.service';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
})
export class LogoComponent {
  readonly idioma = inject(IdiomaService);
  readonly size = input<'sm' | 'md' | 'lg'>('lg');
}
