import { Route, Routes } from '@angular/router';
import { CoreComponent } from './presentation/layout/core/core';

const BASE_ROUTES: Routes = [
  { path: '', component: CoreComponent },
  {
    path: 'trabaja-con-nosotros',
    loadComponent: () =>
      import('./presentation/pages/trabaja-con-nosotros/trabaja-con-nosotros').then(
        m => m.TrabajaConNosotrosComponent
      ),
  },
  {
    path: 'carta',
    loadComponent: () =>
      import('./presentation/pages/carta/carta').then(m => m.CartaComponent),
  },
];

const LANG_PREFIXES = ['en', 'cat'];

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
