# 📋 Guía de Colocación de Iconos en la Carta

## ✅ Estado Actual
Los iconos ya están implementados y funcionando. La leyenda se encuentra **justo encima de la navegación rápida**, y los iconos aparecen **junto al nombre de cada item**.

---

## 🎯 Ubicación de los Iconos

### 1️⃣ Leyenda (Encabezado)
**Ubicación**: `[carta.html](carta.html)` líneas 32-39
**Posición visual**: Entre la navegación rápida y la sección de bebidas

```html
<!-- Leyenda -->
<div class="carta__legend">
  <div class="carta__legend-title">{{ idioma.t().carta.legendTitle }}</div>
  <div class="carta__legend-item">
    <span class="carta__legend-icon">★</span>
    <span>{{ idioma.t().carta.legendFavorite }}</span>
  </div>
  <div class="carta__legend-item">
    <span class="carta__legend-icon">🌾</span>
    <span>{{ idioma.t().carta.legendGlutenFree }}</span>
  </div>
</div>
```

**CSS**: `[carta-base.scss](carta-base.scss#L92-L136)` - Estilos de la leyenda

---

### 2️⃣ Iconos en Items de Bebidas
**Ubicación**: `[carta.html](carta.html)` líneas 43-120

Cada sección de bebidas (Refrescos, Cervezas, Vinos, Cafés) tiene esta estructura:

```html
<span class="carta__list-item-name">
  {{ item.name }}
  @if (item.favorite || item.glutenFree) {
    <span class="carta__list-item-icons">
      @if (item.favorite) {
        <span class="carta__icon-favorite">★</span>
      }
      @if (item.glutenFree) {
        <span class="carta__icon-gluten-free">🌾</span>
      }
    </span>
  }
</span>
```

**Posición visual del icono**: 
- 📍 Al lado derecho del nombre del item
- 🎨 Color oro (#FFD700) para ★ favorito
- 🌾 Color predeterminado para sin gluten

---

## 🔧 Cómo Funcionan los Indicadores

### Datos (carta-data.ts)
Cada bebida puede tener dos propiedades booleanas:

```typescript
export interface BebidaItem {
    name: string;
    desc?: string;
    price: string;
    favorite?: boolean;      // ← Muestra ★
    glutenFree?: boolean;    // ← Muestra 🌾
}
```

### Ejemplos de items marcados:

**REFRESCOS:**
- ✅ Zumo Naranja Natural (grande) → ★ 🌾
- ✅ Todos los refrescos → 🌾

**CERVEZAS:**
- ✅ Turia → ★
- ✅ Complot IPA → ★
- ✅ Free Damm (todas) → 🌾

**VINOS:**
- ✅ Copa de vino Rioja → ★
- ✅ Todos los vinos → 🌾

**CAFÉS:**
- ✅ Americano → ★
- ✅ Todos (menos Cola Cao) → 🌾

---

## 🎨 Estilos CSS

### Clase: `.carta__legend`
```scss
&__legend {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-md;
  justify-content: center;
  align-items: center;
  padding: $spacing-md;
  background: linear-gradient(135deg, rgba($color-accent, 0.08), rgba($color-accent, 0.03));
  border: 1px solid rgba($color-accent, 0.2);
  border-radius: $border-radius-md;
  margin-bottom: $spacing-md;
}
```

### Clase: `.carta__list-item-icons`
```scss
&__list-item-icons {
  display: flex;
  gap: $spacing-xs;
  align-items: center;
  margin-left: $spacing-sm;
}
```

### Clase: `.carta__icon-favorite`
```scss
&__icon-favorite {
  color: #FFD700;  // ← Color oro
  font-size: $font-size-sm;
}
```

### Clase: `.carta__icon-gluten-free`
```scss
&__icon-gluten-free {
  font-size: $font-size-sm;
}
```

---

## 🔄 Cómo Modificar los Indicadores

### Para marcar un item como favorito:
1. Abre `[carta-data.ts](carta-data.ts)`
2. Busca el item que quieras
3. Agrega `favorite: true`

**Ejemplo:**
```typescript
// Antes:
{ name: 'Caña de cerveza', price: '2,00', glutenFree: false }

// Después:
{ name: 'Caña de cerveza', price: '2,00', glutenFree: false, favorite: true }
```

### Para marcar un item como sin gluten:
1. Abre `[carta-data.ts](carta-data.ts)`
2. Busca el item que quieras
3. Agrega o cambia `glutenFree: true`

**Ejemplo:**
```typescript
// Antes:
{ name: 'Caña de cerveza', price: '2,00' }

// Después:
{ name: 'Caña de cerveza', price: '2,00', glutenFree: true }
```

---

## 🌍 Traducciones

Las traducciones de la leyenda están en los archivos de idiomas:

**[es.ts](src/app/idiomas/es.ts) - Español:**
```typescript
legendTitle: 'Leyenda',
legendFavorite: '★ Favorito',
legendGlutenFree: '🌾 Sin gluten',
```

**[en.ts](src/app/idiomas/en.ts) - English:**
```typescript
legendTitle: 'Legend',
legendFavorite: '★ Favorite',
legendGlutenFree: '🌾 Gluten-free',
```

**[cat.ts](src/app/idiomas/cat.ts) - Català:**
```typescript
legendTitle: 'Llegenda',
legendFavorite: '★ Favorit',
legendGlutenFree: '🌾 Sense gluten',
```

---

## ✨ Resultado Visual

### Leyenda
```
┌─────────────────────────────────────────────────────────┐
│  LEYENDA                                                 │
│                                                          │
│     ★ Favorito          🌾 Sin gluten                   │
└─────────────────────────────────────────────────────────┘
```

### Items con Iconos
```
REFRESCOS
┌──────────────────────────────────────────────────────┐
│ Agua Veri 0,33L                              1,60€   │
│ Agua Veri 0,5L                               1,80€   │
│ Zumo de Naranja Natural (grande) ★ 🌾        5,00€   │
│ Zumo de Naranja Natural (pequeño) 🌾         2,90€   │
└──────────────────────────────────────────────────────┘

CERVEZAS
┌──────────────────────────────────────────────────────┐
│ Caña de cerveza                              2,00€   │
│ Turia ★                                      2,60€   │
│ Complot IPA ★                                3,00€   │
│ Free Damm 🌾                                 2,60€   │
└──────────────────────────────────────────────────────┘
```

---

## 🚀 Notas Importantes

1. **Los iconos aparecen automáticamente**: Si estableces `favorite: true` o `glutenFree: true`, el icono aparecerá sin necesidad de cambiar el HTML.

2. **Posición**: Los iconos están **junto al nombre** del item, no en la fila de precio, para una mejor legibilidad.

3. **Responsive**: Los estilos se adaptan automáticamente en móviles gracias a `flex-wrap: wrap`.

4. **Multiidioma**: La leyenda cambia automáticamente según el idioma seleccionado.

5. **Performance**: Solo se renderiza el contenedor de iconos cuando hay al menos uno (`@if (item.favorite || item.glutenFree)`).

