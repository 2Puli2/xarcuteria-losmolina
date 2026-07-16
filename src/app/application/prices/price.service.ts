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
} from './price.config';
import { IdiomaService, Lang } from '../language/language.service';

/** overrides[clave][campo] = precio leído de la hoja (ej. overrides['fuet']['torrada'] = '7,90') */
type Overrides = Record<string, Record<string, string>>;

/** Diccionario de traducción de una pestaña de nombres: clave → {name, desc?} */
type MapaNombres = Record<string, ProductoExtraI18n>;

/**
 * Categorías donde la hoja puede AÑADIR productos nuevos (precio único).
 * El valor es el array del código, que define qué claves ya existen: cualquier
 * clave de la hoja que no esté aquí se trata como producto nuevo.
 * Las demás categorías (embutidos, biquinis, calientes, suplementos) solo
 * admiten cambios de precio, no altas — se siguen añadiendo por código.
 */
const CATEGORIAS_CON_EXTRAS: Record<string, readonly { key: string }[]> = {
    aperitivos: APERITIVOS_PRICES,
    conservas: CONSERVAS_PRICES,
    menus: MENUS_PRICES,
    pan_y_tostadas: PAN_Y_TOSTADAS_PRICES,
    pizzas: PIZZAS_PRICES,
    postres: POSTRES_PRICES,
    refrescos: REFRESCOS_DATA,
    cervezas: CERVEZAS_DATA,
    vinos: VINOS_DATA,
    cafes: CAFES_DATA,
};

/**
 * Servicio de precios de la carta.
 *
 * Fuente de verdad en producción: la Google Sheet (pestañas "precios",
 * "nombres_cat" y "nombres_en"), leídas como CSV al arrancar. carta-data.ts es
 * el RESPALDO y define la "forma" de la carta: qué productos existen, cómo se
 * agrupan y qué campos de precio aplica cada uno. Si la hoja no responde
 * (offline, CORS, Google caído) o le falta una clave/campo, se usa el precio
 * del código: la carta nunca queda vacía.
 *
 * Además, la hoja puede AÑADIR productos nuevos dentro de una categoría ya
 * existente (ver CATEGORIAS_CON_EXTRAS). El respaldo en código de esos
 * productos es PRODUCTOS_EXTRA, que rellena `npm run sync:carta`.
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

    constructor() {
        // Solo en navegador: durante el prerender se emiten los precios de respaldo
        if (isPlatformBrowser(this.platformId)) {
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
            const overrides = filasAOverrides(filas);
            if (Object.keys(overrides).length > 0) {
                this.overrides.set(overrides);
            }
            this.nuevosHoja.set(detectarNuevos(filas, mapaCat, mapaEn));
        } catch {
            // Sin conexión con la hoja: se mantienen los precios y productos de respaldo del código
        }
    }

    /** Descarga y parsea una pestaña de nombres; tolerante a fallo (devuelve {}) */
    private async cargarNombres(tab: string): Promise<MapaNombres> {
        try {
            const csv = await firstValueFrom(
                this.http.get(sheetCsvUrl(tab), { responseType: 'text' })
            );
            return parsearNombres(csv);
        } catch {
            return {};
        }
    }

    /** Mezcla una colección del código con los precios de la hoja por encima */
    private mezclar<T extends { key: string }>(items: T[], campos: readonly (keyof T & string)[]): T[] {
        const overrides = this.overrides();
        return items.map(item => {
            const filaHoja = overrides[item.key];
            if (!filaHoja) return item;
            const mezclado = { ...item };
            for (const campo of campos) {
                // Solo se pisan campos que el código define para el producto:
                // la "forma" de la carta la marca carta-data.ts
                if (item[campo] !== undefined && filaHoja[campo]) {
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
                // Estructuralmente compatible con PriceItem/PanPriceRow/BebidaItem
                // (todos aceptan key/price/name/desc). Las 10 categorías con
                // extras usan uno de esos tipos.
                return { key: n.key, price: n.price, name: i18n.name, desc: i18n.desc } as unknown as T;
            });
        return nuevos.length ? [...base, ...nuevos] : base;
    }

    readonly aperitivos = computed<PriceItem[]>(() => this.mezclarConNuevos(APERITIVOS_PRICES, 'aperitivos', ['price']));
    readonly conservas = computed<PriceItem[]>(() => this.mezclarConNuevos(CONSERVAS_PRICES, 'conservas', ['price']));
    readonly menus = computed<PriceItem[]>(() => this.mezclarConNuevos(MENUS_PRICES, 'menus', ['price']));

    readonly embutidoGroups = computed<EmbutidoPriceGroup[]>(() =>
        EMBUTIDO_GROUPS_PRICES.map(grupo => ({
            groupKey: grupo.groupKey,
            items: this.mezclar(grupo.items, [
                'medioBocadillo',
                'bocadilloEntero',
                'torrada',
                'mediaTabla',
                'tabla',
            ]),
        }))
    );

    readonly panYTostadas = computed<PanPriceRow[]>(() => this.mezclarConNuevos(PAN_Y_TOSTADAS_PRICES, 'pan_y_tostadas', ['price']));
    readonly biquinis = computed<BiquiniPriceRow[]>(() => this.mezclar(BIQUINIS_PRICES, ['normal', 'maxi']));
    readonly calientes = computed<CalientePriceRow[]>(() => this.mezclar(CALIENTES_PRICES, ['medio', 'entero']));
    readonly suplementos = computed<SuplementoPriceRow[]>(() => this.mezclar(SUPLEMENTOS_PRICES, ['medio', 'entero']));
    readonly pizzas = computed<PriceItem[]>(() => this.mezclarConNuevos(PIZZAS_PRICES, 'pizzas', ['price']));
    readonly postres = computed<PriceItem[]>(() => this.mezclarConNuevos(POSTRES_PRICES, 'postres', ['price']));

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

/** Parsea una pestaña de nombres (clave, producto, descripcion?) en un mapa por clave */
function parsearNombres(csv: string): MapaNombres {
    const mapa: MapaNombres = {};
    for (const fila of parsearFilas(csv)) {
        const clave = fila['clave']?.trim();
        const name = fila['producto']?.trim();
        if (!clave || !name) continue;
        const desc = fila['descripcion']?.trim();
        mapa[clave] = desc ? { name, desc } : { name };
    }
    return mapa;
}

/**
 * Detecta productos nuevos: filas de "precios" cuya categoría admite altas y
 * cuya clave no existe ya en el código. El nombre en español sale de la propia
 * fila; catalán e inglés de los mapas de nombres (con respaldo al español).
 */
function detectarNuevos(
    filas: Record<string, string>[],
    mapaCat: MapaNombres,
    mapaEn: MapaNombres,
): ProductoExtra[] {
    const nuevos: ProductoExtra[] = [];
    for (const fila of filas) {
        const categoria = fila['categoria']?.trim();
        const clave = fila['clave']?.trim();
        const nombreEs = fila['producto']?.trim();
        if (!categoria || !clave || !nombreEs) continue;

        const conocidos = CATEGORIAS_CON_EXTRAS[categoria];
        if (!conocidos) continue; // categoría que no admite altas (o typo)
        if (conocidos.some(i => i.key === clave)) continue; // ya existe en el código

        const price = normalizarPrecio(fila['precio']);
        if (!price) continue; // sin precio no se puede pintar

        const descEs = fila['descripcion']?.trim();
        const es: ProductoExtraI18n = descEs ? { name: nombreEs, desc: descEs } : { name: nombreEs };
        nuevos.push({
            categoria,
            key: clave,
            price,
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
