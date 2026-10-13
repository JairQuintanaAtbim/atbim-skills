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

Ejemplo de cómo debe quedar `DATA.tareas` en el script:
```js
tareas: [
  { tarea: "RF-01: Estructura del módulo de solicitudes", horas: 8 },
  { tarea: "RF-02: Gestión de solicitudes generales", horas: 14 },
  { tarea: "RF-03: Detalle de solicitud general", horas: 10 },
]
```

### Después de tener todo
5. **Copia el script plantilla** a un sitio editable:
   ```bash
   cp /mnt/skills/user/ref-generator/scripts/generate_ref.js /home/claude/generate_ref.js
   ```
6. **Edita el objeto `DATA`** con todo lo recopilado en los pasos 1-8.
7. **Genera el documento**:
   ```bash
   cd /home/claude && node generate_ref.js
   ```
8. **Verifica visualmente** antes de entregar (obligatorio):
   ```bash
   python /mnt/skills/public/docx/scripts/office/soffice.py --headless --convert-to pdf REF.docx
   pdftoppm -jpeg -r 100 REF.pdf page
   ```
   Revisa con `view` al menos la portada y la página de la tabla de horas.
9. **Renombra** el archivo de forma descriptiva (p.ej. `REF_Alcampo_Solicitudes.docx`), cópialo a
   `/mnt/user-data/outputs/` y compártelo con `present_files`.

## Estructura del documento (fija, no la cambies sin pedirlo el usuario)

1. Portada (fondo de marca + logo + título + cliente + fecha)
2. 1. Proyecto / Módulo
3. 2. Problema actual
4. 3. Solución propuesta
5. 4. Requisitos Funcionales (con nota de "borrador" + bloques RF-XX)
6. 5. Estimación de horas (texto introductorio + tabla con total)

## Identidad visual

- Color de títulos y cabeceras de tabla: `#181525` (definido como `COLOR_TITULOS` en el script).
- Marca de agua / fondo de portada: `/mnt/skills/user/ref-generator/assets/background-a4.png`
  (incluye el logo de atbim ya integrado — no añadas el logo por duplicado).
- Fuente: Calibri en todo el documento.
- El fondo de marca solo se coloca en la portada (detrás del texto). El resto de páginas van sin
  cabecera de texto, solo con el número de página en el pie, para un diseño limpio.

## Notas y límites importantes

- **Word no soporta fórmulas vivas tipo Excel.** El total de horas se calcula en JavaScript antes
  de escribir el documento — si el usuario cambia horas a mano en el Word después de generado,
  el total NO se recalculará solo. Si en algún momento se necesita un total que el propio cliente
  pueda recalcular editando cifras, hay que generar un Excel aparte (no lo hace esta skill).
- Si el usuario pide **añadir más secciones** (p.ej. riesgos, fuera de alcance, condiciones
  comerciales), añádelas como nuevos bloques `heading()` + `bodyText()` siguiendo el mismo patrón,
  manteniendo el color y la fuente.
- Si cambia el logo o la marca de agua, sustituye el archivo en `assets/background-a4.png`
  manteniendo proporción A4 (2480×3508 px o equivalente) para que el `transformation` de
  794×1123 (96dpi) siga cubriendo la página completa sin deformarse.
- Los bloques de requisitos NO usan numeración automática de Word: los prefijos `RF-XX.Y` van
  escritos literalmente en el texto, igual que en el documento de referencia del cliente. Mantén
  esa convención para que el cliente pueda referenciar requisitos concretos en las conversaciones.
