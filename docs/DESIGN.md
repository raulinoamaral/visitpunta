# Visit Punta: design

The style the site settled on in November 2026 (redesign of the home, Alojamientos, Gastronomía, Recorridos, the zones, the notes and the place pages). Read this before touching any page of the site, and follow it for new pages.

## The idea

A curated guide that reads like a magazine, not a portal, a directory or a WordPress theme.

- **The photo always wins**, like a social feed: big photos, the text short and beside or under them.
- **Luxury without showing it.** Air, restraint, good photos. No badges, stars, prices, "top" or loud colors.
- **Curated.** Few things, well chosen. Lists are broken up so they don't read as a catalogue.
- References the author likes: softervolumes.com (above all), Kinfolk (components and how things slide sideways). Not Monocle (too newspaper) nor Mr & Mrs Smith (not enough air).

## What the author rejected (don't bring it back)

- **Small thumbnails or round photos** in lists ("tipo álbum de Spotify"). Rejected twice. A list is either text only (`TextIndex`) or big photos.
- **Hero sliders** that change photos ("da viejo"). One cover photo, fixed.
- Anything that looks "AI" or "WordPress": generic cards in endless grids, icons with text, gradients, overlays full of text.
- The pink underline on links (the Booking link is navy, `currentColor`).

## Base

- **Type:** Playfair Display for titles (weight 400, never bold) and italic lines; Inter for text, labels and the UI. The logo is Mont Heavy.
- **Color:** white background (no automatic dark mode). Navy `--color-blue: #3D4B66` for titles and links; pink `--color-pink: #FA9683` only for hover and small accents. Greys `#555–#999` for secondary text, `#d9d9d9` for rules, sand `#f6f5f2` for note bands.
- **Width:** one width and one side margin for everything (header, covers, sections, footer), so it all starts on the same line:
  - `--page-width: 1280px`, `--page-gutter: 2rem` (1.25rem on phones);
  - `--page-inset` for full-width bars and bleeding rows.
  - Never set another max-width for a page block; use these tokens.
- **Rhythm:** sections are separated by air (7rem; 5rem on phones), not boxes or backgrounds. The last section closes with the same padding so nothing sticks to the footer.
- **Phones:** the header docks at the bottom. Nothing may make the page move sideways: no negative margins that go past the gutter (`html, body { overflow-x: clip }` is only a safety net). Check at 390px.

## Page shape

Every section page and zone follows roughly the same order, varying the formats so the eye doesn't get tired:

1. `PageCover`: one big photo, the title, one line and a caption saying what the photo shows ("La bahía", "El faro").
2. `Intro`: the opening text, centered, with air.
3. Sections, alternating formats, and **breaks** between them: a `NoteBand` (a note across the page) or a `Spotlight` (one place full width, name oversized).
4. Notes at the end, as a `TextIndex`.

Don't place two sections in a row with the same format.

## Components (`src/components/sections/`)

Reuse these before creating new ones. Each has its own `*.module.css` (never inline styles).

| Component | What it is | Used for |
|---|---|---|
| `Section` | Page-width block with the section rhythm. `bleed` lets rows run off the right edge; `last` adds bottom padding | Every section |
| `SectionHead` | Playfair title over a thin rule, an italic line with voice, optional "Ver todo" | Every section title |
| `PageCover` | Big cover photo, title, line, caption | Top of section and zone pages |
| `Intro` | Centered opening text | Under the cover |
| `CardGrid` | Photo-first cards. `wide` 3:2 two across (hotels, with the Booking link), `tall` 4:5 three across (restaurants), `places` 3:2 three across | Main lists |
| `SlideRow` | Row that slides sideways. `tall` 3:4 with the name on the photo, `wide` 3:2 with text under | Things to do, selections |
| `Trio` | One big photo and two stacked | Short featured groups |
| `CoffeeGrid` | Square photos, name and zone | Cafés, apart from restaurants |
| `NoteBand` | A note across the page on a sand band | Breaking a list, leading to a guide |
| `Spotlight` | One place full width, name oversized | A pause between sections |
| `TextIndex` | Text only: big titles, one line, an arrow | Notes, seasonal items |
| `ZoneFilter` | Zone pills; the list filters itself | Long lists (stay, eat) |

Items come through `src/lib/sectionItems.ts` (`toSectionItem(s)`), which picks the card image, the label (zone or type) and the Booking link.

## Cards and text

- On a card: a small uppercase label (zone or type), the name in Playfair, **one** line of summary. Nothing else: no icons, ratings, prices or tags.
- Section lines (`SectionHead line`) are short and have voice, in the tone of the `visitpunta-editorial` skill ("Pocos, y por algo.", "Mesas a las que se vuelve.", never "Los mejores hoteles").
- Hotels carry "Ver disponibilidad" to Booking (affiliate, `withBookingAid`), discreet, under the card.

## What is featured: Ubicaciones

Nothing on the pages is chosen in code. What the home, sections and zones feature comes from **Admin → Ubicaciones**, managed from the **Mapa del sitio** (`/admin/mapa`). Slots are defined in `src/lib/placementSlots.ts`.

- Featured slots (`home.*`, `zone.guide`, `zone.spotlight`, `explore.*`…) can have dates (day/month, every year) and a language (all, es, pt).
- Lists are "Primeros de la lista" (chosen ones first, in order) and then alphabetical (`firstThenByName`). There is no "Destacado" checkbox or `order` field any more.
- A new place on the site that should be featured gets a slot in `placementSlots.ts`, never a new checkbox or a hardcoded list.
- No payment or currency fields for now.

## Before showing a change

- Design changes: show one preview first (one language is enough), wait for the author's OK, then roll out.
- The author checks visuals in local dev; no screenshot builds.
- Look at it on a phone width (390px) too.

## Places inside a note (`RenderPlaceBlock`)

Decided 26/11/2026. The note's own subtitle and paragraph name the place and tell the story; the block only shows it: one big clean photo (breakout width), two more from the place's gallery side by side when it has them, and a quiet "Más sobre {name} →" in navy. No overlay, no text on the photo, no second description. Never "ficha" in visible text.
