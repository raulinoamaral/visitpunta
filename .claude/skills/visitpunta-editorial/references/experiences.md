# Experiencias (`experiences`)

Lugares para vivir más que para consumir: playas, faros, miradores, islas, el puerto, la rambla, Casapueblo. URL: `/{slug}`.

Campos:
- `title`, `slug`, `destination` (uno), `order`, `featured` (sección "Para empezar")
- `heroImage`, `gallery`
- `summary`: ≤ 90 caracteres, para cards.
- `tagline`: subtítulo con voz, ≤ 110 caracteres. Ej: "La obra más icónica de Punta Ballena, donde el atardecer se vuelve parte del lugar."
- `content`: bloques (**solo** textBlock, mediaBlock, quoteBlock, placeBlock).
- `highlights`: 3 ítems, lo que define el lugar. Ej: "La Ceremonia al Sol con la voz de Páez Vilaró".
- `timingTitle` ("Cuándo ir", "Mejor momento") + `timing`: 2–4 ítems `moment` / `description`. moment: "Mañana", "Atardecer", "Invierno" (sin dos puntos). description: corta, en minúscula. Ej: "menos gente y una experiencia más tranquila".
- `related` (places/experiences), `seoTitle`, `seoDescription`.

Estructura de `content` (ver `examples/casapueblo.md`), 250–450 palabras:
1. textBlock: cómo aparece o cómo se llega. Escena.
2. mediaBlock breakout.
3. textBlock: qué es, un poco de historia solo si suma, cómo se recorre.
4. quoteBlock (opcional).
5. textBlock: el momento que define la experiencia.
6. mediaBlock breakout.
7. textBlock: lo práctico y honesto (llenos en verano, viento, cómo llegar) + otra forma de vivirlo + cómo cambia en invierno.
8. placeBlock opcional hacia un lugar cercano para comer o dormir.

Las experiencias casi no usan `##`: el texto fluye entre imágenes.
