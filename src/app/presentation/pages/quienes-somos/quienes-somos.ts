import { Component, inject } from '@angular/core';
import { TitleComponent } from '../../shared/components/title/title';
import { PhotoSliderComponent } from '../../shared/components/photo-slider/photo-slider';
import { ReviewsSliderComponent } from '../../shared/components/reviews-slider/reviews-slider';
import { IdiomaService } from '../../../application/language/language.service';

@Component({
  selector: 'app-quienes-somos',
  imports: [TitleComponent, PhotoSliderComponent, ReviewsSliderComponent],
  templateUrl: './quienes-somos.html',
  styleUrl: './quienes-somos.scss',
})
export class QuienesSomosComponent {
  readonly idioma = inject(IdiomaService);
}
