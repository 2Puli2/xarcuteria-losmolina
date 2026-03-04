import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { IdiomaService } from '../../../idiomas/idioma.service';

export interface Brand {
  name: string;
  image: string;
  url: string;
}

/** Marcas — datos estáticos (nombres propios, no se traducen) */
export const BRANDS: Brand[] = [
  { name: 'Blázquez', image: '/images/brands/BLAZQUEZ.jpg', url: 'https://jamonesblazquez.com/' },
  { name: 'Joselito', image: '/images/brands/JOSELITO.jpg', url: 'https://www.joselito.com' },
  { name: '5 Jotas', image: '/images/brands/CINCO_JOTAS.jpg', url: 'https://www.cincojotas.com' },
  { name: 'La Selva', image: '/images/brands/LA_SELVA.png', url: 'https://www.laselva.es' },
  { name: 'Mamma Fiore', image: '/images/brands/MAMMAFIORE.jpg', url: 'https://www.mammafiore.es' },
  { name: 'García Baquero', image: '/images/brands/GARCIA_VAQUERO.png', url: 'https://www.garciabaquero.com' },
  { name: 'Flor de Esgueva', image: '/images/brands/FLOR_DE_ESGUEVA.webp', url: 'https://www.flordeesgueva.es' },
  { name: 'Can Duran', image: '/images/brands/CAN_DURAN.png', url: 'https://www.canduran.com' },
  { name: 'Salgot', image: '/images/brands/SALGOT.png', url: 'https://www.salgot.com' },
  { name: 'Casa Miró', image: '/images/brands/CASA_MIRO.jpg', url: 'https://casamiro.cat/' },
  { name: 'Idiazabal', image: '/images/brands/IDIAZABAL.jpg', url: 'https://www.quesoidiazabal.eus' },
  { name: 'Payoyo', image: '/images/brands/PAYOYO.jpg', url: 'https://www.payoyo.com' },
];

const SLIDE_INTERVAL_MS = 3000;
const FADE_DURATION_MS  = 500;

/**
 * Sub-componente "Somos Charcutería" — Descripción y carrusel de marcas.
 */
@Component({
  selector: 'app-somos-charcuteria',
  templateUrl: './somos-charcuteria.html',
  styleUrl: './somos-charcuteria.scss',
})
export class SomosCharcuteriaComponent implements OnInit, OnDestroy {
  readonly brands = BRANDS;

  /** Índice de la marca visible actualmente */
  readonly activeIndex = signal(0);

  /** Controla la visibilidad para el fade CSS */
  readonly visible = signal(true);

  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(readonly idioma: IdiomaService) {}

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      // Fade out
      this.visible.set(false);

      // Swap brand mid-fade, then fade back in
      setTimeout(() => {
        this.activeIndex.set((this.activeIndex() + 1) % this.brands.length);
        this.visible.set(true);
      }, FADE_DURATION_MS);
    }, SLIDE_INTERVAL_MS);
  }

  ngOnDestroy(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }
  }

  get currentBrand(): Brand {
    return this.brands[this.activeIndex()];
  }
}
