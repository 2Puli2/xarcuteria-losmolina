import { Component, signal, OnInit } from '@angular/core';
import { IdiomaService } from '../../idiomas/idioma.service';

export interface Review {
  author: string;
  rating: number;
  text: string;
}

/**
 * Componente slider de reseñas.
 * Carga reseñas desde datos mockeados.
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
    readonly idioma: IdiomaService,
  ) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  private loadReviews(): void {
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

