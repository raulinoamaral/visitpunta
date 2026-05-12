import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Dónde dormir en Punta del Este — Visit Punta',
  description: 'Una selección de los mejores lugares para alojarse en Punta del Este, según el tipo de viaje y el plan.',
}

const featuredPlaces = [
  {
    name: 'Fasano Punta del Este',
    description: 'Campo, diseño y privacidad absoluta en José Ignacio.',
    image: 'https://picsum.photos/seed/fasano/800/600',
    href: '/fasano',
  },
  {
    name: 'The Grand Hotel',
    description: 'En pleno corazón de la Península. Vistas al puerto y a la Mansa.',
    image: 'https://picsum.photos/seed/grandhotel/800/600',
    href: '/the-grand-hotel',
  },
  {
    name: 'Lauberge',
    description: 'Un clásico de Punta. Bosque, piscina y mucha tranquilidad.',
    image: 'https://picsum.photos/seed/lauberge/800/600',
    href: '/lauberge',
  },
]

const relatedArticles = [
  {
    title: 'Dónde conviene alojarse en Punta del Este',
    excerpt: 'Península, La Barra, José Ignacio — cada zona tiene su lógica.',
    image: 'https://picsum.photos/seed/alojarse/800/600',
    href: '#',
  },
  {
    title: 'Un fin de semana en José Ignacio',
    excerpt: 'Qué hacer, dónde comer y dónde quedarse en el rincón más tranquilo de Punta.',
    image: 'https://picsum.photos/seed/joseignacio/800/600',
    href: '#',
  },
]

export default function ArticlePage() {
  return (
    <main>
      <PageHero
        image="https://picsum.photos/seed/dormirpunta/1600/900"
        title=""
      />

      <article className={styles.article}>

        <header className={styles.header}>
          <div className={styles.meta}>
            <span className={styles.badge}>Guía</span>
            <span className={styles.section}>Dormir</span>
          </div>
          <h1 className={styles.title}>Dónde dormir en Punta del Este</h1>
          <p className={styles.excerpt}>
            Una selección de los mejores lugares para alojarse, según el tipo de viaje y el plan.
          </p>
        </header>

        <div className={styles.intro}>
          <p>
            Punta del Este no es un solo lugar. Es la Península con su energía y su puerto,
            es La Barra con sus restaurantes y su movida, es José Ignacio con su calma absoluta.
            Dónde quedarse cambia todo lo demás.
          </p>
          <p>
            Esta guía está pensada para ayudarte a elegir bien, sin perderte en opciones de más.
          </p>
        </div>

        <section className={styles.content}>
          <h2>Si querés estar en el centro de todo</h2>
          <p>
            La Península es la opción si querés caminar a la playa, tener restaurantes cerca
            y no depender del auto. Hoteles como The Grand tienen vistas directas al mar
            y quedan a minutos de todo.
          </p>

          <h2>Si querés desconectar de verdad</h2>
          <p>
            José Ignacio es otra categoría. Hay menos opciones, pero las que hay son de las mejores
            de Uruguay. Fasano es el más icónico — diseño impecable, bungalows entre la naturaleza
            y un nivel de privacidad difícil de encontrar en otro lado.
          </p>

          <h2>Si viajás con familia</h2>
          <p>
            La Barra tiene opciones con espacio, pileta y una ubicación que permite moverse
            fácil tanto hacia Punta como hacia José Ignacio. Es el punto medio que muchos
            terminan eligiendo sin haberlo planeado.
          </p>
        </section>

        <section className={styles.featuredPlaces}>
          <h2 className={styles.featuredTitle}>Los lugares de esta guía</h2>
          <div className={styles.featuredGrid}>
            {featuredPlaces.map((place) => (
              <Link key={place.name} href={place.href} className={styles.placeCard}>
                <div className={styles.placeImage}>
                  <Image src={place.image} alt={place.name} fill className={styles.placeImg} />
                </div>
                <div className={styles.placeBody}>
                  <h3 className={styles.placeName}>{place.name}</h3>
                  <p className={styles.placeDescription}>{place.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </article>

      <section className={styles.relatedArticles}>
        <h2 className={styles.relatedTitle}>Seguir leyendo</h2>
        <div className={styles.relatedGrid}>
          {relatedArticles.map((article) => (
            <Link key={article.title} href={article.href} className={styles.relatedCard}>
              <div className={styles.relatedImage}>
                <Image src={article.image} alt={article.title} fill className={styles.relatedImg} />
              </div>
              <div className={styles.relatedBody}>
                <h3 className={styles.relatedCardTitle}>{article.title}</h3>
                <p className={styles.relatedExcerpt}>{article.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
