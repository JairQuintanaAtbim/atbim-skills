# Reglas de contenido

## 1. Quality gate: "¿Podría ChatGPT escribir esto sin conocer atBIM?"

Si la respuesta es sí, el post no vale. Para pasarlo, el post necesita material que solo tiene
atBIM:

- un caso real (`contexto-atbim.md` §7), contado como lección: qué pasó, qué se decidió y qué
  le sirve al lector, no "hicimos el proyecto X";
- una cifra verificada (`contexto-atbim.md` §4) que pruebe lo que se dice;
- un método o un criterio propio validado por el equipo (cómo se fija el alcance, qué se acuerda
  antes de escanear…);
- imágenes propias: capturas de modelos, nubes de puntos, cuadros de mando.

El filtro se pasa dos veces:
- en el **CHECKPOINT 1**: si no hay ningún dato propio disponible, avisa antes de seguir;
- en la **fase 6**, sección por sección: indica qué elemento propio lleva cada una.

## 2. Nunca inventar datos

Fuentes válidas, y ninguna más:

1. `contexto-atbim.md`;
2. la web en vivo (inventario de la fase 1);
3. lo que el usuario aporta en la conversación (anota quién lo valida);
4. fuentes externas públicas citadas con URL (normativa, fabricantes, organismos).

Todo lo demás se escribe como `[PENDIENTE VALIDAR: qué dato falta — a quién preguntarlo]`.
Nunca se inventan cifras, plazos, porcentajes de ahorro, precios, nombres de clientes, cargos,
citas ni resultados. Tampoco se atribuye a un proyecto lo que no dice su ficha ni se generaliza
("en todos nuestros proyectos…").

- Al final del borrador, las **preguntas abiertas** se agrupan por categoría: Datos ·
  Imágenes · Validaciones de negocio · Desarrollo y analítica.
- **Los pendientes bloquean la publicación.** La web refuerza esta regla: su despliegue a
  producción falla si el HTML contiene `[PENDIENTE VALIDAR` (`scripts/checkPendingMarkers.mjs`
  del repo web).

## 3. JSON-LD

Solo con hechos verificados. Si un dato no está confirmado, se omite: no se marca como
pendiente dentro del schema. Lo que ya genera la plantilla está en `plantilla-post.md` §8.

## 4. CTA

- **Think, dos niveles:**
  - *Principal*, suave, de "siguiente paso": ver la página de servicio o un caso relacionado.
  - *Secundario*, de contacto, al final.
- **Do:** el CTA de contacto puede ser el principal.
- **See:** sin CTA comercial; enlaza a contenido relacionado.
- Sin sobreventa: nada de "líderes", "los mejores", "solución definitiva" ni urgencia falsa.
- Cada CTA se mapea a su medición (`plantilla-post.md` §5 y `contexto-atbim.md` §10).

## 5. Canibalización

- **Se comprueba siempre en vivo:** posts de los tres idiomas, borradores del repo web, páginas
  de servicio y fichas de proyecto. Los temas con canibalización conocida están en
  `contexto-atbim.md` §8.
- **El post apoya a la página de servicio:** la enlaza y no compite por su keyword principal
  (la de su title y su H1, comprobada en vivo). El post va a por una variante Think o de cola larga.
- **Si un post o un borrador ya cubre la keyword**, propón una de dos opciones: actualizar ese
  post (conserva el slug) o cambiar de ángulo. Nunca dos posts para la misma keyword.

## 6. Dependencias

Un post Think espera a que su página de servicio esté publicada y cubra el tema. Si no lo
está, el post queda bloqueado y se dice en el CHECKPOINT 1.

## 7. Idiomas

- Se escriben solo los idiomas que pida el usuario.
- **Registro:**
  - `es`: español peninsular, de "tú" al lector;
  - `en`: inglés británico, como los posts actuales ("organisation");
  - `br`: portugués de Brasil, de "você".
- **Cada versión es nativa, no una traducción literal:**
  - keyword investigada en ese idioma;
  - ejemplos y referencias normativas de ese mercado, solo si son verificables;
  - formato de números del idioma.
- Los casos y las cifras son los mismos: no se añaden afirmaciones locales ("en Brasil hemos…")
  que no estén en el contexto o en la web.
- Si se enlaza una página que no existe en el idioma del post, se avisa al lector, como hacen
  los posts actuales ("disponible en español").

## 8. Tono y estilo

- Escribimos para quien contrata (`contexto-atbim.md` §11). Hablamos de decisiones, riesgo,
  coste, plazo y calidad de la información, no de clics en el software.
- Profesional, directo y técnico. "Nosotros" para la empresa y "tú" para el lector.
- **Hiperespecificidad:** cada afirmación lleva un dato, un criterio o el porqué técnico detrás.
  "Acordamos LOD y tolerancia por disciplina antes de escanear porque…", no "trabajamos con
  calidad".
- **Prohibido:** "revolucionario", "líder", "sinergia", "soluciones integrales", "de vanguardia",
  "innovador" y cualquier adjetivo sin dato detrás.
- La empresa aparece donde aporta una prueba, no en cada párrafo.
- El primer párrafo responde por sí solo a la pregunta del post.

## 9. Explicar siempre el porqué

Cada decisión SEO (keyword, title, estructura, enlaces, CTA, FAQ, schema, idioma) lleva su
motivo y, si sale de un framework, su fuente (`frameworks.md`). En el borrador van en la tabla
del apartado D.

## 10. Reescrituras

- El slug se conserva (la API no lo cambia al actualizar).
- Lista qué cambia y por qué, y conserva lo que funciona: mira Search Console si hay datos.
- Corrige los patrones heredados: secciones solo en H3, ningún enlace a la página de servicio,
  enlaces a `-copy`, meta description vacía.
