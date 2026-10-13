---
name: atbim-brand
description: "Identidad visual de atbim para cualquier documento Word (.docx) o PDF: fondo de marca con logo como marca de agua en todas las páginas, portada, color #181525, Calibri, tablas, tarjetas KPI y pie con paginación. Úsala SIEMPRE que se genere un Word o PDF para atbim/atBIM (informes, REF, propuestas, actas, casos de estudio, informes SEO…) o cuando el usuario pida «con la marca de atbim», «con nuestro logo» o «formato corporativo». Las skills de contenido (p. ej. ref-generator) llevan una copia de esta librería para funcionar solas, pero si esta skill está instalada, la suya tiene prioridad."
license: Proprietary
---

# atbim-brand: identidad visual de los documentos de atbim

Esta skill es la **capa de marca**. No define qué contiene un documento, solo cómo se ve.
Las skills de contenido (REF, informe SEO, propuestas…) definen estructura y flujo, y
construyen el documento con la librería de esta skill. Cada una lleva una copia idéntica de la
librería, los assets y las reglas para poder funcionar sin esta skill, pero si esta skill está
instalada usan la de aquí. Esta skill es la fuente de verdad: la marca se cambia aquí.

## Archivos

- `scripts/atbim_brand.js`: librería Node (usa el paquete `docx`). Toda la marca está aquí.
- `scripts/example.js`: ejemplo completo y funcional (portada, KPIs, tablas, listas, nota).
- `assets/background-a4.png`: fondo A4 (2480×3508) con el logo arriba a la derecha y los triángulos abajo a la izquierda. Se usa como marca de agua en todas las páginas.
- `assets/logo.png`: logo suelto, para usos fuera del fondo (no hace falta en los documentos estándar).

Localiza las rutas a partir del directorio de esta skill (el que contiene este SKILL.md).

## Reglas de identidad visual

<!-- atbim-brand:reglas:inicio -->
| Elemento | Valor |
|---|---|
| Color principal (títulos, cabeceras de tabla, viñetas) | `#181525` |
| Texto de cuerpo | `#3A3A3A`, Calibri 11 pt |
| Gris suave (filas alternas, tarjetas, notas) | `#F1F1F0` (el gris de los triángulos) |
| Rojo / verde | `#B42318` / `#1B7F3B`, **solo** para caídas/alertas y subidas/mejoras |
| Fuente | Calibri en todo el documento |
| Marca de agua | Fondo de marca a página completa en **todas** las páginas (va en la cabecera del documento). No añadas el logo otra vez. |
| Portada | Primera página, sin pie. |
| Páginas interiores | Pie «atbim – Building Engineering · Página X de Y». Margen superior amplio para no pisar el logo. |

No inventes colores, fuentes ni logos nuevos. Si el usuario pide otro estilo puntual, aplícalo
solo a ese documento y no toques la librería.
<!-- atbim-brand:reglas:fin -->

## Cómo generar un documento

1. Copia `scripts/example.js` a la carpeta de trabajo y sustituye el contenido.
   Importa la librería con su ruta absoluta dentro de esta skill:
   `const B = require("<dir-de-la-skill>/scripts/atbim_brand.js");`
2. Construye el contenido con las piezas de la librería:
   - `B.h1(text)`, `B.h2(text)`, `B.h3(text)`: títulos de marca.
   - `B.p(text | [segmentos])`: párrafo; segmentos `{ text, bold, italics, color }`.
   - `...B.bullets(items, { numbered })`: listas (devuelve un array: usa `...`).
   - `B.table({ columns, rows, widths, align, total })`: tabla con cabecera `#181525`, filas
     alternas y fila de total opcional. `widths` en porcentajes que suman 100.
   - `B.kpis([{ label, value, delta, trend: "up"|"down"|"flat" }])`: fila de tarjetas KPI.
   - `B.callout(text, "info"|"alert"|"ok")`: nota destacada con barra lateral.
   - `B.pageBreak()`, `B.spacer(twips)`.
3. Monta y guarda:
   ```js
   const doc = B.buildDocument({ cover: { title, subtitle, client, date, author }, children });
   const docx = await B.save(doc, "Nombre_descriptivo.docx");
   B.toPdf(docx); // solo si se pide PDF
   ```
   `cover: null` genera el documento sin portada (útil para documentos de una página).
4. Ejecuta con el módulo `docx` disponible: `NODE_PATH=$(npm root -g) node mi_doc.js`
   (si falta: `npm install -g docx`).
5. **Verifica visualmente antes de entregar (obligatorio)**: convierte a PDF, pasa las páginas a
   imagen (`pdftoppm -jpeg -r 70 doc.pdf pg`) y revisa al menos la portada y una página interior:
   que la portada no se desborde a una segunda página, que las tablas no se salgan del margen y
   que el texto se lea bien sobre los triángulos de la esquina inferior izquierda y no pise el logo.
6. Nombra el archivo de forma descriptiva (`Informe_SEO_2026-10-13.docx`, `REF_Alcampo_Solicitudes.docx`).

## Límites

- Word no recalcula totales: calcula sumas en JavaScript antes de escribir la tabla.
- Si cambia la marca, sustituye `assets/background-a4.png` (proporción A4) y `assets/logo.png`
  manteniendo los nombres; todos los documentos la heredan. Las copias que llevan las demás skills
  se actualizan desde aquí con `npm run sync:brand` en el repo de skills (no las edites a mano).
- Formatos cubiertos: Word y PDF. PowerPoint y Excel todavía no tienen implementación de marca.
