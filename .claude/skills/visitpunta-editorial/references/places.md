# Lugares (`places`)

Tipos: `comer`, `dormir`, `spots`. URL: `/{slug}`.

Campos:
- `name`, `slug`, `type`, `destination` (uno), `tags`
- `heroImage`, `cardImage` (opcional), `gallery`
- `summary`: frase para cards, ≤ 90 caracteres, con voz. Ej: "El restaurante de playa más conocido de José Ignacio. Y probablemente del Este."
- `location`: dónde está, en una línea o dos. Ej: "Los Cisnes y Las Calandrias, Playa Brava".
- `description`: **texto plano** (textarea, sin bloques ni subtítulos), 120–250 palabras, 4–6 párrafos cortos.
- `highlights`: 3–4 ítems cortos. Para `comer` funciona como "Tené en cuenta" y para `dormir`, como "Por qué alojarse aquí". Concretos y prácticos: "Se pide y paga en caja antes de sentarse", "Fila en temporada alta".
- `cta.url` (reserva) y `cta.mapsUrl`: solo si vienen en el material. Si no, `[VERIFICAR]`.
- `relatedPlaces`: grupos con título editorial ("Para quedarse cerca", "Para comer después") → lugares/experiencias del inventario.
- `relatedArticles`, `seoTitle`, `seoDescription`.

Estructura de `description` (ver `examples/la-huella.md`):
1. Qué es y dónde, con una frase de posición ("uno de esos lugares que ya no necesita presentación").
2. La propuesta: qué se come o cómo es el lugar, con 2–4 cosas concretas (platos, materiales, vista).
3. El momento en que mejor funciona (almuerzo, invierno, atardecer…).
4. Lo honesto: qué puede no estar tan bien.
5. Una línea práctica final (reservar, llegar temprano, ir sin auto…).

`comer`: platos concretos, el momento del día, cómo se reserva o si hay fila.
`dormir`: para quién es, qué se ve desde la habitación, a qué distancia queda todo, el clima del lugar. Sin listar amenities de folleto.
`spots`: qué se hace ahí y cuándo conviene ir.

seoTitle típico: "{Nombre} {Zona}: {2–3 cosas que la gente busca}". Ej: "La Huella José Ignacio: qué comer, cómo reservar y qué esperar".
