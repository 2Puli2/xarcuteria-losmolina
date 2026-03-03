import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Lang } from '../idiomas/idioma.service';

const DOMAIN = 'https://www.xarcuterialosmolina.com';

export type SeoPage = 'home' | 'trabaja';

interface SeoData {
  title: string;
  description: string;
  htmlLang: string;
  canonical: string;
  ogLocale: string;
}

const SEO_BY_LANG: Record<Lang, SeoData> = {
  es: {
    title:
      'Xarcuteria Los Molina — Charcutería en El Prat de Llobregat | Jamón Ibérico y Bocadillos',
    description:
      'Charcutería Los Molina: jamón ibérico, jamón de bellota, embutido ibérico, queso manchego y bocadillos artesanales en El Prat de Llobregat. Marcas Joselito y Cinco Jotas. Frederic Soler, 17.',
    htmlLang: 'es',
    canonical: DOMAIN + '/',
    ogLocale: 'es_ES',
  },
  en: {
    title:
      'Xarcuteria Los Molina — Charcuterie in El Prat de Llobregat | Iberian Ham & Sandwiches',
    description:
      'Xarcuteria Los Molina: Iberian ham, bellota ham, Iberian cold cuts, manchego cheese and artisan sandwiches in El Prat de Llobregat (Barcelona). Joselito & Cinco Jotas. Frederic Soler, 17.',
    htmlLang: 'en',
    canonical: DOMAIN + '/en',
    ogLocale: 'en_GB',
  },
  cat: {
    title:
      'Xarcuteria Los Molina — Xarcuteria al Prat de Llobregat | Pernil Ibèric i Entrepans',
    description:
      "Xarcuteria Los Molina: pernil ibèric, pernil de gla, embotit ibèric, formatge manchego i entrepans artesans al Prat de Llobregat. Joselito i Cinco Jotas. Frederic Soler, 17.",
    htmlLang: 'ca',
    canonical: DOMAIN + '/cat',
    ogLocale: 'ca_ES',
  },
};

const TRABAJA_TITLE: Record<Lang, string> = {
  es: 'Trabaja con nosotros — Xarcuteria Los Molina',
  en: 'Work with us — Xarcuteria Los Molina',
  cat: 'Treballa amb nosaltres — Xarcuteria Los Molina',
};

const TRABAJA_DESC: Record<Lang, string> = {
  es: '¿Te apasiona la charcutería ibérica y el trato con el cliente? Únete al equipo de Xarcuteria Los Molina en El Prat de Llobregat.',
  en: 'Passionate about Iberian charcuterie and customer care? Join the Xarcuteria Los Molina team in El Prat de Llobregat.',
  cat: "T'apassiona la xarcuteria ibèrica i el tracte amb els clients? Uneix-te a l'equip de Xarcuteria Los Molina al Prat de Llobregat.",
};

/**
 * Servicio SEO — Actualiza dinámicamente el título, descripción, etiquetas Open Graph,
 * enlace canónico y hreflang en función del idioma y la página activa.
 */
@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  /**
   * Actualiza todas las etiquetas SEO de la página.
   * @param lang   Idioma activo
   * @param page   Página actual ('home' | 'trabaja')
   */
  setPageSeo(lang: Lang, page: SeoPage = 'home'): void {
    const base = SEO_BY_LANG[lang];

    const title = page === 'trabaja' ? TRABAJA_TITLE[lang] : base.title;
    const description = page === 'trabaja' ? TRABAJA_DESC[lang] : base.description;
    const canonical =
      page === 'trabaja'
        ? base.canonical.replace(/\/$/, '') + (lang === 'es' ? '' : '') + '/trabaja-con-nosotros'
        : base.canonical;

    // --- <title> ---
    this.titleService.setTitle(title);

    // --- HTML lang attribute ---
    this.doc.documentElement.setAttribute('lang', base.htmlLang);

    // --- Meta básico ---
    this.metaService.updateTag({ name: 'description', content: description });

    // --- Canonical ---
    this.setLink('canonical', canonical);

    // --- Open Graph ---
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:url', content: canonical });
    this.metaService.updateTag({ property: 'og:locale', content: base.ogLocale });

    // --- Twitter Card ---
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });

    // --- hreflang ---
    this.updateHreflang(page);
  }

  // ---------------------------------------------------------------------------
  // Helpers privados
  // ---------------------------------------------------------------------------

  private setLink(rel: string, href: string): void {
    let el = this.doc.querySelector(`link[rel='${rel}']`) as HTMLLinkElement | null;
    if (!el) {
      el = this.doc.createElement('link');
      el.setAttribute('rel', rel);
      this.doc.head.appendChild(el);
    }
    el.setAttribute('href', href);
  }

  private updateHreflang(page: SeoPage): void {
    // Eliminar hreflang existentes para no duplicar
    this.doc
      .querySelectorAll("link[rel='alternate'][hreflang]")
      .forEach(el => el.remove());

    const suffix = page === 'trabaja' ? '/trabaja-con-nosotros' : '';

    const pairs = [
      { hreflang: 'es', href: DOMAIN + '/' + suffix.replace(/^\//, '') },
      { hreflang: 'en', href: DOMAIN + '/en' + suffix },
      { hreflang: 'ca', href: DOMAIN + '/cat' + suffix },
      { hreflang: 'x-default', href: DOMAIN + '/' + suffix.replace(/^\//, '') },
    ];

    pairs.forEach(({ hreflang, href }) => {
      const link = this.doc.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', hreflang);
      link.setAttribute('href', href);
      this.doc.head.appendChild(link);
    });
  }
}
