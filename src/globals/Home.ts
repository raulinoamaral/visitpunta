import type { GlobalConfig } from 'payload'
import { revalidateGlobalOnChange } from '@/lib/revalidate'

/**
 * The home's texts. What appears in each section is chosen in Admin → Ubicaciones (Mapa del sitio).
 */
export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home',
  admin: {
    description: 'Los textos de la home. Qué aparece en cada sección se elige en el Mapa del sitio.',
  },
  hooks: { afterChange: [revalidateGlobalOnChange] },
  fields: [
    {
      name: 'heroCaption',
      type: 'text',
      localized: true,
      label: 'Línea de la foto de portada',
      admin: { description: 'Qué muestra la foto. Ej: La bahía.' },
    },
    {
      name: 'spotlightQuote',
      type: 'text',
      localized: true,
      label: 'Frase del destacado a pantalla completa',
    },
  ],
}
