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
    PriceItem,
    EmbutidoPriceGroup,
    BiquiniPriceRow,
    CalientePriceRow,
    SuplementoPriceRow,
    PanPriceRow,
    BebidaItem,
} from '../../domain/constants/carta-data';
import { preciosCsvUrl } from './price.config';

/** overrides[clave][campo] = precio leído de la hoja (ej. overrides['fuet']['torrada'] = '7,90') */
type Overrides = Record<string, Record<string, string>>;

/**
 * Servicio de precios de la carta.
 *
 * Fuente de verdad en producción: la Google Sheet (pestaña "precios"), leída
 * como CSV al arrancar. carta-data.ts es el RESPALDO y define la "forma" de la
 * carta: qué productos existen, cómo se agrupan y qué campos de precio aplica
 * cada uno. Si la hoja no responde (offline, CORS, Google caído) o le falta
 * una clave/campo, se usa el precio del código: la carta nunca queda vacía.
 */
@Injectable({ providedIn: 'root' })
export class PrecioService {
    private readonly http = inject(HttpClient);
    private readonly platformId = inject(PLATFORM_ID);

    /** Precios leídos de la hoja; vacío = solo respaldo del código */
    private readonly overrides = signal<Overrides>({});

    constructor() {
        // Solo en navegador: durante el prerender se emiten los precios de respaldo
        if (isPlatformBrowser(this.platformId)) {
            this.cargarPreciosDeLaHoja();
        }
    }

    private async cargarPreciosDeLaHoja(): Promise<void> {
        try {
            const csv = await firstValueFrom(
                this.http.get(preciosCsvUrl(), { responseType: 'text' })
            );
            const overrides = parsearCsvPrecios(csv);
            if (Object.keys(overrides).length > 0) {
                this.overrides.set(overrides);
            }
        } catch {
            // Sin conexión con la hoja: se mantienen los precios de respaldo del código
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

    readonly aperitivos = computed<PriceItem[]>(() => this.mezclar(APERITIVOS_PRICES, ['price']));
    readonly conservas = computed<PriceItem[]>(() => this.mezclar(CONSERVAS_PRICES, ['price']));
    readonly menus = computed<PriceItem[]>(() => this.mezclar(MENUS_PRICES, ['price']));

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

    readonly panYTostadas = computed<PanPriceRow[]>(() => this.mezclar(PAN_Y_TOSTADAS_PRICES, ['price']));
    readonly biquinis = computed<BiquiniPriceRow[]>(() => this.mezclar(BIQUINIS_PRICES, ['normal', 'maxi']));
    readonly calientes = computed<CalientePriceRow[]>(() => this.mezclar(CALIENTES_PRICES, ['medio', 'entero']));
    readonly suplementos = computed<SuplementoPriceRow[]>(() => this.mezclar(SUPLEMENTOS_PRICES, ['medio', 'entero']));
    readonly pizzas = computed<PriceItem[]>(() => this.mezclar(PIZZAS_PRICES, ['price']));
    readonly postres = computed<PriceItem[]>(() => this.mezclar(POSTRES_PRICES, ['price']));

    readonly refrescos = computed<BebidaItem[]>(() => this.mezclar(REFRESCOS_DATA, ['price']));
    readonly cervezas = computed<BebidaItem[]>(() => this.mezclar(CERVEZAS_DATA, ['price']));
    readonly vinos = computed<BebidaItem[]>(() => this.mezclar(VINOS_DATA, ['price']));
    readonly cafes = computed<BebidaItem[]>(() => this.mezclar(CAFES_DATA, ['price']));
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

/** Convierte el CSV de la hoja en el mapa de overrides */
export function parsearCsvPrecios(csv: string): Overrides {
    const filas = parsearCsv(csv);
    if (filas.length < 2) return {};

    const cabecera = filas[0].map(c => c.trim());
    const idxClave = cabecera.indexOf('clave');
    if (idxClave === -1) return {};

    const overrides: Overrides = {};
    for (const fila of filas.slice(1)) {
        const clave = fila[idxClave]?.trim();
        if (!clave) continue;
        for (let i = 0; i < cabecera.length; i++) {
            const campo = CAMPOS_PRECIO[cabecera[i]];
            const valor = normalizarPrecio(fila[i]);
            if (campo && valor) {
                (overrides[clave] ??= {})[campo] = valor;
            }
        }
    }
    return overrides;
}

/**
 * Normaliza el precio al formato de la web ("6,90"). Rescata celdas que Google
 * haya convertido a número: "6.9" → "6,90", "6,9" → "6,90", "6" → "6,00".
 */
function normalizarPrecio(valor: string | undefined): string {
    const texto = (valor ?? '').trim();
    if (!texto) return '';
    const numerico = texto.replace(',', '.');
    if (!/^\d+(\.\d+)?$/.test(numerico)) return texto;
    const [entera, decimal = ''] = numerico.split('.');
    return `${entera},${decimal.padEnd(2, '0').slice(0, 2)}`;
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
