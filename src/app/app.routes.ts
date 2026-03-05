import { Route, Routes } from '@angular/router';
import { CoreComponent } from './core/core';

/** Rutas base (sin prefijo de idioma) */
const BASE_ROUTES: Routes = [
  { path: '', component: CoreComponent },
  {
    path: 'trabaja-con-nosotros',
    loadComponent: () =>
      import('./views/trabaja-con-nosotros/trabaja-con-nosotros').then(
        m => m.TrabajaConNosotrosComponent
      ),
  },
  {
    path: 'carta',
    loadComponent: () =>
      import('./views/carta/carta').then(m => m.CartaComponent),
  },
];

/** Prefijos de idioma que necesitan sus propias rutas */
const LANG_PREFIXES = ['en', 'cat'];

/** Genera rutas con prefijo de idioma a partir de las rutas base */
function withLangPrefix(prefix: string): Routes {
  return BASE_ROUTES.map(route => ({
    ...route,
    path: route.path ? `${prefix}/${route.path}` : prefix,
  } as Route));
}

export const routes: Routes = [
  ...BASE_ROUTES,
  ...LANG_PREFIXES.flatMap(withLangPrefix),
];
