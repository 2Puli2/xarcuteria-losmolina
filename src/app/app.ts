import { Component, signal, inject, effect } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { IdiomaService } from './application/language/language.service';
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

  private readonly navigationEnd = toSignal(
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd))
  );

  constructor() {
    this.idioma.detectLangFromUrl(this.router.url);

    effect(() => {
      const nav = this.navigationEnd();
      if (nav) {
        this.idioma.detectLangFromUrl((nav as NavigationEnd).urlAfterRedirects);
      }
    });
  }
}
