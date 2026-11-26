# Visit Punta — Claude Guidelines

## Styling
- Never use inline styles. Always create a separate CSS file for each component (e.g., `Header.module.css`) and import it.

## Instagram
- For anything for @visitpunta (posts, carousels, highlights), use the `visitpunta-instagram` skill. Images render with `node scripts/instagram/render.mjs content/instagram/<post>.json`.

## Design
- Before changing or creating any page of the site, read `docs/DESIGN.md`: the style, the shared section components, what the author rejected, and how featured content is chosen (Ubicaciones).
