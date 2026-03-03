import { Component, signal, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { IdiomaService } from './idiomas/idioma.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('Charcutería Los Molina');

  private router = inject(Router);
  private idioma = inject(IdiomaService);

  ngOnInit(): void {
    // Detectar idioma en la URL inicial
    this.idioma.detectLangFromUrl(this.router.url);

    // Detectar idioma en cada cambio de ruta
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.idioma.detectLangFromUrl((e as NavigationEnd).urlAfterRedirects);
      });
  }
}
