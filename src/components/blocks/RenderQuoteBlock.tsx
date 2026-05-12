import styles from './RenderQuoteBlock.module.css'

type Props = {
  text: string
  attribution?: string | null
}

export default function RenderQuoteBlock({ text, attribution }: Props) {
  return (
    <blockquote className={styles.quote}>
      <p className={styles.text}>{text}</p>
      {attribution && <cite className={styles.attribution}>— {attribution}</cite>}
    </blockquote>
  )
}
