'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Header() {
  const [npub, setNpub] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedNpub = localStorage.getItem('nostr-npub')
      if (storedNpub) setNpub(storedNpub)
    }
  }, [])

  return (
    <header className="flex justify-between items-center p-4 bg-transparent text-white">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/MOSTRO-LOGO.png"
            alt="Mostro Logo"
            width={27}
            height={27}
          />
        </Link>
      </div>

      {/* Conditional button or npub */}
      {npub ? (
        <Link href={`/u/${npub}`}>
          <Button
            className="border-lime-500 bg-transparent text-lime-300 hover:text-white hover:border-white cursor-pointer"
          >
            {npub.slice(0, 8)}…{npub.slice(-4)}
          </Button>
        </Link>
      ) : (
        <Link href="/auth">
          <Button className="px-4 h-8 bg-lime-500 text-black font-bold rounded-sm hover:bg-lime-600 cursor-pointer">
            GET IN
          </Button>
        </Link>
      )}
    </header>
  )
}
