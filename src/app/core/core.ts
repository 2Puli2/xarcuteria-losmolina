import { Component, ElementRef, viewChild, inject, effect } from '@angular/core';
import { HeaderComponent } from '../components/header/header';
import { FooterComponent } from '../components/footer/footer';
import { HomeComponent } from '../views/home/home';
import { QuienesSomosComponent } from '../views/quienes-somos/quienes-somos';
import { QueOfrecemosComponent } from '../views/que-ofrecemos/que-ofrecemos';
import { UbicacionComponent } from '../views/ubicacion/ubicacion';
import { NgxScrollTopComponent } from 'ngx-scrolltop';
import { SidebarComponent } from '../components/sidebar/sidebar';
import { SeoService } from './seo.service';
import { IdiomaService } from '../idiomas/idioma.service';

/**
 * Componente Core — Agrupa todas las secciones de la web.
 * Gestiona el scroll suave entre secciones y actualiza el SEO dinámicamente.
 */
@Component({
  selector: 'app-core',
  imports: [
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    QuienesSomosComponent,
    QueOfrecemosComponent,
    UbicacionComponent,
    NgxScrollTopComponent,
    SidebarComponent,
  ],
  templateUrl: './core.html',
  styleUrl: './core.scss',
})
export class CoreComponent {
  private readonly seo = inject(SeoService);
  private readonly idioma = inject(IdiomaService);

  /** Referencia al contenedor principal para detectar scroll */
  readonly mainContent = viewChild<ElementRef>('mainContent');

  constructor() {
    // Actualizar SEO cada vez que cambia el idioma
    effect(() => {
      this.seo.setPageSeo(this.idioma.currentLang(), 'home');
    });
  }

  /** Controla la visibilidad del header */
  showHeader = false;

  /** Indica si el header está en animación de desaparición */
  headerHiding = false;

  /** Temporizador para eliminar el header tras la animación */
  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Hace scroll suave a la sección indicada.
   * @param sectionId - ID de la sección destino
   */
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const isMobile = window.innerWidth <= 768;
      const offset = isMobile ? 120 : 0; // Más espacio en mobile por el header
      
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    }
  }

  /**
   * Detecta la posición del scroll para mostrar/ocultar header.
   */
  onScroll(): void {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const homeSection = document.getElementById('home');
    const homeHeight = homeSection ? homeSection.offsetHeight : 600;
    const shouldShow = scrollTop > homeHeight - 80;

    if (shouldShow && !this.showHeader) {
      // Cancelar cualquier timer de ocultamiento pendiente
      if (this.hideTimer) {
        clearTimeout(this.hideTimer);
        this.hideTimer = null;
      }
      this.headerHiding = false;
      this.showHeader = true;
    } else if (!shouldShow && this.showHeader && !this.headerHiding) {
      // Lanzar animación de desaparición
      this.headerHiding = true;
      this.hideTimer = setTimeout(() => {
        this.showHeader = false;
        this.headerHiding = false;
        this.hideTimer = null;
      }, 300);
    }
  }
}
