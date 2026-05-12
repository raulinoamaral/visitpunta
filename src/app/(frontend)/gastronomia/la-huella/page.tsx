import type { Metadata } from 'next'
import Image from 'next/image'
import PageHero from '@/components/PageHero'
import PlaceCard from '@/components/PlaceCard'
import ArticleCard from '@/components/ArticleCard'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Parador La Huella — José Ignacio · Visit Punta',
  description: 'Uno de los lugares más icónicos para comer en Punta del Este. Frente al mar en José Ignacio, buena cocina y ambiente relajado.',
}

const masParaComer = [
  { name: 'Lo de Tere', description: 'El mercado más querido de Punta. Pastas, fiambres y una energía difícil de igualar.', image: 'https://picsum.photos/seed/lodetere2/800/600' },
  { name: 'Francis', description: 'Cocina de autor con productos locales. Uno de los más interesantes de la temporada.', image: 'https://picsum.photos/seed/francis3/800/600' },
  { name: 'Chihuahua', description: 'Referente de la noche puntaesteña. Buena carta, mejor ambiente.', image: 'https://picsum.photos/seed/chihuahua2/800/600' },
  { name: 'La Susana', description: 'Parador frente al mar en La Barra. Atardeceres y carta de autor.', image: 'https://picsum.photos/seed/susana2/800/600' },
]

const articulos = [
  { title: 'Los mejores paradores frente al mar', image: 'https://picsum.photos/seed/arthuella1/800/600', href: '#' },
  { title: 'Dónde comer en José Ignacio', image: 'https://picsum.photos/seed/arthuella2/800/600', href: '#' },
]

export default function LaHuellaPage() {
  return (
    <main>
      <PageHero
        image="/images/la-huella/hero.jpg"
        title=""
      />

      <section className={styles.hotelHeader}>
        <div className={styles.hotelInfo}>
          <h1 className={styles.hotelName}>Parador La Huella</h1>
          <p className={styles.hotelLocation}>José Ignacio</p>
        </div>
        <div className={styles.hotelCta}>
          <a href="#" className={styles.ctaButton}>Reservar</a>
        </div>
      </section>

      <section className={styles.description}>
        <p className={styles.descriptionText}>
          Uno de los lugares más icónicos para comer en Punta del Este.
        </p>
        <p className={styles.descriptionText}>
          Frente al mar en José Ignacio, combina buena cocina, ambiente relajado y una energía muy propia del lugar.
        </p>
      </section>

      <section className={styles.gallery}>
        {['3', '4', '2', '1'].map((n) => (
          <div key={n} className={styles.galleryImage}>
            <Image
              src={`/images/la-huella/${n}.jpg`}
              alt="Parador La Huella"
              fill
              className={styles.galleryImg}
            />
            <span className={styles.galleryCredit}>© Parador La Huella</span>
          </div>
        ))}
      </section>

      <section className={styles.reasons}>
        <h2 className={styles.reasonsTitle}>Tené en cuenta</h2>
        <ul className={styles.reasonsList}>
          {[
            'Frente al mar',
            'Ideal para atardecer',
            'Conviene reservar',
            'No dejes de probar el volcán de chocolate',
          ].map((tag) => (
            <li key={tag} className={styles.reasonsItem}>
              <span className={styles.check}>✓</span>
              {tag}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.ctaSection}>
        <a href="#" className={styles.ctaButtonLarge}>Reservar</a>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>José Ignacio</h2>
        <div className={styles.placeGrid}>
          {masParaComer.map((place) => (
            <PlaceCard key={place.name} {...place} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.articulosGrid}>
          {articulos.map((article) => (
            <ArticleCard key={article.title} {...article} />
          ))}
        </div>
      </section>
    </main>
  )
}
