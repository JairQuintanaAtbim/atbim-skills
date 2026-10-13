# Contexto de atBIM

**Verificado el: 13/10/2026**

Este es el ÚNICO archivo de la skill con datos de la empresa: cifras, casos, servicios, sedes,
URLs, herramientas y medición. El resto de archivos remiten aquí. Para actualizar la empresa
se edita este archivo y solo este (lo hace una persona; la skill nunca lo modifica).

Cómo se verificó: páginas en vivo de atbim.com, los textos de `translation/es/*.json` y
`src/data/offices.js` del repo `atbim-web` (rama `main`, commit `4e89149`) y la API pública
(`/api/posts`, `/api/projects`). Si la web dice otra cosa que este archivo, **manda la web**:
avisa de la discrepancia, usa el dato de la web y no edites este archivo.

---

## 1. Web, idiomas e inventario en vivo

- **Dominio:** `https://www.atbim.com` (sin barra final en ninguna URL).
- **Idiomas:** `/es` (español peninsular), `/en` (inglés), `/br` (portugués de Brasil).
- **Repo de la web (local):** `C:\Users\Jair\Desktop\proyectos-github\atbim-web`. Si no existe
  en esta máquina, pregunta la ruta.

Inventario que se consulta EN CADA EJECUCIÓN (no se guarda en ningún sitio):

| Qué | Página legible | JSON exacto (preferible: slugs y metas literales) |
|---|---|---|
| Posts publicados | `https://www.atbim.com/es/all-blogs` | `https://www.atbim.com/api/posts?lang=es` (`en`, `br`) |
| Un post | `https://www.atbim.com/es/blog/{slug}` | `https://www.atbim.com/api/posts/{slug}?lang=es` |
| Proyectos | `https://www.atbim.com/es/all-projects` | `https://www.atbim.com/api/projects?lang=es` (sin cuerpo; el detalle en `/api/projects/{slug}`) |
| Servicios | `https://www.atbim.com/es/services` | — |

La API pública no devuelve los borradores del CMS (`draft: true`). Los borradores en Markdown
del repo web están en las carpetas que indica `plantilla-post.md`.

---

## 2. Quién es

- **ATBIM**: consultoría BIM para el sector AECO. "Consultoría BIM para optimizar diseño,
  construcción y gestión de activos" (portada, `https://www.atbim.com/es`).
- **Lema:** "Más valor. Más control. Más futuro." (portada).
- **Misión:** "Conectar BIM, datos y desarrollo para crear flujos de trabajo más inteligentes,
  trazables y eficientes en proyectos AEC" (`https://www.atbim.com/es/about`).
- **Filosofía:** "Procesos claros, datos fiables y decisiones mejor informadas" (`/es/about`).
- **No es un SaaS.** BIMsualize y Garuna 360 son productos propios dentro de la oferta.
- **Email:** info@atbim.es.

## 3. Sedes

| Sede | Dato | Fuente |
|---|---|---|
| **Zaragoza** (oficina) | Avenida Ranillas 3C, 1ª Planta, Oficina 1B, 50018 Zaragoza. Lunes a viernes, 08:00–16:00. +34 660 51 44 55 | `https://www.atbim.com/es/offices/zaragoza`, `/es/contact-page` |
| **São Paulo** (oficina) | Al. Rio Negro, 503, Sala 2020, Alphaville, Barueri – SP, Brasil | `https://www.atbim.com/es/offices/sao-paulo` |
| **Sevilla** | Parte del equipo está en Sevilla. **No hay oficina**: nunca insinuar oficina física | `https://www.atbim.com/es/offices/sevilla` ("En Sevilla no tenemos oficina…") |

- Servicio en toda España, con desplazamiento del equipo de escaneo.
- `[PENDIENTE VALIDAR]` Teléfono de Brasil (+55 51 99253-9699): lo publica `/br`, pero el
  prefijo 51 no es de São Paulo y la web lo excluye del schema a propósito. **No usarlo en posts.**

## 4. Cifras verificadas (solo se pueden usar estas)

| Cifra | Dónde está publicada |
|---|---|
| +10 años de experiencia | `/es/about` (en las cifras de esa página: "años de experiencia combinada") |
| +200 proyectos | `/es` (portada) |
| +10 países | `/es` (portada) |
| +10.000.000 m² modelados en BIM | `/es/about` |
| +1.000.000 m² escaneados con láser 3D | `/es/about` |
| +58 modelos BIM en una sola obra (The Ellinikon, Atenas) | `/es/about`, `/es/bim-outsourcing` |
| 5 hospitales coordinados | `/es/bim-outsourcing` ("los cinco hospitales que hemos coordinado") |
| +500 profesionales formados en implantación BIM | `/es/about` |
| +100 plugins de Revit como partner ADN de Autodesk | `/es/about` |
| Scan to BIM: +3.500 posicionamientos de nube de puntos a color en edificios industriales | `/es/scan-to-bim` |
| Scan to BIM: 100.000 m² escaneados en 20 días, con 6 técnicos y +100 tomas al día | `/es/scan-to-bim` |
| ISO 19650-2 certificada por Applus+ desde 2020 | `/es/bim-outsourcing` |
| Sello RSA PYME 2025 (Aragón Empresa) | Pie de todas las páginas (la web solo dice "Sello RSA PYME 2025") |

**No usar:** "500.000 m² en 5 hospitales". Ya no está en la web (sobrevive en un post antiguo).

## 5. Líneas de servicio (por orden de prioridad) y páginas

1. **Desarrollo y gestión de proyectos BIM / BIM Outsourcing** → `https://www.atbim.com/es/bim-outsourcing`.
   Modelado de arquitectura, estructura y MEP (del estudio previo al as-built); cálculo y
   análisis (implantación, soleamiento, viento, energía, huella de carbono); mediciones,
   control de costes y certificación; 4D; BIM + GIS; detección de interferencias
   (Navisworks/Clash Detective, ACC, BCF). Metodología en 4 etapas, del alcance a la entrega.
2. **Scan to BIM** → `https://www.atbim.com/es/scan-to-bim`.
   Leica RTC360 (hasta 2 millones de puntos por segundo, registro VIS, imágenes 360° HDR);
   escáneres Faro y Leica; Scene, Register360 y Recap; entrega en Revit, IFC y 2D para AutoCAD;
   LOD y tolerancia por disciplina acordados antes de empezar. Aplicaciones: rehabilitación,
   arquitectura e ingeniería, MEP, industria y logística, patrimonio, as-built y FM.
   Fotogrametría con dron.
3. **Gemelo digital y aplicaciones web** → `https://www.atbim.com/es/digital-twin`.
   Gemelo de la propia oficina de Zaragoza (580 elementos de arquitectura y cerca de 700 de
   instalaciones, sensores IoT) con dashboard BIM, costes y O&M sobre ACC.
   **Desarrollo de MCP para Revit** con skills y procesos a medida.

- **Productos:** BIMsualize → `https://www.atbim.com/es/bim` · Garuna 360 → `https://www.atbim.com/es/web` ·
  Visor 3D → `https://www.atbim.com/es/viewer`. **Git4bim está en pausa: no mencionarlo.**
- **Visión general:** `https://www.atbim.com/es/services`. **Contacto:** `https://www.atbim.com/es/contact-page`.

## 6. Software

Revit, Navisworks Manage, Civil 3D, Synchro, ACC, AutoCAD, Dynamo, Forma, Insight, Power BI,
Tekla, Catia, Inventor, Infraworks; IFC, BCF, BEP, MIDP; Three.js/GLB.
(La mayoría están en `/es/bim-outsourcing` y sus FAQ; Inventor e Infraworks salen en posts y
fichas de proyecto; Three.js/GLB en los posts del gemelo digital.)

## 7. Casos usables

Prefijo de todas las URLs: `https://www.atbim.com/es/projects/`. Antes de enlazar un caso,
comprueba en el inventario en vivo que la ficha sigue publicada. Muchas fichas tienen poco
texto: cualquier detalle que no esté en la ficha va como `[PENDIENTE VALIDAR: …]`.

| Sector | Caso | Slug |
|---|---|---|
| Estadios | Santiago Bernabéu (instalaciones) | `modelado-y-coordinacion-de-instalaciones-para-el-proyecto-de-reforma-del-estadio-santiago-bernabeu` |
| Estadios | Nou Camp Nou (Scan to BIM) | `scan-to-bim-para-el-proyecto-del-nou-camp-nou` |
| Estadios | La Romareda | `proyecto-visualizacion-estadio-romareda-zaragoza` |
| Sanitario | VDC Hospital 12 de Octubre | `vdc-instalaciones-hospital-12-octubre-madrid` |
| Sanitario | Hospital modular LOD 400 en Isla Mauricio | `hospital-modular-en-mauricio` |
| Sanitario | Sótero del Río | `reposicion-del-complejo-sotero-del-rio` |
| Residencial (Zaragoza) | 198 viviendas | `modelado-coordinacion-y-documentacion-de-proyecto-residencial-de-198-viviendas-en-zaragoza` |
| Residencial (Zaragoza) | 155 viviendas | `modelado-de-edificio-de-155-viviendas-para-proyecto-basico` |
| Residencial (Zaragoza) | 64 viviendas | `proyecto-basico-edificio-residencial-zaragoza` |
| Industria y logística | BonÁrea Épila | `gestion-informacion-control-documental-bim-gemelo-digital-bonarea-epila` |
| Industria y logística | Ciempozuelos | `centros-logisticos` |
| Industria y logística | Logístico en Valencia | `scan-to-bim-de-edificio-industrial-logistico-valencia` |
| Industria y logística | Naves en Navarra (varias fichas: elegir y comprobar) | `proyecto-ejecucion-nave-industrial`, `proyecto-naves-nido`, `implantacion-bim-modelado-familias-componentes-industriales` |
| Obra civil | A-23 Monrepós–Nueno | `tramo-a-23-monrepos-nueno` |
| Obra civil | Alta velocidad en Murcia | `modelado-tramo-tren-alta-velocidad` |
| Obra civil | Presa en Dubái | `modelado-bim-presa-dubai` |
| Obra civil | Depuradoras | `modelado-proyectos-depuradoras` |
| Construcción | BIM 4D Westfield La Maquinista | `bim-4d-planificacion-y-organizacion-y-control-de-obra-con-navisworks-y-synchro` |
| Construcción | Torre de Méndez Álvaro (MEP) | `modelo-mep-torre-oficinas-madrid` |
| Construcción | CC Garbera | `modelo-coordinacion-ampliacion-cc-garbera` |
| Internacional | The Ellinikon (Atenas) | `colaboracion-en-el-proyecto-ellinikon` |
| Internacional | Qatar (fachada modular) | `fachada-modular-adaptativa` |
| Internacional | Venezuela | `proyecto-basico-centro-salud-venezuela`, `proyecto-escuela-modular-venezuela`, `proyecto-basico-parque-bomberos` |
| Implantación | Implantaciones BIM en empresas y AAPP | `implementaciones-bim-en-empresas-y-entidades-publicas` |

**No usar:** Velindre Cancer Centre (NDA sin aclarar), aunque tenga ficha publicada.

## 8. Blog

- **Inventario el 13/10/2026:** 40 posts en `/es` (2 son duplicados `-copy`), 39 en `/en` y 39
  en `/br`. Los últimos en `/es`: el gemelo digital de la oficina, partes 1 y 2 (septiembre de
  2026); Green Building Studio → Insight y la guía de ISO 19650 (julio de 2026).
- **Formato actual:** autor "ATBIM"; "nosotros" para la empresa y "tú" para el lector; listas;
  imágenes con alt y pie en cursiva; FAQ al final; cierre que invita a contactar. La web añade
  sola el pie con el email y el bloque "Más posts que podrían interesarte".
- **No repetir en los posts nuevos:** secciones solo en H3 sin H2, y ningún enlace a páginas de
  servicio en el cuerpo.
- **No enlazar nunca** URLs que acaben en `-copy` o `-copy-copy`. Hoy: `vcd-y-bim-copy` y
  `modelado-bim-de-armadura-parte-02-modificacion-de-geometrias-con-dynamo-copy`.
- **Canibalización conocida:**
  - "gemelo digital": posts del blog frente a `/es/digital-twin`.
  - "ISO 19650": 4 posts con la norma en el título (`iso-19650`,
    `une-en-iso-19650-1-novedades-y-conceptos-clave-de-la-nueva-norma-iso`,
    `5-puntos-clave-de-la-norma-iso-19650-amplia-el-alcance-de-metodologia-bim`,
    `descarga-pdf-esquematico-de-la-norma-iso-19650-2-bim`) y más posts que la tratan.

## 9. Vocabulario de la demanda

"consultoría BIM", "modelado BIM", "servicios BIM", "scan to bim", "auditoría BIM".
"Outsourcing BIM" casi no tiene demanda en España.

## 10. Medición (GA4)

- **Conversión:** `contact_sent`, con `interest_service` = `core_modeling_management` ·
  `scan_to_bim` · `custom_software` · `other` · `not_specified` (más `language` y `placement`).
  Estos valores no se traducen ni se renombran: renombrar uno parte la serie histórica.
- **Línea de servicio → `interest_service`:** desarrollo y gestión BIM → `core_modeling_management`;
  Scan to BIM → `scan_to_bim`; gemelo digital, aplicaciones web, MCP y productos → `custom_software`.
- **Clics declarados:** `cta_click` (parámetro `content_id`), `ask_ai` (`ai_tool` = `chatgpt` |
  `claude`), `faq_open`, `select_content`. Todos llevan `placement`.
- **Automáticos:** `content_scroll` (25/50/75/100, con `content_type`, `page_path` y
  `seconds_to_depth`), `contact_click` (enlaces `mailto:` y `tel:`), `form_start`.
- **Dimensiones:** `content_type` (en los posts vale `blog`), `content_id`, `placement`.
- **Placements que existen hoy:** `contact_page`, `contact_section`, `demos`, `faqs`, `footer`,
  `header`, `hero`, `home_projects`. Dentro de un post no hay ninguno, así que un CTA del cuerpo
  sale como `other`. Un valor nuevo (p. ej. para el cierre del post) necesita el OK de quien
  lleve la analítica antes de usarse.
- **CTA "Pregunta a tu IA cómo encaja atBIM en tus proyectos"** (ChatGPT y Claude): está en la
  portada y en `/es/services`, `/es/bim-outsourcing`, `/es/scan-to-bim` y `/es/digital-twin`.
  En los posts Think se valora caso a caso (ver `plantilla-post.md`).
- El formulario de contacto no permite preseleccionar el servicio desde la URL: el
  `interest_service` lo elige el visitante.

## 11. Público y tono

- Escribimos para quien contrata: promotoras, constructoras, ingenierías, AAPP, propietarios y
  gestores de activos, retail e industria. No para colegas modeladores.
- Tono profesional, directo y técnico, sin sobreventa.

## 12. Discrepancias detectadas al verificar (13/10/2026)

Las debe revisar una persona; la skill solo las tiene en cuenta.

1. Velindre Cancer Centre tiene ficha publicada (`/es/projects/velindre-cancer-centre`), pero
   aquí figura como "no usar" por la NDA.
2. El texto de "Pregunta a tu IA" (`translation/*/askAi.json`) dice "con sedes en Zaragoza,
   Sevilla y São Paulo", y `/es/offices` se titula "ATBIM en Zaragoza, São Paulo y Sevilla".
   En los posts: "parte del equipo está en Sevilla".
3. El aviso legal y la política de privacidad publican otras dos direcciones en Zaragoza
   (`docs/CONTENIDO-PENDIENTE.md` §1 del repo web). En los posts solo se usa la de Ranillas.
4. El brief daba 39 posts en `/es`; la API devuelve 40 (2 `-copy`). La parte 2 del gemelo
   digital no tiene meta description y ya usa H2.
5. "Naves en Navarra" son varias fichas. La de la planta industrial de lavado
   (`proyecto-ejecucion-planta-industrial-lavado`) dice Navarra en el título y Ychoux
   (Francia) en la ubicación: no usarla sin aclararlo.
6. La ficha de The Ellinikon se titula "Colaboración en el proyecto ellinikon" y no tiene
   ubicación ni descripción. La cifra de +58 modelos sale de `/es/about` y `/es/bim-outsourcing`,
   no de la ficha.
