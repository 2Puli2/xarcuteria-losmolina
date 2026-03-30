# Buenas Prácticas · LA CHARCU

Chuleta técnica del proyecto para entrevistas de trabajo frontend.  
Responde las preguntas habituales de procesos de selección Angular y defiende las decisiones de arquitectura.

---

## 1. Angular 21 — ¿Por qué esta versión y cómo se aprovecha?

**Angular 21 es la versión LTS más reciente del framework.** Elegirla no es capricho: es la apuesta de Google para el desarrollo frontend empresarial de los próximos años.

### Qué aporta Angular 21 respecto a versiones anteriores

| Feature | Disponible desde | Usado en el proyecto |
|---|---|---|
| Standalone Components | v15 | ✅ Todos los componentes |
| `inject()` funcional | v14 | ✅ Todos los servicios/componentes |
| Signals (`signal`, `computed`, `effect`) | v17 | ✅ Estado de idioma, carta, sliders |
| `input()` / `output()` signal-based | v17.1 | ✅ `button`, `title`, `arrow` |
| `viewChild()` signal-based | v17.3 | ✅ `photo-slider` |
| `loadComponent()` lazy routing | v14 | ✅ `carta`, `trabaja-con-nosotros` |
| Sin NgModules | v15 (opcional) | ✅ Cero módulos en el proyecto |

### Por qué Angular y no React o Vue

| Pregunta | Respuesta |
|---|---|
| ¿Angular no es más pesado? | El bundle es comparable con React+Router+Redux+TypeScript. Angular lo incluye todo. |
| ¿No está más de moda React? | Angular domina en entornos enterprise. Fue diseñado para equipos grandes con convenciones claras. |
| ¿Y Vue? | Vue es flexible pero sin convenciones obligatorias. Angular impone estructura, lo que escala mejor. |
| ¿Por qué este proyecto usa Angular? | Es una web de negocio real con i18n, SEO, lazy loading, formularios y routing. Angular ofrece todo sin dependencias externas. |

---

## 2. Arquitectura — DDD + N-Layers

El proyecto usa **Domain-Driven Design** combinado con **N-Layers** en vez de la estructura por defecto de Angular (`components/`, `views/`, `shared/`).

### Estructura de carpetas

```
src/app/
├── domain/            ← Qué es el negocio (modelos, constantes)
│   ├── models/        ← Interfaces de datos
│   └── constants/     ← carta-data.ts (datos reales de la carta del restaurante)
│
├── application/       ← Cómo funciona el negocio (servicios, lógica)
│   ├── language/      ← language.service.ts + traducciones (es/en/cat)
│   └── seo/           ← seo.service.ts (meta tags, canonical)
│
├── infrastructure/    ← Cómo se conecta al exterior (pipes, adaptadores)
│   └── pipes/         ← sanitizer.pipe.ts (DomSanitizer wrapper)
│
└── presentation/      ← Qué ve el usuario (Angular components)
    ├── layout/        ← Estructura de página: core, header, footer, sidebar
    ├── shared/        ← Componentes reutilizables: button, title, arrow...
    └── pages/         ← Páginas: home, carta, quienes-somos...
```

### Beneficios para una entrevista

- **Separación de responsabilidades**: Los datos de negocio (`domain/`) no dependen de Angular.
- **Testabilidad**: Los servicios de `application/` son puro TypeScript, sin dependencias de UI.
- **Escalabilidad**: Añadir una nueva página es `pages/nueva-pagina/` sin tocar nada más.
- **Onboarding rápido**: Un desarrollador nuevo entiende la estructura leyendo sólo los nombres de carpetas.

---

## 3. Signals — Reactividad sin RxJS

Angular Signals es el nuevo sistema de reactividad de Angular, introducido en v17 como alternativa a RxJS para el estado local.

### Los tres pilares

```typescript
// signal() → estado mutable
currentLang = signal<Lang>('es');

// computed() → derivado automático (memo)
t = computed<Translations>(() => translations[this.currentLang()]);

// effect() → efecto secundario reactivo
effect(() => {
  this.seoService.updateMeta(this.t());
});
```

### Pregunta de entrevista: ¿Cuándo usas Signals vs RxJS?

| Caso | Signals | RxJS |
|---|---|---|
| Estado del componente | ✅ | Innecesario |
| Estado global de la app | ✅ (signal en servicio) | Posible con BehaviorSubject |
| Streams asíncronos (HTTP) | No apto | ✅ |
| Transformaciones complejas de datos | Limitado | ✅ |
| Comunicación entre componentes | `input()`/`output()` | EventEmitter |

**En este proyecto**: el idioma activo, las traducciones y el estado de la carta son signals. No hay `BehaviorSubject` ni `Observable` en el código propio.

---

## 4. Change Detection

### Pregunta: ¿Qué es Change Detection y cómo lo optimizas?

Angular detecta cambios en los datos y actualiza el DOM. Hay dos estrategias:

- **Default**: Angular revisa todos los componentes en cada ciclo.
- **OnPush**: Angular sólo revisa el componente cuando cambia una `@Input()` signal o se emite un evento.

**Con Signals, `OnPush` es automático** para los componentes que leen signals. Angular sabe exactamente qué signal cambió y sólo actualiza el componente que la lee.

En este proyecto los signals de `language.service.ts` provocan re-render *quirúrgico* sólo en los componentes que muestran texto traducido.

---

## 5. Dependency Injection — `inject()` funcional

### Antes (constructor DI)

```typescript
constructor(
  private idiomaService: IdiomaService,
  private router: Router,
  private title: Title
) {}
```

### Ahora (`inject()`)

```typescript
private idiomaService = inject(IdiomaService);
private router = inject(Router);
private title = inject(Title);
```

### Ventajas

- **Menos boilerplate**: sin `constructor` si no hay otra lógica de inicialización.
- **Composición**: se pueden crear funciones reutilizables que llaman a `inject()` internamente.
- **Legibilidad**: las dependencias se leen como propiedades, no como parámetros.
- **Testing**: se puede mockear igual que con constructor DI.

---

## 6. Lazy Loading

Las rutas pesadas se cargan bajo demanda:

```typescript
// app.routes.ts
{
  path: 'carta',
  loadComponent: () =>
    import('./presentation/pages/carta/carta').then(m => m.CartaComponent)
}
```

### Impacto real

- El bundle inicial **no incluye** el código de `carta.ts` ni `trabaja-con-nosotros.ts`.
- El usuario descarga esos chunks **sólo cuando navega** a esas rutas.
- Mejora el **LCP** (Largest Contentful Paint) y el **TTI** (Time to Interactive).

---

## 7. i18n Personalizado

En vez de `@angular/localize` (que requiere compilaciones separadas), el proyecto usa un servicio propio basado en signals.

### Cómo funciona

```
URL /es/home → detectLangFromUrl() → setLang('es') → signal actualiza → computed recalcula traducciones
URL /en/home → detectLangFromUrl() → setLang('en') → signal actualiza → computed recalcula traducciones
```

### Ventajas sobre `@angular/localize`

- **Una sola build** para todos los idiomas.
- **Cambio de idioma sin recarga** de página.
- **Añadir idioma** = crear un archivo `xx.ts` con el objeto de traducciones.

---

## 8. SEO con Angular

Angular renderiza en el cliente, lo que dificulta el SEO. El proyecto lo resuelve con `seo.service.ts`:

```typescript
// Actualiza <title>, <meta description>, <meta og:*>, <link rel="canonical">
updateMeta(t: Translations): void {
  this.titleService.setTitle(t.metaTitle);
  this.meta.updateTag({ name: 'description', content: t.metaDescription });
  this.meta.updateTag({ property: 'og:title', content: t.metaTitle });
  this.meta.updateTag({ property: 'og:description', content: t.metaDescription });
  this.setCanonical();
}
```

Se llama en un `effect()` reactivo: cuando el idioma cambia, los meta tags se actualizan automáticamente.

---

## 9. Buenas Prácticas aplicadas en el código

### Single Responsibility — un método para dos acciones simétricas

```typescript
// ❌ Antes: dos métodos idénticos con signo opuesto
prev() { if (this.currentIndex > 0) this.currentIndex--; }
next() { if (this.currentIndex < this.total - 1) this.currentIndex++; }

// ✅ Después: un método con parámetro de dirección
navigate(step: number): void {
  const next = this.currentIndex + step;
  if (next >= 0 && next < this.total) this.currentIndex = next;
}
```

### Memory Leak Prevention — `ngOnDestroy`

```typescript
// ❌ Sin cleanup: el intervalo sigue corriendo aunque el componente se destruya
ngOnInit() {
  this.intervalId = setInterval(() => this.nextSlide(), 4000);
}

// ✅ Con cleanup
ngOnDestroy() {
  clearInterval(this.intervalId);
}
```

### DRY en SCSS — eliminar variables duplicadas

```scss
// ❌ Antes: dos variables con el mismo valor
$color-secondary: #ffffff;
$color-light: #ffffff;

// ✅ Después: una sola variable
$color-light: #ffffff;
```

### DRY en SCSS — consolidar @keyframes

```scss
// ❌ Antes: @keyframes fadeIn definido en 5 archivos SCSS distintos

// ✅ Después: definido una sola vez en styles.scss (global)
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0);   }
}
```

### Composición de tipos — TypeScript estricto

```typescript
// Tipos explícitos para las claves de idioma
type Lang = 'es' | 'en' | 'cat';

// Signal tipada, no any
currentLang = signal<Lang>('es');
```

---

## 10. Preguntas frecuentes de entrevista

**¿Qué es un Standalone Component?**  
Un componente que no pertenece a ningún NgModule. Declara sus propias dependencias en el array `imports` del decorador `@Component`. Angular 15+ los recomienda por defecto. Angular 19+ los activa como opción por defecto en `ng generate`.

**¿Qué diferencia hay entre `signal()` y `BehaviorSubject`?**  
`signal()` es síncrono, se lee como una función `valor()` y Angular lo integra en el ciclo de change detection nativamente. `BehaviorSubject` es asíncrono, requiere `.subscribe()` y gestión manual de unsubscribe. Para estado local y servicios simples, Signals es la opción moderna.

**¿Qué es el `inject()` y cuándo usarlo?**  
Es la forma funcional de hacer Dependency Injection en Angular. Se puede usar fuera del constructor, en funciones de utilidad, en guards, en interceptors. Requiere que la función se ejecute en un contexto de inyección (dentro de un constructor, `inject()` de otro servicio, o `runInInjectionContext()`).

**¿Cómo evitas memory leaks en Angular?**  
- `ngOnDestroy` + `clearInterval` / `clearTimeout` para timers manuales.
- `.pipe(takeUntilDestroyed())` para Observables (Angular 16+).
- `DestroyRef` + `inject(DestroyRef)` como alternativa moderna.

**¿Qué es Tree Shaking?**  
El proceso por el que el bundler (esbuild en Angular 17+) elimina el código no usado. Los Standalone Components favorecen el tree shaking porque cada componente importa sólo lo que necesita, en vez de importar un NgModule entero.

**¿Cómo funciona el routing en este proyecto?**  
`app.routes.ts` define rutas con segmento de idioma: `/:lang/home`, `/:lang/carta`. El `core.ts` detecta el idioma del segmento inicial de la URL y actualiza el signal del servicio. Las rutas pesadas usan `loadComponent()` para lazy loading.

---

## Resumen ejecutivo para entrevista

> "El proyecto usa Angular 21 con arquitectura DDD + N-Layers: domain, application, infrastructure y presentation. Todos los componentes son standalone, sin NgModules. El estado se gestiona con Signals nativos de Angular —sin RxJS ni librerías de estado externas—. La inyección de dependencias usa `inject()` funcional. Hay lazy loading en las rutas más pesadas y un sistema de i18n propio (es/en/cat) con cambio de idioma sin recarga. El SCSS usa variables centralizadas y el @keyframes fadeIn está definido una sola vez en el archivo global."
