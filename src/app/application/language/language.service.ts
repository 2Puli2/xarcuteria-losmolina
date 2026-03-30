import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ES } from './translations/es';
import { EN } from './translations/en';
import { CAT } from './translations/cat';

export type Lang = 'es' | 'en' | 'cat';
export type Translations = typeof ES;

export interface LangOption {
  code: Lang;
  label: string;
}

@Injectable({
  providedIn: 'root',
})
export class IdiomaService {
  private readonly router = inject(Router);

  readonly languages: LangOption[] = [
    { code: 'es', label: 'es' },
    { code: 'cat', label: 'cat' },
    { code: 'en', label: 'en' },
  ];

  readonly currentLang = signal<Lang>('es');

  readonly t = computed<Translations>(() => {
    switch (this.currentLang()) {
      case 'en':  return EN;
      case 'cat': return CAT;
      default:    return ES;
    }
  });

  setLang(lang: Lang): void {
    this.currentLang.set(lang);
    const cleanPath = this.stripLangPrefix(this.router.url);
    if (lang === 'es') {
      this.router.navigateByUrl(cleanPath || '/');
    } else {
      this.router.navigateByUrl(`/${lang}${cleanPath}`);
    }
  }

  detectLangFromUrl(url: string): void {
    const firstSegment = url.split('/').filter(Boolean)[0] as Lang;
    if (firstSegment === 'en' || firstSegment === 'cat') {
      this.currentLang.set(firstSegment);
    } else {
      this.currentLang.set('es');
    }
  }

  localizeRoute(path: string): string {
    const lang = this.currentLang();
    return lang === 'es' ? path : `/${lang}${path}`;
  }

  private stripLangPrefix(url: string): string {
    return url.replace(/^\/(en|cat)/, '') || '/';
  }
}
