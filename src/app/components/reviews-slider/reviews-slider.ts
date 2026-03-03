import { Component, signal, OnInit } from '@angular/core';
import { IdiomaService } from '../../idiomas/idioma.service';

export interface Review {
  author: string;
  text: string;
}

/**
 * Componente slider de reseñas.
 * Carga reseñas desde datos mockeados y permite navegación mediante arrastrado.
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

  /** Indica si se está arrastrando */
  readonly isDragging = signal(false);

  /** Posición inicial del arrastrado */
  private dragStartX = 0;

  /** Mínima distancia de arrastrado para cambiar de reseña (px) */
  private dragThreshold = 50;

  constructor(
    readonly idioma: IdiomaService,
  ) {}

  ngOnInit(): void {
    this.loadReviews();
    setInterval(() => {
      const len = this.reviews().length;
      if (len > 0) {
        this.currentReviewIndex.set((this.currentReviewIndex() + 1) % len);
      }
    }, 25000);
  }

  private loadReviews(): void {
    this.reviews.set(this.idioma.t().reviews.items as Review[]);
  }

  getCurrentReview(): Review | undefined {
    return this.reviews()[this.currentReviewIndex()];
  }

  /**
   * Inicia el arrastrado
   */
  onDragStart(event: MouseEvent | TouchEvent): void {
    this.isDragging.set(true);
    this.dragStartX = this.getClientX(event);
  }

  /**
   * Maneja el movimiento durante el arrastrado
   */
  onDragMove(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging()) return;
    event.preventDefault();
  }

  /**
   * Finaliza el arrastrado
   */
  onDragEnd(): void {
    this.isDragging.set(false);
  }

  /**
   * Finaliza el arrastrado calculando la dirección
   */
  onDragEndCalculate(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging()) return;
    
    this.isDragging.set(false);
    const endX = this.getClientX(event);
    const dragDistance = endX - this.dragStartX;
    const len = this.reviews().length;

    if (len === 0) return;

    // Si se arrastra hacia la izquierda (distancia negativa), ir a la siguiente
    if (dragDistance < -this.dragThreshold) {
      this.currentReviewIndex.set((this.currentReviewIndex() + 1) % len);
    }
    // Si se arrastra hacia la derecha (distancia positiva), ir a la anterior
    else if (dragDistance > this.dragThreshold) {
      this.currentReviewIndex.set(
        (this.currentReviewIndex() - 1 + len) % len
      );
    }
  }

  /**
   * Obtiene la coordenada X del evento (compatible con mouse y touch)
   */
  private getClientX(event: MouseEvent | TouchEvent): number {
    if (event instanceof TouchEvent) {
      return event.touches.length > 0 ? event.touches[0].clientX : 0;
    }
    return (event as MouseEvent).clientX;
  }
}


