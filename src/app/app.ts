import { Component, signal, inject, effect } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { IdiomaService } from './idiomas/idioma.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Charcutería Los Molina');

  private router = inject(Router);
  private idioma = inject(IdiomaService);

  // Convertir el Observable de eventos del router a Signal
  private readonly navigationEnd = toSignal(
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd))
  );

  constructor() {
    // Detectar idioma en la URL inicial
    this.idioma.detectLangFromUrl(this.router.url);

    // Reaccionar con effect cuando cambia la navegación
    effect(() => {
      const nav = this.navigationEnd();
      if (nav) {
        this.idioma.detectLangFromUrl((nav as NavigationEnd).urlAfterRedirects);
      }
    });
  }
}
