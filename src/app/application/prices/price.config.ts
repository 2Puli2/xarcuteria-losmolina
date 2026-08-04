/**
 * Configuración de la hoja de precios (Google Sheets).
 *
 * ⚠️ ÚNICO SITIO donde se cambia la hoja: pega aquí el ID de la Google Sheet.
 * El ID es la parte larga de la URL de la hoja:
 *   https://docs.google.com/spreadsheets/d/⟨ESTE_ES_EL_ID⟩/edit
 *
 * Requisitos de la hoja:
 *  - Compartida como "Cualquier persona con el enlace → Lector".
 *  - Una pestaña llamada exactamente "precios" (ver docs/CARTA-PRECIOS.md).
 */
export const PRECIOS_SHEET_ID = '1OcvM2g8j8g4X0sP3knGN2CG9LAlOThRWcAhX0WXY2PQ';

/**
 * Interruptor manual del respaldo en código.
 *
 * Por defecto en `false`: si la hoja de precios no responde (o responde sin
 * filas válidas), la carta NO muestra los precios de `carta-data.ts` —
 * muestra un aviso de error. Así nunca se enseña un precio antiguo sin que
 * se note.
 *
 * Si Google Sheets se cae de verdad y hay que mantener la carta visible con
 * el respaldo mientras se soluciona:
 *  1. Actualiza a mano los precios en `carta-data.ts` con los últimos
 *     conocidos.
 *  2. Pon esta constante en `true`.
 *  3. `ng build` + deploy.
 * Cuando la hoja vuelva a responder, puede quedarse en `true` sin problema
 * (la hoja manda en cuanto responde) o volver a `false`.
 */
export const FALLBACK_ACTIVO = false;

/** Pestaña canónica: qué productos existen, en qué categoría y sus precios */
export const PRECIOS_SHEET_TAB = 'precios';

/** Pestañas de traducción (solo para productos añadidos vía hoja): nombre/desc por clave */
export const NOMBRES_SHEET_TAB_CAT = 'nombres_cat';
export const NOMBRES_SHEET_TAB_EN = 'nombres_en';

/**
 * Endpoint gviz que devuelve la pestaña como CSV.
 * Funciona desde el navegador (responde con CORS abierto) para hojas públicas,
 * sin API key ni backend.
 *
 * CONTINGENCIA: si Google llegara a bloquear este endpoint por CORS, usar
 * "Archivo → Compartir → Publicar en la web → CSV" en la hoja y sustituir
 * esta URL por la que genera Google (formato
 * https://docs.google.com/spreadsheets/d/e/⟨ID_PUBLICACION⟩/pub?output=csv),
 * que también responde con CORS abierto y es igual de gratuita.
 */
export function sheetCsvUrl(tab: string): string {
    // Cache-buster para saltarse la caché intermedia y ver los cambios al momento
    return (
        `https://docs.google.com/spreadsheets/d/${PRECIOS_SHEET_ID}/gviz/tq` +
        `?tqx=out:csv&sheet=${encodeURIComponent(tab)}&_=${Date.now()}`
    );
}

/** URL CSV de la pestaña de precios (atajo de sheetCsvUrl) */
export function preciosCsvUrl(): string {
    return sheetCsvUrl(PRECIOS_SHEET_TAB);
}
