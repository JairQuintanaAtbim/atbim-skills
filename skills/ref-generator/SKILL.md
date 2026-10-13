---
name: ref-generator
description: "Genera documentos REF (Requisitos Técnicos Funcionales) en Word (.docx) con la plantilla corporativa de atbim, para proponer alcance funcional a un cliente. Incluye la estructura estándar (Proyecto/Módulo, Problema actual, Solución propuesta, Requisitos Funcionales RF-XX, Estimación de horas) y una tabla final de horas por tarea con el total calculado automáticamente. Úsala cuando el usuario pida crear un REF, un documento de requisitos técnico-funcionales, una propuesta funcional para un cliente, o pida estimar horas de un desarrollo para presentar a un cliente."
license: Proprietary
---

# Generador de REF (Requisitos Técnicos Funcionales)

Genera un Word `.docx` con la identidad visual de atbim (fondo de marca, logo, títulos en `#181525`)
a partir de la información de un proyecto: problema, solución propuesta, requisitos funcionales
numerados (RF-XX) y una tabla de horas estimadas con el total calculado.

## Cuándo usar esta skill

- El usuario pide "crear un REF", "documento de requisitos", "propuesta funcional para [cliente]".
- El usuario quiere presentar a un cliente el alcance de un desarrollo con estimación de horas.
- El usuario pega o describe requisitos y pide formalizarlos en un documento profesional.

## Flujo de trabajo (orden fijo, síguelo siempre así)

Usa el selector de opciones (`ask_user_input_v0`) en cada punto donde se indique — es más rápido
para el usuario que escribir, sobre todo en móvil. Máximo 1 pregunta por turno de selector salvo
que el propio tool permita agrupar 2-3 relacionadas.

### 1-4. Datos básicos
Preguntas simples, una detrás de otra o agrupadas en el selector:
1. **Fecha** — por defecto la fecha de hoy; confirma con selector (`Usar hoy (DD/MM/AAAA)` /
   `Indicar otra fecha`).
2. **Cliente** — texto libre.
3. **Proyecto / Módulo** — texto libre, título corto del proyecto.
4. **Elaborado por** — texto libre (persona o equipo que firma el REF).

### 5. Problema actual
El usuario da una **descripción corta**. Tú la usas como punto de partida y haces **preguntas de
seguimiento con selector** para completarla hasta tener un párrafo sólido: canales/medios
actuales, frecuencia del problema, quién lo sufre (qué perfil de usuario), impacto o
consecuencia concreta. No preguntes todo de golpe — 1-2 preguntas por turno, y para en cuanto
tengas suficiente para redactar un párrafo claro (no hace falta agotar todas las posibles
preguntas si la descripción ya es completa).

### 6. Solución propuesta
Mismo patrón que el punto 5: descripción corta del usuario + preguntas de selector para
completar (qué módulo/pantalla se ve afectado, qué usuarios la usarán, alcance de la solución).

### 7. Requisitos Funcionales — dos caminos
Pregunta con selector:

- **Opción A — "Ya tengo una estructura de RF"**: el usuario pega o sube su propia lista de
  requisitos. Tú la normalizas al formato `RF-XX` / `RF-XX.Y` / `RF-XX.Y.Z` si no viene ya así,
  sin inventar contenido nuevo.
- **Opción B — "Construyámoslos juntos"**: tú propones un primer borrador de bloques `RF-XX`
  basándote en el problema y la solución ya descritos (puntos 5 y 6), y el usuario los valida o
  corrige. Itera bloque a bloque: propone el título del bloque + 2-4 sub-requisitos, pregunta si
  falta algo o hay que ajustar, y avanza al siguiente bloque. No generes los 10 bloques de golpe
  sin validar — construir "juntos" significa ir bloque por bloque con confirmación del usuario.

### 8. Estimación de horas
**Las filas de la tabla de horas son los bloques RF-XX de nivel superior** (uno por cada
`RF-01`, `RF-02`, `RF-03`... ya definidos en el punto 7), **no tareas técnicas genéricas** del
tipo "backend/frontend/QA". Pregunta las horas bloque a bloque (con texto libre, las horas no
se prestan bien a selector) y el total se calcula solo, no lo sumes a mano.

Ejemplo de cómo debe quedar `tareas` en el JSON de datos:
```json
"tareas": [
  { "tarea": "RF-01: Estructura del módulo de solicitudes", "horas": 8 },
  { "tarea": "RF-02: Gestión de solicitudes generales", "horas": 14 },
  { "tarea": "RF-03: Detalle de solicitud general", "horas": 10 }
]
```

### Después de tener todo
1. **Escribe los datos en un JSON** (p.ej. `/home/claude/ref.json`) con todo lo recopilado en los
   pasos 1-8. El formato completo está en `DATA_EJEMPLO` dentro de `scripts/generate_ref.js`:
   ```json
   {
     "cliente": "Alcampo",
     "proyecto": "Alcampo Cloud Platform – Sistema de gestión de solicitudes en el módulo Master.",
     "fecha": "14/08/2026",
     "autor": "atbim – Building Engineering",
     "problemaActual": "…",
     "solucionPropuesta": "…",
     "requisitos": [
       { "titulo": "RF-01: Estructura del módulo", "items": ["RF-01.1: …", "RF-01.2: …"] }
     ],
     "tareas": [{ "tarea": "RF-01: Estructura del módulo", "horas": 8 }],
     "seccionesExtra": [{ "titulo": "Fuera de alcance", "parrafos": ["…"], "items": ["…"] }]
   }
   ```
   `notaBorrador` (si no viene, se usa la nota estándar) y `seccionesExtra` son opcionales.
2. **Genera el documento** ejecutando el script desde la carpeta de esta skill (la que contiene
   este SKILL.md, p.ej. `/mnt/skills/user/ref-generator`). No lo copies: así encuentra la marca.
   ```bash
   cd /home/claude && NODE_PATH=$(npm root -g) node <dir-de-esta-skill>/scripts/generate_ref.js ref.json REF_Alcampo_Solicitudes.docx
   ```
   Si falta el paquete `docx`: `npm install -g docx`. La primera línea de la salida indica qué
   marca se ha usado (skill `atbim-brand` o copia local).
3. **Verifica visualmente** antes de entregar (obligatorio):
   ```bash
   python /mnt/skills/public/docx/scripts/office/soffice.py --headless --convert-to pdf REF_Alcampo_Solicitudes.docx
   pdftoppm -jpeg -r 100 REF_Alcampo_Solicitudes.pdf page
   ```
   Revisa con `view` al menos la portada y la página de la tabla de horas.
4. **Entrega**: el nombre del archivo debe ser descriptivo (p.ej. `REF_Alcampo_Solicitudes.docx`).
   Cópialo a `/mnt/user-data/outputs/` y compártelo con `present_files`.

## Estructura del documento (fija, no la cambies sin pedirlo el usuario)

1. Portada (fondo de marca + logo + título + cliente + fecha)
2. 1. Proyecto / Módulo
3. 2. Problema actual
4. 3. Solución propuesta
5. 4. Requisitos Funcionales (con nota de "borrador" + bloques RF-XX)
6. 5. Estimación de horas (texto introductorio + tabla con total)

## Identidad visual

Esta skill no define la marca: el documento se monta con la librería de `atbim-brand`.

1. **Si la skill `atbim-brand` está instalada** (aparece en tus skills disponibles), lee su
   `SKILL.md` y sigue sus reglas: mandan sobre las de aquí. `generate_ref.js` usa su librería
   automáticamente si está en una carpeta hermana de esta skill; si está en otra ruta, indícala con
   `ATBIM_BRAND_DIR=<dir-de-atbim-brand>` delante del comando.
2. **Si no está**, el script usa la copia local que lleva esta skill (`scripts/atbim_brand.js` y
   `assets/`) y se aplican estas reglas, copia idéntica de las de `atbim-brand`:

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

## Notas y límites importantes

- **Word no soporta fórmulas vivas tipo Excel.** El total de horas se calcula en JavaScript antes
  de escribir el documento — si el usuario cambia horas a mano en el Word después de generado,
  el total NO se recalculará solo. Si en algún momento se necesita un total que el propio cliente
  pueda recalcular editando cifras, hay que generar un Excel aparte (no lo hace esta skill).
- Si el usuario pide **añadir más secciones** (p.ej. riesgos, fuera de alcance, condiciones
  comerciales), añádelas en `seccionesExtra` del JSON (título + párrafos y/o viñetas). Van después
  de la estimación de horas y se numeran a partir del 6.
- La marca (fondo, logo, colores, fuente) no se cambia aquí, sino en la skill `atbim-brand`.
  `scripts/atbim_brand.js` y `assets/` de esta skill son una copia sincronizada: no los edites a mano.
- Los bloques de requisitos NO usan numeración automática de Word: los prefijos `RF-XX.Y` van
  escritos literalmente en el texto, igual que en el documento de referencia del cliente. Mantén
  esa convención para que el cliente pueda referenciar requisitos concretos en las conversaciones.
