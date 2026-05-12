import Image from 'next/image'
import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <nav className={styles.nav}>
          <Link href="/alojamientos" className={styles.navLink}>Alojamientos</Link>
          <Link href="/gastronomia" className={styles.navLink}>Gastronomía</Link>
          <Link href="/recorridos" className={styles.navLink}>Recorridos</Link>
        </nav>

        <div className={styles.brand}>
          <Image
            src="/visit-punta-del-este-w.svg"
            alt="Visit Punta del Este"
            width={200}
            height={60}
            className={styles.logo}
          />
        </div>

        <div className={styles.social}>
          <Link
            href="https://instagram.com/visitpunta"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            @visitpunta
          </Link>
          <p className={styles.suggest}>¿Tenés un lugar que vale la pena?</p>
          <a href="mailto:hello@visitpunta.com" className={styles.socialLink}>
            hello@visitpunta.com
          </a>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copyright}>Una guía curada por Visit Punta</p>
        <a
          href="https://balloon.haus/es"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.balloon}
        >
          balloon.haus
        </a>
      </div>
    </footer>
  )
}
