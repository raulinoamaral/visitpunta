# Fotos para Instagram

## De dónde salen
`fotos/` (carpetas por tema: atardecer, cafe, casapueblo, centro-punta, isla-gorriti, noche, playa, puerto, punta-ballena). Son del usuario y se pueden usar en Instagram.
- `cafe/` son del usuario. Por GPS: FAEF9096, FullSizeRender_VSCO e IMG_9810 son de Mostrador Santa Teresita; IMG_1687 e IMG_2658, de Rizoma; IMG_3601, de la península (ningún café de la web); 4E7E5F18 y D8057CCF, de Barcelona (nunca como Punta). Las `PHOTO-…` (WhatsApp) son del usuario pero sin GPS: rizoma.jpg y las de la estufa a leña son de Rizoma; manon*.jpg y las de pérgola blanca, de Manon; las del cartel verde, de La Proveeduría (no está en la web); "PHOTO-2026-05-02-21-29-59 2", de La Bici. Las demás, preguntar antes de nombrar el lugar.
- Para saber dónde se sacó una foto: `mdls -name kMDItemLatitude -name kMDItemLongitude <foto>` y compararlo con el link de Google Maps de la ficha en la web.
- Si una foto parece de un lugar (interior de un restaurante u hotel, un plato con su vajilla, su cartel), preguntar antes si es del usuario o del lugar. Las que cedieron los lugares para la web **no** van en Instagram.
- Las fotos que se cargaron en la web con crédito de otra persona tampoco.
- Los `.HEIC` tienen su `.jpeg` al lado casi siempre; usar el jpeg. Si no hay, convertirlo antes con `sips -s format jpeg X.HEIC --out X.jpeg` (el script no lee HEIC).

## Repetir
- **La foto de portada de un post nunca se repite.** Revisar `content/instagram/registro.md` antes de elegir.
- Las demás conviene no repetirlas; si hace falta, avisar.
- Que una foto esté en la web no impide usarla en Instagram.

## Elegir
- Hoja de contactos de las carpetas candidatas antes de decidir.
- Para la grilla: alternar cielo/agua con ciudad/arena, día con atardecer y noche, cerca con lejos.
- Personas: preferir de espaldas o lejos; si se reconocen caras, preguntar.
- Marcas visibles (carteles, logos): evitarlas en portadas.
- Nada de fotos con el logo viejo ni marcas de agua.
- Las verticales son ideales para 4:5; las horizontales se recortan con `position` cuidando el sujeto.
