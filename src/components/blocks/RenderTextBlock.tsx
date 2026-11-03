'use client'

import { RichText, defaultJSXConverters } from '@payloadcms/richtext-lexical/react'
import { localePath, type Locale } from '@/i18n/config'
import styles from './RenderTextBlock.module.css'

type Props = {
  content: any
  locale: Locale
}

// Internal links point to the document in the page's language
const buildConverters = (locale: Locale) => ({
  ...defaultJSXConverters,
  link: ({ node, nodesToJSX }: any) => {
    const children = nodesToJSX({ nodes: node.children })
    if (node.fields?.linkType === 'internal' && node.fields?.doc) {
      const doc = node.fields.doc as any
      const target = doc?.value ?? doc
      // A page not yet published in this language: keep the words, drop the link
      if (!target?.slug || target.published === false) return <>{children}</>
      return <a href={localePath(locale, target.slug)}>{children}</a>
    }
    return (
      <a
        href={node.fields?.url || '#'}
        target={node.fields?.newTab ? '_blank' : undefined}
        rel={node.fields?.newTab ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    )
  },
})

export default function RenderTextBlock({ content, locale }: Props) {
  return (
    <div className={styles.block}>
      <RichText data={content} converters={buildConverters(locale)} />
    </div>
  )
}
