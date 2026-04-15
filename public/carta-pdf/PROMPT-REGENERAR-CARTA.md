# Prompt para regenerar la carta física — Xarcuteria Los Molina

Usa este prompt cuando necesites actualizar o regenerar cualquiera de los tres archivos de carta imprimible (`carta-es.html`, `carta-cat.html`, `carta-en.html`).

---

## Prompt de regeneración

```
Eres un experto en maquetación HTML/CSS para impresión en formato A4.
Necesito que actualices o regeneres la carta física imprimible de la Xarcuteria Los Molina.

### Contexto del proyecto
- Proyecto Angular en: src/app/
- Datos de precios: src/app/domain/constants/carta-data.ts
- Traducciones: src/app/application/language/translations/es.ts | cat.ts | en.ts
- Carpeta de salida: public/carta-pdf/

### Sistema de diseño
- Colores:
  --red:    #ac2521  (títulos de sección, bordes izquierdos de promos, encabezados de grupo en tabla)
  --gold:   #aba361  (subtítulos, precios, elementos dorados)
  --dark:   #0d1b1e  (fondo principal de cada página)
  --light:  #ffffff  (texto principal)
  --gray:   #c8c8c8  (descripciones, notas)
- Tipografías: 'Reddit Sans Condensed' (cabeceras/títulos) y 'Reddit Sans' (cuerpo), cargadas desde Google Fonts
- Tamaño de página: A4 (210mm × 297mm), sin márgenes externos (@page { size: A4; margin: 0; })
- Padding interior de cada página: 10mm 10mm 8mm (print: 10mm 10mm 16mm)
- Forzar fondo oscuro en impresión: -webkit-print-color-adjust: exact; print-color-adjust: exact

### Estructura de páginas (3 páginas por idioma)

**Página 1 — Bebidas + Aperitivos + Conservas + Menús**
- Cabecera completa (.header): logo, tagline, dirección
- Nota informativa (.header-note)
- Sección "Bebidas": layout dos columnas (.two-col)
  - Columna izquierda: Refrescos (lista) + Cafés (lista)
  - Columna derecha: Cervezas (tabla 3 cols: Cerveza/Clara × Pequeña/Grande/Jarra) + cervezas especiales + Vinos (lista) + nota precio
- Sección "Aperitivos y Conservas": layout dos columnas
  - Columna izquierda: lista de aperitivos
  - Columna derecha: lista conservas Espinaler + 3 menús con descripción
- Pie de página absoluto (.footer)

**Página 2 — Embutidos + Pan y Tostadas**
- Cabecera pequeña (.header-small): brand izquierda, título sección derecha
- Nota sobre tipos de pan
- Tabla completa de embutidos (6 columnas: Producto, ½Bocadillo, Bocadillo, Torrada, ½Tabla, Tabla)
  - Grupos: Jamón / Embutidos Ibéricos / Fiambres y Embutidos / Quesos
  - Filas de cabecera de grupo con class="group-header"
- Sección "Pan y Tostadas": grid 4 columnas
- Pie de página absoluto

**Página 3 — Bocadillos + Pizzas + Postres**
- Cabecera pequeña
- Layout dos columnas
  - Columna izquierda: Biquinis (tabla Normal/Maxi) + Calientes (tabla Mitad/Entero) + Suplementos (tabla Mitad/Entero)
  - Columna derecha: Pizzas (lista) + Postres (lista) + Horario (lista) + Leyenda + Promo miércoles
- Pie de página absoluto

### Clases CSS clave
| Clase | Uso |
|-------|-----|
| `.page` | Contenedor A4, `page-break-after: always` |
| `.header` | Cabecera completa (página 1) |
| `.header-small` | Cabecera compacta (páginas 2 y 3) |
| `.header-note` | Nota destacada bajo la cabecera |
| `.section-title` | Título de sección (rojo, mayúsculas, borde inferior rojo) |
| `.subsection-title` | Subtítulo (dorado, mayúsculas, borde inferior dorado semitransparente) |
| `.list` + `.list-item` | Listas de productos con precio a la derecha |
| `.two-col` | Grid de 2 columnas (1fr 1fr) con gap 5mm |
| `.table-wrap` + `table` | Tablas con cabecera dorada y filas alternas |
| `.group-header` | Fila separadora de grupo en tabla (fondo rojo semitransparente) |
| `.footer` | Pie de página absoluto |

### Qué actualizar
Cuando cambien los datos, sigue estas reglas:

1. **Cambio de precio**: localiza el producto en `carta-data.ts` y actualiza el valor `€` en el HTML correspondiente.
2. **Nuevo producto en lista**: añade un `<div class="list-item">` con `.item-name`, `.item-desc` (opcional) y `.item-price`.
3. **Nuevo producto en tabla de embutidos**: añade un `<tr>` con `<td class="col-name">` + las celdas de precio. Si no tiene un formato (ej. sin ½tabla), deja la celda vacía o con `—`.
4. **Nuevo grupo en tabla de embutidos**: añade `<tr class="group-header"><td colspan="6">Nombre del grupo</td></tr>`.
5. **Cambio de texto/traducción**: actualiza el literal correspondiente en `es.ts`, `cat.ts` o `en.ts` y refleja el cambio en el HTML del idioma afectado.
6. **Nuevo idioma**: copia el archivo `carta-es.html` completo, cambia `<html lang="xx">` y traduce todos los literales usando el archivo de traducciones correspondiente.

### Archivos a generar
- `public/carta-pdf/carta-es.html` — Castellano
- `public/carta-pdf/carta-cat.html` — Català
- `public/carta-pdf/carta-en.html` — English

### Cómo imprimir/exportar a PDF
1. Abre el archivo HTML en Google Chrome.
2. Menú → Imprimir (Ctrl+P).
3. Destino: "Guardar como PDF".
4. Tamaño de papel: A4.
5. Márgenes: Ninguno (o "Mínimos" si el navegador no permite "Ninguno").
6. Activa "Gráficos de fondo" (Background graphics) para que el fondo oscuro se imprima.
7. Guarda. Cada `.page` será una página del PDF.

### Instrucción para la IA
Cuando se te pida actualizar la carta:
1. Lee el archivo `carta-data.ts` para obtener los precios actuales.
2. Lee el archivo de traducciones del idioma solicitado.
3. Aplica solo los cambios indicados, manteniendo el resto del HTML y CSS intacto.
4. Verifica que cada página tenga exactamente su sección asignada y que el footer esté posicionado correctamente.
5. No cambies la paleta de colores ni las tipografías salvo indicación explícita.
```

---

## Notas adicionales

- Los tres archivos HTML son completamente autocontenidos (CSS embebido, sin dependencias externas salvo la carga de Google Fonts).
- La clase `page-break-after: always` garantiza que cada `.page` ocupe exactamente una hoja A4 al imprimir.
- El fondo oscuro se preserva en la impresión gracias a `print-color-adjust: exact`.
- Si la carta crece mucho, considera dividir las secciones en más páginas añadiendo más bloques `.page` y ajustando el contenido.

---

*Última actualización: Junio 2025 · Xarcuteria Los Molina — Frederic Soler, 17, El Prat de Llobregat*
