---
name: atbim-blog-post
description: "Crea y reescribe posts del blog de atbim.com de principio a fin: elige la keyword con See-Think-Do y prioridad BOFU, acuerda la estructura en dos checkpoints, redacta en español, inglés o portugués de Brasil sin inventar datos, prepara el SEO on-page (title, meta, H2/H3, enlazado interno, FAQ, CTA medidos en GA4) y deja el borrador listo en el repo atbim-web. Úsala cuando el usuario pida «escribe un post», «post para el blog de atbim», «artículo para atbim.com», «contenido Think», «idea de post», «ideas para el blog», «reescribe este post», «post en inglés» o «post en portugués», o cualquier contenido de blog para atBIM/ATBIM."
license: Proprietary
---

# atbim-blog-post: posts del blog de atbim.com

Guía la creación de un post de principio a fin:

1. elegir la keyword;
2. aprobar el enfoque (CHECKPOINT 1);
3. aprobar la estructura (CHECKPOINT 2);
4. redactar;
5. pasar el quality gate y el checklist;
6. dejar el borrador en el repo de la web.

Solo sirve para atBIM.

## Reglas que no se negocian

- **Un solo punto de contexto.** Los datos de la empresa (cifras, casos, servicios, sedes, URLs,
  herramientas, medición) salen SOLO de `references/contexto-atbim.md` o de la web en vivo. No
  los copies a otros archivos ni los des por sabidos.
- **Nunca inventes datos.** Lo que no esté en el contexto, en la web o en lo que diga el usuario
  va como `[PENDIENTE VALIDAR: qué falta — a quién preguntarlo]`. Los pendientes bloquean la
  publicación.
- **Sin estado.** No hay backlog, lista de posts planificados ni historial. Cada ejecución lee el
  contexto y consulta el inventario en vivo. **La skill nunca modifica sus propios archivos**,
  tampoco `contexto-atbim.md`.
- **Si la web contradice el contexto, manda la web.** Avisa de la discrepancia, usa el dato de la
  web y sugiere al usuario el cambio en `contexto-atbim.md`. No lo edites tú.
- **Checkpoints obligatorios.** No pases del CHECKPOINT 1 ni del 2 sin un OK explícito. Si el
  usuario corrige algo, vuelve a presentar el checkpoint.
- **Explica el porqué** de cada decisión SEO y, si sale de un framework, cita la fuente.

## Archivos de referencia

| Archivo | Qué contiene | Cuándo leerlo |
|---|---|---|
| `references/contexto-atbim.md` | Todos los datos de la empresa, con su fecha y sus fuentes | Fase 1, siempre |
| `references/plantilla-post.md` | Cómo es un post en atbim-web: campos, Markdown, CTA, hreflang y formato del borrador | Fase 1, siempre |
| `references/frameworks.md` | See-Think-Do, BOFU, ICE/RICE y sus fuentes | Fase 2 (ideas) y fase 3 |
| `references/reglas-contenido.md` | Quality gate, pendientes, CTA, canibalización, idiomas y tono | Fases 3 a 6 |
| `references/seo-on-page.md` | Title, meta, encabezados, enlaces, FAQ, LLM, imágenes y medición | Fases 4 a 6 |
| `references/checklist-final.md` | Puntos de control y formato del informe | Fase 6 |
| `references/reglas-git.md` | Ramas y commits | Fase 7 |

---

## Fase 1. Cargar contexto

1. **Lee** `contexto-atbim.md` y `plantilla-post.md`. Anota la fecha de "Verificado el".
2. **Consulta el inventario en vivo** (URLs en `contexto-atbim.md` §1) con WebFetch, o con
   `curl` si tienes terminal. Usa el JSON de la API cuando puedas: da slugs y metas literales.
   - Posts publicados en `es`, `en` y `br`: slug, título y meta description.
   - Proyectos publicados: slug y título.
   - La página de servicio afectada, si ya se sabe cuál es (si no, en la fase 3): title, H1 y FAQ.
3. **Mira los borradores.** Si tienes acceso al repo local de la web (ruta en
   `contexto-atbim.md` §1), lee las carpetas de borradores que indica `plantilla-post.md` §1.
   Recuerda que la API no enseña los borradores del CMS: pregunta si hay alguno sobre el tema.
4. **Busca discrepancias** entre el contexto y lo que ves en vivo. Enséñalas en una tabla
   (Dato · Contexto · Web · Qué se usa) sin editar ningún archivo.
5. **Si no hay red**, dilo. Trabaja solo con el contexto y marca como `[PENDIENTE VALIDAR]` todo
   lo que dependa del inventario: canibalización, enlaces y dependencias.

## Fase 2. Brief

Necesitas:

- **Modo:** post nuevo, reescritura de un post existente o búsqueda de ideas.
- **Línea de servicio** (`contexto-atbim.md` §5).
- **Idioma o idiomas.** Por defecto, solo `es`.
- **Keyword candidata o tema.**
- **Datos propios disponibles:** caso, cifra, imágenes y quién los valida.

Pregunta lo que falte. Usa el selector de opciones cuando haya alternativas claras y texto
libre cuando no. Agrupa las preguntas: no hagas un interrogatorio.

- **"Idea de post" o "ideas para el blog":**
  1. Propón 3-5 ideas con su etapa See/Think/Do, su keyword y su puntuación ICE en tabla
     (`frameworks.md` §3).
  2. Prioriza la línea de servicio 1 y las ideas Think/BOFU.
  3. El usuario elige una y sigues con la fase 3.
- **"Reescribe este post":**
  1. Lee el post en vivo (API, por slug).
  2. Mantén el slug.
  3. Lista lo que choca con `reglas-contenido.md` y `seo-on-page.md` antes de proponer nada
     (`reglas-contenido.md` §10).

## Fase 3. Investigación → CHECKPOINT 1

1. **Etapa.** Clasifica la keyword en See/Think/Do con los criterios de `frameworks.md` §1. Si
   es Do, avisa de que suele funcionar mejor como caso de estudio o como página de servicio, y
   propón ese formato.
2. **Intención BOFU.** ¿Tiene modificadores de contratación o de decisión? Busca variantes con
   la fórmula de `frameworks.md` §2 y el vocabulario de `contexto-atbim.md` §9.
3. **Canibalización** (`reglas-contenido.md` §5). Busca la keyword y sus variantes en los posts
   de los tres idiomas, en los borradores y en la página de servicio. Revisa los temas
   conflictivos conocidos de `contexto-atbim.md` §8. Si algo ya lo cubre, propón actualizarlo o
   cambiar de ángulo.
4. **Dependencias** (`reglas-contenido.md` §6). Comprueba en vivo que la página de servicio está
   publicada y cubre el tema.
5. **Demanda.**
   - Usa los datos de Search Console si el usuario los pasa o si hay exportaciones en el repo web
     (`docs/seo/`); di de qué fecha son.
   - Si no hay, pídelos.
   - Si el usuario no los tiene, sigue sin cifras de volumen y dilo. Nunca inventes volúmenes ni
     posiciones.
6. **Quality gate previo.** ¿Qué elemento propio de atBIM tendrá el post (`reglas-contenido.md`
   §1)? Si no hay ninguno, avisa aquí.
7. **Fuentes.** Si propones una táctica que no está en `frameworks.md`, consulta y cita antes
   su fuente primaria.

**Entrega del CHECKPOINT 1:** una tabla simple con tres columnas, Campo · Propuesta · Por qué.
Filas:

- keyword principal;
- keywords secundarias (2-4);
- etapa See/Think/Do;
- intención BOFU;
- página de servicio que apoya;
- canibalización (con las URLs revisadas);
- dependencias;
- elemento propio de atBIM;
- datos de demanda (fuente y fecha, o "sin datos");
- riesgos y pendientes.

Termina con **«CHECKPOINT 1: ¿apruebas la keyword y el enfoque?»** y PARA. No escribas la
estructura hasta tener el OK.

## Fase 4. Estructura → CHECKPOINT 2

Con `seo-on-page.md` y `plantilla-post.md` delante, propón:

1. **Título / H1:** 2-3 variantes. De cada una: caracteres, caracteres del `<title>`, slug que
   generará la API y ángulo. Recomienda una.
2. **Meta description:** 2-3 variantes, con caracteres.
3. **Esqueleto:** H2 y H3. Por cada sección, una línea con la pregunta que responde y el dato
   propio que entra, con su fuente o con `[PENDIENTE VALIDAR]`.
4. **Enlaces internos:** la página de servicio y 1-2 casos, y opcionalmente posts. Para cada uno:
   ancla, destino y motivo.
5. **CTA:** en Think, dos niveles. De cada uno: texto, destino, medición (evento, `content_id`,
   placement) y si hace falta un valor nuevo de GA4. Valora el CTA "Pregunta a tu IA"
   (`plantilla-post.md` §6).
6. **FAQ:** 3-5 preguntas y si llevan schema (`seo-on-page.md` §5).
7. **Imágenes:** qué mostrar, de dónde sale, alt propuesto y si hay permiso.
8. **Idiomas:** qué versiones se escriben y la decisión de slug y hreflang, con su coste
   (`plantilla-post.md` §7).

Termina con **«CHECKPOINT 2: ¿apruebas la estructura?»** y PARA.

## Fase 5. Redacción

- **Formato:** exactamente el de `plantilla-post.md` §4.
  - Sin H1 en el cuerpo.
  - Sin el pie con el email ni el bloque "Más posts que podrían interesarte" (los pinta la web).
  - CTA medidos como HTML en línea.
- **Contenido:** sigue `reglas-contenido.md`.
  - El primer párrafo responde.
  - Hiperespecificidad y porqué técnico.
  - Casos contados como lección.
  - Tono sin sobreventa.
- **Datos que faltan:** `[PENDIENTE VALIDAR: …]` en el sitio exacto donde iría el dato. Nunca un
  dato aproximado.
- **Idiomas:** `en` y `br` solo si los ha pedido el usuario, y escritos como nativos
  (`reglas-contenido.md` §7).
- **Borrador completo:** se monta con la estructura de `plantilla-post.md` §9 (apartados A-G).

## Fase 6. Quality gate y checklist final

1. **Quality gate,** sección por sección: ¿lo podría escribir ChatGPT sin conocer atBIM? Si una
   sección no tiene nada propio, reescríbela o propón quitarla.
2. **Checklist:** pasa `checklist-final.md` entera.
3. **Informe:** entrégalo en la tabla de ese archivo, con la línea **Publicable: sí / no.**
4. **Preguntas abiertas:** debajo, agrupadas por categoría. Son lo único que bloquea la publicación.

## Fase 7. Dejar el borrador en atbim-web

- **Con acceso al repo local de la web** (Claude Code):
  1. Aplica `reglas-git.md`: rama propia desde `main` y solo tus archivos.
  2. Escribe el borrador en la ruta de `plantilla-post.md` §9.
  3. Propón el commit y espera el OK.
- **Sin acceso** (por ejemplo, en claude.ai): entrega el borrador como archivo `.md` o en la
  conversación y explica cómo publicarlo.
- **Publicar lo hace una persona:**
  1. Pega el apartado B en el editor de la web, en modo Split si hay HTML en línea.
  2. Rellena los campos del apartado A.
  3. Guarda como borrador.
  4. Publica cuando no quede ningún pendiente.

  La skill nunca llama a la API de escritura.
- **Otros idiomas:** solo si el usuario los pide, cada uno en su archivo.

## Qué no hace esta skill

- No guarda historial, backlog ni planificación de posts.
- No edita sus propios archivos, tampoco `contexto-atbim.md`.
- No publica posts ni cambia páginas de servicio, plantillas o código de la web. Si hace falta,
  lo propone como tarea de desarrollo.
- No hace commits, push ni merge sin confirmación explícita.
