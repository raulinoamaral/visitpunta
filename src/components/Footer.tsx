import Link from 'next/link'
import { localePath, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { sectionHref } from '@/i18n/routes'
import Logo from './Logo'
import styles from './Footer.module.css'

type Props = {
  locale: Locale
}

/**
 * Editorial close of every page: a closing line like the end of a story, then three
 * columns (links, the full logo, Instagram and contact) and a small notice line.
 */
export default function Footer({ locale }: Props) {
  const t = getDictionary(locale)

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.closing}>{t.footer.closing}</p>

        <div className={styles.columns}>
          <nav className={styles.links}>
            <Link href={sectionHref('stay', locale)}>{t.nav.stay}</Link>
            <Link href={sectionHref('eat', locale)}>{t.nav.eat}</Link>
            <Link href={sectionHref('explore', locale)}>{t.nav.explore}</Link>
          </nav>

          <Link href={localePath(locale)} className={styles.brand} aria-label="Visit Punta del Este">
            <Logo tagline />
          </Link>

          <div className={styles.social}>
            <a href="https://instagram.com/visitpunta" target="_blank" rel="noopener noreferrer">
              @visitpunta
            </a>
            <p className={styles.suggest}>{t.footer.suggest}</p>
            <a href="mailto:hello@visitpunta.com">hello@visitpunta.com</a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            {t.footer.notice}
            <span className={styles.dot} aria-hidden="true">
              ·
            </span>
            <span className={styles.family}>
              {t.footer.family}{' '}
              <a href="https://visitcabopolonio.com" target="_blank" rel="noopener">
                visitcabopolonio.com
              </a>
            </span>
          </p>
          <a href="https://balloon.haus/es" target="_blank" rel="noopener noreferrer">
            balloon.haus
          </a>
        </div>
      </div>
    </footer>
  )
}
