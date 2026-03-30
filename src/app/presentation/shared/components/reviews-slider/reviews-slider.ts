import { Component, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { IdiomaService } from '../../../../application/language/language.service';

export interface Review {
  author: string;
  text: string;
}

@Component({
  selector: 'app-reviews-slider',
  templateUrl: './reviews-slider.html',
  styleUrl: './reviews-slider.scss',
})
export class ReviewsSliderComponent implements OnInit, OnDestroy {
  readonly idioma = inject(IdiomaService);
  readonly reviews = signal<Review[]>([]);
  readonly currentReviewIndex = signal(0);
  readonly isDragging = signal(false);

  private dragStartX = 0;
  private readonly dragThreshold = 50;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.reviews.set(this.idioma.t().reviews.items as Review[]);
    this.intervalId = setInterval(() => {
      const len = this.reviews().length;
      if (len > 0) this.currentReviewIndex.set((this.currentReviewIndex() + 1) % len);
    }, 25000);
  }

  ngOnDestroy(): void {
    if (this.intervalId !== null) clearInterval(this.intervalId);
  }

  getCurrentReview(): Review | undefined {
    return this.reviews()[this.currentReviewIndex()];
  }

  onDragStart(event: MouseEvent | TouchEvent): void {
    this.isDragging.set(true);
    this.dragStartX = this.getClientX(event);
  }

  onDragMove(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging()) return;
    event.preventDefault();
  }

  onDragEnd(event?: MouseEvent | TouchEvent): void {
    if (!this.isDragging()) return;
    this.isDragging.set(false);

    if (!event) return;
    const dragDistance = this.getClientX(event) - this.dragStartX;
    const len = this.reviews().length;
    if (len === 0) return;

    if (dragDistance < -this.dragThreshold) {
      this.currentReviewIndex.set((this.currentReviewIndex() + 1) % len);
    } else if (dragDistance > this.dragThreshold) {
      this.currentReviewIndex.set((this.currentReviewIndex() - 1 + len) % len);
    }
  }

  private getClientX(event: MouseEvent | TouchEvent): number {
    if (event instanceof TouchEvent) {
      return event.touches.length > 0 ? event.touches[0].clientX : 0;
    }
    return (event as MouseEvent).clientX;
  }
}


