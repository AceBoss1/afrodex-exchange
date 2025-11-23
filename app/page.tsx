// app/page.tsx
'use client'

import React, { useState } from 'react'
import AfroDexPlatform from '@/components/AfroDexPlatform'

export default function Page() {
  const [collapsed, setCollapsed] = useState(false)

  return <AfroDexPlatform initialCollapsed={collapsed} />
}
