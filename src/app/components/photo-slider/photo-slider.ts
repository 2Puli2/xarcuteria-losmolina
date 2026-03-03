import { Component, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit } from '@angular/core';
import { register } from 'swiper/element/bundle';

export interface SliderPhoto {
  src: string;
  alt: string;
}

/**
 * Componente slider de fotos con Swiper.
 * Carrusel táctil con autoplay, paginación y navegación.
 */
@Component({
  selector: 'app-photo-slider',
  templateUrl: './photo-slider.html',
  styleUrl: './photo-slider.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PhotoSliderComponent implements AfterViewInit {
  /** Lista de fotos del slider */
  readonly photos: SliderPhoto[] = [
    { src: '/images/gallery/IMG_0046.jpg', alt: 'Charcutería Los Molina — Galería 1' },
    { src: '/images/gallery/IMG_1474.jpg', alt: 'Charcutería Los Molina — Galería 2' },
    { src: '/images/gallery/IMG_1676.jpg', alt: 'Charcutería Los Molina — Galería 3' },
    { src: '/images/gallery/IMG_2823.jpg', alt: 'Charcutería Los Molina — Galería 4' },
    { src: '/images/gallery/IMG_8238.jpg', alt: 'Charcutería Los Molina — Galería 5' },
    { src: '/images/gallery/IMG_8843.jpg', alt: 'Charcutería Los Molina — Galería 6' },
  ];

  ngAfterViewInit(): void {
    register();
  }
}
