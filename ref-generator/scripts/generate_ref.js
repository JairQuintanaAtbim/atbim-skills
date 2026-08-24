/**
 * Generador de REF (Requisitos Técnicos Funcionales) — plantilla atbim
 * ----------------------------------------------------------------------
 * Cómo usarlo:
 *   1. Copia este archivo a /home/claude/generate_ref.js (o el nombre que quieras)
 *   2. Rellena el objeto DATA más abajo con la info del proyecto concreto
 *   3. node generate_ref.js
 *   4. Verifica el resultado (ver sección "Verificar" en SKILL.md)
 *
 * No hace falta tocar nada por debajo de la línea "NO TOCAR DE AQUÍ PARA ABAJO"
 * salvo que se quiera ajustar el diseño.
 */

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow,
  TableCell, WidthType, BorderStyle, ShadingType, AlignmentType, ImageRun,
  Header, Footer, PageNumber, TextWrappingType, HorizontalPositionAlign,
  VerticalPositionAlign, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom,
  PageBreak, convertInchesToTwip,
} = require("docx");
const fs = require("fs");
const path = require("path");

// ======================================================================
// DATA — esto es lo único que cambia en cada proyecto/cliente
// ======================================================================
const DATA = {
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

  notaBorrador:
    "Este documento debe considerarse como una primera versión o borrador funcional, por lo " +
    "que los requisitos aquí definidos pueden estar sujetos a modificaciones, ajustes o " +
    "ampliaciones durante las fases de análisis, diseño e implementación, en función de las " +
    "necesidades del proyecto y de las decisiones técnicas que se adopten. El objetivo de " +
    "este documento es servir como base inicial de referencia para la iteración y definición " +
    "final de las funcionalidades del sistema.",

  // Cada bloque RF-XX con sus sub-requisitos (acepta anidación en texto, no en objeto,
  // para mantenerlo simple: usa el prefijo ya escrito, p.ej "RF-02.3.1")
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
  // El TOTAL se calcula solo, no lo edites a mano.
  tareas: [
    { tarea: "RF-01: Estructura del módulo de solicitudes", horas: 8 },
    { tarea: "RF-02: Gestión de solicitudes generales", horas: 14 },
  ],
};

// ======================================================================
// NO TOCAR DE AQUÍ PARA ABAJO (salvo ajustes de diseño)
// ======================================================================

const COLOR_TITULOS = "181525";
const COLOR_GRIS_TEXTO = "3A3A3A";
const FUENTE = "Calibri";
const BACKGROUND_IMG = "/mnt/skills/user/ref-generator/assets/background-a4.png";

// A4 en twips
const PAGE_WIDTH = 11906;
const PAGE_HEIGHT = 16838;

function backgroundImageRun() {
  const imgBuffer = fs.readFileSync(BACKGROUND_IMG);
  return new ImageRun({
    data: imgBuffer,
    type: "png",
    transformation: { width: 794, height: 1123 }, // A4 completo a 96dpi (210x297mm)
    floating: {
      horizontalPosition: {
        relative: HorizontalPositionRelativeFrom.PAGE,
        align: HorizontalPositionAlign.CENTER,
      },
      verticalPosition: {
        relative: VerticalPositionRelativeFrom.PAGE,
        align: VerticalPositionAlign.CENTER,
      },
      wrap: { type: TextWrappingType.NONE },
      behindDocument: true,
    },
  });
}

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    heading: level,
    spacing: { before: 300, after: 150 },
    children: [
      new TextRun({
        text,
        bold: true,
        color: COLOR_TITULOS,
        font: FUENTE,
        size: level === HeadingLevel.HEADING_1 ? 30 : 24,
      }),
    ],
  });
}

function bodyText(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 160 },
    children: [
      new TextRun({
        text,
        font: FUENTE,
        size: 22,
        color: COLOR_GRIS_TEXTO,
        italics: !!opts.italics,
      }),
    ],
  });
}

function requisitoItem(text) {
  return new Paragraph({
    spacing: { after: 90 },
    indent: { left: convertInchesToTwip(0.15) },
    children: [
      new TextRun({ text, font: FUENTE, size: 21, color: COLOR_GRIS_TEXTO }),
    ],
  });
}

function buildHeader() {
  return new Header({
    children: [new Paragraph({ children: [] })],
  });
}

function buildFooter() {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "Página ", font: FUENTE, size: 16, color: "808080" }),
          new TextRun({ children: [PageNumber.CURRENT], font: FUENTE, size: 16, color: "808080" }),
          new TextRun({ text: " de ", font: FUENTE, size: 16, color: "808080" }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FUENTE, size: 16, color: "808080" }),
        ],
      }),
    ],
  });
}

function buildPortada() {
  return [
    new Paragraph({ children: [backgroundImageRun()] }),
    new Paragraph({ spacing: { before: 3000 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: "REF – Requisitos Técnicos Funcionales",
          bold: true,
          color: COLOR_TITULOS,
          font: FUENTE,
          size: 40,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 150 },
      children: [
        new TextRun({ text: DATA.cliente, bold: true, color: COLOR_TITULOS, font: FUENTE, size: 28 }),
      ],
    }),
    new Paragraph({
      spacing: { before: 400 },
      children: [
        new TextRun({ text: `Fecha: ${DATA.fecha}`, font: FUENTE, size: 20, color: COLOR_GRIS_TEXTO }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `Elaborado por: ${DATA.autor}`, font: FUENTE, size: 20, color: COLOR_GRIS_TEXTO }),
      ],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

function buildHorasTable() {
  const totalHoras = DATA.tareas.reduce((sum, t) => sum + t.horas, 0);

  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        width: { size: 8000, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: COLOR_TITULOS },
        children: [new Paragraph({ children: [new TextRun({ text: "Bloque de Requisitos (RF)", bold: true, color: "FFFFFF", font: FUENTE, size: 20 })] })],
      }),
      new TableCell({
        width: { size: 2000, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: COLOR_TITULOS },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Horas", bold: true, color: "FFFFFF", font: FUENTE, size: 20 })] })],
      }),
    ],
  });

  const rows = DATA.tareas.map((t, i) => new TableRow({
    children: [
      new TableCell({
        width: { size: 8000, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: i % 2 === 0 ? "FFFFFF" : "F2F2F2" },
        children: [new Paragraph({ children: [new TextRun({ text: t.tarea, font: FUENTE, size: 20, color: COLOR_GRIS_TEXTO })] })],
      }),
      new TableCell({
        width: { size: 2000, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: i % 2 === 0 ? "FFFFFF" : "F2F2F2" },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(t.horas), font: FUENTE, size: 20, color: COLOR_GRIS_TEXTO })] })],
      }),
    ],
  }));

  const totalRow = new TableRow({
    children: [
      new TableCell({
        width: { size: 8000, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: "D9D9D9" },
        children: [new Paragraph({ children: [new TextRun({ text: "TOTAL ESTIMADO", bold: true, font: FUENTE, size: 20, color: COLOR_TITULOS })] })],
      }),
      new TableCell({
        width: { size: 2000, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: "D9D9D9" },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${totalHoras} h`, bold: true, font: FUENTE, size: 20, color: COLOR_TITULOS })] })],
      }),
    ],
  });

  return new Table({
    width: { size: 10000, type: WidthType.DXA },
    columnWidths: [8000, 2000],
    rows: [headerRow, ...rows, totalRow],
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" },
      left: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" },
      right: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "E0E0E0" },
      insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "E0E0E0" },
    },
  });
}

function buildBody() {
  const children = [];

  children.push(heading("1. Proyecto / Módulo"));
  children.push(bodyText(DATA.proyecto));

  children.push(heading("2. Problema actual"));
  children.push(bodyText(DATA.problemaActual));

  children.push(heading("3. Solución propuesta"));
  children.push(bodyText(DATA.solucionPropuesta));

  children.push(heading("4. Requisitos Funcionales"));
  children.push(bodyText(DATA.notaBorrador, { italics: true }));

  DATA.requisitos.forEach((bloque) => {
    children.push(heading(bloque.titulo, HeadingLevel.HEADING_2));
    bloque.items.forEach((item) => children.push(requisitoItem(item)));
  });

  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(heading("5. Estimación de horas"));
  children.push(bodyText(
    "La siguiente tabla recoge la estimación de horas por cada bloque de requisitos " +
    "funcionales (RF) necesario para su desarrollo. Esta estimación es orientativa y puede " +
    "ajustarse durante la fase de análisis detallado."
  ));
  children.push(buildHorasTable());

  return children;
}

async function main() {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
            margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 },
          },
        },
        headers: { default: buildHeader() },
        footers: { default: buildFooter() },
        children: [...buildPortada(), ...buildBody()],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = path.join(__dirname, "..", "..", "..", "..", "home", "claude", "REF.docx");
  fs.writeFileSync("REF.docx", buffer);
  console.log("Generado: REF.docx");
}

main().catch((e) => { console.error(e); process.exit(1); });
