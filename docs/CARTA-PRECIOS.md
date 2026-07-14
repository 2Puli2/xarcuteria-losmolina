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
- **No cambies** las columnas `categoria` ni `clave`: son las que conectan la
  hoja con la web.
- Las celdas de precio vacías significan "este formato no se vende para este
  producto" (sale — en la carta). Rellenar una celda que estaba vacía no añade
  el formato: eso requiere tocar código.
- Añadir o quitar productos también requiere tocar código
  (`carta-data.ts` + traducciones): la hoja solo manda en los precios.

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
