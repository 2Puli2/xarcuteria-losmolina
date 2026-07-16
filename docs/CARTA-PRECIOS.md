# Precios de la carta — Google Sheet

Los precios de la carta (web y carta imprimible) se leen de una **Google Sheet
pública** al cargar la página. Para cambiar un precio basta con editar la hoja:
**no hay que recompilar ni subir nada a Hostinger**.

Si la hoja no responde (sin conexión, Google caído…), la web usa los precios de
respaldo definidos en `src/app/domain/constants/carta-data.ts`. La carta nunca
se queda vacía.

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

## Cómo cambiar un precio (para la dueña)

1. Abre la hoja de Google.
2. Busca el producto (columna `producto`, en español).
3. Cambia el precio en la columna que toque (formato con coma: `6,90`).
4. Listo. Al recargar la web ya se ve el precio nuevo.

Reglas:
- **No cambies** la columna `clave` de un producto que ya existe: es la que
  conecta la hoja con la web.
- Las celdas de precio vacías significan "este formato no se vende para este
  producto" (sale — en la carta). Rellenar una celda que estaba vacía no añade
  el formato a un producto existente: eso requiere tocar código.

## Añadir un producto nuevo desde la hoja

Se puede **dar de alta un producto nuevo** (con nombre y descripción en los 3
idiomas) sin tocar código, siempre que sea dentro de una de estas categorías,
que son las que admiten altas:

`aperitivos`, `conservas`, `menus`, `pan_y_tostadas`, `pizzas`, `postres`,
`refrescos`, `cervezas`, `vinos`, `cafes`.

**Preparación (solo la primera vez):** crea en la hoja dos pestañas para los
nombres en catalán e inglés, llamadas exactamente **`nombres_cat`** y
**`nombres_en`**. Importa en cada una su CSV inicial, que ya viene con **todas
las traducciones actuales** de la carta:
[`docs/nombres_cat-inicial.csv`](./nombres_cat-inicial.csv) y
[`docs/nombres_en-inicial.csv`](./nombres_en-inicial.csv). Compártelas igual que
`precios` ("Cualquier persona con el enlace → Lector").

> Nota: hoy la web solo consulta estas pestañas para los productos **nuevos**
> (los que no están en el código). Las traducciones de los productos que ya
> existen siguen saliendo del código; tenerlas también aquí sirve de
> referencia y deja las pestañas listas por si en el futuro se pasa toda la
> carta a la hoja.

Pasos:
1. En la pestaña **`precios`**, añade una fila nueva al final con:
   - `categoria`: una de las de arriba (exactamente igual).
   - `clave`: un identificador único sin espacios ni acentos (ej. `croquetas_casa`).
   - `producto`: el nombre en **español**.
   - `precio`: el precio con coma (ej. `4,50`).
   - `descripcion` (opcional): descripción en español.
2. Para el nombre en catalán e inglés, añade la misma `clave` en las pestañas
   **`nombres_cat`** y **`nombres_en`** (columnas `clave`, `producto`,
   `descripcion`). Si no lo haces, ese idioma mostrará el nombre en español.
3. Al recargar la web, el producto aparece **al final de su categoría**.

Limitaciones:
- El producto nuevo sale **al final** de su categoría (no se puede reordenar
  desde la hoja).
- **No** se pueden crear categorías nuevas ni añadir productos a `embutidos`,
  `biquinis`, `calientes` o `suplementos` desde la hoja: eso sigue requiriendo
  tocar código (`carta-data.ts` + traducciones).

## Respaldo en código (recuperación)

La hoja es la fuente en producción, pero si Google Sheets se cayera del todo,
los productos **nuevos** (que solo viven en la hoja) desaparecerían de la
carta. Para evitarlo hay un script que los "congela" en el código:

```
npm run sync:carta
```

Descarga la hoja y vuelca los productos nuevos al bloque `PRODUCTOS_EXTRA` de
`src/app/domain/constants/carta-data.ts` (solo ese bloque; no toca nada más).
Conviene ejecutarlo **antes de cada `ng build` + deploy**: así el respaldo en
código siempre incluye las últimas altas. Revisa el cambio con `git diff`
antes de subir.

(Nota: el script solo captura ALTAS de productos nuevos. Los cambios de precio
de productos que ya están en el código no se vuelcan al respaldo; ese caso se
recupera reescribiendo el precio a mano en `carta-data.ts`.)

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
