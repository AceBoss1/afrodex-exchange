'use client'

import '@/styles/globals.css'
import { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>AfroDex - Africa's Biggest DEX</title>
        <meta name="description" content="AfroDex Decentralized Exchange" />
      </head>
      <body className="bg-[#0b0b0f] text-white">
        {children}
      </body>
    </html>
  )
}
