# Bloques de Payload

**Las fotos las elige y sube el autor.** En cada bloque con imágenes (mediaBlock, socialCarousel, socialGallery, heroImage, gallery) indicar solo: cuántas fotos, qué tiene que mostrar cada una (encuadre, momento del día, estación) y la orientación. Escribir los textos que acompañan: `caption` cuando sume y `text` de cada slide. Nunca nombrar archivos ni links de fotos, ni elegir imágenes de bancos.

Regla general: **cada bloque se gana su lugar**. No usar un bloque porque está disponible. Una pieza típica usa 3 o 4 tipos de bloque, no todos.

| Bloque (`blockType`) | Campos | Cuándo usarlo | Cuándo no |
|---|---|---|---|
| `textBlock` | `content` (rich text: párrafos, `##`, links, listas) | Siempre. Una sección = un textBlock. | No meter dos `##` en el mismo bloque. Evitar listas con viñetas salvo datos prácticos. |
| `mediaBlock` | `images` (1–3, cada una con `caption` opcional), `variant`: `inline` · `breakout` · `bleed` | Para cortar el texto y mostrar el lugar. `bleed` una sola vez, temprano (después de la apertura). `breakout` entre secciones. `inline` para detalles. | Sin foto real disponible: indicar qué foto haría falta en "Pendientes". |
| `quoteBlock` | `text` (puede tener salto de línea), `attribution` (opcional) | Una frase que condensa la idea de la pieza, máximo una por pieza. Puede ser del autor (sin attribution) o una cita real de una persona (con attribution). | Si la frase repite algo que ya está en el texto. Nunca inventar citas de terceros. |
| `placeBlock` | `place` → places o experiences (del inventario), `context` (opcional, una línea) | **Excepcional:** una sola recomendación fuerte en una pieza que no es de lugares (ej: un hotel en la nota de ballenas). Máximo uno por pieza. `context` ejemplos: "Probablemente el ritual más conocido del Este.", "Para quedarse cerca". | **Nunca en serie** (varias tarjetas seguidas se leen como avisos, pieza "publicitada"). En Selecciones y Guías con varios lugares, ver "Varios lugares en una nota" abajo. Si el lugar no existe en el inventario: marcar `[CREAR]`. |
| `socialCarousel` | `title` (opcional), `slides` (2–6: `image` + `text` ≤ 80 caracteres) | Datos prácticos, rápidos, en formato redes: "5 cosas que saber antes de ir". Uno por pieza como máximo. | Si los datos ya están en el texto. |
| `socialVideo` | `source`: `embed` (`embedUrl` TikTok/Reel/Shorts) o `upload`, `caption` | Cuando el material incluye un video real y relevante (ej: avistamiento, el momento del atardecer). | Si no hay URL concreta. No sugerir videos genéricos. |
| `socialGallery` | `images` (2–10, con `caption`) | Muchas fotos de un mismo lugar o momento (ej: varias playas, un evento). | Si con un mediaBlock alcanza. |

Experiencias (`experiences.content`) solo admiten textBlock, mediaBlock, quoteBlock y placeBlock.
Lugares y destinos no tienen bloques: `description` es texto plano.

## Varios lugares en una nota (decisión del autor, 11/11/2026)
Cuando una nota recomienda varios lugares (Selección, Guía de un día, etc.), que se lea como revista y no como directorio:
- **En el cuerpo:** el nombre del lugar con link interno en el texto, la primera vez que aparece.
- **Fotos:** cada tanto un `mediaBlock` con 1–2 fotos de la galería de la ficha del lugar (de a pares, `breakout`). El crédito va en el `caption` ("Foto: Posto 5"), porque el crédito del media no se muestra en artículos. Preferir fotos de galería a la portada, que ya aparece en la tarjeta del final.
- **Al final:** los lugares van en `related`. La página los muestra una sola vez como fila de tarjetas, con título automático según el tipo ("Para comer cerca", "Dónde quedarse cerca", "Para recorrer" o "Lugares de esta nota").
- Ejemplos: *Paradores de la Mansa*, *Un día en José Ignacio*.

Además, cada lugar o experiencia nombrado (con link, placeBlock o en `related`) muestra solo la nota en su "Para seguir explorando": no hace falta cargar `relatedArticles` del lado del lugar.

## Links internos dentro de textBlock
Formato `[texto natural](/slug)`, con el slug tomado del inventario. Entre 2 y 4 por artículo (más los nombres de los lugares recomendados, en notas con varios lugares), en frases naturales ("los [miradores de Punta Ballena](/mirador-punta-ballena)"). Nunca "hacé clic acá".
