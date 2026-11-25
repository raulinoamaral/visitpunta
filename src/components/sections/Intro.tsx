import Reveal from '@/components/Reveal'
import styles from './Intro.module.css'

/** The page's opening text, centered, with air around it */
export default function Intro({ text }: { text: string }) {
  return (
    <Reveal>
      <p className={styles.intro}>{text}</p>
    </Reveal>
  )
}
