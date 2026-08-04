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
 * ⚠️ IMPORTANTE: ejecuta «Aplicar formato» ANTES que «➕ Añadir producto…».
 * Los permisos solo se pueden conceder ejecutando una función directamente
 * desde el menú; un diálogo no puede pedirlos por sí mismo, y el formulario
 * fallaría con «Authorisation is required to perform that action».
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

/**
 * Qué formatos de precio admite cada sección. Es la misma tabla que usa la web
 * (CATEGORIAS en price.service.ts): el formulario solo pide estos campos, para
 * no tener que adivinar cuál de las 14 columnas toca en cada caso.
 */
var FORMATOS_POR_CATEGORIA = {
    aperitivos: [['precio', 'Precio']],
    conservas: [['precio', 'Precio']],
    menus: [['precio', 'Precio']],
    pan_y_tostadas: [['precio', 'Precio']],
    pizzas: [['precio', 'Precio']],
    postres: [['precio', 'Precio']],
    refrescos: [['precio', 'Precio']],
    cervezas: [['precio', 'Precio']],
    vinos: [['precio', 'Precio']],
    cafes: [['precio', 'Precio']],
    biquinis: [['normal', 'Normal'], ['maxi', 'Maxi']],
    calientes: [['medio', 'Medio'], ['entero', 'Entero']],
    suplementos: [['medio', 'Medio'], ['entero', 'Entero']],
    bocadillo_dia: [['medioBocadillo', '½ Bocadillo'], ['bocadilloEntero', 'Bocadillo entero']],
    jamon: EMBUTIDO_FORMATOS(),
    embutidos_ibericos: EMBUTIDO_FORMATOS(),
    fiambres: EMBUTIDO_FORMATOS(),
    quesos: EMBUTIDO_FORMATOS(),
};

function EMBUTIDO_FORMATOS() {
    return [
        ['medioBocadillo', '½ Bocadillo'],
        ['bocadilloEntero', 'Bocadillo entero'],
        ['torrada', 'Torrada'],
        ['mediaTabla', '½ Tabla'],
        ['tabla', 'Tabla'],
    ];
}

/** Nombre bonito de cada sección, para el desplegable del formulario */
var NOMBRE_SECCION = {
    aperitivos: 'Aperitivos', conservas: 'Conservas', menus: 'Menús',
    jamon: 'Embutidos · Jamón', embutidos_ibericos: 'Embutidos · Ibéricos',
    fiambres: 'Embutidos · Fiambres', quesos: 'Embutidos · Quesos',
    pan_y_tostadas: 'Pan y tostadas', biquinis: 'Biquinis',
    calientes: 'Bocadillos calientes', suplementos: 'Suplementos',
    pizzas: 'Pizzas', postres: 'Postres', refrescos: 'Refrescos',
    cervezas: 'Cervezas', vinos: 'Vinos', cafes: 'Cafés',
    bocadillo_dia: '⭐ Bocadillo del día',
};

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
        .addItem('➕ Añadir producto…', 'mostrarFormulario')
        .addSeparator()
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

// ═══════════════════ Formulario para añadir productos ═══════════════════

/** Abre el diálogo. Rellenar 4 campos en vez de pelearse con 14 columnas. */
function mostrarFormulario() {
    var secciones = CATEGORIAS.map(function (c) {
        return { id: c, nombre: NOMBRE_SECCION[c] || c, formatos: FORMATOS_POR_CATEGORIA[c] || [] };
    });
    var html = HtmlService
        .createHtmlOutput(plantillaFormulario(secciones))
        .setWidth(460)
        .setHeight(560);
    SpreadsheetApp.getUi().showModalDialog(html, 'Añadir producto a la carta');
}

/**
 * Crea el producto: lo inserta al final de su sección en `precios` y añade sus
 * traducciones en `nombres_cat` y `nombres_en`. La clave se genera del nombre.
 * Devuelve un resumen para enseñarlo en el diálogo.
 */
function guardarProducto(datos) {
    var libro = SpreadsheetApp.getActiveSpreadsheet();
    var precios = libro.getSheetByName(PESTANA_PRECIOS);
    if (!precios) throw new Error('No encuentro la pestaña "' + PESTANA_PRECIOS + '".');

    var cabeceras = precios.getRange(1, 1, 1, precios.getLastColumn()).getValues()[0];
    var col = indicePorNombre(cabeceras);

    var nombre = String(datos.nombre || '').trim();
    if (!nombre) throw new Error('El producto necesita un nombre.');

    var clave = claveUnica(precios, col, nombre);

    // Fila nueva con solo las columnas que aplican a esta sección
    var fila = new Array(cabeceras.length).fill('');
    fila[col.categoria - 1] = datos.categoria;
    fila[col.clave - 1] = clave;
    fila[col.producto - 1] = nombre;
    if (col.descripcion) fila[col.descripcion - 1] = String(datos.descripcion || '').trim();

    var algunPrecio = false;
    Object.keys(datos.precios || {}).forEach(function (campo) {
        var valor = normalizarPrecio(datos.precios[campo]);
        if (valor && col[campo]) {
            fila[col[campo] - 1] = valor;
            algunPrecio = true;
        }
    });
    if (!algunPrecio) throw new Error('Pon al menos un precio: sin ninguno, la web ignora la fila.');

    // Insertar justo detrás del último producto de su misma sección, para que
    // quede agrupado visualmente (a la web el orden le da igual).
    var destino = ultimaFilaDeCategoria(precios, col, datos.categoria);
    precios.insertRowAfter(destino);
    precios.getRange(destino + 1, 1, 1, fila.length).setValues([fila]);

    // Traducciones (si se dejan vacías, la web muestra el español)
    anadirTraduccion(libro, 'nombres_cat', clave, datos.nombreCat, datos.descCat);
    anadirTraduccion(libro, 'nombres_en', clave, datos.nombreEn, datos.descEn);

    aplicarFormato();
    return { clave: clave, fila: destino + 1 };
}

/** Última fila ocupada por una categoría; si no existe, el final de la hoja */
function ultimaFilaDeCategoria(hoja, col, categoria) {
    var ultima = hoja.getLastRow();
    if (ultima < 2) return 1;
    var valores = hoja.getRange(2, col.categoria, ultima - 1, 1).getValues();
    var destino = 0;
    for (var i = 0; i < valores.length; i++) {
        if (String(valores[i][0]).trim() === categoria) destino = i + 2;
    }
    return destino || ultima;
}

/** Clave a partir del nombre: "Bikini de Chorizo" → "bikini_de_chorizo" */
function claveUnica(hoja, col, nombre) {
    var base = nombre
        .toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '') // quita acentos
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 40) || 'producto';

    var usadas = {};
    if (hoja.getLastRow() > 1) {
        hoja.getRange(2, col.clave, hoja.getLastRow() - 1, 1).getValues()
            .forEach(function (f) { usadas[String(f[0]).trim()] = true; });
    }
    if (!usadas[base]) return base;
    for (var n = 2; ; n++) {
        if (!usadas[base + '_' + n]) return base + '_' + n;
    }
}

function anadirTraduccion(libro, pestana, clave, nombre, descripcion) {
    var hoja = libro.getSheetByName(pestana);
    if (!hoja || !String(nombre || '').trim()) return;
    var col = indicePorNombre(hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0]);
    var fila = new Array(hoja.getLastColumn()).fill('');
    fila[col.clave - 1] = clave;
    fila[col.producto - 1] = String(nombre).trim();
    if (col.descripcion) fila[col.descripcion - 1] = String(descripcion || '').trim();
    hoja.appendRow(fila);
}

/** "6,9" o "6.9" → "6,90"; "7" → "7,00". Igual que hace la web al pintarlo. */
function normalizarPrecio(valor) {
    var texto = String(valor == null ? '' : valor).trim().replace(/[€\s]/g, '');
    if (!texto) return '';
    var numerico = texto.replace(',', '.');
    if (!/^\d+(\.\d+)?$/.test(numerico)) return texto;
    var partes = numerico.split('.');
    var decimal = (partes[1] || '') + '00';
    return partes[0] + ',' + decimal.slice(0, 2);
}

function plantillaFormulario(secciones) {
    return '' +
'<!DOCTYPE html><html><head><base target="_top"><style>' +
'body{font-family:Roboto,Arial,sans-serif;font-size:13px;margin:0;padding:16px;color:#202124}' +
'label{display:block;margin:12px 0 4px;font-weight:500}' +
'input,select{width:100%;box-sizing:border-box;padding:7px 8px;border:1px solid #dadce0;border-radius:4px;font-size:13px}' +
'.precios{display:flex;gap:8px;flex-wrap:wrap}.precios>div{flex:1;min-width:110px}' +
'fieldset{border:1px solid #e0e0e0;border-radius:4px;margin:16px 0 0;padding:0 12px 12px}' +
'legend{font-size:12px;color:#5f6368;padding:0 6px}' +
'.pie{margin-top:18px;display:flex;gap:8px;align-items:center}' +
'button{background:#0d1b1e;color:#fff;border:0;border-radius:4px;padding:9px 18px;font-size:13px;cursor:pointer}' +
'button:disabled{opacity:.5;cursor:default}' +
'.aviso{font-size:12px;color:#5f6368;margin-top:6px}' +
'.error{color:#c5221f;margin-left:4px}.ok{color:#188038;margin-left:4px}' +
'</style></head><body>' +
'<label>Sección</label><select id="cat" onchange="pintarPrecios()"></select>' +
'<label>Nombre (español) *</label><input id="nombre" autofocus>' +
'<label>Descripción (español)</label><input id="desc" placeholder="opcional">' +
'<label>Precios *</label><div class="precios" id="precios"></div>' +
'<div class="aviso">Puedes escribir 6,9 o 6.9: se guarda como 6,90. Deja vacío el formato que no vendas.</div>' +
'<fieldset><legend>Traducciones (opcional)</legend>' +
'<label>Catalán — nombre</label><input id="nombreCat">' +
'<label>Catalán — descripción</label><input id="descCat">' +
'<label>Inglés — nombre</label><input id="nombreEn">' +
'<label>Inglés — descripción</label><input id="descEn">' +
'<div class="aviso">Si lo dejas vacío, ese idioma mostrará el texto en español.</div>' +
'</fieldset>' +
'<div class="pie"><button id="btn" onclick="enviar()">Añadir a la carta</button><span id="msg"></span></div>' +
'<script>' +
'var SECCIONES=' + JSON.stringify(secciones) + ';' +
'var sel=document.getElementById("cat");' +
'SECCIONES.forEach(function(s){var o=document.createElement("option");o.value=s.id;o.textContent=s.nombre;sel.appendChild(o)});' +
'function pintarPrecios(){' +
'  var s=SECCIONES.filter(function(x){return x.id===sel.value})[0];' +
'  document.getElementById("precios").innerHTML=s.formatos.map(function(f){' +
'    return "<div><div style=\\"font-size:11px;color:#5f6368\\">"+f[1]+"</div>"+' +
'           "<input data-campo=\\""+f[0]+"\\" placeholder=\\"0,00\\"></div>"}).join("")}' +
'pintarPrecios();' +
'function enviar(){' +
'  var msg=document.getElementById("msg"), btn=document.getElementById("btn");' +
'  var nombre=document.getElementById("nombre").value.trim();' +
'  if(!nombre){msg.className="error";msg.textContent="Falta el nombre";return}' +
'  var precios={};' +
'  [].forEach.call(document.querySelectorAll("#precios input"),function(i){precios[i.dataset.campo]=i.value});' +
'  if(!Object.keys(precios).some(function(k){return precios[k].trim()})){' +
'    msg.className="error";msg.textContent="Pon al menos un precio";return}' +
'  btn.disabled=true;msg.className="";msg.textContent="Guardando…";' +
'  google.script.run.withSuccessHandler(function(r){' +
'      msg.className="ok";msg.textContent="Añadido como "+r.clave;' +
'      setTimeout(function(){google.script.host.close()},1200)})' +
'    .withFailureHandler(function(e){btn.disabled=false;msg.className="error";msg.textContent=e.message})' +
'    .guardarProducto({categoria:sel.value,nombre:nombre,' +
'      descripcion:document.getElementById("desc").value,precios:precios,' +
'      nombreCat:document.getElementById("nombreCat").value,descCat:document.getElementById("descCat").value,' +
'      nombreEn:document.getElementById("nombreEn").value,descEn:document.getElementById("descEn").value})}' +
'</script></body></html>';
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
