import { Component } from '@angular/core';
import { TitleComponent } from '../../components/title/title';
import { PhotoSliderComponent } from '../../components/photo-slider/photo-slider';
import { ReviewsSliderComponent } from '../../components/reviews-slider/reviews-slider';
import { IdiomaService } from '../../idiomas/idioma.service';

/**
 * Vista Quiénes Somos — Historia y filosofía del restaurante con galería de fotos.
 */
@Component({
  selector: 'app-quienes-somos',
  imports: [TitleComponent, PhotoSliderComponent, ReviewsSliderComponent],
  templateUrl: './quienes-somos.html',
  styleUrl: './quienes-somos.scss',
})
export class QuienesSomosComponent {
  constructor(readonly idioma: IdiomaService) {}
}
