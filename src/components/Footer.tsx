import Image from 'next/image'
import Link from 'next/link'
import styles from './Footer.module.css'

/**
 * Editorial close of every page: a closing line like the end of a story, then three
 * columns (links, white logo, Instagram and contact) and a small credit line.
 */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.closing}>Para quedarse unos minutos más.</p>

        <div className={styles.columns}>
          <nav className={styles.links}>
            <Link href="/alojamientos">Alojamientos</Link>
            <Link href="/gastronomia">Gastronomía</Link>
            <Link href="/recorridos">Recorridos</Link>
          </nav>

          <Link href="/" className={styles.brand} aria-label="Visit Punta del Este">
            <Image
              src="/visit-punta-del-este-w.svg"
              alt="Visit Punta del Este"
              width={200}
              height={60}
              className={styles.logo}
            />
          </Link>

          <div className={styles.social}>
            <a href="https://instagram.com/visitpunta" target="_blank" rel="noopener noreferrer">
              @visitpunta
            </a>
            <p className={styles.suggest}>¿Tenés un lugar que vale la pena?</p>
            <a href="mailto:hello@visitpunta.com">hello@visitpunta.com</a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>Una guía curada por Visit Punta</p>
          <a href="https://balloon.haus/es" target="_blank" rel="noopener noreferrer">
            balloon.haus
          </a>
        </div>
      </div>
    </footer>
  )
}
