// Ejemplo mínimo de uso de atbim_brand.js. Copia este archivo, cambia el contenido y ejecuta:
//   NODE_PATH=$(npm root -g) node example.js
const path = require("path");
const B = require(path.join(__dirname, "atbim_brand.js"));

(async () => {
  const doc = B.buildDocument({
    cover: {
      title: "Informe SEO semanal",
      subtitle: "atbim.com · semana del 4 al 10 de octubre de 2026",
      client: "atBIM – Marketing digital",
      date: "13/10/2026",
      author: "atbim – Building Engineering",
    },
    children: [
      B.h1("1. Resumen"),
      B.kpis([
        { label: "Clics GSC", value: "167", delta: "+8 %", trend: "up" },
        { label: "Impresiones", value: "7.180", delta: "+4 %", trend: "up" },
        { label: "Sesiones orgánicas", value: "28", delta: "−24 %", trend: "down" },
        { label: "Leads (contact_sent)", value: "0", delta: "1 la semana anterior", trend: "down" },
      ]),
      B.spacer(200),
      B.p([{ text: "/es/bim-outsourcing ya está publicada y posiciona", bold: true }, ": 78 impresiones (antes 0)."]),
      B.callout("Hueco de medición: 167 clics en Search Console frente a 28 sesiones orgánicas en GA4.", "alert"),
      B.h1("2. KPIs de Search Console"),
      B.table({
        columns: ["Métrica", "Esta semana", "Anterior", "Variación"],
        widths: [40, 20, 20, 20],
        rows: [["Clics", "167", "154", "+8 %"], ["Impresiones", "7.180", "6.890", "+4 %"], ["CTR", "2,3 %", "2,2 %", "+0,1 pp"], ["Posición media", "10,5", "10,6", "−0,1"]],
      }),
      B.h1("3. Acciones de la semana"),
      ...B.bullets(["Lanzar el post Think «Cuándo necesitas consultoría BIM».", "Post en portugués sobre gemelo digital y scan to BIM.", "Redirigir con 301 las URL -copy."], { numbered: true }),
      B.h1("4. Detalle (relleno de prueba)"),
      ...Array.from({ length: 14 }, (_, i) => B.p(`Párrafo de prueba ${i + 1}: texto de cuerpo para comprobar cómo se ve la marca de agua detrás del contenido en las páginas interiores, incluida la zona de los triángulos de la esquina inferior izquierda.`)),
      B.h2("Tabla con total"),
      B.table({ columns: ["Bloque", "Horas"], widths: [80, 20], rows: [["RF-01: Estructura", 8], ["RF-02: Gestión", 14]], total: ["TOTAL ESTIMADO", "22 h"] }),
    ],
  });
  const out = await B.save(doc, "ejemplo-atbim.docx");
  B.toPdf(out);
})();
