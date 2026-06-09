'use client'

import { useMemo } from 'react'
import MarkdownIt from 'markdown-it'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const md = useMemo(() => {
    return new MarkdownIt({
      html: false,
      linkify: true,
      typographer: true,
    })
  }, [])

  const html = useMemo(() => {
    return md.render(content)
  }, [content, md])

  return (
    <div
      className="markdown space-y-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
