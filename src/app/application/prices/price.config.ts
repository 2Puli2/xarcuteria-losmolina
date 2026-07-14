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
export const PRECIOS_SHEET_ID = 'PEGA_AQUI_EL_ID_DE_LA_HOJA';

/** Nombre de la pestaña dentro de la hoja de cálculo */
export const PRECIOS_SHEET_TAB = 'precios';

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
export function preciosCsvUrl(): string {
    // Cache-buster para saltarse la caché intermedia y ver los cambios al momento
    return (
        `https://docs.google.com/spreadsheets/d/${PRECIOS_SHEET_ID}/gviz/tq` +
        `?tqx=out:csv&sheet=${PRECIOS_SHEET_TAB}&_=${Date.now()}`
    );
}
