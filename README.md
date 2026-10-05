# yocorroporcaro

Página oficial de Yo Corro por Caro. Sitio estático en HTML, CSS y JavaScript, con todos sus recursos incluidos.

## Publicar en Vercel

1. En Vercel selecciona **Add New → Project**.
2. Importa el repositorio **Yairpabon/yocorroporcaro**.
3. Conserva **Root Directory** en la raíz del repositorio y **Framework Preset** en **Other**.
4. No necesita instalación ni comando de compilación. `vercel.json` define `dist` como carpeta de publicación.
5. Pulsa **Deploy**. Cada actualización de `main` se publicará automáticamente.

## Editar

- `dist/index.html`: contenido.
- `dist/styles.css`: apariencia y versión móvil.
- `dist/app.js`: menú, galería y modales.
- `dist/assets/`: imágenes y logos.

La imagen de bienvenida es `dist/assets/imagen-modal.jpg` y aparece en cada entrada a la página.

## Vista local

Sirve la carpeta `dist` con cualquier servidor HTTP estático, por ejemplo `python -m http.server 4173 --directory dist`.

## Evento

24 de octubre de 2026 en Santa Marta, Magdalena. Inscripciones y ruta pendientes de confirmación.
