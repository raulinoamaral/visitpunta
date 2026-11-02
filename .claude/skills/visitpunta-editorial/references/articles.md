# Artículos (`articles`)

Campos: `title`, `slug`, `type`, `destinations` (varios), `heroImage`, `tagline`, `layout` (bloques), `related` (places/experiences), `relatedArticles`, `seoTitle`, `seoDescription`.
Bloques disponibles en `layout`: textBlock, mediaBlock, quoteBlock, placeBlock, socialCarousel, socialVideo, socialGallery (ver `blocks.md`).

Estructura que se repite en todos los tipos:
1. **Apertura** (textBlock sin subtítulo): escena + qué resuelve la nota, 3–6 líneas.
2. **Imagen fuerte** temprano (mediaBlock `bleed` o `breakout`) cuando hay material.
3. **Secciones con `##`**: cada una un lugar, un momento o una decisión.
4. **Una cita** (quoteBlock) en algún punto medio, solo si hay una frase que la merezca.
5. **Cierre** (textBlock sin subtítulo): 2–4 líneas.

Cada textBlock es una unidad: un subtítulo y su texto. No meter dos `##` en el mismo bloque.

---

## Guía (`guide`)
Responde una pregunta concreta: dónde, cuándo, cómo. Ej: *Dónde ver ballenas en Punta del Este*, *Dónde ver el atardecer en Punta del Este*.

- La respuesta corta aparece en la apertura.
- Secciones por lugar o por opción, cada una con su "cuándo funciona mejor".
- Una sección práctica cerca del final ("Cuándo ir", "A tener en cuenta") con datos concretos.
- Si compara opciones (ej: Punta del Este o Rocha), cerrar con "¿Cuál elegir?" en formato "si buscás X… si querés Y…".
- placeBlock después de cada sección cuando el lugar existe en el inventario.

Ejemplo de referencia: `examples/donde-ver-el-atardecer-en-punta-del-este.md`.

## Selección (`selection`)
Un conjunto curado de lugares con un criterio. Ej: *Cafés de especialidad en Punta del Este*, *Qué playa elegir*.

- La apertura explica el criterio (por qué estos y no otros), sin decir "seleccionamos".
- Sin números en el título ni en los subtítulos.
- Cada lugar: `## Nombre (zona)` + 2–4 líneas (qué es, cuándo funciona, un dato concreto) + placeBlock.
- Entre 4 y 7 lugares. Más que eso deja de ser curado.
- Orden pensado: por momento del día, por zona o por estación, no por "ranking".
- Una cita que resuma el espíritu, antes del cierre.

## Experiencia (`experience`)
Narra algo para hacer o vivir, en primera escena: una salida, un recorrido, un ritual. Todavía no hay ejemplos publicados de este tipo: tomar como referencia el tono de `examples/casapueblo.md`, que es la pieza más narrativa.

- Contada como secuencia: llegar, lo que pasa, el momento clave, el después.
- Más narrativa, menos subtítulos (2–3 como máximo).
- Una sección práctica breve al final.
- Más imágenes (mediaBlock breakout entre momentos) si hay material.

## Temporada (`season`)
Cómo cambia el Este en una época o con un fenómeno estacional. Ej: *Punta del Este en invierno*, *Ballenas en Punta del Este*.

- La apertura dice qué cambia.
- Secciones: el ritmo, los planes, lo que solo pasa en esa época, alrededores, "A tener en cuenta".
- Honestidad sobre lo que está cerrado o no funciona en esa época.
- socialCarousel práctico ("5 cosas a saber en invierno") si hay material visual.
- relatedArticles hacia las guías de la misma temporada.

Ejemplo de referencia: `examples/ballenas-en-punta-del-este.md`.
