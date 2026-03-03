import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ES } from './es';
import { EN } from './en';
import { CAT } from './cat';

export type Lang = 'es' | 'en' | 'cat';
export type Translations = typeof ES;

export interface LangOption {
  code: Lang;
  label: string;
}

/**
 * Servicio de idiomas — Gestiona el idioma activo y las traducciones.
 */
@Injectable({
  providedIn: 'root',
})
export class IdiomaService {
  /** Idiomas disponibles */
  readonly languages: LangOption[] = [
    { code: 'es', label: 'es' },
    { code: 'cat', label: 'cat' },
    { code: 'en', label: 'en' },
  ];

  /** Idioma actual */
  readonly currentLang = signal<Lang>('es');

  /** Traducciones actuales */
  readonly t = computed<Translations>(() => {
    switch (this.currentLang()) {
      case 'en':
        return EN;
      case 'cat':
        return CAT;
      default:
        return ES;
    }
  });

  constructor(private router: Router) {}

  /**
   * Cambia el idioma activo y actualiza la URL.
   */
  setLang(lang: Lang): void {
    this.currentLang.set(lang);

    // Obtener la ruta actual sin el prefijo de idioma
    const currentUrl = this.router.url;
    const cleanPath = this.stripLangPrefix(currentUrl);

    // Navegar a la nueva URL con el prefijo de idioma
    if (lang === 'es') {
      this.router.navigateByUrl(cleanPath || '/');
    } else {
      this.router.navigateByUrl(`/${lang}${cleanPath}`);
    }
  }

  /**
   * Detecta el idioma a partir de la URL actual.
   */
  detectLangFromUrl(url: string): void {
    const segments = url.split('/').filter(Boolean);
    const firstSegment = segments[0] as Lang;

    if (firstSegment === 'en' || firstSegment === 'cat') {
      this.currentLang.set(firstSegment);
    } else {
      this.currentLang.set('es');
    }
  }

  /**
   * Genera la ruta del routerLink con el prefijo de idioma.
   */
  localizeRoute(path: string): string {
    const lang = this.currentLang();
    if (lang === 'es') {
      return path;
    }
    return `/${lang}${path}`;
  }

  /**
   * Elimina el prefijo de idioma de una URL.
   */
  private stripLangPrefix(url: string): string {
    return url.replace(/^\/(en|cat)/, '') || '/';
  }
}
