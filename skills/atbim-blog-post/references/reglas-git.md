# Reglas de git

Valen para el repo de la web (cuando la skill deja un borrador) y para el repo de skills
(cuando se cambia esta skill).

## Ramas

- **Rama propia desde la rama principal.** En `atbim-web` la principal es `main`; en
  `atbim-skills`, `master`. Nunca hagas merge ni push directo a la rama principal.
- **Nombre de la rama:** `tipo/descripcion-en-kebab`, como el resto del repo:
  - `atbim-web`: `docs/blog-{slug-corto}`;
  - `atbim-skills`: `feat/skill-{nombre}`.
- **Push y pull request**, solo si el usuario lo pide.

## Antes de cada commit

1. Enseña el `git status` y la lista de archivos que van a entrar.
2. **Excluye los archivos de otras reescrituras en curso.** Añade solo tus archivos, por ruta;
   nunca `git add -A` ni `git add .`. Si hay cambios ajenos ya en el índice, usa
   `git commit -- <rutas>` para no arrastrarlos.
3. Propón el mensaje y **espera confirmación explícita.** Una confirmación vale para un commit,
   no para los siguientes.

## Commits

- **Un commit por bloque lógico**, con mensaje descriptivo. Estilo de los dos repos:
  Conventional Commits.
  - `atbim-web`: `docs(blog): draft post on {tema}`
  - `atbim-skills`: `feat(atbim-blog-post): {qué}`
- **El borrado o renombrado de una skill o de un archivo sustituido** va en un commit aparte.
- **Sin atribución:** nada de `Co-Authored-By` a Claude o a Anthropic, ni líneas de "Generated with".
- **Nada de** `--no-verify`, `--amend` sobre commits ajenos, push forzado ni reescritura del
  historial.
