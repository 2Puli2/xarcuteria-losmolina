/**
 * Formato de la hoja de la carta — Xarcuteria Los Molina
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Da estilo a las pestañas `precios`, `nombres_cat` y `nombres_en`, y añade
 * avisos visuales para los errores que rompen la carta de la web.
 *
 * CÓMO USARLO
 *   1. En la hoja: Extensiones → Apps Script.
 *   2. Borra lo que haya y pega este fichero entero. Guarda (💾).
 *   3. Recarga la hoja. Aparece un menú nuevo: «🎨 Carta».
 *   4. Menú «🎨 Carta» → «Aplicar formato».
 *
 * La primera vez Google pedirá permiso para que el script edite la hoja: es
 * normal, el script es tuyo y solo toca ESTA hoja.
 *
 * ⚠️ El script NO cambia ningún dato: solo colores, anchos, validaciones y
 * avisos. Puedes ejecutarlo tantas veces como quieras (por ejemplo, cada vez
 * que añadas productos, para que el rayado por secciones se recalcule).
 */

// ─────────────────────────── Configuración ───────────────────────────

var PESTANA_PRECIOS = 'precios';
var PESTANAS_NOMBRES = ['nombres_cat', 'nombres_en'];

/** Columnas de precio: se dejan como TEXTO para que "6,90" no se vuelva número */
var COLUMNAS_PRECIO = [
    'precio', 'medioBocadillo', 'bocadilloEntero', 'torrada', 'mediaTabla',
    'tabla', 'normal', 'maxi', 'medio', 'entero',
];

/** Categorías válidas. Si algún día se añade una sección nueva, amplía esta lista */
var CATEGORIAS = [
    'aperitivos', 'conservas', 'menus', 'jamon', 'embutidos_ibericos',
    'fiambres', 'quesos', 'pan_y_tostadas', 'biquinis', 'calientes',
    'suplementos', 'pizzas', 'postres', 'refrescos', 'cervezas', 'vinos',
    'cafes', 'bocadillo_dia',
];

/** Qué significa cada columna (sale como nota al pasar el ratón por la cabecera) */
var AYUDA = {
    categoria: 'Sección de la carta. Elígela del desplegable: si te la inventas, la fila se ignora.',
    clave: '⚠️ NO LA CAMBIES en productos que ya existen: es lo que conecta esta fila con la web.',
    producto: 'Nombre en español, tal y como se verá en la carta.',
    descripcion: 'Texto pequeño bajo el nombre. Déjala vacía si no quieres descripción.',
    precio: 'Precio único (aperitivos, pizzas, bebidas…). Formato: 6,90',
    medioBocadillo: 'Embutidos y bocadillo del día. Formato: 6,90',
    bocadilloEntero: 'Embutidos y bocadillo del día. Formato: 6,90',
    torrada: 'Solo embutidos. Formato: 6,90',
    mediaTabla: 'Solo embutidos. Formato: 6,90',
    tabla: 'Solo embutidos. Formato: 6,90',
    normal: 'Solo biquinis. Formato: 6,90',
    maxi: 'Solo biquinis. Formato: 6,90',
    medio: 'Calientes y suplementos. Formato: 6,90',
    entero: 'Calientes y suplementos. Formato: 6,90',
};

var COLOR = {
    cabecera: '#0d1b1e',
    cabeceraTexto: '#ffffff',
    bandaA: '#ffffff',
    bandaB: '#f5f3e7',
    claveFondo: '#eceff1',
    aviso: '#fff3cd',   // formato de precio raro
    error: '#f8d7da',   // clave duplicada o producto sin nombre
    destacado: '#fdf0d5', // fila del bocadillo del día
    borde: '#aba361',
};

// ─────────────────────────── Menú ───────────────────────────

function onOpen() {
    SpreadsheetApp.getUi()
        .createMenu('🎨 Carta')
        .addItem('Aplicar formato', 'aplicarFormato')
        .addToUi();
}

// ─────────────────────────── Principal ───────────────────────────

function aplicarFormato() {
    var libro = SpreadsheetApp.getActiveSpreadsheet();

    var precios = libro.getSheetByName(PESTANA_PRECIOS);
    if (!precios) {
        SpreadsheetApp.getUi().alert(
            'No encuentro la pestaña "' + PESTANA_PRECIOS + '".\n\n' +
            'Revisa que se llame exactamente así, en minúsculas: es el nombre que busca la web.'
        );
        return;
    }
    formatearPrecios(precios);

    PESTANAS_NOMBRES.forEach(function (nombre) {
        var hoja = libro.getSheetByName(nombre);
        if (hoja) formatearNombres(hoja);
    });

    SpreadsheetApp.getActiveSpreadsheet().toast('Formato aplicado', '🎨 Carta', 5);
}

// ─────────────────────────── Pestaña "precios" ───────────────────────────

function formatearPrecios(hoja) {
    var ultimaFila = Math.max(hoja.getLastRow(), 2);
    var cabeceras = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0];
    var col = indicePorNombre(cabeceras); // {categoria: 1, clave: 2, ...}

    limpiar(hoja);
    estiloCabecera(hoja, cabeceras);
    hoja.setFrozenRows(1);
    if (col.clave) hoja.setFrozenColumns(col.clave);

    // Anchos: los textos necesitan sitio, los precios no
    if (col.categoria) hoja.setColumnWidth(col.categoria, 150);
    if (col.clave) hoja.setColumnWidth(col.clave, 190);
    if (col.producto) hoja.setColumnWidth(col.producto, 260);
    if (col.descripcion) hoja.setColumnWidth(col.descripcion, 320);
    COLUMNAS_PRECIO.forEach(function (nombre) {
        if (col[nombre]) hoja.setColumnWidth(col[nombre], 95);
    });

    var datos = hoja.getRange(2, 1, ultimaFila - 1, cabeceras.length);
    datos.setVerticalAlignment('middle').setFontSize(10);

    // Los precios, como TEXTO: así "6,90" no se convierte en número ni pierde
    // el cero final. Centrados para leerlos de un vistazo.
    COLUMNAS_PRECIO.forEach(function (nombre) {
        if (!col[nombre]) return;
        hoja.getRange(2, col[nombre], ultimaFila - 1, 1)
            .setNumberFormat('@')
            .setHorizontalAlignment('center');
    });

    // La clave, en gris y monoespaciada: se ve que es "de la máquina"
    if (col.clave) {
        hoja.getRange(2, col.clave, ultimaFila - 1, 1)
            .setBackground(COLOR.claveFondo)
            .setFontFamily('Roboto Mono')
            .setFontSize(9);
    }

    bandearPorCategoria(hoja, col, ultimaFila, cabeceras.length);
    desplegableCategorias(hoja, col, ultimaFila);
    avisos(hoja, col, ultimaFila, cabeceras.length);
    protegerClaves(hoja, col, ultimaFila);
}

/**
 * Pinta cada sección de un color alterno, para separarlas de un golpe de vista.
 * Es formato fijo (no condicional), así que conviene volver a ejecutar el
 * script después de añadir filas.
 */
function bandearPorCategoria(hoja, col, ultimaFila, numColumnas) {
    if (!col.categoria) return;
    var categorias = hoja.getRange(2, col.categoria, ultimaFila - 1, 1).getValues();
    var anterior = null;
    var usarB = false;

    for (var i = 0; i < categorias.length; i++) {
        var actual = String(categorias[i][0]).trim();
        if (actual !== anterior) {
            usarB = !usarB;
            anterior = actual;
        }
        var fondo = actual === 'bocadillo_dia' ? COLOR.destacado
                                               : (usarB ? COLOR.bandaB : COLOR.bandaA);
        hoja.getRange(2 + i, 1, 1, numColumnas).setBackground(fondo);
    }

    // La clave mantiene su gris por encima del rayado
    if (col.clave) {
        hoja.getRange(2, col.clave, ultimaFila - 1, 1).setBackground(COLOR.claveFondo);
    }
}

/** Desplegable en `categoria`: evita las erratas, que se ignoran en silencio */
function desplegableCategorias(hoja, col, ultimaFila) {
    if (!col.categoria) return;
    var regla = SpreadsheetApp.newDataValidation()
        .requireValueInList(CATEGORIAS, true)
        .setAllowInvalid(true) // avisa con un triangulito, pero no bloquea
        .setHelpText('Elige una sección de la lista. Una categoría inventada hace que la fila se ignore.')
        .build();
    hoja.getRange(2, col.categoria, ultimaFila - 1, 1).setDataValidation(regla);
}

/**
 * Avisos en color para los tres errores que de verdad hacen daño:
 *  · precio con formato raro (9 en vez de 9,00)
 *  · clave repetida (la web se queda con la primera y descarta el resto)
 *  · fila con precio pero sin nombre de producto (no se pinta)
 */
function avisos(hoja, col, ultimaFila, numColumnas) {
    var reglas = [];
    var letraClave = col.clave ? columnaALetra(col.clave) : null;
    var letraProducto = col.producto ? columnaALetra(col.producto) : null;

    // 1. Precios que no siguen el formato 0,00
    COLUMNAS_PRECIO.forEach(function (nombre) {
        if (!col[nombre]) return;
        var rango = hoja.getRange(2, col[nombre], ultimaFila - 1, 1);
        var letra = columnaALetra(col[nombre]);
        reglas.push(
            SpreadsheetApp.newConditionalFormatRule()
                .whenFormulaSatisfied(
                    '=AND($' + letra + '2<>"", NOT(REGEXMATCH(TO_TEXT($' + letra + '2), "^\\d+,\\d{2}$")))'
                )
                .setBackground(COLOR.aviso)
                .setRanges([rango])
                .build()
        );
    });

    // 2. Claves duplicadas
    if (letraClave) {
        reglas.push(
            SpreadsheetApp.newConditionalFormatRule()
                .whenFormulaSatisfied(
                    '=AND($' + letraClave + '2<>"", COUNTIF($' + letraClave + '$2:$' + letraClave + ', $' + letraClave + '2)>1)'
                )
                .setBackground(COLOR.error)
                .setRanges([hoja.getRange(2, col.clave, ultimaFila - 1, 1)])
                .build()
        );
    }

    // 3. Producto sin nombre
    if (letraClave && letraProducto) {
        reglas.push(
            SpreadsheetApp.newConditionalFormatRule()
                .whenFormulaSatisfied(
                    '=AND($' + letraClave + '2<>"", $' + letraProducto + '2="")'
                )
                .setBackground(COLOR.error)
                .setRanges([hoja.getRange(2, col.producto, ultimaFila - 1, 1)])
                .build()
        );
    }

    hoja.setConditionalFormatRules(reglas);
}

/** Protege cabecera y claves: avisa antes de romper lo que conecta hoja y web */
function protegerClaves(hoja, col, ultimaFila) {
    hoja.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach(function (p) {
        if (p.getDescription().indexOf('[carta]') === 0) p.remove();
    });

    hoja.getRange(1, 1, 1, hoja.getLastColumn())
        .protect()
        .setDescription('[carta] Cabecera: la web busca las columnas por estos nombres')
        .setWarningOnly(true);

    if (col.clave) {
        hoja.getRange(2, col.clave, ultimaFila - 1, 1)
            .protect()
            .setDescription('[carta] Claves: cambiar una desconecta el producto de la web')
            .setWarningOnly(true);
    }
}

// ─────────────────────── Pestañas de nombres ───────────────────────

function formatearNombres(hoja) {
    var ultimaFila = Math.max(hoja.getLastRow(), 2);
    var cabeceras = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0];
    var col = indicePorNombre(cabeceras);

    limpiar(hoja);
    estiloCabecera(hoja, cabeceras);
    hoja.setFrozenRows(1);

    if (col.clave) hoja.setColumnWidth(col.clave, 190);
    if (col.producto) hoja.setColumnWidth(col.producto, 280);
    if (col.descripcion) hoja.setColumnWidth(col.descripcion, 360);

    hoja.getRange(2, 1, ultimaFila - 1, cabeceras.length)
        .setFontSize(10)
        .setVerticalAlignment('middle');

    if (col.clave) {
        hoja.getRange(2, col.clave, ultimaFila - 1, 1)
            .setBackground(COLOR.claveFondo)
            .setFontFamily('Roboto Mono')
            .setFontSize(9);
    }

    // Rayado simple: aquí no hay secciones que separar
    var banda = hoja.getRange(2, 1, ultimaFila - 1, cabeceras.length);
    banda.getBandings().forEach(function (b) { b.remove(); });
    banda.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false);

    if (col.clave) {
        hoja.getRange(2, col.clave, ultimaFila - 1, 1).setBackground(COLOR.claveFondo);
    }
}

// ─────────────────────────── Utilidades ───────────────────────────

/** {nombreDeColumna: numeroDeColumna} a partir de la fila de cabecera */
function indicePorNombre(cabeceras) {
    var mapa = {};
    cabeceras.forEach(function (nombre, i) {
        var limpio = String(nombre).trim();
        if (limpio) mapa[limpio] = i + 1;
    });
    return mapa;
}

function estiloCabecera(hoja, cabeceras) {
    var rango = hoja.getRange(1, 1, 1, cabeceras.length);
    rango.setBackground(COLOR.cabecera)
        .setFontColor(COLOR.cabeceraTexto)
        .setFontWeight('bold')
        .setFontSize(10)
        .setHorizontalAlignment('center')
        .setVerticalAlignment('middle')
        .setBorder(null, null, true, null, null, null, COLOR.borde,
                   SpreadsheetApp.BorderStyle.SOLID_THICK);
    hoja.setRowHeight(1, 34);

    // Nota de ayuda en cada cabecera
    cabeceras.forEach(function (nombre, i) {
        var texto = AYUDA[String(nombre).trim()];
        if (texto) hoja.getRange(1, i + 1).setNote(texto);
    });
}

/** Quita formato previo para que reejecutar el script no acumule capas */
function limpiar(hoja) {
    var filas = Math.max(hoja.getLastRow(), 1);
    var columnas = Math.max(hoja.getLastColumn(), 1);
    hoja.getRange(1, 1, filas, columnas).getBandings().forEach(function (b) { b.remove(); });
    hoja.setConditionalFormatRules([]);
}

/** 1 → 'A', 27 → 'AA' */
function columnaALetra(numero) {
    var letra = '';
    while (numero > 0) {
        var resto = (numero - 1) % 26;
        letra = String.fromCharCode(65 + resto) + letra;
        numero = Math.floor((numero - resto) / 26);
    }
    return letra;
}
