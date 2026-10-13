# SEO on-page

Cada punto lleva su porqué. Los datos de la web (dominio, páginas y medición) están en
`contexto-atbim.md`, y cómo los usa la plantilla, en `plantilla-post.md`.

## 1. Title: un campo, tres funciones

En atbim.com, el título del post es a la vez el H1, el `<title>` (con " | ATBIM" detrás, 8
caracteres más) y el origen del slug (`plantilla-post.md` §2).

- **Longitud:** el `<title>` completo, 60 caracteres como máximo, así que el título no pasa de
  unos 52. *Por qué:* Google corta el título por píxeles (unos 600) y a partir de ahí se pierde
  la promesa.
- **Keyword principal al principio**, si suena natural. *Por qué:* es lo primero que se lee en el
  resultado y lo que el buscador cruza con la consulta.
- **2-3 variantes**, cada una con el texto, los caracteres del título y del `<title>`, el slug
  que generará y el ángulo de CTR (pregunta directa, criterio de decisión, "(y cuándo no)",
  cifra verificada). Evita años y fechas, porque envejecen el resultado.
- **Si el slug ideal es más corto que el título**, usa el truco del slug (`plantilla-post.md` §2).

## 2. Meta description

- **140-155 caracteres:** keyword, promesa concreta y qué va a encontrar el lector. Sin clickbait.
- **2-3 variantes.** *Por qué:* Google a veces la reescribe, pero en consultas con intención clara
  suele usar una buena, y es el texto que vende el clic.
- **Nunca vacía.** La plantilla publica la página sin meta description si falta, como le pasa
  hoy a algún post.

## 3. Encabezados

- **Un solo H1, que es el título** (lo pone la plantilla). El cuerpo no lleva H1.
- **H2 para las secciones y H3 para las subsecciones**, sin saltar niveles. No uses `####`, que
  el editor no entiende. *Por qué:* los posts antiguos, con todo en H3, no tienen jerarquía y a
  Google y a los LLM les cuesta saber qué es sección y qué es detalle.
- **Redacta los H2 como la pregunta o la decisión del lector.** *Por qué:* casan con consultas
  conversacionales y con fragmentos destacados.

## 4. Enlazado interno (obligatorio)

- **En el cuerpo**, al menos:
  - un enlace a la página de servicio que apoya el post, en los 2-3 primeros párrafos y con un
    ancla descriptiva que lleve una variante de su keyword;
  - 1 o 2 casos (`contexto-atbim.md` §7) donde prueben algo.
  - Opcional: 1 o 2 posts relacionados.
- *Por qué:* le dice a Google qué página es la del servicio (evita la canibalización) y lleva al
  lector Think hacia la prueba y el siguiente paso.
- **Todos los enlaces existen en el inventario en vivo.** Nunca a slugs `-copy`, nunca con barra
  final.
- **Anclas descriptivas**, nunca "aquí". Una misma ancla no apunta a URLs distintas.
- **Después de publicar:** propón enlaces entrantes desde posts del mismo tema que ya posicionan
  ("SEO colonies", `frameworks.md` §2). Es una tarea para una persona, no la hace la skill.

## 5. FAQ y schema FAQPage

- **Incluye FAQ cuando haya repreguntas reales (3-5)**, del tipo que haría alguien en un chat con
  una IA para afinar su búsqueda. Tienen que ser distintas de las FAQ de la página de servicio:
  compruébalo en vivo.
- **Schema FAQPage, solo cuando aporte**, y como anexo del borrador (`plantilla-post.md` §8).
  *Por qué:* desde agosto de 2023 Google solo muestra resultados enriquecidos de FAQ en webs
  gubernamentales y de salud muy conocidas
  (https://developers.google.com/search/blog/2023/08/howto-faq-changes). En atbim.com no dará
  fragmento enriquecido. Su valor es que la estructura se entienda mejor; nunca es un motivo
  para escribir FAQ.

## 6. Estructura para LLM

- **El primer párrafo responde a la consulta en 2-4 frases.** *Por qué:* es el fragmento que un
  LLM recupera y cita.
- **Cada sección H2 se entiende sola:** nombra el tema en lugar de decir "esto" o "lo anterior".
- **Comparaciones en tabla y criterios o pasos en lista.** *Por qué:* los LLM las resumen sin
  deformarlas.
- **Entidades escritas igual siempre:** atBIM, el nombre de cada servicio, las normas y los
  programas.
- **Hiperespecificidad:** un dato con su fuente vale más que tres adjetivos.

## 7. Idioma, hreflang y canonical

- **Canonical:** lo pone la plantilla, sin barra final. Los enlaces se escriben igual.
- **Hreflang:** solo existe en el sitemap y solo si las versiones comparten slug
  (`plantilla-post.md` §7). Se decide en el CHECKPOINT 2, explicando su coste.
- **Versión de idioma correcta:** en un post `en` o `br`, enlaza a la versión de ese idioma
  cuando exista (compruébalo en el inventario). Si no existe, enlaza la de `es` y avisa al lector.

## 8. Imágenes

- **Alt:** qué se ve y en qué contexto, sin meter keywords de relleno.
- **Pie en cursiva debajo.**
- **WebP comprimido.**
- **Mejor imágenes propias** (modelos, nubes de puntos, capturas): también ayudan a pasar el
  quality gate.
- **Un edificio de cliente no se nombra sin permiso:** si no está claro, `[PENDIENTE VALIDAR]`.
- **Portada:** si no hay, el sitemap usa la primera imagen del cuerpo.

## 9. CTA y medición

- **Cada CTA tiene su evento**, como en las páginas actuales (`plantilla-post.md` §5,
  `contexto-atbim.md` §10). Si no está claro qué evento, `content_id` o placement llevar,
  pregunta: no inventes valores.
- **Plan de medición de un post Think** (`frameworks.md` §1): profundidad de lectura,
  clics en CTA por `content_id` y contactos asistidos según el servicio. En el borrador va en
  la tabla del apartado E.
- **Revisión:**
  - semana 2: indexación en Search Console;
  - semana 4: lectura y clics;
  - semanas 8-12: consultas en Search Console y canibalización de la página de servicio.
