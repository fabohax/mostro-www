'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

declare global {
  interface Window {
    nostr?: {
      getPublicKey: () => Promise<string>;
      signEvent?: (event: { kind: number; content: string; tags: any[]; created_at: number; pubkey: string }) => Promise<{ kind: number; content: string; tags: any[]; created_at: number; pubkey: string; sig: string }>;
    };
  }
}

export default function OrderPage() {
  const params = useParams()
  const [pubkey, setPubkey] = useState<string | null>(null)
  const [signedEvent, setSignedEvent] = useState<{ kind: number; content: string; tags: { key: string; value: string }[]; created_at: number; pubkey: string; sig?: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const pk = localStorage.getItem('nostr-pubkey')
    setPubkey(pk)
  }, [])

  const handleSign = async () => {
    if (!window.nostr) {
      setError('Nostr extension not found.')
      return
    }

    try {
      const event = {
        kind: 1,
        content: `Order ${params?.id || 'unknown'} created!`,
        tags: [],
        created_at: Math.floor(Date.now() / 1000),
        pubkey: pubkey || '',
      }

      if (!window.nostr || !window.nostr.signEvent) {
        throw new Error('signEvent is not available on the Nostr extension.')
      }
      const signed = await window.nostr.signEvent(event)
      setSignedEvent(signed)
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Failed to sign the event.')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 font-mono space-y-4">
      <h1 className="text-2xl">📝 Order Detail</h1>
      <p><strong>ID:</strong> {params?.id}</p>
      <p><strong>Pubkey:</strong> {pubkey}</p>

      <Button
        className="bg-lime-500 text-black font-bold hover:bg-lime-600"
        onClick={handleSign}
      >
        Sign Order with Nostr
      </Button>

      {signedEvent && (
        <pre className="bg-neutral-900 p-4 mt-4 rounded overflow-auto text-sm">
          {JSON.stringify(signedEvent, null, 2)}
        </pre>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}
