import type { Metadata } from 'next'
import Image from 'next/image'
import PageHero from '@/components/PageHero'
import PlaceCard from '@/components/PlaceCard'
import ArticleCard from '@/components/ArticleCard'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Fasano Punta del Este Hotel — José Ignacio · Visit Punta',
  description: 'Si querés desconectar de verdad, es acá. Naturaleza, calma y uno de los hoteles más exclusivos de Punta, donde todo pasa más lento.',
}

const masParaDormir = [
  { name: 'Lauberge', description: 'Un clásico de Punta. Bosque, piscina y mucha tranquilidad.', image: 'https://picsum.photos/seed/lauberge2/800/600' },
  { name: 'Casa Suaya', description: 'Pequeño, íntimo y pensado para los que buscan algo diferente.', image: 'https://picsum.photos/seed/suaya3/800/600' },
  { name: 'The Grand Hotel', description: 'Vistas al puerto y a la Mansa desde los pisos altos.', image: 'https://picsum.photos/seed/grand2/800/600' },
  { name: 'Bahia Hotel', description: 'Frente a la Playa Mansa. Cómodo, bien ubicado y sin pretensiones.', image: 'https://picsum.photos/seed/bahia2/800/600' },
]

const articulos = [
  { title: 'Los mejores hoteles de José Ignacio', image: 'https://picsum.photos/seed/artji1/800/600', href: '#' },
  { title: 'Dónde alojarse cerca de Punta', image: 'https://picsum.photos/seed/artji2/800/600', href: '#' },
]

export default function FasanoPage() {
  return (
    <main>
      <PageHero
        image="/images/fasano/hero.jpg"
        title=""
      />

      <section className={styles.hotelHeader}>
        <div className={styles.hotelInfo}>
          <h1 className={styles.hotelName}>Fasano Punta del Este Hotel</h1>
          <p className={styles.hotelLocation}>José Ignacio</p>
        </div>
        <div className={styles.hotelCta}>
          <a href="#" className={styles.ctaButton}>Ver disponibilidad</a>
          <span className={styles.ctaNote}>en booking.com</span>
        </div>
      </section>

      <section className={styles.description}>
        <p className={styles.descriptionText}>
          Si querés desconectar de verdad, es acá. Naturaleza, calma y uno de los hoteles más exclusivos de Punta, donde todo pasa más lento.
        </p>
        <p className={styles.descriptionText}>
          Fasano combina campo, diseño y privacidad absoluta en un entorno donde todo está pensado para bajar el ritmo — sin resignar sofisticación.
        </p>
      </section>

      <section className={styles.gallery}>
        <div className={styles.galleryRow2}>
          <div className={styles.galleryImage}>
            <Image src="/images/fasano/3.jpg" alt="Fasano" fill className={styles.galleryImg} />
            <span className={styles.galleryCredit}>© Hotel Fasano Punta del Este</span>
          </div>
          <div className={styles.galleryImage}>
            <Image src="/images/fasano/4.webp" alt="Fasano" fill className={styles.galleryImg} />
            <span className={styles.galleryCredit}>© Hotel Fasano Punta del Este</span>
          </div>
        </div>
        <div className={styles.galleryRow3}>
          <div className={styles.galleryImage}>
            <Image src="/images/fasano/1.jpg" alt="Fasano" fill className={styles.galleryImg} />
            <span className={styles.galleryCredit}>© Hotel Fasano Punta del Este</span>
          </div>
          <div className={styles.galleryImage}>
            <Image src="/images/fasano/2.jpg" alt="Fasano" fill className={styles.galleryImg} />
            <span className={styles.galleryCredit}>© Hotel Fasano Punta del Este</span>
          </div>
          <div className={styles.galleryImage}>
            <Image src="/images/fasano/5.jpg" alt="Fasano" fill className={styles.galleryImg} />
            <span className={styles.galleryCredit}>© Hotel Fasano Punta del Este</span>
          </div>
        </div>
      </section>

      <section className={styles.reasons}>
        <h2 className={styles.reasonsTitle}>Por qué alojarse aquí</h2>
        <ul className={styles.reasonsList}>
          {[
            'Bungalows privados entre naturaleza virgen',
            'Arquitectura integrada al paisaje',
            'Spa + experiencias de campo',
            'Uno de los hoteles más exclusivos de Uruguay',
            'A minutos de Punta, pero completamente aparte',
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
        <h2 className={styles.sectionTitle}>José Ignacio</h2>
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
