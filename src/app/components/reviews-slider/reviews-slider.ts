import { Component, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GooglePlacesService, GoogleReview } from '../../shared/services/google-places.service';
import { IdiomaService } from '../../idiomas/idioma.service';

export interface Review {
  author: string;
  rating: number;
  text: string;
  date: string;
}

/**
 * Componente slider de reseñas positivas.
 * Carga reseñas reales desde Google Places API (con fallback a traducciones locales).
 */
@Component({
  selector: 'app-reviews-slider',
  templateUrl: './reviews-slider.html',
  styleUrl: './reviews-slider.scss',
})
export class ReviewsSliderComponent implements OnInit {
  /** Señal con las reseñas */
  readonly reviews = signal<Review[]>([]);

  /** Índice de la reseña actualmente mostrada */
  readonly currentReviewIndex = signal(0);

  constructor(
    private http: HttpClient,
    private googlePlacesService: GooglePlacesService,
    readonly idioma: IdiomaService,
  ) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  private loadReviews(): void {
    this.googlePlacesService.getBusinessReviews().subscribe({
      next: (googleReviews: GoogleReview[]) => {
        if (googleReviews.length > 0) {
          const reviews: Review[] = googleReviews.map((gr) => ({
            author: gr.author_name,
            rating: gr.rating,
            text: gr.text,
            date: gr.relative_time_description,
          }));
          this.reviews.set(reviews);
        } else {
          this.useLocalReviews();
        }
      },
      error: () => this.useLocalReviews(),
    });
  }

  /** Usa las reseñas del archivo de traducciones como fallback */
  private useLocalReviews(): void {
    this.reviews.set(this.idioma.t().reviews.items as Review[]);
  }

  getCurrentReview(): Review | undefined {
    return this.reviews()[this.currentReviewIndex()];
  }

  nextReview(): void {
    const len = this.reviews().length;
    if (len > 0) {
      this.currentReviewIndex.set((this.currentReviewIndex() + 1) % len);
    }
  }

  previousReview(): void {
    const len = this.reviews().length;
    if (len > 0) {
      this.currentReviewIndex.set((this.currentReviewIndex() - 1 + len) % len);
    }
  }

  getStars(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => (i < rating ? 1 : 0));
  }
}
