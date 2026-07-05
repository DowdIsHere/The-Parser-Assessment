import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Parser Profile™',
  description: 'Discover how your mind filters, processes, and engages with the world.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  )
}
