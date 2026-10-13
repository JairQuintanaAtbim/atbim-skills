# Checklist final

Se pasa entera en la fase 6, sobre el borrador completo. El resultado se entrega como tabla
simple y se copia en el apartado G del borrador:

| # | Punto | Estado | Nota |
|---|---|---|---|
| 1 | … | ✅ / ❌ / ⚠️ | qué falla y dónde (sección o línea) |

✅ cumple · ❌ no cumple · ⚠️ depende de un `[PENDIENTE VALIDAR]`.

Debajo de la tabla, una línea: **Publicable: sí / no.** Es "no" si hay algún ❌ o queda algún
`[PENDIENTE VALIDAR]`.

## A. Veracidad

1. Cada cifra, caso, dirección, servicio o herramienta sale de `contexto-atbim.md`, de la web en
   vivo o de un dato del usuario con quien lo valida. Indica la fuente de cada uno.
2. No aparece nada de lo marcado como "no usar" o "no mencionar" en `contexto-atbim.md`.
3. Cada `[PENDIENTE VALIDAR]` está en las preguntas abiertas, agrupado por categoría.
4. El anexo de JSON-LD solo contiene hechos verificados.
5. Las discrepancias entre el contexto y la web están avisadas.

## B. Quality gate

6. Pasa la prueba de "¿lo podría escribir ChatGPT sin conocer atBIM?": indica el elemento
   propio de cada sección H2.
7. Los casos se cuentan como lección, no como catálogo.
8. El tono no tiene adjetivos vacíos ni sobreventa, y usa "nosotros" y "tú" (`reglas-contenido.md` §8).

## C. Estrategia

9. La etapa See/Think/Do está declarada y cuadra con la keyword y con los CTA.
10. No canibaliza nada. Indica qué se comprobó: posts de los tres idiomas, borradores y páginas
    de servicio.
11. La página de servicio de la que depende está publicada.

## D. SEO on-page

12. El título lleva la keyword y cumple la longitud. Indica los caracteres del título y del
    `<title>`, y el slug que generará.
13. La meta description tiene 140-155 caracteres y no está vacía.
14. El cuerpo no lleva H1, mantiene la jerarquía H2/H3 y no usa `####`.
15. El primer párrafo responde por sí solo.
16. El cuerpo enlaza la página de servicio y 1 o 2 casos. Todos los enlaces existen, ninguno es
    `-copy` y ninguno tiene barra final.
17. Las FAQ son distintas de las de la página de servicio.
18. Las imágenes tienen alt, pie y origen; si muestran un edificio de cliente, hay permiso.
19. Se ha aplicado la decisión de idioma y hreflang del CHECKPOINT 2.

## E. CTA y medición

20. En un post Think hay CTA de dos niveles y ninguno sobrevende.
21. Cada CTA tiene su medición, con valores que existen o marcados como pendientes.
22. El plan de medición está en el apartado E.

## F. Formato del CMS

23. El Markdown sigue `plantilla-post.md` §4: sin "Más posts…", sin el pie con el email y sin
    `<br />`.
24. Los campos del editor (apartado A) están completos.
25. Si hay HTML en línea, el borrador indica que se pegue y se guarde en modo Split.

## G. Git (solo si se escribe en atbim-web)

26. Rama propia, solo los archivos propios y commit con confirmación (`reglas-git.md`).
