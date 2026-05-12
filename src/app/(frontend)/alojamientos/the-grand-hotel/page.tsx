import type { Metadata } from 'next'
import Image from 'next/image'
import PageHero from '@/components/PageHero'
import PlaceCard from '@/components/PlaceCard'
import ArticleCard from '@/components/ArticleCard'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'The Grand Hotel Punta del Este · Visit Punta',
  description: 'Uno de los hoteles mejor ubicados en la Punta, frente a Playa Brava. Moderno, cómodo y con vista al mar.',
}

const masParaDormir = [
  { name: 'Fasano', description: 'Campo, diseño y privacidad absoluta en José Ignacio.', image: 'https://picsum.photos/seed/fasano3/800/600' },
  { name: 'Lauberge', description: 'Un clásico de Punta. Bosque, piscina y mucha tranquilidad.', image: 'https://picsum.photos/seed/lauberge3/800/600' },
  { name: 'Casa Suaya', description: 'Pequeño, íntimo y pensado para los que buscan algo diferente.', image: 'https://picsum.photos/seed/suaya4/800/600' },
  { name: 'Bahia Hotel', description: 'Frente a la Playa Mansa. Cómodo, bien ubicado y sin pretensiones.', image: 'https://picsum.photos/seed/bahia3/800/600' },
]

const articulos = [
  { title: 'Los mejores hoteles frente al mar', image: 'https://picsum.photos/seed/artgrand1/800/600', href: '#' },
  { title: 'Dónde alojarse en la Península', image: 'https://picsum.photos/seed/artgrand2/800/600', href: '#' },
]

export default function TheGrandHotelPage() {
  return (
    <main>
      <PageHero
        image="/images/grand-hotel/hero.jpg"
        title=""
      />

      <section className={styles.hotelHeader}>
        <div className={styles.hotelInfo}>
          <h1 className={styles.hotelName}>The Grand Hotel Punta del Este</h1>
          <p className={styles.hotelLocation}>Punta del Este</p>
        </div>
        <div className={styles.hotelCta}>
          <a href="#" className={styles.ctaButton}>Ver disponibilidad</a>
          <span className={styles.ctaNote}>en booking.com</span>
        </div>
      </section>

      <section className={styles.description}>
        <p className={styles.descriptionText}>
          Uno de los hoteles mejor ubicados en la Punta, frente a Playa Brava.
        </p>
        <p className={styles.descriptionText}>
          Moderno, cómodo y con vista al mar, funciona bien tanto para una estadía tranquila como para moverse fácil por la ciudad.
        </p>
      </section>

      <section className={styles.gallery}>
        <div className={styles.galleryMain}>
          <Image src="/images/grand-hotel/4.jpg" alt="The Grand Hotel" fill className={styles.galleryImg} />
        </div>
        <div className={styles.galleryStack}>
          <div className={styles.galleryStackImage}>
            <Image src="/images/grand-hotel/3.jpg" alt="The Grand Hotel" fill className={styles.galleryImg} />
          </div>
          <div className={styles.galleryStackImage}>
            <Image src="/images/grand-hotel/6.jpg" alt="The Grand Hotel" fill className={styles.galleryImg} />
          </div>
        </div>
      </section>

      <section className={styles.reasons}>
        <h2 className={styles.reasonsTitle}>Por qué alojarse aquí</h2>
        <ul className={styles.reasonsList}>
          {[
            'Frente al mar',
            'Ubicación céntrica',
            'Hotel completo (spa, piscina, gimnasio)',
          ].map((tag) => (
            <li key={tag} className={styles.reasonsItem}>
              <span className={styles.check}>✓</span>
              {tag}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.ctaSection}>
        <a href="#" className={styles.ctaButtonLarge}>Ver disponibilidad</a>
        <span className={styles.ctaNote}>en booking.com</span>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Punta del Este</h2>
        <div className={styles.placeGrid}>
          {masParaDormir.map((place) => (
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
