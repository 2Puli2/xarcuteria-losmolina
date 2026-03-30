import { Component, ElementRef, viewChild, inject, effect } from '@angular/core';
import { HeaderComponent } from '../header/header';
import { FooterComponent } from '../footer/footer';
import { HomeComponent } from '../../pages/home/home';
import { QuienesSomosComponent } from '../../pages/quienes-somos/quienes-somos';
import { QueOfrecemosComponent } from '../../pages/que-ofrecemos/que-ofrecemos';
import { UbicacionComponent } from '../../pages/ubicacion/ubicacion';
import { NgxScrollTopComponent } from 'ngx-scrolltop';
import { SidebarComponent } from '../sidebar/sidebar';
import { SeoService } from '../../../application/seo/seo.service';
import { IdiomaService } from '../../../application/language/language.service';

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

  readonly mainContent = viewChild<ElementRef>('mainContent');

  constructor() {
    effect(() => {
      this.seo.setPageSeo(this.idioma.currentLang(), 'home');
    });
  }

  showHeader = false;
  headerHiding = false;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  scrollToSection(sectionId: string, offset: number = 0): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const isMobile = window.innerWidth < 768;
      const finalOffset = isMobile ? offset - 55 : offset;
      
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const finalPosition = elementPosition + finalOffset;
      
      window.scrollTo({
        top: finalPosition,
        behavior: 'smooth',
      });
    }
  }

  onScroll(): void {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const homeSection = document.getElementById('home');
    const homeHeight = homeSection ? homeSection.offsetHeight : 600;
    const shouldShow = scrollTop > homeHeight - 80;

    if (shouldShow && !this.showHeader) {
      if (this.hideTimer) {
        clearTimeout(this.hideTimer);
        this.hideTimer = null;
      }
      this.headerHiding = false;
      this.showHeader = true;
    } else if (!shouldShow && this.showHeader && !this.headerHiding) {
      this.headerHiding = true;
      this.hideTimer = setTimeout(() => {
        this.showHeader = false;
        this.headerHiding = false;
        this.hideTimer = null;
      }, 300);
    }
  }
}
