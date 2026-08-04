# Precios de la carta — Google Sheet

Los precios de la carta (web y carta imprimible) se leen de una **Google Sheet
pública** al cargar la página. Para cambiar un precio basta con editar la hoja:
**no hay que recompilar ni subir nada a Hostinger**.

Mientras se lee la hoja, la carta muestra "Cargando la carta…" en vez de
precios: los del código podrían estar desfasados y se verían un instante
antes de que llegue la hoja.

Si la hoja no responde (sin conexión, Google caído…), por defecto la web
**no** enseña precios: muestra un aviso de "No hemos podido cargar la carta"
en vez de la carta y de la carta imprimible. Es intencional: es preferible
avisar a enseñar un precio antiguo sin que se note. `carta-data.ts` sigue
siendo el respaldo, pero solo se activa a mano (ver "Si la hoja se cae" más
abajo).

## Crear la hoja (solo la primera vez)

1. Entra en [sheets.google.com](https://sheets.google.com) y crea una hoja de
   cálculo nueva. Nómbrala, por ejemplo, "Precios carta Los Molina".
2. Renombra la pestaña de abajo (doble clic sobre "Hoja 1") a: **precios**
   (exactamente así, en minúsculas).
3. Importa el CSV inicial: **Archivo → Importar → Subir** y elige
   [`docs/carta-precios-inicial.csv`](./carta-precios-inicial.csv). En el diálogo:
   - Ubicación de importación: **Reemplazar la hoja actual**.
   - Tipo de separador: **Coma**.
   - **Convertir texto en números, fechas y fórmulas: NO** ← importante, para
     que "6,90" se quede como texto y no pierda el cero final.
4. Congela la primera fila: **Ver → Inmovilizar → 1 fila**.
5. (Recomendado) Selecciona las columnas de precio (de `precio` a `entero`) y
   pon **Formato → Número → Texto sin formato**.
6. Compártela en solo lectura: botón **Compartir → Acceso general →
   "Cualquier persona con el enlace" → Lector**.

## Obtener el SHEET_ID y conectarlo a la web

El ID es el churro largo de la URL de la hoja:

```
https://docs.google.com/spreadsheets/d/ ⟨ESTO_ES_EL_ID⟩ /edit#gid=0
```

Pégalo en **`src/app/application/prices/price.config.ts`**, en la constante
`PRECIOS_SHEET_ID` (único sitio donde se configura). Después, un último
`ng build` + despliegue: a partir de ahí los cambios de precio ya no requieren
tocar código.

## Las tres pestañas

La hoja tiene tres pestañas, con estos nombres **exactos** (en minúsculas):

| Pestaña | Para qué sirve | Columnas |
|---|---|---|
| `precios` | Qué productos hay, sus precios y sus textos en **español** | `categoria`, `clave`, `producto`, `descripcion` + columnas de precio |
| `nombres_cat` | Nombres y descripciones en **catalán** | `clave`, `producto`, `descripcion` |
| `nombres_en` | Nombres y descripciones en **inglés** | `clave`, `producto`, `descripcion` |

> ⚠️ **El nombre de la pestaña importa mucho.** Si te equivocas al escribirlo,
> Google **no da error**: devuelve la primera pestaña como si fuera la que se
> ha pedido. La web detecta ese caso concreto y muestra el aviso de error en
> vez de precios equivocados, pero conviene revisar los nombres si algo deja
> de verse.

## Cambiar un precio, un nombre o una descripción (para la dueña)

1. Abre la hoja de Google.
2. Busca el producto por la columna `producto`.
3. Cambia lo que necesites:
   - **Precio**: la columna que toque, con coma (`6,90`).
   - **Nombre**: la columna `producto`.
   - **Descripción**: la columna `descripcion` (el texto pequeño gris bajo el
     nombre). Déjala vacía para que el producto no tenga descripción.
4. Para catalán e inglés, cambia lo mismo en `nombres_cat` y `nombres_en`,
   buscando la fila por su `clave`.
5. Listo. Al recargar la web ya se ve el cambio.

Reglas:
- **No cambies** la columna `clave` de un producto que ya existe: es la que
  conecta la hoja con la web. Es lo único que no debes tocar.
- La hoja **manda sobre el código**: si un producto está en la hoja, su nombre
  y su descripción salen de ahí. Por eso vaciar `descripcion` la quita de la
  carta (no "reaparece" la que hubiera en el código).
- Si una clave falta en `nombres_cat` o `nombres_en`, ese idioma muestra el
  texto en español.
- Las celdas de precio vacías significan "este formato no se vende para este
  producto" (sale — en la carta). **Rellenar una celda vacía pone ese formato
  a la venta**: si el Lomo Matanza solo se hacía en bocadillo y escribes un
  precio en `tabla`, a partir de ese momento se ofrece en tabla.
- Lo que todavía **no** se puede hacer desde la hoja es lo contrario: vaciar
  una celda que tenía precio no retira el formato (se sigue viendo el último
  precio conocido). Para dejar de ofrecer un formato, avisa a quien lleve la
  web.

## Bocadillo del día

El recuadro grande de la cabecera de la carta muestra el **bocadillo del día**,
y se pone desde la hoja como una fila más. Mientras no haya ninguno, ese
recuadro enseña el mensaje de siempre ("¡Recuerda preguntar por nuestras
ofertas…!").

En la pestaña **`precios`**, añade (o edita) una fila con:

| columna | qué poner |
|---|---|
| `categoria` | `bocadillo_dia` (exactamente así) |
| `clave` | `bocadillo_dia` — reutiliza siempre la misma fila |
| `producto` | el nombre del bocadillo, en español |
| `descripcion` | opcional: qué lleva |
| `medioBocadillo` | precio del medio bocadillo |
| `bocadilloEntero` | precio del bocadillo entero |

Para el catalán y el inglés, la misma `clave` en `nombres_cat` y `nombres_en`.

Detalles útiles:
- **Para quitarlo**, borra los dos precios de esa fila (o la fila entera). El
  recuadro vuelve solo al mensaje de siempre; no hace falta avisar a nadie.
- Puedes poner **solo uno de los dos precios**: se muestra únicamente ese
  formato.
- Si por lo que sea hubiera varias filas con categoría `bocadillo_dia`, se usa
  la primera.

## Añadir un producto nuevo desde la hoja

Se puede dar de alta un producto nuevo, con nombre y descripción en los 3
idiomas, **en cualquier categoría de la carta**, sin tocar código.

### La forma cómoda: el formulario

Con el script de formato instalado (ver «Dar formato a la hoja»), el menú
**«🎨 Carta» → «➕ Añadir producto…»** abre un formulario que:

- te deja elegir la sección de un desplegable;
- **solo te pide los precios que esa sección usa** (un biquini pide normal y
  maxi; un embutido, los cinco formatos), en vez de hacerte buscar entre las
  14 columnas;
- se inventa la `clave` por ti a partir del nombre, evitando duplicados;
- coloca la fila **al final de su sección**, no suelta al final de la hoja;
- escribe también las traducciones en `nombres_cat` y `nombres_en`;
- acepta `6,9` o `6.9` y lo guarda como `6,90`.

Es la vía recomendada. Lo de abajo es lo que hace por dentro, por si algún día
hay que hacerlo a mano.

### A mano

Pasos:
1. En la pestaña **`precios`**, añade una fila al final con:
   - `categoria`: una de las que ya aparecen en la columna (cópiala tal cual de
     otra fila de esa misma sección).
   - `clave`: un identificador único, sin espacios ni acentos (ej. `biquini_chorizo`).
   - `producto`: el nombre en **español**.
   - `descripcion` (opcional): la descripción en español.
   - **Las columnas de precio de su sección** (ver tabla de abajo).
2. Añade la misma `clave` en **`nombres_cat`** y **`nombres_en`** con su
   nombre y descripción. Si no lo haces, esos idiomas mostrarán el español.
3. Al recargar la web, el producto aparece **al final de su sección**.

Qué columnas de precio rellenar según la categoría:

| Categorías | Columnas de precio |
|---|---|
| `aperitivos`, `conservas`, `menus`, `pan_y_tostadas`, `pizzas`, `postres`, `refrescos`, `cervezas`, `vinos`, `cafes` | `precio` |
| `biquinis` | `normal`, `maxi` |
| `calientes`, `suplementos` | `medio`, `entero` |
| `jamon`, `embutidos_ibericos`, `fiambres`, `quesos` | `medioBocadillo`, `bocadilloEntero`, `torrada`, `mediaTabla`, `tabla` |

Ejemplo — un biquini nuevo de chorizo, picante, a 4,50€ el normal y 6,50€ el
maxi: fila en `precios` con `categoria` = `biquinis`, `clave` = `biquini_chorizo`,
`producto` = `Biquini de Chorizo`, `descripcion` = `Picante`, `normal` = `4,50`
y `maxi` = `6,50`. Deja el resto de columnas de precio vacías.

Limitaciones:
- El producto nuevo sale **al final** de su sección (no se puede reordenar
  desde la hoja).
- **No** se pueden crear secciones nuevas desde la hoja: una `categoria` que no
  exista ya se ignora. Eso sigue requiriendo tocar código.
- Basta con rellenar **al menos una** columna de precio; si las dejas todas
  vacías, la fila se ignora.

## Dar formato a la hoja

Hay un script que deja la hoja legible (secciones separadas por color, cabecera
fija, columnas con su ancho) y, sobre todo, **avisa en color de los errores que
rompen la carta**: precios mal escritos, claves repetidas o productos sin
nombre.

Está en [`docs/formato-hoja.gs`](./formato-hoja.gs). Para instalarlo:

1. En la hoja: **Extensiones → Apps Script**.
2. Borra lo que haya, pega el fichero entero y guarda.
3. Recarga la hoja: aparece el menú **«🎨 Carta»**.
4. **«🎨 Carta» → «Aplicar formato»**.

La primera vez Google pedirá permiso; es normal, el script solo toca esta hoja.
No modifica ningún dato: únicamente colores, anchos, validaciones y avisos.

> ⚠️ Ejecuta **«Aplicar formato» antes que «➕ Añadir producto…»**. Los permisos
> solo se conceden ejecutando una función desde el menú: un diálogo no puede
> pedirlos por sí mismo, y el formulario fallaría con *«Authorisation is
> required to perform that action»*. Si el menú tampoco te ofrece autorizar,
> abre el editor de Apps Script, elige `aplicarFormato` en el desplegable de
> funciones y pulsa **Ejecutar**.

Qué hace, además del estilo:
- **Desplegable en `categoria`**, para que no haya erratas (una categoría
  inventada hace que la fila se ignore sin avisar).
- **Precios en ámbar** cuando no siguen el formato `0,00` (por ejemplo `9` en
  vez de `9,00`). No están rotos —la web los normaliza— pero conviene verlos.
- **Claves duplicadas y productos sin nombre en rojo.**
- **Cabecera y columna `clave` protegidas** con aviso: siguen editándose, pero
  Google pregunta antes, que es justo lo que no debe tocarse a la ligera.
- Notas de ayuda al pasar el ratón por cada cabecera.

Conviene volver a ejecutarlo después de añadir productos, para que el color por
secciones se recalcule.

## Si la hoja se cae (respaldo en código)

Por defecto, si la hoja no responde, la carta muestra un aviso de error en
vez de precios (ver arriba). El respaldo en código existe pero está
**desactivado a propósito**: hay que activarlo a mano, para asegurarnos de
que cuando se active tiene precios de verdad al día, no los que había el día
que se escribió el código.

Pasos cuando os avisen de que la carta está caída:

1. Abre `src/app/domain/constants/carta-data.ts` y actualiza a mano los
   precios que sepas que están desactualizados (compáralos con la última
   copia de la hoja que tengas, ver "Copia de seguridad" abajo).
2. Si hay productos dados de alta desde la hoja recientemente y no capturados
   aún, ejecuta `npm run sync:carta`: descarga la hoja y los vuelca al bloque
   `PRODUCTOS_EXTRA` de `carta-data.ts` (solo ese bloque; no toca nada más).
   Revisa el cambio con `git diff` antes de seguir.
3. Abre `src/app/application/prices/price.config.ts` y pon
   `FALLBACK_ACTIVO` en `true`.
4. `ng build` + deploy.

Cuando la hoja vuelva a funcionar no hace falta hacer nada más: en cuanto
responde, sus precios vuelven a mandar por encima del respaldo. Puedes dejar
`FALLBACK_ACTIVO` en `true` (por si vuelve a caerse) o devolverlo a `false`
para que un futuro fallo avise en vez de enseñar precios silenciosamente
desactualizados.

(Nota: `npm run sync:carta` solo captura ALTAS de productos nuevos. Los
cambios de precio de productos que ya están en el código no se vuelcan solos;
ese caso siempre se recupera reescribiendo el precio a mano en
`carta-data.ts`, paso 1 de arriba.)

### Copia de seguridad de la hoja

Para poder hacer el paso 1 con precios reales (no los que había hace meses),
conviene tener una copia reciente de la hoja a mano. La propia Google Sheet ya
guarda un historial de versiones sin que nadie tenga que hacer nada: **Archivo
→ Historial de versiones → Ver historial de versiones**, desde ahí se puede
consultar o restaurar cualquier estado anterior. Lo único que hay que evitar
es que alguien borre la hoja entera o le quite el acceso de "Lector" al
enlace público.

Si además queréis una copia manual periódica (por ejemplo, tras cada revisión
de precios grande), basta con **Archivo → Descargar → Valores separados por
comas (.csv)** de la pestaña `precios` y guardarla donde la dueña prefiera. No
hace falta automatizarlo: es una red de seguridad adicional sobre el
historial de versiones, no un requisito para que el sistema funcione.

## Carta imprimible

La carta física ya no son ficheros HTML sueltos: es la ruta **`/carta/imprimir`**
de la propia web (`/cat/carta/imprimir` y `/en/carta/imprimir` para catalán e
inglés), con los mismos precios de la hoja y las mismas traducciones.

Para generar el PDF:
1. Abre `https://www.xarcuterialosmolina.com/carta/imprimir` en Chrome.
2. Ctrl+P (Cmd+P en Mac) → Destino: **Guardar como PDF**.
3. Papel: **A3** · Márgenes: **Ninguno** · Activa **Gráficos de fondo**.
4. Guarda: salen 2 páginas A3 con el diseño de siempre.

El QR físico (`public/images/qr-carta-los-molina.png`) apunta a
`https://www.xarcuterialosmolina.com/carta` y sigue funcionando igual.

## Si algún día falla por CORS

El endpoint que se usa (`.../gviz/tq?tqx=out:csv`) responde con CORS abierto
para hojas públicas y no necesita clave. Si Google lo cambiara, la alternativa
(también gratuita) está documentada en `price.config.ts`: publicar la hoja con
**Archivo → Compartir → Publicar en la web → CSV** y sustituir la URL.
