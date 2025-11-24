'use client'

import { useState } from 'react'
import AfroDexPlatform from '@/components/AfroDexPlatform'

export default function Home() {
  const [collapsed, setCollapsed] = useState(false)

  return <AfroDexPlatform collapsed={collapsed} onToggle={setCollapsed} />
}
