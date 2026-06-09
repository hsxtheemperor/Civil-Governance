import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CJP Community Platform',
  description: 'By the people. For the people. Documented.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
