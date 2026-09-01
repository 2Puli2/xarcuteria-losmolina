#!/usr/bin/env node
/**
 * Recuperación: vuelca los PRODUCTOS NUEVOS de la Google Sheet al código.
 *
 *   npm run sync:carta
 *
 * Descarga las pestañas "precios", "nombres_cat" y "nombres_en", detecta los
 * productos que existen en la hoja pero NO en el código (altas hechas por la
 * dueña desde el Excel) y regenera el bloque PRODUCTOS_EXTRA de
 * src/app/domain/constants/carta-data.ts. Así, si Google Sheets se cae, esos
 * productos siguen apareciendo en la carta con su precio y sus nombres en los
 * 3 idiomas.
 *
 * IMPORTANTE (alcance): solo captura ALTAS de productos nuevos. NO reescribe
 * los precios de los productos que ya están en el código (esos siguen siendo
 * el respaldo tal cual). Solo toca un archivo y un solo bloque marcado, por lo
 * que es seguro de re-ejecutar.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(__dirname, '..');
const CONFIG_PATH = resolve(RAIZ, 'src/app/application/prices/price.config.ts');
const DATA_PATH = resolve(RAIZ, 'src/app/domain/constants/carta-data.ts');

const MARCA_INI = '// >>> sync:productos-extra';
const MARCA_FIN = '// <<< sync:productos-extra';

/**
 * Campos de precio de cada categoría (deben coincidir con CATEGORIAS de
 * PrecioService). 'price' se lee de la columna 'precio' de la hoja.
 */
const CAMPOS_EMBUTIDO = ['medioBocadillo', 'bocadilloEntero', 'torrada', 'mediaTabla', 'tabla'];
const CAMPOS_POR_CATEGORIA = {
    aperitivos: ['price'],
    conservas: ['price'],
    menus: ['price'],
    pan_y_tostadas: ['price'],
    pizzas: ['price'],
    postres: ['price'],
    refrescos: ['price'],
    cervezas: ['price'],
    vinos: ['price'],
    cafes: ['price'],
    biquinis: ['normal', 'maxi'],
    calientes: ['medio', 'entero'],
    suplementos: ['medio', 'entero'],
    jamon: CAMPOS_EMBUTIDO,
    embutidos_ibericos: CAMPOS_EMBUTIDO,
    fiambres: CAMPOS_EMBUTIDO,
    quesos: CAMPOS_EMBUTIDO,
};

// ─────────────────────────── utilidades ───────────────────────────

/** Parser CSV mínimo con comillas (mismo que PrecioService) */
function parsearCsv(csv) {
    const filas = [];
    let fila = [];
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
    if (campo !== '' || fila.length > 0) { fila.push(campo); filas.push(fila); }
    return filas;
}

/** CSV → filas-objeto indexadas por cabecera */
function parsearFilas(csv) {
    const filas = parsearCsv(csv);
    if (filas.length < 2) return [];
    const cabecera = filas[0].map(c => c.trim());
    return filas.slice(1).map(fila => {
        const obj = {};
        cabecera.forEach((col, i) => { obj[col] = (fila[i] ?? '').trim(); });
        return obj;
    });
}

/** Igual que PrecioService.normalizarPrecio: "6.9"→"6,90", "6"→"6,00", "6,90 €"→"6,90" */
function normalizarPrecio(valor) {
    const texto = (valor ?? '').trim();
    if (!texto) return '';
    const numerico = texto.replace(/[€\s]/g, '').replace(',', '.');
    if (!/^\d+(\.\d+)?$/.test(numerico)) return texto;
    const [entera, decimal = ''] = numerico.split('.');
    return `${entera},${decimal.padEnd(2, '0').slice(0, 2)}`;
}

/** clave→{name, desc?} desde una pestaña de nombres */
function parsearNombres(csv) {
    const mapa = {};
    for (const fila of parsearFilas(csv)) {
        const clave = (fila['clave'] || '').trim();
        const name = (fila['producto'] || '').trim();
        if (!clave || !name) continue;
        const desc = (fila['descripcion'] || '').trim();
        mapa[clave] = desc ? { name, desc } : { name };
    }
    return mapa;
}

function sheetCsvUrl(sheetId, tab) {
    return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq` +
        `?tqx=out:csv&sheet=${encodeURIComponent(tab)}&_=${Date.now()}`;
}

async function fetchCsv(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const texto = await res.text();
    // gviz devuelve HTML en vez de CSV cuando la hoja/pestaña no es pública o no existe
    if (texto.trimStart().startsWith('<')) throw new Error('respuesta no-CSV (¿hoja privada o pestaña inexistente?)');
    return texto;
}

/** Literal de string en comillas simples, escapando \ y ' */
function q(s) {
    return `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function i18nLiteral(o) {
    return o.desc ? `{ name: ${q(o.name)}, desc: ${q(o.desc)} }` : `{ name: ${q(o.name)} }`;
}

function preciosLiteral(precios) {
    const campos = Object.entries(precios).map(([campo, valor]) => `${campo}: ${q(valor)}`);
    return `{ ${campos.join(', ')} }`;
}

function entradaLiteral(p) {
    return [
        '    {',
        `        categoria: ${q(p.categoria)},`,
        `        key: ${q(p.key)},`,
        `        precios: ${preciosLiteral(p.precios)},`,
        `        es: ${i18nLiteral(p.es)},`,
        `        cat: ${i18nLiteral(p.cat)},`,
        `        en: ${i18nLiteral(p.en)},`,
        '    },',
    ].join('\n');
}

// ─────────────────────────── main ───────────────────────────

async function main() {
    const config = await readFile(CONFIG_PATH, 'utf8');
    const idMatch = config.match(/PRECIOS_SHEET_ID\s*=\s*'([^']+)'/);
    if (!idMatch) throw new Error(`No se encontró PRECIOS_SHEET_ID en ${CONFIG_PATH}`);
    const sheetId = idMatch[1];
    if (sheetId.includes('PEGA_AQUI')) {
        throw new Error('PRECIOS_SHEET_ID sigue con el valor de ejemplo; pega el ID real primero.');
    }

    console.log(`Leyendo hoja ${sheetId}…`);

    // "precios" es obligatoria; los nombres son tolerantes a fallo (pestaña opcional)
    const csvPrecios = await fetchCsv(sheetCsvUrl(sheetId, 'precios'));
    const mapaCat = await fetchCsv(sheetCsvUrl(sheetId, 'nombres_cat')).then(parsearNombres).catch(() => ({}));
    const mapaEn = await fetchCsv(sheetCsvUrl(sheetId, 'nombres_en')).then(parsearNombres).catch(() => ({}));

    // Claves ya conocidas por el código: se leen de carta-data.ts FUERA del bloque
    // PRODUCTOS_EXTRA (si no, los productos ya syncados se contarían como conocidos)
    const dataOriginal = await readFile(DATA_PATH, 'utf8');
    const iIni = dataOriginal.indexOf(MARCA_INI);
    const iFin = dataOriginal.indexOf(MARCA_FIN);
    if (iIni === -1 || iFin === -1 || iFin < iIni) {
        throw new Error(`No se encontraron los marcadores sync:productos-extra en ${DATA_PATH}`);
    }
    const fueraDelBloque = dataOriginal.slice(0, iIni) + dataOriginal.slice(iFin + MARCA_FIN.length);
    const conocidas = new Set([...fueraDelBloque.matchAll(/\bkey:\s*'([^']+)'/g)].map(m => m[1]));

    // Detectar productos nuevos
    const filas = parsearFilas(csvPrecios);
    const nuevos = [];
    const ignoradas = new Set();
    for (const fila of filas) {
        const categoria = (fila['categoria'] || '').trim();
        const key = (fila['clave'] || '').trim();
        const nombreEs = (fila['producto'] || '').trim();
        if (!categoria || !key || !nombreEs) continue;
        if (conocidas.has(key)) continue;
        const campos = CAMPOS_POR_CATEGORIA[categoria];
        if (!campos) { ignoradas.add(`${key} (categoría desconocida: ${categoria})`); continue; }

        // Solo los campos de precio de esta categoría ('precio' en la hoja → 'price')
        const precios = {};
        for (const campo of campos) {
            const valor = normalizarPrecio(fila[campo === 'price' ? 'precio' : campo]);
            if (valor) precios[campo] = valor;
        }
        if (Object.keys(precios).length === 0) { ignoradas.add(`${key} (sin precio)`); continue; }

        const descEs = (fila['descripcion'] || '').trim();
        const es = descEs ? { name: nombreEs, desc: descEs } : { name: nombreEs };
        nuevos.push({ categoria, key, precios, es, cat: mapaCat[key] || es, en: mapaEn[key] || es });
    }

    // Regenerar el bloque
    const cuerpo = nuevos.length
        ? `export const PRODUCTOS_EXTRA: ProductoExtra[] = [\n${nuevos.map(entradaLiteral).join('\n')}\n];`
        : `export const PRODUCTOS_EXTRA: ProductoExtra[] = [];`;
    const bloque = `${MARCA_INI}\n${cuerpo}\n${MARCA_FIN}`;
    const dataNuevo = dataOriginal.slice(0, iIni) + bloque + dataOriginal.slice(iFin + MARCA_FIN.length);

    if (dataNuevo === dataOriginal) {
        console.log('Sin cambios: PRODUCTOS_EXTRA ya está al día.');
    } else {
        await writeFile(DATA_PATH, dataNuevo, 'utf8');
        console.log(`Actualizado ${DATA_PATH}`);
    }

    console.log(`\n${nuevos.length} producto(s) nuevo(s) capturado(s) en PRODUCTOS_EXTRA:`);
    for (const p of nuevos) {
        const importes = Object.entries(p.precios).map(([c, v]) => `${c} ${v}€`).join(', ');
        console.log(`  · ${p.categoria} / ${p.key} — ${p.es.name} (${importes})`);
    }
    if (ignoradas.size) {
        console.log(`\n${ignoradas.size} fila(s) de la hoja ignorada(s) (categoría no admite altas o sin precio):`);
        for (const s of ignoradas) console.log(`  · ${s}`);
    }

    // Bajas: claves del código sin fila en la hoja. La web ya no las pinta (la
    // hoja manda), pero siguen escritas en carta-data.ts, así que volverían a
    // salir si algún día se activa FALLBACK_ACTIVO. Solo se avisa: quitarlas del
    // código es una decisión a mano, no algo que deba hacer este script.
    const clavesHoja = new Set(filas.map(f => (f['clave'] || '').trim()).filter(Boolean));
    const bajas = [...conocidas].filter(clave => !clavesHoja.has(clave));
    if (bajas.length) {
        console.log(`\n${bajas.length} producto(s) del código sin fila en la hoja (dados de baja en la carta):`);
        for (const clave of bajas) console.log(`  · ${clave}`);
        console.log('  Ya no se pintan. Siguen en carta-data.ts como respaldo: quítalos de ahí');
        console.log('  cuando la baja sea definitiva.');
    }

    console.log('\nRevisa el cambio con `git diff` y recuerda `ng build` + deploy para congelar el respaldo.');
}

main().catch(err => {
    console.error(`\n✗ sync:carta falló: ${err.message}`);
    process.exit(1);
});
