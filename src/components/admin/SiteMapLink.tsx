import Link from 'next/link'
import styles from './SiteMapLink.module.css'

/** Link to the site map, at the end of the admin navigation */
export function SiteMapLink() {
  return (
    <Link href="/admin/mapa" className={styles.link}>
      Mapa del sitio
    </Link>
  )
}
