import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdiomaService } from '../../idiomas/idioma.service';

@Component({
  selector: 'app-legend',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legend.html',
  styleUrl: './legend.scss',
})
export class LegendComponent {
  idioma = inject(IdiomaService);
}
