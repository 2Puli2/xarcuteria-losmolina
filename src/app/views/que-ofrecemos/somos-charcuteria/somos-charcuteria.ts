import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { IdiomaService } from '../../../idiomas/idioma.service';

export interface Brand {
  name: string;
  image: string;
  url: string;
  key: keyof ReturnType<IdiomaService['t']>['offer']['brandDescriptions'];
}

/** Marcas — datos estáticos (nombres propios, no se traducen) */
export const BRANDS: Brand[] = [
  { name: 'Blázquez',      image: '/images/brands/BLAZQUEZ.jpg',     url: 'https://jamonesblazquez.com/', key: 'blazquez' },
  { name: 'Joselito',      image: '/images/brands/JOSELITO.jpg',     url: 'https://www.joselito.com',     key: 'joselito' },
  { name: '5 Jotas',       image: '/images/brands/CINCO_JOTAS.jpg',  url: 'https://www.cincojotas.com',   key: 'cinco_jotas' },
  { name: 'La Selva',      image: '/images/brands/LA_SELVA.png',     url: 'https://www.laselva.es',       key: 'la_selva' },
  { name: 'Mamma Fiore',   image: '/images/brands/MAMMAFIORE.jpg',   url: 'https://www.mammafiore.es',    key: 'mamma_fiore' },
  { name: 'García Baquero',image: '/images/brands/GARCIA_VAQUERO.png', url: 'https://www.garciabaquero.com', key: 'garcia_baquero' },
  { name: 'Flor de Esgueva', image: '/images/brands/FLOR_DE_ESGUEVA.webp', url: 'https://www.flordeesgueva.es', key: 'flor_de_esgueva' },
  { name: 'Can Duran',     image: '/images/brands/CAN_DURAN.png',   url: 'https://www.canduran.com',     key: 'can_duran' },
  { name: 'Salgot',        image: '/images/brands/SALGOT.png',      url: 'https://www.salgot.com',       key: 'salgot' },
  { name: 'Casa Miró',     image: '/images/brands/CASA_MIRO.jpg',   url: 'https://casamiro.cat/',        key: 'casa_miro' },
  { name: 'Idiazabal',     image: '/images/brands/IDIAZABAL.jpg',   url: 'https://www.quesoidiazabal.eus', key: 'idiazabal' },
  { name: 'Payoyo',        image: '/images/brands/PAYOYO.jpg',      url: 'https://www.payoyo.com',       key: 'payoyo' },
];

const SLIDE_INTERVAL_MS = 20000;
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

  /** Navegar a la siguiente marca con animación fade */
  next(): void {
    this.visible.set(false);
    setTimeout(() => {
      this.activeIndex.set((this.activeIndex() + 1) % this.brands.length);
      this.visible.set(true);
    }, FADE_DURATION_MS);
  }

  /** Navegar a la marca anterior con animación fade */
  prev(): void {
    this.visible.set(false);
    setTimeout(() => {
      this.activeIndex.set((this.activeIndex() - 1 + this.brands.length) % this.brands.length);
      this.visible.set(true);
    }, FADE_DURATION_MS);
  }

  get currentBrand(): Brand {
    return this.brands[this.activeIndex()];
  }
}
