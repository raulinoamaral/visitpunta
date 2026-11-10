import type { Locale } from './config'

/**
 * Fixed interface copy per language. Content (places, articles, experiences,
 * destinations) comes from Payload; this is only the copy the code owns.
 * Portuguese is written for Brazilian readers, not translated word by word.
 */
const es = {
  meta: {
    siteDescription: 'Una guía curada de Punta del Este y sus alrededores',
    homeTitle: 'Punta del Este y alrededores: guía curada de lugares que valen la pena',
    homeDescription:
      'Una guía curada de Punta del Este, José Ignacio y La Barra: alojamientos, restaurantes, cafés y experiencias elegidas por su calidad y estilo.',
  },
  nav: {
    stay: 'Alojamientos',
    eat: 'Gastronomía',
    explore: 'Recorridos',
    home: 'Visit Punta del Este',
    switchLanguage: 'Ver en português',
  },
  footer: {
    closing: 'Para quedarse unos minutos más.',
    suggest: '¿Tenés un lugar que vale la pena?',
    notice: 'Una guía curada e independiente. No es un sitio oficial.',
    family: 'De la misma mano:',
  },
  home: {
    heroSmall: '& alrededores',
    heroSubtitle: 'Una guía curada del Este',
    intro:
      'Lugares elegidos con criterio. Hoteles donde dan ganas de quedarse, restaurantes que dan ganas de volver, cafés que se vuelven rutina.',
    zonesTitle: 'El Este, zona por zona',
    guideLabel: 'Guía',
    enjoyTitle: 'Para disfrutarlo bien',
    enjoy: {
      stay: { title: 'Refugios', subtitle: 'Hoteles, villas y lugares para quedarse' },
      eat: { title: 'Mesa & café', subtitle: 'Restaurantes, beach clubs y specialty coffee' },
      explore: { title: 'Recorridos', subtitle: 'Playas, planes y spots para descubrir' },
    },
    exploreTitle: 'Para explorar ahora',
  },
  stay: {
    metaTitle: 'Alojamientos en Punta del Este: hoteles y lugares para quedarse',
    metaDescription:
      'Una selección de alojamientos en Punta del Este, José Ignacio y La Barra: hoteles, posadas y lugares para quedarse según el tipo de viaje.',
    title: 'Alojamientos',
    subtitle: 'Lugares que realmente valen la pena',
    intro:
      'Una selección curada de lugares donde dan ganas de quedarse en el Este, pensados para bajar el ritmo y disfrutar el entorno.',
    // Keys are the Spanish tag labels in Payload
    sections: {
      'Para desconectar': 'Para desconectar',
      'Cerca de todo': 'Cerca de todo',
      'Con más diseño': 'Con más diseño',
    } as Record<string, string>,
  },
  eat: {
    metaTitle: 'Dónde comer en Punta del Este: restaurantes, cafés y paradores',
    metaDescription:
      'Restaurantes, cafés y paradores en Punta del Este y alrededores. Lugares para comer frente al mar, sin apuro o con café de especialidad.',
    title: 'Restaurantes y cafés',
    subtitle: 'Para comer, tomar algo y quedarse un rato más de lo planeado',
    intro:
      'Restaurantes frente al mar y beach clubs para alargar el día hasta el atardecer. Cafés de especialidad donde todo está cuidado.',
    sections: {
      Restaurant: 'Para sentarse sin apuro',
      Café: 'Café de especialidad',
      Parador: 'Frente al mar',
    } as Record<string, string>,
  },
  explore: {
    metaTitle: 'Qué hacer en Punta del Este: playas, recorridos y lugares clave',
    metaDescription:
      'Playas, recorridos y lugares para visitar en Punta del Este. Una guía de experiencias que terminan armando el mapa del Este.',
    title: 'Para recorrer',
    subtitle: 'Para ver y entender el ritmo del Este',
    intro: 'Playas y algunos lugares que, juntos, terminan armando el mapa del Este.',
    start: 'Para empezar',
    others: 'Otros',
  },
  place: {
    highlights: { dormir: 'Por qué alojarse aquí', comer: 'Tené en cuenta' } as Record<string, string>,
    highlightsDefault: 'Destacados',
    checkAvailability: 'Consultar disponibilidad',
    bookTable: 'Reservar mesa',
    onBooking: 'en booking.com',
    viewOnMaps: 'Ver en Google Maps →',
    otherPlaces: 'Otros lugares que valen la pena',
    otherPlacesIn: (destination: string) => `Otros lugares que valen la pena en ${destination}`,
    keepExploring: 'Para seguir explorando',
  },
  experience: {
    timingDefault: 'Cuándo ir',
    nearby: 'Cerca',
  },
  destination: {
    stay: 'Dónde dormir',
    explore: 'Para recorrer',
    eat: 'Dónde comer y tomar algo',
    keepExploring: 'Para seguir explorando',
  },
  article: {
    keepReading: 'Seguir leyendo',
    types: { guide: 'Guía', selection: 'Selección', experience: 'Experiencia', season: 'Temporada' } as Record<string, string>,
  },
  notFound: {
    title: 'Esta página no existe.',
    subtitle: 'Pero el Este sí.',
  },
}

export type Dictionary = typeof es

const pt: Dictionary = {
  meta: {
    siteDescription: 'Um guia com curadoria de Punta del Este e arredores, no Uruguai',
    homeTitle: 'Punta del Este, Uruguai: um guia com curadoria dos lugares que valem a pena',
    homeDescription:
      'Um guia com curadoria de Punta del Este, José Ignacio e La Barra, no Uruguai: hospedagens, restaurantes, cafés e experiências escolhidos pela qualidade e pelo estilo.',
  },
  nav: {
    stay: 'Hospedagem',
    eat: 'Gastronomia',
    explore: 'Passeios',
    home: 'Visit Punta del Este',
    switchLanguage: 'Ver en español',
  },
  footer: {
    closing: 'Para ficar só mais um pouquinho.',
    suggest: 'Conhece um lugar que vale a pena?',
    notice: 'Um guia curado e independente. Não é um site oficial.',
    family: 'Da mesma mão:',
  },
  home: {
    heroSmall: '& arredores',
    heroSubtitle: 'Um guia com curadoria da costa uruguaia',
    intro:
      'Lugares escolhidos com critério. Hotéis onde dá vontade de ficar, restaurantes que dão vontade de voltar, cafés que viram rotina.',
    zonesTitle: 'Região por região',
    guideLabel: 'Guia',
    enjoyTitle: 'Para aproveitar bem',
    enjoy: {
      stay: { title: 'Refúgios', subtitle: 'Hotéis, villas e lugares para ficar' },
      eat: { title: 'Mesa & café', subtitle: 'Restaurantes, beach clubs e cafés especiais' },
      explore: { title: 'Passeios', subtitle: 'Praias, programas e lugares para descobrir' },
    },
    exploreTitle: 'Para explorar agora',
  },
  stay: {
    metaTitle: 'Onde ficar em Punta del Este, Uruguai: hotéis e pousadas que valem a pena',
    metaDescription:
      'Uma seleção de hospedagens em Punta del Este, José Ignacio e La Barra: hotéis, pousadas e lugares para ficar de acordo com o tipo de viagem.',
    title: 'Hospedagem',
    subtitle: 'Lugares que realmente valem a pena',
    intro:
      'Uma seleção com curadoria de lugares onde dá vontade de ficar em Punta del Este e arredores, pensados para desacelerar e aproveitar o entorno.',
    sections: {
      'Para desconectar': 'Para desconectar',
      'Cerca de todo': 'Perto de tudo',
      'Con más diseño': 'Com mais design',
    },
  },
  eat: {
    metaTitle: 'Onde comer em Punta del Este, Uruguai: restaurantes, cafés e paradores',
    metaDescription:
      'Restaurantes, cafés e paradores em Punta del Este e arredores. Lugares para comer de frente para o mar, sem pressa ou com café especial.',
    title: 'Restaurantes e cafés',
    subtitle: 'Para comer, tomar alguma coisa e ficar um pouco mais do que o planejado',
    intro:
      'Restaurantes de frente para o mar e beach clubs para esticar o dia até o pôr do sol. Cafés especiais onde tudo é bem cuidado.',
    sections: {
      Restaurant: 'Para sentar sem pressa',
      Café: 'Cafés especiais',
      Parador: 'De frente para o mar',
    },
  },
  explore: {
    metaTitle: 'O que fazer em Punta del Este, Uruguai: praias, passeios e lugares essenciais',
    metaDescription:
      'Praias, passeios e lugares para conhecer em Punta del Este, no Uruguai. Um guia de experiências que, juntas, desenham o mapa da região.',
    title: 'Para explorar',
    subtitle: 'Para ver e entender o ritmo de Punta del Este',
    intro: 'Praias e alguns lugares que, juntos, acabam desenhando o mapa da região.',
    start: 'Para começar',
    others: 'Outros',
  },
  place: {
    highlights: { dormir: 'Por que ficar aqui', comer: 'Bom saber' },
    highlightsDefault: 'Destaques',
    checkAvailability: 'Ver disponibilidade',
    bookTable: 'Reservar mesa',
    onBooking: 'no booking.com',
    viewOnMaps: 'Ver no Google Maps →',
    otherPlaces: 'Outros lugares que valem a pena',
    otherPlacesIn: (destination: string) => `Outros lugares que valem a pena em ${destination}`,
    keepExploring: 'Para continuar explorando',
  },
  experience: {
    timingDefault: 'Quando ir',
    nearby: 'Por perto',
  },
  destination: {
    stay: 'Onde ficar',
    explore: 'Para explorar',
    eat: 'Onde comer e beber',
    keepExploring: 'Para continuar explorando',
  },
  article: {
    keepReading: 'Continue lendo',
    types: { guide: 'Guia', selection: 'Seleção', experience: 'Experiência', season: 'Temporada' },
  },
  notFound: {
    title: 'Esta página não existe.',
    subtitle: 'Mas Punta del Este, sim.',
  },
}

const dictionaries: Record<Locale, Dictionary> = { es, pt }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
