/**
 * `sizes` hints for fill images, matching how wide each layout really renders.
 * Without them the browser assumes full width and asks for photos up to
 * 3840px wide, even for small cards.
 */
export const IMAGE_SIZES = {
  // Grids of 4 on desktop, swipe carousels of ~80% on phones
  card4: '(max-width: 768px) 80vw, 25vw',
  // Grids of 3 on desktop
  card3: '(max-width: 768px) 80vw, 33vw',
  // Two columns on desktop
  half: '(max-width: 768px) 100vw, 50vw',
  // Two thirds of the page (featured layouts)
  twoThirds: '(max-width: 768px) 100vw, 66vw',
  // Text column blocks (place block, inline media)
  content: '(max-width: 768px) 100vw, 860px',
  // Social carousels and galleries: narrow slides
  slide: '(max-width: 768px) 80vw, 420px',
  full: '100vw',
} as const
