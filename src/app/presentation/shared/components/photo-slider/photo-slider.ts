import { Component, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit } from '@angular/core';
import { register } from 'swiper/element/bundle';

export interface SliderPhoto {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-photo-slider',
  templateUrl: './photo-slider.html',
  styleUrl: './photo-slider.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PhotoSliderComponent implements AfterViewInit {
  readonly photos: SliderPhoto[] = [
    { src: '/images/gallery/IMG_8843.jpg', alt: 'Charcutería Los Molina — Galería' },
    { src: '/images/gallery/IMG_9169.jpg', alt: 'Charcutería Los Molina — Galería' },
    { src: '/images/gallery/IMG_8238.jpg', alt: 'Charcutería Los Molina — Galería' },
    { src: '/images/gallery/IMG_8188.jpg', alt: 'Charcutería Los Molina — Galería' },
    { src: '/images/gallery/IMG_6074.jpg', alt: 'Charcutería Los Molina — Galería' },
    { src: '/images/gallery/IMG_3478.jpg', alt: 'Charcutería Los Molina — Galería' },
    { src: '/images/gallery/IMG_3477.jpg', alt: 'Charcutería Los Molina — Galería' },
    { src: '/images/gallery/IMG_2824.jpg', alt: 'Charcutería Los Molina — Galería' },
    { src: '/images/gallery/IMG_1676.jpg', alt: 'Charcutería Los Molina — Galería' },
    { src: '/images/gallery/IMG_1474.jpg', alt: 'Charcutería Los Molina — Galería' },
  ];

  ngAfterViewInit(): void {
    register();
  }
}
