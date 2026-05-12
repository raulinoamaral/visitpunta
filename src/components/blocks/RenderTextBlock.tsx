'use client'

import { RichText, defaultJSXConverters } from '@payloadcms/richtext-lexical/react'
import styles from './RenderTextBlock.module.css'

type Props = {
  content: any
}

const converters = {
  ...defaultJSXConverters,
  link: ({ node, nodesToJSX }: any) => {
    const children = nodesToJSX({ nodes: node.children })
    if (node.fields?.linkType === 'internal' && node.fields?.doc) {
      const doc = node.fields.doc as any
      const slug = doc?.value?.slug || doc?.slug
      const href = slug ? `/${slug}` : '#'
      return <a href={href}>{children}</a>
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
}

export default function RenderTextBlock({ content }: Props) {
  return (
    <div className={styles.block}>
      <RichText data={content} converters={converters} />
    </div>
  )
}
