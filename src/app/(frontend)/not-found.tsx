import Link from 'next/link'
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <img src="/ISO-COLOR.svg" alt="" className={styles.iso} />
        <h1 className={styles.title}>Esta página no existe.</h1>
        <p className={styles.subtitle}>Pero el Este sí.</p>
        <nav className={styles.nav}>
          <Link href="/alojamientos" className={styles.link}>Alojamientos</Link>
          <Link href="/gastronomia" className={styles.link}>Gastronomía</Link>
          <Link href="/recorridos" className={styles.link}>Recorridos</Link>
        </nav>
      </div>
    </main>
  )
}
