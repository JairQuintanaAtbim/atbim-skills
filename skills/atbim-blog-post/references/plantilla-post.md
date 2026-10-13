# Plantilla de post de atbim.com

Extraída el 13/10/2026 del repo `atbim-web` (rama `main`, commit `4e89149`) y de posts reales
leídos de la API: la guía de ISO 19650 en `es`, `en` y `br`, y las dos partes del gemelo digital
en `es`. Aquí solo hay estructura y código; los datos de la empresa (dominio, email, valores de
GA4…) están en `contexto-atbim.md`. Si el código de la web cambia, manda el código: avisa y
sigue lo que diga el repo.

---

## 1. Dónde vive un post

- **No hay content collection de Astro ni frontmatter.** Cada post es un documento de MongoDB
  que se crea en el editor de administración (`/{lang}/auth/create-post`, con login de
  administrador) y se guarda en la API (`POST /api/manage/posts-create`).
- La web es estática: `src/pages/[lang]/blog/[slug].astro` lee los posts en el build
  (`getStaticPaths`). Un post publicado aparece en el siguiente build y despliegue.
- Lo que la skill deja en el repo es un **borrador en Markdown** para revisión
  (`docs/content/drafts/`, apartado 9). Lo copia al editor una persona. La skill nunca llama a
  `/api/manage/*`.
- Hay borradores anteriores en `docs/content/drafts/` (la convención actual) y en
  `docs/borradores/` (la anterior). Revisa las dos carpetas al buscar canibalización.

## 2. Campos del documento

| Campo | En el editor | Reglas | Dónde se usa en la web |
|---|---|---|---|
| `lang` | Lo fija la URL del editor (`/es/auth/…` → `es`) | `es`, `en` o `br` | Ruta `/{lang}/blog/{slug}` |
| `title` (obligatorio) | Título | Es el H1 y el `<title>`, y genera el slug | `<h1>`, `<title>` = `{title} \| ATBIM`, `headline` del BlogPosting, último nivel del breadcrumb, tarjetas |
| `titleAccent` | Resalto del título | Opcional. Solo se guarda si es un fragmento literal del título | Pinta ese fragmento con el estilo de resalto |
| `slug` | No se edita | Sale de `slugify(title)` al **crear**: minúsculas, sin tildes, sin signos, espacios → guiones. Si ya existe en ese idioma, añade `-2`, `-3`… **Al actualizar el título, el slug no cambia** | URL y canonical |
| `metaDescription` | Meta description | Si está vacía, la página sale sin meta description | `<meta name="description">` y `description` del BlogPosting |
| `content` (obligatorio) | Cuerpo | Markdown (apartado 4) | Cuerpo del post |
| `image` | Portada | Se sube desde el editor (DigitalOcean Spaces) | Tarjetas y `<image:image>` del sitemap (si no hay portada, la primera imagen del cuerpo) |
| `categoryId` | Categoría | Opcional. Los posts recientes van sin categoría | Badge y lateral de relacionados |
| `draft` | Botón de borrador | Los borradores no salen en la API pública ni en el build | — |
| `author` | No se escribe | La API lo asigna según quien guarda (lista en `api/src/functions/posts.js`); si no reconoce al usuario, pone "ATBIM". Los posts recientes llevan "ATBIM" | Línea "fecha / autor". El JSON-LD usa siempre la Organization |
| `date`, `updatedAt` | Automáticos | — | Fecha visible, `datePublished`, `dateModified`, `lastmod` |
| `contentId` | No existe en el editor | Lo tienen los posts migrados para agrupar traducciones, pero el código de posts no lo usa | — |

**Truco del slug** (comprobado en el código): si quieres un slug más corto que el título,
crea el post con un título que genere ese slug, guárdalo como borrador y cambia después el
título. El slug se queda.

## 3. Lo que pinta la plantilla: no lo escribas en el cuerpo

`src/pages/[lang]/blog/[slug].astro` añade solo:

- El **H1** con el título. El cuerpo no lleva H1.
- La línea **"fecha / autor"** (va dentro de otro `<h1>`: cada post tiene hoy dos H1. Es un
  fallo de la plantilla, fuera del alcance de la skill; menciónalo si afecta).
- El **badge de categoría**, si hay.
- El **pie de contacto**: texto `contact` de `translation/{lang}/slugBlog.json` más el email
  con `mailto:`. No repitas el email en el cuerpo.
- El lateral **"Más posts que podrían interesarte"** (texto `more` de `slugBlog.json`): hasta
  5 posts de la misma categoría y el resto aleatorios, hasta 10. Se oculta a 1024 px o menos.
  **No se escribe en el cuerpo.**
- El bloque de Instagram.
- `<main data-ga-content="blog">`, que activa la medición de profundidad de lectura.
- **JSON-LD automático:** `BlogPosting` (headline, description, author y publisher = la
  Organization por `@id`, `datePublished`/`dateModified` del CMS, `mainEntityOfPage`, `url`) y
  `BreadcrumbList` (Inicio › Todos los blogs › título).
- **Canonical** `{dominio}/{lang}/blog/{slug}`, sin barra final (`trailingSlash: 'never'`).
- `alternates={[]}`: la página del post **no** emite hreflang en el `<head>` (apartado 7).

## 4. Markdown del cuerpo

Se publica con la instancia de `marked` (GFM) de `src/utils/marked.js`, la misma que usa la
vista previa del editor. No hay sanitizador: el HTML en línea se publica tal cual.

- **Títulos:** sin H1. Secciones en `##` y subsecciones en `###`. El modo visual del editor solo
  entiende `#`, `##` y `###`: no uses `####`.
- **Párrafo inicial:** sin título encima. Responde la pregunta del post en las primeras frases.
- **Imagen:** `![alt descriptivo](url)` y, en la línea siguiente, el pie en cursiva:
  `*Pie de la imagen.*`. Las URLs salen de la subida del editor; en el borrador, si falta la
  imagen, escribe `[PENDIENTE VALIDAR: imagen — qué mostrar · de dónde sale · alt propuesto]`.
- **Destacado:** `> texto`.
- **Tablas:** GFM, con barra inicial en cada fila.
- **Marcas propias** (`src/utils/post-syntax.js`):
  - `==texto==` resalto de titulares (solo se ve en h1 y h2);
  - `[texto]{violeta|azul|arena}` rotulador;
  - `{{descargar url="https://…" texto="…" align="center"}}` botón de descarga (solo http/https);
  - ` {align=center}` al final de un párrafo o título.
- **Enlaces internos:** absolutos con el dominio de `contexto-atbim.md`, como en los posts
  actuales. Los relativos (`/{lang}/…`) también funcionan.
- **FAQ:** `## Preguntas frecuentes` y cada pregunta en `###` con interrogación; respuesta de
  2 a 4 frases que se entienda sola. (Los posts antiguos ponen las preguntas en `###` sin H2.)
- **Cierre:** un párrafo final con el CTA. No pongas `<br />` como separador, aunque algunos
  posts lo hagan.

## 5. CTA medidos en el cuerpo

Lo mide `src/scripts/analytics-events.js`:

- Cualquier clic en un elemento con `data-ga-event` envía ese evento.
- Cada `data-ga-*` adicional viaja como parámetro (`data-ga-content-id` → `content_id`).
- `placement` sale del `data-ga-placement` del propio elemento o del ancestro más cercano. Si no
  hay ninguno, vale `other`.
- GA4 corta cada valor a 100 caracteres.

En Markdown, un CTA medido es HTML en línea:

```html
<a href="{URL de destino}" data-ga-event="{evento de clic}" data-ga-content-id="{id_en_snake_case}" data-ga-placement="{placement}">{Texto del CTA}</a>
```

- Los nombres de evento, los `placement` que existen y los valores de `interest_service`
  están en `contexto-atbim.md` §10. Un `placement` nuevo necesita el OK de quien lleve la
  analítica: hasta entonces, márcalo como `[PENDIENTE VALIDAR]`.
- **Riesgo comprobado:** el modo visual (Word) del editor guarda los `<a>` como
  `[texto](href)` (`src/scripts/admin/markdown/to-markdown.js`, rama `tag === 'a'`). Si el post
  se guarda desde ese modo, los `data-ga-*` se pierden sin avisar. Hay que pegar y guardar en
  **modo Split**, y comprobar el clic en GA4 DebugView después de publicar.
- Ningún post publicado usa todavía CTA medidos. El primero que los lleve es también una
  prueba: avísalo en el informe.
- Un enlace `mailto:` se mide solo como clic de contacto. El formulario de contacto no permite
  preseleccionar el servicio desde la URL.

## 6. "Pregunta a tu IA" dentro de un post

- En la web es el componente `src/components/ui/AskAiButtons.astro`. Monta dos enlaces,
  `https://chatgpt.com/?q={prompt}` y `https://claude.ai/new?q={prompt}`, cada uno con su
  `data-ga-event` y `data-ga-ai-tool`. El prompt se construye en el build con los textos de
  `translation/{lang}/askAi.json`, el resumen y los puntos del servicio, y la URL de la página.
- Un componente de Astro no se puede insertar desde el Markdown del post. Sin tocar código, la
  única forma es copiar los dos enlaces como HTML en línea con el prompt ya codificado
  (`encodeURIComponent`). Tiene el mismo riesgo del modo Word que los CTA medidos. La forma
  limpia es un cambio en `blog/[slug].astro`, que es una tarea de desarrollo.
- Se decide en el CHECKPOINT 2. Por defecto, no se incluye.

## 7. Idiomas, slugs y hreflang

- Cada idioma es un documento independiente, creado desde `/{lang}/auth/create-post`.
- El hreflang de los posts **solo** sale en `sitemap-blog.xml` (`src/pages/sitemap-blog.xml.js`),
  que agrupa los documentos con **el mismo slug** (`es` → `es`, `en` → `en`, `br` → `pt-BR`;
  `x-default` = la versión `es`). La mayoría de las traducciones actuales tienen un slug propio
  y por eso no están enlazadas.
- Si quieres hreflang, la traducción tiene que compartir slug con la versión `es`: créala con
  el título en español (para que genere el mismo slug) y cambia después el título. El coste es
  una URL en español en la versión inglesa o portuguesa. Si prefieres slug nativo, no habrá
  hreflang hasta que la web agrupe por `contentId`, que es una tarea de desarrollo.
- Se decide en el CHECKPOINT 2, explicando ese coste.

## 8. JSON-LD

- `BlogPosting` y `BreadcrumbList` son automáticos (apartado 3). No los escribas.
- La plantilla **no publica `FAQPage`**, y meter un `<script type="application/ld+json">` en el
  cuerpo no está probado contra la ida y vuelta del editor. Se entrega como anexo del borrador
  (apartado C) para desarrollo, solo con hechos verificados, y queda como tarea.

## 9. El archivo que deja la skill en atbim-web

Ruta: `docs/content/drafts/{slug-previsto}.md` para `es`. Las versiones en otros idiomas, si se
piden, van en `{slug-previsto}.en.md` y `{slug-previsto}.br.md`. Formato:

````markdown
# Borrador: {título} (post {See | Think | Do})

> Estado: borrador. No publicar mientras quede algún [PENDIENTE VALIDAR].
> Fecha: DD/MM/AAAA · Idioma: {es | en | br} · Keyword principal: {keyword}
> Contexto: contexto-atbim.md verificado el {fecha}; inventario consultado el {fecha}.

---

## A. Campos del editor

- **Título / H1** ({n} caracteres; el `<title>` queda en {n + 8} con " | ATBIM"): `…`
- **Slug que generará la API:** `/{lang}/blog/…`
- **Meta description** ({n} caracteres): `…`
- **Resalto del título:** `…` o vacío
- **Portada:** {imagen} o [PENDIENTE VALIDAR: …]
- **Categoría:** sin categoría
- **Guardar como:** borrador, en modo Split

## B. Post

{Cuerpo en Markdown, listo para pegar: sin H1, sin pie de contacto y sin "Más posts"}

## C. JSON-LD FAQPage (anexo para desarrollo)

## D. Decisiones SEO y fuentes

| Decisión | Por qué | Fuente |
|---|---|---|

## E. Medición

| Qué | Evento y parámetros | Requisito |
|---|---|---|

## F. Preguntas abiertas (bloquean la publicación)

### Datos
### Imágenes
### Validaciones de negocio
### Desarrollo y analítica

## G. Checklist final

{Tabla del informe de checklist-final.md}
````
