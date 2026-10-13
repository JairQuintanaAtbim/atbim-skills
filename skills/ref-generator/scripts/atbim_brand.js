/**
 * atbim-brand: librería de identidad visual de atbim para documentos Word (.docx)
 * ---------------------------------------------------------------------------
 * Uso (desde el script de cualquier documento):
 *
 *   const B = require("<ruta-de-la-skill>/scripts/atbim_brand.js");
 *   const doc = B.buildDocument({
 *     cover: { title: "Informe SEO semanal", subtitle: "atbim.com", client: "atBIM",
 *              date: "13/10/2026", author: "atbim – Building Engineering" },
 *     children: [
 *       B.h1("1. Resumen"), B.p("Texto..."),
 *       B.bullets(["Punto 1", "Punto 2"]),
 *       B.table({ columns: ["Métrica", "Valor"], rows: [["Clics", "167"]], widths: [70, 30] }),
 *     ],
 *   });
 *   await B.save(doc, "Informe.docx");      // escribe el .docx
 *   B.toPdf("Informe.docx");                 // opcional: genera Informe.pdf (LibreOffice)
 *
 * Todo el estilo (colores, fuente, portada, cabecera con logo, pie con paginación) vive
 * aquí. Los documentos solo aportan contenido.
 */

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, AlignmentType, ImageRun, Header, Footer,
  PageNumber, TextWrappingType, HorizontalPositionAlign, VerticalPositionAlign,
  HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, PageBreak,
  LevelFormat, convertInchesToTwip,
} = require("docx");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

// ---------------------------------------------------------------- marca
const ASSETS = path.join(__dirname, "..", "assets");
const BRAND = {
  primary: "181525",      // azul noche atbim: títulos, cabeceras de tabla, logo
  text: "3A3A3A",         // texto de cuerpo
  muted: "808080",        // pies, notas
  light: "F1F1F0",        // gris de los triángulos: fondos suaves, filas alternas
  rule: "D9D9D9",         // líneas y fila de total
  alert: "B42318",        // solo para alertas/caídas (usar con moderación)
  ok: "1B7F3B",           // solo para mejoras/subidas (usar con moderación)
  font: "Calibri",
  background: path.join(ASSETS, "background-a4.png"), // portada (incluye logo)
  logo: path.join(ASSETS, "logo.png"),                // logo suelto (para usos fuera del fondo)
  tagline: "atbim – Building Engineering",
};

// A4 en twips y área útil
const PAGE = { width: 11906, height: 16838, margin: 1000 };
const CONTENT_WIDTH = PAGE.width - 2 * PAGE.margin; // 9906 twips

// ---------------------------------------------------------------- texto
const run = (text, o = {}) => new TextRun({
  text, font: BRAND.font, size: o.size || 22, color: o.color || BRAND.text,
  bold: !!o.bold, italics: !!o.italics,
});

/** Párrafo de cuerpo. Acepta string o array de runs/segmentos {text,bold,italics,color}. */
function p(content, o = {}) {
  const children = Array.isArray(content)
    ? content.map((c) => (typeof c === "string" ? run(c, o) : c instanceof TextRun ? c : run(c.text, { ...o, ...c })))
    : [run(content, o)];
  return new Paragraph({ spacing: { after: o.after ?? 160 }, alignment: o.align, children });
}

const h1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 160 },
  children: [run(text, { bold: true, color: BRAND.primary, size: 30 })],
});
const h2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 },
  children: [run(text, { bold: true, color: BRAND.primary, size: 24 })],
});
const h3 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_3, spacing: { before: 180, after: 100 },
  children: [run(text, { bold: true, color: BRAND.primary, size: 22 })],
});

/** Lista con viñetas (numbered:true para numerada). */
function bullets(items, o = {}) {
  return items.map((it) => new Paragraph({
    numbering: { reference: o.numbered ? "atbim-numbers" : "atbim-bullets", level: 0 },
    spacing: { after: 80 },
    children: typeof it === "string" ? [run(it)] : it.map((c) => (typeof c === "string" ? run(c) : run(c.text, c))),
  }));
}

/** Nota destacada con barra lateral de color (tipo: "info" | "alert" | "ok"). */
function callout(text, type = "info") {
  const color = type === "alert" ? BRAND.alert : type === "ok" ? BRAND.ok : BRAND.primary;
  return new Paragraph({
    spacing: { before: 120, after: 200 },
    indent: { left: convertInchesToTwip(0.1) },
    shading: { type: ShadingType.CLEAR, fill: BRAND.light },
    border: { left: { style: BorderStyle.SINGLE, size: 24, color, space: 8 } },
    children: typeof text === "string" ? [run(text, { size: 21 })] : text.map((c) => (typeof c === "string" ? run(c, { size: 21 }) : run(c.text, { size: 21, ...c }))),
  });
}

const pageBreak = () => new Paragraph({ children: [new PageBreak()] });
const spacer = (twips = 200) => new Paragraph({ spacing: { before: twips }, children: [] });

// ---------------------------------------------------------------- tablas
/**
 * Tabla con estilo de marca.
 *  columns: ["Col A", "Col B", ...]
 *  rows:    [["a", "b"], ...]  (celdas string/number; o {text, bold, color})
 *  widths:  porcentajes por columna (suman 100). Por defecto, reparto igual.
 *  align:   ["left","right",...] por columna (por defecto: left la 1ª, center el resto)
 *  total:   fila final destacada, p.ej. ["TOTAL", "38 h"]
 */
function table({ columns, rows, widths, align, total, fontSize = 20 }) {
  const n = columns.length;
  const pct = widths || Array(n).fill(100 / n);
  const tw = pct.map((w) => Math.round((CONTENT_WIDTH * w) / 100));
  const al = (i) => {
    const a = (align && align[i]) || (i === 0 ? "left" : "center");
    return a === "right" ? AlignmentType.RIGHT : a === "center" ? AlignmentType.CENTER : AlignmentType.LEFT;
  };
  const cell = (val, i, fill, style = {}) => {
    const v = val && typeof val === "object" ? val : { text: String(val ?? "") };
    return new TableCell({
      width: { size: tw[i], type: WidthType.DXA },
      shading: { type: ShadingType.CLEAR, fill },
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      children: [new Paragraph({ alignment: al(i), children: [run(v.text, { size: fontSize, ...style, ...v })] })],
    });
  };
  const header = new TableRow({
    tableHeader: true,
    children: columns.map((c, i) => cell(c, i, BRAND.primary, { bold: true, color: "FFFFFF" })),
  });
  const body = rows.map((r, ri) => new TableRow({
    children: r.map((c, i) => cell(c, i, ri % 2 ? BRAND.light : "FFFFFF")),
  }));
  const tot = total ? [new TableRow({
    children: total.map((c, i) => cell(c, i, BRAND.rule, { bold: true, color: BRAND.primary })),
  })] : [];
  const line = (color) => ({ style: BorderStyle.SINGLE, size: 2, color });
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: tw,
    rows: [header, ...body, ...tot],
    borders: {
      top: line("CCCCCC"), bottom: line("CCCCCC"), left: line("CCCCCC"), right: line("CCCCCC"),
      insideHorizontal: line("E0E0E0"), insideVertical: line("E0E0E0"),
    },
  });
}

/** Fila de tarjetas KPI: [{label:"Clics", value:"167", delta:"+8 %", trend:"up"|"down"|"flat"}] */
function kpis(items) {
  const w = Math.round(CONTENT_WIDTH / items.length);
  const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const white = { style: BorderStyle.SINGLE, size: 12, color: "FFFFFF" };
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: items.map(() => w),
    borders: { top: none, bottom: none, left: none, right: none, insideHorizontal: none, insideVertical: white },
    rows: [new TableRow({
      children: items.map((k) => new TableCell({
        width: { size: w, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: BRAND.light },
        margins: { top: 120, bottom: 120, left: 140, right: 140 },
        children: [
          new Paragraph({ children: [run(k.label, { size: 18, color: BRAND.muted })] }),
          new Paragraph({ children: [run(String(k.value), { size: 36, bold: true, color: BRAND.primary })] }),
          ...(k.delta ? [new Paragraph({ children: [run(k.delta, {
            size: 18, bold: true,
            color: k.trend === "up" ? BRAND.ok : k.trend === "down" ? BRAND.alert : BRAND.muted,
          })] })] : []),
        ],
      })),
    })],
  });
}

// ---------------------------------------------------------------- portada, cabecera, pie
function backgroundRun() {
  return new ImageRun({
    data: fs.readFileSync(BRAND.background), type: "png",
    transformation: { width: 794, height: 1123 }, // A4 a 96 dpi
    floating: {
      horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, align: HorizontalPositionAlign.CENTER },
      verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, align: VerticalPositionAlign.CENTER },
      wrap: { type: TextWrappingType.NONE }, behindDocument: true,
    },
  });
}

/** Portada: fondo de marca (ya incluye logo). Campos opcionales salvo title. */
function cover({ title, subtitle, client, date, author, extra = [] }) {
  const meta = [];
  if (date) meta.push(p(`Fecha: ${date}`, { size: 20, after: 40 }));
  if (author) meta.push(p(`Elaborado por: ${author}`, { size: 20, after: 40 }));
  extra.forEach((t) => meta.push(p(t, { size: 20, after: 40 })));
  return [
    spacer(2400),
    new Paragraph({ children: [run(title, { bold: true, color: BRAND.primary, size: 40 })] }),
    ...(subtitle ? [new Paragraph({ spacing: { before: 120 }, children: [run(subtitle, { color: BRAND.primary, size: 26 })] })] : []),
    ...(client ? [new Paragraph({ spacing: { before: 150 }, children: [run(client, { bold: true, color: BRAND.primary, size: 28 })] })] : []),
    spacer(400),
    ...meta,
  ];
}

/** Cabecera con el fondo de marca a página completa: se repite en todas las páginas como marca de agua. */
function header() {
  return new Header({ children: [new Paragraph({ children: [backgroundRun()] })] });
}

function footer(label) {
  const s = { size: 16, color: BRAND.muted };
  return new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      style: "atbimFooter",
      children: [
        run(`${label || BRAND.tagline}   ·   Página `, s),
        new TextRun({ children: [PageNumber.CURRENT], font: BRAND.font, size: 16, color: BRAND.muted }),
        run(" de ", s),
        new TextRun({ children: [PageNumber.TOTAL_PAGES], font: BRAND.font, size: 16, color: BRAND.muted }),
      ],
    })],
  });
}

// ---------------------------------------------------------------- documento
/**
 * Monta el documento completo.
 *  cover:    objeto para cover() o null (sin portada)
 *  children: contenido (párrafos, tablas...). Si hay portada, empieza en página 2.
 *  footerLabel: texto del pie (por defecto "atbim – Building Engineering")
 *  landscape: false
 */
function buildDocument({ cover: c, children, footerLabel, title }) {
  // Una sola sección. El fondo de marca (logo + triángulos) va en la cabecera, así que aparece en
  // TODAS las páginas como marca de agua. La portada (primera página) no lleva pie.
  const section = {
    properties: {
      titlePage: !!c,
      page: {
        size: { width: PAGE.width, height: PAGE.height },
        // margen superior amplio para no pisar el logo del fondo
        margin: { top: 1900, bottom: 1100, left: PAGE.margin, right: PAGE.margin, header: 0, footer: 500 },
      },
    },
    headers: { default: header(), ...(c ? { first: header() } : {}) },
    footers: { default: footer(footerLabel), ...(c ? { first: new Footer({ children: [new Paragraph("")] }) } : {}) },
    children: c ? [...cover(c), pageBreak(), ...children] : children,
  };
  return new Document({
    creator: BRAND.tagline,
    title: title || (c && c.title) || "atbim",
    styles: {
      default: { document: { run: { font: BRAND.font, size: 22, color: BRAND.text } } },
      // estilo propio del pie: hace que los campos de número de página salgan a 8 pt como el texto
      paragraphStyles: [{ id: "atbimFooter", name: "atbim Footer", run: { font: BRAND.font, size: 16, color: BRAND.muted } }],
    },
    numbering: {
      config: [
        { reference: "atbim-bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 260 } }, run: { color: BRAND.primary } } }] },
        { reference: "atbim-numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 300 } }, run: { color: BRAND.primary, bold: true } } }] },
      ],
    },
    sections: [section],
  });
}

async function save(doc, outPath) {
  fs.writeFileSync(outPath, await Packer.toBuffer(doc));
  console.log("Generado:", outPath);
  return outPath;
}

/** Convierte a PDF con LibreOffice (misma carpeta). Devuelve la ruta del PDF. */
function toPdf(docxPath) {
  const dir = path.dirname(path.resolve(docxPath));
  const bin = ["soffice", "libreoffice"].find((b) => { try { execFileSync("which", [b]); return true; } catch { return false; } });
  if (!bin) throw new Error("LibreOffice no está instalado: no se puede generar el PDF.");
  execFileSync(bin, ["--headless", "--convert-to", "pdf", "--outdir", dir, docxPath], { stdio: "ignore" });
  const pdf = path.join(dir, path.basename(docxPath).replace(/\.docx$/i, ".pdf"));
  console.log("Generado:", pdf);
  return pdf;
}

module.exports = {
  BRAND, PAGE, CONTENT_WIDTH,
  run, p, h1, h2, h3, bullets, callout, pageBreak, spacer, table, kpis,
  cover, buildDocument, save, toPdf,
};
