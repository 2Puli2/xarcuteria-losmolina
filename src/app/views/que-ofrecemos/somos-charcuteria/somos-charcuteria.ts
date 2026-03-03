import { Component } from '@angular/core';
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

/**
 * Sub-componente "Somos Charcutería" — Descripción y marcas.
 */
@Component({
  selector: 'app-somos-charcuteria',
  templateUrl: './somos-charcuteria.html',
  styleUrl: './somos-charcuteria.scss',
})
export class SomosCharcuteriaComponent {
  readonly brands = BRANDS;
  constructor(readonly idioma: IdiomaService) {}
}
