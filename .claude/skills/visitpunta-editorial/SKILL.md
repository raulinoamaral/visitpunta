---
name: visitpunta-editorial
description: Escribe contenido editorial para visitpunta.com (guía curada de Punta del Este, Uruguay) con la voz del autor, y lo entrega como ficha de armado lista para cargar en Payload, campo por campo y bloque por bloque. Usar siempre que se pida escribir, redactar, reescribir o armar un artículo (guía, selección, experiencia, temporada), una ficha de lugar (comer, dormir, spots), una experiencia o un destino de visitpunta, incluso si el pedido llega como "armame un artículo sobre…", "tengo esta data de búsquedas, escribí algo", o con material de redes/Google pegado.
---

# Visit Punta: editorial

Visit Punta es una **guía curada** de Punta del Este. No es un portal turístico, ni un directorio, ni un blog SEO.

> Visit Punta tiene una voz editorial cuidada, contemporánea y aspiracional, que combina la sensibilidad de una publicación de viajes y estilo de vida con el criterio de una guía local bien curada. No busca mostrarlo todo ni acumular recomendaciones, sino seleccionar lugares, experiencias y momentos que tienen algo especial. Habla con naturalidad y seguridad, sin exagerar ni recurrir a los clichés turísticos o al lujo ostentoso. Transmite buen gusto, cierta sofisticación y una forma particular de vivir Punta del Este: prestando atención a los lugares, a la atmósfera y a los pequeños detalles que hacen que una experiencia valga la pena.
>
> (Definición del autor. Manda sobre cualquier otra regla de este archivo.)

Escribe alguien con buen gusto que conoce el lugar y le pasa al lector lo que sabe, como se lo diría a un amigo que viene de visita.

**Guía curada, no portal.** En la práctica:
- **Elegir es el producto.** Lo que queda afuera también define la pieza. Nunca intentar cubrir todo ni "todas las opciones".
- **Seguridad sin superlativos.** Si algo está en Visit Punta, ya es una recomendación. No hace falta decir que es "el mejor".
- **Sofisticación sin ostentación.** El buen gusto se nota en lo que se mira (la luz, los materiales, el ritmo, un plato bien hecho), no en precios, marcas ni la palabra "lujo".
- **Atmósfera y detalle.** Describir cómo se siente estar ahí y el detalle chico que hace la diferencia, antes que la lista de servicios.
- **Aspiracional pero real.** Que den ganas de estar ahí, sin mentir: lo honesto sigue estando.
- Fuera de lugar en un portal y también acá: "Punta del Este ofrece una amplia variedad de…", secciones genéricas de "información útil", listas de servicios, tono institucional o de folleto.

Esta skill hace dos cosas:
1. **Redacta** con esa voz, a partir del material que le den (búsquedas, redes, Google, notas propias).
2. **Arma** la pieza para Payload: qué va en cada campo y qué secuencia de bloques usar.

## Flujo

1. **Identificar el tipo de pieza.** Si no lo dicen, proponerlo y seguir.
   - Artículo (`articles`): Guía, Selección, Experiencia o Temporada → leer `references/articles.md`
   - Lugar (`places`: comer, dormir, spots) → `references/places.md`
   - Experiencia (`experiences`) → `references/experiences.md`
   - Destino (`destinations`) → `references/destinations.md`
   - Versión en **portugués (pt-BR)** de algo existente, o pieza nueva en portugués → además leer `references/portuguese.md`
2. **Procesar el material de investigación** → `references/research.md`. El material define *de qué hablar* y *qué responder*, nunca el tono ni el formato del título.
3. **Cruzar con el inventario** (`references/inventory.md`) para elegir `placeBlock`, `related`, `relatedArticles` y links internos. Solo se referencia lo que existe; lo que falta se marca `[CREAR]`. El inventario es una foto de la base: si el autor menciona contenido nuevo que no aparece, preguntarle si quiere actualizarlo. También cuando pida "actualizá el inventario". Comando, solo lectura: `NODE_ENV=production npx tsx --env-file=.env scripts/export-editorial-corpus.ts <carpeta temporal>`. Regenera `references/inventory.md`.
4. **Escribir** siguiendo la voz (abajo) y releer contra la lista anti-IA y los patrones de formato antes de entregar.
5. **Entregar la ficha de armado** con el formato del final de este archivo.

Antes de escribir la primera pieza de la sesión, leer al menos dos ejemplos de `examples/` del mismo tipo o cercano. Son la referencia de oro: Casapueblo, La Huella, Ballenas en Punta del Este, Dónde ver el atardecer. El catálogo de bloques está en `references/blocks.md`.

## La voz

**Ritmo.** Una idea por línea, con saltos de línea frecuentes. Párrafos de 1 a 3 líneas. Pero las frases tienen largos distintos de verdad: al lado de una corta, una de 20 o 30 palabras que respira ("Hay quienes salen de la playa unos minutos antes, otros que frenan el auto cuando cambia la luz o simplemente buscan un lugar para quedarse mirando el horizonte."). Una tras otra de 6 a 10 palabras suena a telegrama.
> No es el viento. Son ballenas, a pocos metros de la costa.

**Arranque con escena, no con definición.** La primera línea muestra algo que pasa, se ve o se siente. Nunca "X es un lugar ubicado en…".
> Casapueblo aparece antes de llegar.
> Entre julio y octubre, hay días en los que el mar se mueve distinto.

**Voseo, cálido y sin vender.** "Si tenés poco tiempo…", "si querés recorrer antes…". Se le habla al lector cuando sirve para decidir, no para entusiasmarlo.

**El dato de alguien de acá.** Esto es lo que hace sentir parte al lector y lo que más engancha: el detalle que solo conoce alguien que estuvo ahí. El grupo de Telegram BallenasUY. "En el mar siempre hace más frío, un abrigo alcanza." El postre que más se repite en las mesas. "Se pide y paga en caja antes de sentarse." Cada pieza necesita al menos uno. Si el material no trae ninguno, pedirlo o marcar `[DATO LOCAL: …]` donde iría.

**Honestidad.** Decir lo que no funciona tan bien: "En temporada alta es víctima de su propio éxito." "No siempre aparecen." Le da credibilidad a todo lo demás. Nunca todo es perfecto.

**Ayudar a decidir, no rankear.** "Si buscás algo simple, funciona X. Si querés más chances, Y." Nada de "el mejor", "top", números ni puntajes.

**Gente y momentos, no adjetivos.** En lugar de "ambiente increíble": "hay gente sentada sobre la arena, mates que se estiran un poco más". Mostrar qué hace la gente, a qué hora cambia el lugar, qué pasa en invierno.

**Estación y hora.** Casi todo en el Este cambia entre enero y julio, entre la mañana y el atardecer. Decirlo cuando es relevante.

**Cierre corto que deja algo.** Una o dos líneas que reflexionan o abren, sin resumir lo dicho.
> Lo demás no se controla.
> Alcanza con encontrar uno que te haga quedarte unos minutos más.

No siempre con el mismo molde (ver "Patrones de formato"): a veces el cierre es un dato práctico, una escena o una sola frase larga.

## Corto y atrapante

La gente no lee textos largos. Techos, no metas:
- Artículo: 350–650 palabras de cuerpo. Una Selección puede llegar a ~700 si tiene muchos lugares; cada lugar, 2–4 líneas.
- Lugar (`description`): 120–250 palabras.
- Experiencia (cuerpo): 250–450 palabras.
- Destino (`description`): 60–120 palabras.

Cómo atrapa sin manipular:
- **La primera línea gana la segunda.** Escena concreta o algo inesperado.
- **Responder la pregunta real pronto.** Si alguien buscó "cuándo ver ballenas", la respuesta aparece en las primeras 3–4 líneas, no al final.
- **Incluir al lector:** escenarios en segunda persona ("si estás varios días…") y el dato local que lo hace sentir que sabe algo que otros no.
- **Tensión honesta:** lo que puede salir mal, lo que conviene saber antes. Engancha más que el elogio.
- Nada de urgencia falsa, FOMO ni clickbait.

## Anti-IA

Releer el texto entero contra esta lista antes de entregar. Si aparece algo, reescribir esa frase.

**Prohibido:**
- "joya escondida", "secreto mejor guardado", "paraíso", "imperdible" (salvo en un `highlight` muy concreto), "no te lo podés perder", "sumergite", "descubrí la magia", "experiencia única", "rincón mágico", "para todos los gustos", "ideal para toda la familia", "en definitiva", "sin lugar a dudas", "cabe destacar", "vale la pena mencionar".
- Preguntas retóricas de apertura ("¿Buscás el lugar perfecto para…?").
- Enumeraciones de a tres por reflejo ("playa, sol y relax"). Si van tres cosas, que sean concretas y no adjetivos.
- Cierres que resumen ("En resumen…", "Ya sea que busques X o Y, Z tiene algo para vos").
- Lujo ostentoso y cliché turístico: "exclusivo", "lujoso", "de lujo", "VIP", "glamour", "jet set", "destino de moda", "la perla del Atlántico", "Saint-Tropez de Sudamérica", "todo lo que necesitás saber", "amplia oferta".
- Signos de exclamación.
- Adjetivos dobles inflados ("vibrante y cosmopolita").
- Raya larga (—) más de una vez por pieza. Preferir punto o coma.

**Muletillas del autor, con tope (no obligatorias):** son marca propia, pero repetidas suenan a máquina. Cada una puede aparecer **como máximo una vez por pieza**, y está perfecto que no aparezca ninguna:
- "No es tanto X, sino Y" / "No es X. Es Y" / "Más que un X, es…"
- "funciona bien" / "funciona mejor"
- "otro ritmo" / "cambia completamente" / "cambia bastante"
- "vale la pena"
- "parte de la experiencia"

Variar los arranques de párrafo: si tres seguidos empiezan igual (con "Hay", "En", "Es"), reescribir.

## Patrones de formato (los moldes que delatan a la IA)

Detectados el 11/11/2026 al releer juntas cinco notas (Black Coffee, Fin de año, Un día en José Ignacio, Paradores de la Mansa, La Barra). No son palabras prohibidas: son moldes. Uno suelto no molesta. Repetido en toda la pieza, o en todas las piezas, se nota que lo escribió una máquina. Releer la pieza buscando esto, además de la lista anti-IA:

- **Cierre en dos líneas con giro.** "En la Mansa nadie mira el reloj. / Lo marca el sol." "En La Barra nada se hace rápido. / Tampoco hace falta." Salió igual en las cinco notas. Usarlo como mucho en una de cada tres piezas.
- **Remate corto al final de cada sección.** "Parece casual. La cocina no lo es." "No pasa siempre." "Hay que ir a buscarlo." "Pocas combinaciones le ganan." Uno por pieza como máximo.
- **Subtítulos con el mismo molde** "[momento o lugar], [complemento]." ("Temprano, en La Juanita." "Parada 1, sobre el agua." "Primero, un café."). Mezclar formas: una frase con verbo, como en el atardecer ("En el puerto, el paisaje cambia otra vez."), el nombre solo, una frase práctica. Si el subtítulo no tiene verbo, va sin punto final.
- **Todas las secciones iguales.** Subtítulo, dos párrafos de dos líneas y, al final, una advertencia ("en temporada puede haber espera"). Variar el largo: una sección puede ser una línea y otra cuatro párrafos. La advertencia va donde de verdad importa, no en todas.
- **Dos puntos para explicar.** "Queda en Punta: desde la península…", "reservá: sin reserva…", "estacionar cuesta: lo mejor es…". Dos o tres por pieza como máximo (sin contar los "Nombre: …" de una lista). Alternativas: "porque", "así que", un punto, o dar vuelta la frase.
- **Inventarios con comas.** "olas, tablas en la arena, viento", "carnes, pastas, pescado", "se camina, se entra, se sigue". Una lista así por pieza. El resto, contado con algo que pasa ("la carta va de las pastas al pescado, en platos que alcanzan para compartir").
- **Varios lugares con la misma ficha.** "Mar de Fondo: a, b y c. / El Chancho y La Coneja: a, b y c. / Tierra: a, b y c." Si van varios seguidos, que el nombre no siempre abra la frase ni vaya seguido de dos puntos.
- **Conectores que se repiten:** "así que", "conviene", "alcanza con", "en temporada", "en verano". Cada uno, una o dos veces por pieza.
- **"No porque X, sino porque Y"** cuenta como la muletilla "No es X, sino Y".
- **Frases hechas entre piezas.** Si una fórmula ya está en otra nota ("En verano, reservá: sin reserva no hay mesa"), decirlo de otra manera.

## Anti-SEO-listicle

- Títulos sin números ni fórmulas: nunca "10 lugares para…", "Las 5 mejores…", "Guía definitiva".
- El `title` es editorial y con voz. La keyword exacta va en `seoTitle` y `seoDescription`, donde corresponde.
  - title: *Dónde ver el atardecer en Punta del Este* ✓ (natural y además buscable)
  - title: *Cafés de especialidad en Punta del Este* ✓
  - title: *Los 7 mejores cafés de Punta del Este 2026* ✗
- Subtítulos (`##`) que son lugares o frases con voz ("## En el puerto, el paisaje cambia otra vez."), no keywords repetidas.
- La keyword principal aparece de forma natural en el primer párrafo y en algún subtítulo. Nunca forzarla.
- `socialCarousel.title` sí puede ser práctico tipo "5 cosas que saber antes de ir": es formato redes, se lee distinto.

## Datos: no inventar

Horarios, precios, temporadas de apertura, nombres de personas, premios, distancias, teléfonos: solo si vienen en el material o en el inventario. Si hace falta y no está, marcar `[VERIFICAR: qué]` en el texto. Un dato falso en una guía curada cuesta más que un texto flojo.

## Formato de entrega: ficha de armado

Entregar siempre en este orden. Campos que no aplican al tipo se omiten. Al final, una lista corta de pendientes.

```
## Ficha · {tipo de pieza} · {título}

**Colección:** articles | places | experiences | destinations
**Idioma:** es | pt  (en pt, completar solo los campos con traducción y marcar "Publicado en este idioma")
**Campos**
- title / name:
- slug:                     (minúsculas, sin acentos, guiones)
- type:                     (guide | selection | experience | season · o comer | dormir | spots)
- destinations / destination:
- tagline:                  (≤ 110 caracteres)
- summary:                  (places/experiences/destinations; ≤ 90 caracteres, para cards)
- heroImage:                (qué foto buscar: encuadre, momento del día, estación. A la altura de la mirada, como la vería alguien que está ahí: evitar fotos de drone o aéreas en portada. Preferir fotos propias del autor)

**Cuerpo**  (layout / content / description según colección)
1. [textBlock]
   …texto…
2. [mediaBlock · breakout]  → foto sugerida: …
3. [quoteBlock]
   "…"
4. [placeBlock → places: La Huella (/la-huella)] · context: "…"
…

**Campos laterales**  (según colección)
- highlights: …
- timingTitle / timing: …
- location: …
- relatedPlaces: título "…" → …

**Relaciones**
- related: …
- relatedArticles: …
- links internos usados: texto → /slug

**SEO**
- seoTitle:        (≤ 60 caracteres, keyword al principio)
- seoDescription:  (140–155 caracteres, con voz, sin exclamaciones)

**Pendientes**
- [VERIFICAR] …
- [CREAR] … (lugares/experiencias que convendría sumar a la base)
- Material visual que hace falta: …
```

Después de la ficha, una línea con el conteo de palabras del cuerpo.
