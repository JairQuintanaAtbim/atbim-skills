/**
 * Generador de REF (Requisitos Técnicos Funcionales) — plantilla atbim
 * ----------------------------------------------------------------------
 * Cómo usarlo (ejecútalo desde su sitio, no lo copies: así encuentra la marca):
 *
 *   NODE_PATH=$(npm root -g) node <dir-de-la-skill>/scripts/generate_ref.js datos.json REF_Cliente.docx
 *
 *   datos.json -> datos del proyecto, con el mismo formato que DATA_EJEMPLO (más abajo).
 *                 Sin argumentos genera el ejemplo.
 *   salida     -> ruta del .docx (por defecto REF.docx en la carpeta actual).
 *
 * Marca: usa la librería de la skill atbim-brand si está instalada (junto a esta skill o en
 * $ATBIM_BRAND_DIR); si no, la copia local scripts/atbim_brand.js, que es idéntica.
 */

const fs = require("fs");
const path = require("path");
const { Paragraph, convertInchesToTwip } = require("docx");

const BRAND_LOCAL = path.join(__dirname, "atbim_brand.js");
const BRAND_LIB = [
  process.env.ATBIM_BRAND_DIR && path.join(process.env.ATBIM_BRAND_DIR, "scripts", "atbim_brand.js"),
  path.join(__dirname, "..", "..", "atbim-brand", "scripts", "atbim_brand.js"),
  BRAND_LOCAL,
].find((f) => f && fs.existsSync(f));
const B = require(BRAND_LIB);

// ======================================================================
// DATOS — formato del JSON de entrada (este es el ejemplo que se genera sin argumentos)
// ======================================================================

const NOTA_BORRADOR =
  "Este documento debe considerarse como una primera versión o borrador funcional, por lo " +
  "que los requisitos aquí definidos pueden estar sujetos a modificaciones, ajustes o " +
  "ampliaciones durante las fases de análisis, diseño e implementación, en función de las " +
  "necesidades del proyecto y de las decisiones técnicas que se adopten. El objetivo de " +
  "este documento es servir como base inicial de referencia para la iteración y definición " +
  "final de las funcionalidades del sistema.";

const DATA_EJEMPLO = {
  cliente: "Alcampo",
  proyecto: "Alcampo Cloud Platform – Implementación del sistema de gestión de solicitudes en el módulo Master.",
  fecha: "14/08/2026",
  autor: "atbim – Building Engineering",

  problemaActual:
    "Actualmente las solicitudes de las tiendas se gestionan mediante diferentes canales " +
    "(correo, teléfono, mensajes), lo que genera desorden, pérdida de información y " +
    "dificultad para hacer seguimiento. No existe un lugar centralizado donde visualizar " +
    "y gestionar todas las solicitudes.",

  solucionPropuesta:
    "Implementar un sistema de gestión de solicitudes dentro de la plataforma existente, " +
    "añadiendo una nueva pestaña llamada 'Solicitudes' dentro del módulo Master. Esta " +
    "sección centralizará todas las solicitudes enviadas por las tiendas y usuarios.",

  // Opcional: si no viene, se usa NOTA_BORRADOR.
  notaBorrador: NOTA_BORRADOR,

  // Cada bloque RF-XX con sus sub-requisitos (la anidación va en el prefijo del texto,
  // p.ej. "RF-02.3.1", no en el objeto).
  requisitos: [
    {
      titulo: "RF-01: Estructura del módulo de solicitudes (desde módulo Master)",
      items: [
        "RF-01.1: El sistema debe añadir una nueva pestaña llamada 'Solicitudes' dentro del módulo Master.",
        "RF-01.2: El sistema debe dividir esta sección en dos subpestañas: 'Solicitudes' y 'Solicitudes de nuevos usuarios'.",
        "RF-01.3: Cada pestaña debe mostrar un indicador visual (badge o icono) cuando existan nuevas solicitudes sin revisar.",
      ],
    },
    {
      titulo: "RF-02: Gestión de solicitudes generales (desde módulo Master)",
      items: [
        "RF-02.1: El sistema debe mostrar una tabla con todas las solicitudes registradas.",
        "RF-02.2: Cada fila de la tabla debe representar una solicitud individual.",
      ],
    },
  ],

  // Tabla de horas — una fila por cada bloque RF-XX de nivel superior definido arriba en
  // "requisitos" (NO tareas técnicas genéricas tipo backend/frontend/QA).
  // El TOTAL se calcula solo.
  tareas: [
    { tarea: "RF-01: Estructura del módulo de solicitudes", horas: 8 },
    { tarea: "RF-02: Gestión de solicitudes generales", horas: 14 },
  ],

  // Opcional: secciones adicionales tras la estimación de horas (riesgos, fuera de alcance,
  // condiciones comerciales...). Se numeran a partir del 6.
  seccionesExtra: [],
};

// ======================================================================
// DOCUMENTO
// ======================================================================

const [entrada, salida = "REF.docx"] = process.argv.slice(2);
const DATA = entrada
  ? JSON.parse(fs.readFileSync(entrada, "utf8").replace(/^﻿/, ""))
  : DATA_EJEMPLO;

const OBLIGATORIOS = ["cliente", "proyecto", "fecha", "autor", "problemaActual", "solucionPropuesta", "requisitos", "tareas"];
const faltan = OBLIGATORIOS.filter((k) => DATA[k] == null);
if (faltan.length) {
  console.error(`Faltan campos en ${entrada}: ${faltan.join(", ")}`);
  process.exit(1);
}

function requisitoItem(text) {
  return new Paragraph({
    spacing: { after: 90 },
    indent: { left: convertInchesToTwip(0.15) },
    children: [B.run(text, { size: 21 })],
  });
}

function buildBody() {
  const totalHoras = DATA.tareas.reduce((sum, t) => sum + Number(t.horas), 0);

  const children = [
    B.h1("1. Proyecto / Módulo"),
    B.p(DATA.proyecto),
    B.h1("2. Problema actual"),
    B.p(DATA.problemaActual),
    B.h1("3. Solución propuesta"),
    B.p(DATA.solucionPropuesta),
    B.h1("4. Requisitos Funcionales"),
    B.p(DATA.notaBorrador || NOTA_BORRADOR, { italics: true }),
  ];

  DATA.requisitos.forEach((bloque) => {
    children.push(B.h2(bloque.titulo), ...bloque.items.map(requisitoItem));
  });

  children.push(
    B.pageBreak(),
    B.h1("5. Estimación de horas"),
    B.p(
      "La siguiente tabla recoge la estimación de horas por cada bloque de requisitos " +
      "funcionales (RF) necesario para su desarrollo. Esta estimación es orientativa y puede " +
      "ajustarse durante la fase de análisis detallado."
    ),
    B.table({
      columns: ["Bloque de Requisitos (RF)", "Horas"],
      widths: [80, 20],
      rows: DATA.tareas.map((t) => [t.tarea, t.horas]),
      total: ["TOTAL ESTIMADO", `${totalHoras} h`],
    }),
  );

  (DATA.seccionesExtra || []).forEach((s, i) => {
    children.push(
      B.h1(`${6 + i}. ${s.titulo}`),
      ...(s.parrafos || []).map((t) => B.p(t)),
      ...B.bullets(s.items || []),
    );
  });

  return children;
}

async function main() {
  console.log(`Marca: ${BRAND_LIB === BRAND_LOCAL ? "copia local de ref-generator" : "skill atbim-brand"} (${BRAND_LIB})`);
  const doc = B.buildDocument({
    cover: {
      title: "REF – Requisitos Técnicos Funcionales",
      client: DATA.cliente,
      date: DATA.fecha,
      author: DATA.autor,
    },
    title: `REF – ${DATA.cliente}`,
    children: buildBody(),
  });
  await B.save(doc, salida);
}

main().catch((e) => { console.error(e); process.exit(1); });
