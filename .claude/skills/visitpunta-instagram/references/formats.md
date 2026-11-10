# Formatos

Todas las imágenes se arman con `scripts/instagram/render.mjs` (Playfair Display + Inter, navy #3D4B66 y rosa #FA9683). El spec de cada pieza se guarda en `content/instagram/<NN>-<tema>.json`.

| Formato | Tamaño | `format` | Estilos de slide |
|---|---|---|---|
| Feed (foto o carrusel) | 1080 × 1350 (4:5) | `feed` | `clean`, `cover`, `caption`, `card`, `sign` |
| Historia | 1080 × 1920 (9:16) | `story` | `story`, `clean` |
| Tapa de destacada | 1080 × 1920 | `story` | `highlight` |

## La regla de oro: la foto manda, el texto va aparte
Decisión del usuario (10/11/2026), aprendida en la cuenta de Cabo: **nada de recuadros ni paneles sobre las fotos, y poco texto.**
- Sobre una foto, como mucho **una línea corta** (`caption`: itálica chica abajo, con un degradé suave).
- Si una idea necesita texto, va en **una placa propia** (`card`: fondo navy, título blanco y como mucho una línea en rosa). El carrusel **alterna** fotos y placas; nunca mezcla las dos en la misma imagen.
- **Tope: unas 12 palabras por placa.** El detalle va en el texto del post.
- **La marca (pe) no va sobre las fotos** (sería una marca de agua, como las fotos viejas de la cuenta). Solo en la **última placa** de cada carrusel (`sign`: avatar y "visitpunta.com") y en las tapas de destacadas.
- Referencia visual: `~/Downloads/visitcabopolonio-instagram/03-como-se-llega-v2/` (el mismo formato con los colores de Cabo).

## Spec
```json
{
  "out": "~/Downloads/visitpunta-instagram/01-casapueblo",
  "format": "feed",
  "slides": [
    { "file": "fotos/casapueblo/X.jpg", "position": "50% 60%", "style": "cover", "eyebrow": "Punta Ballena", "title": "Casapueblo", "text": "Aparece antes de llegar." },
    { "file": "fotos/casapueblo/Y.jpg", "style": "caption", "text": "Una línea corta." },
    { "style": "card", "title": "Un dato por placa.", "text": "Y una línea, como mucho." },
    { "style": "sign" }
  ]
}
```

## Feed
- **Foto sola (`clean`):** la mayoría de los posts. La foto habla; el texto va en la descripción.
- **Carrusel:** portada `cover` (eyebrow + título corto + una línea en itálica), después fotos `clean` o `caption` alternadas con alguna `card` si hace falta un dato, y cierre `sign`. 4 a 8 imágenes.
- **Post práctico** (cuándo ver ballenas, cómo llegar a Isla de Lobos): igual que un carrusel, con los datos en `card`, de a uno por placa. Datos solo de la web.
- Recortar con `position` para que lo importante quede adentro del 4:5.

## Historias
- Sets de 3 a 5. Estilo `story`: título y una línea en el tercio del medio, sobre un velo suave. Los ~250 px de arriba y de abajo quedan libres para la interfaz de Instagram.
- La última deja lugar para el **sticker de link**, que pone el usuario. En `texto.txt`: la URL exacta.

## Destacadas
Tapas `highlight`: fondo navy y una palabra centrada (Instagram la recorta en círculo). Propuestas: Comer, Dormir, Playas, Qué hacer, Ballenas, Punta.

## Reels
Solo ideas y guion (el video lo filma el usuario): gancho en el primer segundo, 5 a 15 segundos, poco texto en pantalla, audio de la biblioteca comercial (la cuenta es de empresa).

## Entrega (`texto.txt`)
```
POST NN · TEMA (formato, cantidad de imágenes)
── TEXTO ── (para copiar)
── UBICACIÓN ── Punta del Este (o el lugar exacto)
── TEXTO ALTERNATIVO ── una línea por imagen
── LINK ── (historias) URL exacta + en qué historia va el sticker
── FECHA SUGERIDA ── día y hora
```
