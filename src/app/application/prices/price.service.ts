import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
    APERITIVOS_PRICES,
    CONSERVAS_PRICES,
    MENUS_PRICES,
    EMBUTIDO_GROUPS_PRICES,
    PAN_Y_TOSTADAS_PRICES,
    BIQUINIS_PRICES,
    CALIENTES_PRICES,
    SUPLEMENTOS_PRICES,
    PIZZAS_PRICES,
    POSTRES_PRICES,
    REFRESCOS_DATA,
    CERVEZAS_DATA,
    VINOS_DATA,
    CAFES_DATA,
    PRODUCTOS_EXTRA,
    PriceItem,
    EmbutidoPriceGroup,
    BiquiniPriceRow,
    CalientePriceRow,
    SuplementoPriceRow,
    PanPriceRow,
    BebidaItem,
    ProductoExtra,
    ProductoExtraI18n,
} from '../../domain/constants/carta-data';
import {
    sheetCsvUrl,
    PRECIOS_SHEET_TAB,
    NOMBRES_SHEET_TAB_CAT,
    NOMBRES_SHEET_TAB_EN,
    FALLBACK_ACTIVO,
} from './price.config';
import { IdiomaService, Lang } from '../language/language.service';

/** overrides[clave][campo] = precio leído de la hoja (ej. overrides['fuet']['torrada'] = '7,90') */
type Overrides = Record<string, Record<string, string>>;

/** Diccionario de traducción de una pestaña de nombres: clave → {name, desc?} */
type MapaNombres = Record<string, ProductoExtraI18n>;

/** Textos de un producto en los 3 idiomas, tal y como los trae la hoja */
type TextosPorIdioma = Record<Lang, ProductoExtraI18n>;

/** Bocadillo del día resuelto al idioma activo (ver PrecioService.bocadilloDelDia) */
export interface BocadilloDelDia {
    name: string;
    desc?: string;
    /** Puede faltar uno de los dos: solo se pinta el formato que tenga precio */
    medioBocadillo?: string;
    bocadilloEntero?: string;
}

/** Campos de precio de cada tipo de categoría (nombres del código) */
const CAMPOS_UNICO = ['price'] as const;
const CAMPOS_EMBUTIDO = ['medioBocadillo', 'bocadilloEntero', 'torrada', 'mediaTabla', 'tabla'] as const;
const CAMPOS_BIQUINI = ['normal', 'maxi'] as const;
const CAMPOS_MEDIO_ENTERO = ['medio', 'entero'] as const;
const CAMPOS_BOCADILLO = ['medioBocadillo', 'bocadilloEntero'] as const;

/**
 * Categoría del bocadillo del día. No tiene productos en el código: vive
 * ENTERA en la hoja, así que su fila siempre se trata como un alta. Vaciar
 * sus precios en la hoja lo apaga y el recuadro de la carta vuelve al aviso
 * de siempre ("pregunta por nuestras ofertas").
 */
export const CATEGORIA_BOCADILLO_DIA = 'bocadillo_dia';

/**
 * Todas las categorías de la carta. Para cada una:
 *  - `items`: el array del código, que define qué claves YA existen (cualquier
 *    clave de la hoja que no esté aquí es un producto nuevo).
 *  - `campos`: qué campos de precio usa la categoría, para saber qué columnas
 *    de la hoja leer al dar de alta un producto.
 *
 * Todas admiten altas desde la hoja, incluidas las de precio múltiple
 * (embutidos, biquinis, calientes, suplementos).
 */
const CATEGORIAS: Record<string, { items: readonly { key: string }[]; campos: readonly string[] }> = {
    aperitivos: { items: APERITIVOS_PRICES, campos: CAMPOS_UNICO },
    conservas: { items: CONSERVAS_PRICES, campos: CAMPOS_UNICO },
    menus: { items: MENUS_PRICES, campos: CAMPOS_UNICO },
    pan_y_tostadas: { items: PAN_Y_TOSTADAS_PRICES, campos: CAMPOS_UNICO },
    pizzas: { items: PIZZAS_PRICES, campos: CAMPOS_UNICO },
    postres: { items: POSTRES_PRICES, campos: CAMPOS_UNICO },
    refrescos: { items: REFRESCOS_DATA, campos: CAMPOS_UNICO },
    cervezas: { items: CERVEZAS_DATA, campos: CAMPOS_UNICO },
    vinos: { items: VINOS_DATA, campos: CAMPOS_UNICO },
    cafes: { items: CAFES_DATA, campos: CAMPOS_UNICO },
    biquinis: { items: BIQUINIS_PRICES, campos: CAMPOS_BIQUINI },
    calientes: { items: CALIENTES_PRICES, campos: CAMPOS_MEDIO_ENTERO },
    suplementos: { items: SUPLEMENTOS_PRICES, campos: CAMPOS_MEDIO_ENTERO },
    // Sin items: no existe en el código, solo en la hoja (ver arriba)
    [CATEGORIA_BOCADILLO_DIA]: { items: [], campos: CAMPOS_BOCADILLO },
    // Cada grupo de embutidos es una categoría propia en la hoja (jamon,
    // embutidos_ibericos, fiambres, quesos…), con los 5 campos de embutido.
    ...Object.fromEntries(
        EMBUTIDO_GROUPS_PRICES.map(g => [g.groupKey, { items: g.items, campos: CAMPOS_EMBUTIDO }])
    ),
};

/**
 * Servicio de precios de la carta.
 *
 * Fuente de verdad en producción: la Google Sheet (pestañas "precios",
 * "nombres_cat" y "nombres_en"), leídas como CSV al arrancar. carta-data.ts
 * define la "forma" de la carta (qué productos existen, cómo se agrupan y
 * qué campos de precio aplica cada uno) y sirve de respaldo de precios SOLO
 * si FALLBACK_ACTIVO está en `true` (price.config.ts). Por defecto está en
 * `false`: si la hoja no responde, `estado()` pasa a 'error' y las páginas
 * de carta deben mostrar un aviso en vez de precios, para no enseñar un
 * precio antiguo sin que se note.
 *
 * La hoja manda en tres cosas: PRECIOS, TEXTOS (nombre y descripción, en los 3
 * idiomas) y ALTAS de productos nuevos en cualquier categoría (ver CATEGORIAS).
 * Las traducciones del código solo se usan para las claves que la hoja no trae.
 * El respaldo en código de las altas es PRODUCTOS_EXTRA (`npm run sync:carta`).
 */
@Injectable({ providedIn: 'root' })
export class PrecioService {
    private readonly http = inject(HttpClient);
    private readonly platformId = inject(PLATFORM_ID);
    private readonly idioma = inject(IdiomaService);

    /** Precios leídos de la hoja; vacío = solo respaldo del código */
    private readonly overrides = signal<Overrides>({});

    /** Productos nuevos leídos de la hoja; null = hoja no cargada (se usa PRODUCTOS_EXTRA) */
    private readonly nuevosHoja = signal<ProductoExtra[] | null>(null);

    /** Nombres y descripciones leídos de la hoja: clave → textos por idioma */
    private readonly textosHoja = signal<Record<string, TextosPorIdioma>>({});

    /** true si la pestaña "precios" no respondió o no parece la pestaña correcta */
    private readonly errorHoja = signal(false);

    /** true mientras se está leyendo la hoja por primera vez */
    private readonly cargando = signal(false);

    /**
     * Qué deben pintar las páginas de carta:
     *  - 'cargando': aún no sabemos qué dice la hoja. Con FALLBACK_ACTIVO=false
     *    NO se pintan precios: los del código podrían estar desfasados y
     *    saldrían un instante antes de que llegue la hoja.
     *  - 'error': la hoja ha fallado y no hay respaldo activado → aviso.
     *  - 'ok': hay precios buenos que pintar (de la hoja, o del código si
     *    FALLBACK_ACTIVO está en `true`).
     */
    readonly estado = computed<'cargando' | 'ok' | 'error'>(() => {
        if (FALLBACK_ACTIVO) return 'ok'; // el código basta: no hay que esperar a nadie
        if (this.cargando()) return 'cargando';
        return this.errorHoja() ? 'error' : 'ok';
    });

    constructor() {
        // Solo en navegador: durante el prerender se emiten los precios de respaldo
        if (isPlatformBrowser(this.platformId)) {
            this.cargando.set(true);
            this.cargarPreciosDeLaHoja();
        }
    }

    private async cargarPreciosDeLaHoja(): Promise<void> {
        try {
            // Las 3 pestañas en paralelo. Los nombres son tolerantes a fallo:
            // si caen pero "precios" responde, los productos nuevos salen en español.
            const [csvPrecios, mapaCat, mapaEn] = await Promise.all([
                firstValueFrom(
                    this.http.get(sheetCsvUrl(PRECIOS_SHEET_TAB), { responseType: 'text' })
                ),
                this.cargarNombres(NOMBRES_SHEET_TAB_CAT),
                this.cargarNombres(NOMBRES_SHEET_TAB_EN),
            ]);

            const filas = parsearFilas(csvPrecios);
            if (!esPestanaPrecios(filas)) {
                // Respondió, pero lo que llegó no es la pestaña de precios: hoja
                // vacía, ID incorrecto, error de Google en vez de CSV, o —el caso
                // más habitual— la pestaña "precios" no existe (renombrada o
                // borrada) y gviz ha devuelto la PRIMERA pestaña en su lugar.
                this.errorHoja.set(true);
                return;
            }
            const overrides = filasAOverrides(filas);
            if (Object.keys(overrides).length > 0) {
                this.overrides.set(overrides);
            }
            this.textosHoja.set(construirTextos(filas, mapaCat, mapaEn));
            this.nuevosHoja.set(detectarNuevos(filas, mapaCat, mapaEn));
            this.errorHoja.set(false);
        } catch {
            // Sin conexión con la hoja de precios
            this.errorHoja.set(true);
        } finally {
            // En finally para cubrir también el `return` temprano de arriba:
            // si no, la carta se quedaría en 'cargando' para siempre.
            this.cargando.set(false);
        }
    }

    /** Descarga y parsea una pestaña de nombres; tolerante a fallo (devuelve {}) */
    private async cargarNombres(tab: string): Promise<MapaNombres> {
        try {
            const csv = await firstValueFrom(
                this.http.get(sheetCsvUrl(tab), { responseType: 'text' })
            );
            const filas = parsearFilas(csv);
            // Si gviz ha devuelto la pestaña de precios porque esta no existe,
            // no sirve como pestaña de nombres: mejor {} y caer al español.
            return esPestanaPrecios(filas) ? {} : parsearNombres(filas);
        } catch {
            return {};
        }
    }

    /**
     * Nombre y descripción de una clave según la hoja, en el idioma activo.
     * `undefined` si la hoja no trae esa clave (entonces manda el código).
     * La hoja es la fuente de verdad del texto: si trae la clave, su
     * descripción vacía significa "sin descripción", no "usa la del código".
     */
    readonly textoHoja = computed<(key: string) => ProductoExtraI18n | undefined>(() => {
        const textos = this.textosHoja();
        const lang = this.idioma.currentLang();
        return (key: string) => textos[key]?.[lang];
    });

    /** Mezcla una colección del código con los precios de la hoja por encima */
    private mezclar<T extends { key: string }>(items: T[], campos: readonly (keyof T & string)[]): T[] {
        const overrides = this.overrides();
        return items.map(item => {
            const filaHoja = overrides[item.key];
            if (!filaHoja) return item;
            const mezclado = { ...item };
            for (const campo of campos) {
                // `campos` son los formatos que admite la categoría, así que la
                // hoja puede rellenar cualquiera de ellos —incluido uno que el
                // código dejaba vacío—: es como se pone a la venta un formato
                // nuevo (p. ej. empezar a servir en tabla un embutido que solo
                // se hacía en bocadillo) sin tocar código.
                if (filaHoja[campo]) {
                    (mezclado as Record<string, unknown>)[campo] = filaHoja[campo];
                }
            }
            return mezclado;
        });
    }

    /** Productos nuevos vigentes: los de la hoja si cargó, si no el respaldo del código */
    private nuevosEfectivos(): ProductoExtra[] {
        return this.nuevosHoja() ?? PRODUCTOS_EXTRA;
    }

    /**
     * Como mezclar(), pero además añade AL FINAL los productos nuevos de la
     * categoría (los que existen en la hoja/PRODUCTOS_EXTRA pero no en el
     * código), con el nombre/descripción del idioma activo.
     *
     * Cada alta trae sus importes en `precios` con los nombres de campo de su
     * categoría, así que un biquini nuevo llega con {normal, maxi} y un
     * embutido nuevo con sus 5 campos, no con un `price` que nadie pintaría.
     */
    private mezclarConNuevos<T extends { key: string }>(
        items: T[],
        categoria: string,
        campos: readonly (keyof T & string)[],
    ): T[] {
        const base = this.mezclar(items, campos);
        const lang: Lang = this.idioma.currentLang();
        const nuevos = this.nuevosEfectivos()
            .filter(n => n.categoria === categoria)
            .map(n => {
                const i18n = n[lang] ?? n.es;
                // Estructuralmente compatible con la fila que espera cada
                // plantilla: key + los campos de precio de la categoría + textos.
                return { key: n.key, ...n.precios, name: i18n.name, desc: i18n.desc } as unknown as T;
            });
        return nuevos.length ? [...base, ...nuevos] : base;
    }

    readonly aperitivos = computed<PriceItem[]>(() => this.mezclarConNuevos(APERITIVOS_PRICES, 'aperitivos', ['price']));
    readonly conservas = computed<PriceItem[]>(() => this.mezclarConNuevos(CONSERVAS_PRICES, 'conservas', ['price']));
    readonly menus = computed<PriceItem[]>(() => this.mezclarConNuevos(MENUS_PRICES, 'menus', ['price']));

    readonly embutidoGroups = computed<EmbutidoPriceGroup[]>(() =>
        EMBUTIDO_GROUPS_PRICES.map(grupo => ({
            groupKey: grupo.groupKey,
            // Cada grupo es su propia categoría en la hoja, así que también
            // admite altas (un embutido nuevo sale al final de su grupo).
            items: this.mezclarConNuevos(grupo.items, grupo.groupKey, CAMPOS_EMBUTIDO),
        }))
    );

    readonly panYTostadas = computed<PanPriceRow[]>(() => this.mezclarConNuevos(PAN_Y_TOSTADAS_PRICES, 'pan_y_tostadas', ['price']));
    readonly biquinis = computed<BiquiniPriceRow[]>(() => this.mezclarConNuevos(BIQUINIS_PRICES, 'biquinis', CAMPOS_BIQUINI));
    readonly calientes = computed<CalientePriceRow[]>(() => this.mezclarConNuevos(CALIENTES_PRICES, 'calientes', CAMPOS_MEDIO_ENTERO));
    readonly suplementos = computed<SuplementoPriceRow[]>(() => this.mezclarConNuevos(SUPLEMENTOS_PRICES, 'suplementos', CAMPOS_MEDIO_ENTERO));
    readonly pizzas = computed<PriceItem[]>(() => this.mezclarConNuevos(PIZZAS_PRICES, 'pizzas', ['price']));
    readonly postres = computed<PriceItem[]>(() => this.mezclarConNuevos(POSTRES_PRICES, 'postres', ['price']));

    /**
     * Bocadillo del día, o `null` si hoy no hay ninguno puesto en la hoja
     * (fila ausente, o sin ningún precio: detectarNuevos descarta esas filas).
     * El recuadro de la carta usa ese null para volver al mensaje de siempre.
     */
    readonly bocadilloDelDia = computed<BocadilloDelDia | null>(() => {
        const lang: Lang = this.idioma.currentLang();
        // Solo uno: si la hoja trae varias filas, manda la primera
        const fila = this.nuevosEfectivos().find(n => n.categoria === CATEGORIA_BOCADILLO_DIA);
        if (!fila) return null;
        const i18n = fila[lang] ?? fila.es;
        return {
            name: i18n.name,
            desc: i18n.desc,
            medioBocadillo: fila.precios['medioBocadillo'],
            bocadilloEntero: fila.precios['bocadilloEntero'],
        };
    });

    readonly refrescos = computed<BebidaItem[]>(() => this.mezclarConNuevos(REFRESCOS_DATA, 'refrescos', ['price']));
    readonly cervezas = computed<BebidaItem[]>(() => this.mezclarConNuevos(CERVEZAS_DATA, 'cervezas', ['price']));
    readonly vinos = computed<BebidaItem[]>(() => this.mezclarConNuevos(VINOS_DATA, 'vinos', ['price']));
    readonly cafes = computed<BebidaItem[]>(() => this.mezclarConNuevos(CAFES_DATA, 'cafes', ['price']));
}

/** Columnas de la hoja con precio; 'precio' de la hoja equivale a 'price' en el código */
const CAMPOS_PRECIO: Record<string, string> = {
    precio: 'price',
    medioBocadillo: 'medioBocadillo',
    bocadilloEntero: 'bocadilloEntero',
    torrada: 'torrada',
    mediaTabla: 'mediaTabla',
    tabla: 'tabla',
    normal: 'normal',
    maxi: 'maxi',
    medio: 'medio',
    entero: 'entero',
};

/** Convierte las filas de "precios" en el mapa de overrides de precio por clave */
function filasAOverrides(filas: Record<string, string>[]): Overrides {
    const overrides: Overrides = {};
    for (const fila of filas) {
        const clave = fila['clave']?.trim();
        if (!clave) continue;
        for (const [colHoja, campoCodigo] of Object.entries(CAMPOS_PRECIO)) {
            const valor = normalizarPrecio(fila[colHoja]);
            if (valor) {
                (overrides[clave] ??= {})[campoCodigo] = valor;
            }
        }
    }
    return overrides;
}

/**
 * ¿Estas filas son la pestaña "precios"? Solo ella trae la columna `categoria`
 * con valores reconocidos. Sirve para dos cosas: detectar que la pestaña de
 * precios falta (gviz devuelve otra en su lugar, con HTTP 200) y descartar esa
 * misma respuesta cuando llega pidiendo una pestaña de nombres.
 */
function esPestanaPrecios(filas: Record<string, string>[]): boolean {
    return filas.some(f => f['clave']?.trim() && CATEGORIAS[f['categoria']?.trim()]);
}

/** Parsea una pestaña de nombres (clave, producto, descripcion?) en un mapa por clave */
function parsearNombres(filas: Record<string, string>[]): MapaNombres {
    const mapa: MapaNombres = {};
    for (const fila of filas) {
        const clave = fila['clave']?.trim();
        const name = fila['producto']?.trim();
        if (!clave || !name) continue;
        const desc = fila['descripcion']?.trim();
        mapa[clave] = desc ? { name, desc } : { name };
    }
    return mapa;
}

/**
 * Textos de TODOS los productos de la hoja (existan o no en el código), en los
 * 3 idiomas. El español sale de la propia pestaña "precios"; catalán e inglés
 * de las pestañas de nombres, con respaldo al español si les falta la clave.
 */
function construirTextos(
    filas: Record<string, string>[],
    mapaCat: MapaNombres,
    mapaEn: MapaNombres,
): Record<string, TextosPorIdioma> {
    const textos: Record<string, TextosPorIdioma> = {};
    for (const fila of filas) {
        const clave = fila['clave']?.trim();
        const name = fila['producto']?.trim();
        if (!clave || !name) continue;
        const desc = fila['descripcion']?.trim();
        const es: ProductoExtraI18n = desc ? { name, desc } : { name };
        textos[clave] = { es, cat: mapaCat[clave] ?? es, en: mapaEn[clave] ?? es };
    }
    return textos;
}

/**
 * Detecta productos nuevos: filas de "precios" cuya clave no existe ya en el
 * código. Lee los campos de precio que corresponden a la categoría (precio
 * único, normal/maxi, medio/entero o los 5 de embutido), así que un alta llega
 * lista para pintarse en la tabla de su sección. El nombre en español sale de
 * la propia fila; catalán e inglés de los mapas de nombres (respaldo: español).
 */
function detectarNuevos(
    filas: Record<string, string>[],
    mapaCat: MapaNombres,
    mapaEn: MapaNombres,
): ProductoExtra[] {
    const nuevos: ProductoExtra[] = [];
    const vistas = new Set<string>();
    for (const fila of filas) {
        const categoria = fila['categoria']?.trim();
        const clave = fila['clave']?.trim();
        const nombreEs = fila['producto']?.trim();
        if (!categoria || !clave || !nombreEs) continue;

        const def = CATEGORIAS[categoria];
        if (!def) continue; // categoría desconocida (o typo en la hoja)
        if (def.items.some(i => i.key === clave)) continue; // ya existe en el código
        if (vistas.has(clave)) continue; // clave repetida en la hoja: nos quedamos con la primera
        vistas.add(clave);

        // Solo los campos de precio de ESTA categoría, con el nombre que usa el
        // código ('precio' en la hoja es 'price' en PriceItem/BebidaItem).
        const precios: Record<string, string> = {};
        for (const campo of def.campos) {
            const valor = normalizarPrecio(fila[campo === 'price' ? 'precio' : campo]);
            if (valor) precios[campo] = valor;
        }
        if (Object.keys(precios).length === 0) continue; // sin ningún importe no se puede pintar

        const descEs = fila['descripcion']?.trim();
        const es: ProductoExtraI18n = descEs ? { name: nombreEs, desc: descEs } : { name: nombreEs };
        nuevos.push({
            categoria,
            key: clave,
            precios,
            es,
            cat: mapaCat[clave] ?? es,
            en: mapaEn[clave] ?? es,
        });
    }
    return nuevos;
}

/**
 * Normaliza el precio al formato de la web ("6,90"). Rescata celdas que Google
 * haya convertido a número: "6.9" → "6,90", "6,9" → "6,90", "6" → "6,00".
 */
function normalizarPrecio(valor: string | undefined): string {
    const texto = (valor ?? '').trim();
    if (!texto) return '';
    // Tolera que la dueña escriba el símbolo de euro en la celda (ej. "6,90 €"):
    // si no se limpiara, se concatenaría con el "€" fijo de la plantilla ("6,90€€")
    const sinSimbolo = texto.replace(/[€\s]/g, '');
    const numerico = sinSimbolo.replace(',', '.');
    if (!/^\d+(\.\d+)?$/.test(numerico)) return texto;
    const [entera, decimal = ''] = numerico.split('.');
    return `${entera},${decimal.padEnd(2, '0').slice(0, 2)}`;
}

/**
 * Convierte el CSV en filas-objeto indexadas por cabecera:
 * [{categoria: 'aperitivos', clave: 'olivas_xxl', precio: '3,90', ...}, ...]
 */
function parsearFilas(csv: string): Record<string, string>[] {
    const filas = parsearCsv(csv);
    if (filas.length < 2) return [];
    const cabecera = filas[0].map(c => c.trim());
    return filas.slice(1).map(fila => {
        const obj: Record<string, string> = {};
        cabecera.forEach((col, i) => {
            obj[col] = (fila[i] ?? '').trim();
        });
        return obj;
    });
}

/** Parser CSV mínimo con soporte de comillas (gviz entrecomilla todos los campos) */
function parsearCsv(csv: string): string[][] {
    const filas: string[][] = [];
    let fila: string[] = [];
    let campo = '';
    let entreComillas = false;

    for (let i = 0; i < csv.length; i++) {
        const c = csv[i];
        if (entreComillas) {
            if (c === '"') {
                if (csv[i + 1] === '"') { campo += '"'; i++; }
                else entreComillas = false;
            } else campo += c;
        } else if (c === '"') {
            entreComillas = true;
        } else if (c === ',') {
            fila.push(campo); campo = '';
        } else if (c === '\n' || c === '\r') {
            if (c === '\r' && csv[i + 1] === '\n') i++;
            fila.push(campo); campo = '';
            filas.push(fila); fila = [];
        } else {
            campo += c;
        }
    }
    if (campo !== '' || fila.length > 0) {
        fila.push(campo);
        filas.push(fila);
    }
    return filas;
}
