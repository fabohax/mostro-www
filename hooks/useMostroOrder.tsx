import { useState } from 'react'
import { bytesToHex, hexToBytes } from '@noble/hashes/utils'
import { signAsync } from '@noble/secp256k1'
import { sha256 } from '@noble/hashes/sha256'

interface OrderPayload {
  type: string
  amount: number
  fiat_code: string
  payment_method: string
  premium: number
}

interface NostrEvent {
  kind: number
  created_at: number
  tags: string[][]
  content: string
  pubkey: string
  id: string
  sig: string
}

export function useMostroOrder() {
  const [status, setStatus] = useState<string | null>(null)

  const sendOrder = async (order: OrderPayload): Promise<string | null> => {
    const privkey = localStorage.getItem('nostr-privkey')
    const pubkey = localStorage.getItem('nostr-pubkey')

    if (!privkey || !pubkey) {
      setStatus('Missing keys')
      return null
    }

    const now = Math.floor(Date.now() / 1000)
    const content = JSON.stringify(order)
    const tags: string[][] = [['d', crypto.randomUUID()]]

    const serialized = [0, pubkey, now, 23195, tags, content]
    const encoded = JSON.stringify(serialized)
    const hash = sha256(new TextEncoder().encode(encoded))
    const id = bytesToHex(hash)

    const signatureWithRecovery = await signAsync(hash, hexToBytes(privkey))
    const r = signatureWithRecovery.r.toString(16).padStart(64, '0')
    const s = signatureWithRecovery.s.toString(16).padStart(64, '0')
    const sig = bytesToHex(new Uint8Array([...hexToBytes(r), ...hexToBytes(s)]))

    const fullEvent: NostrEvent = {
      kind: 23195,
      created_at: now,
      tags,
      content,
      pubkey,
      id,
      sig,
    }

    const socket = new WebSocket('wss://relay.mostro.network')

    socket.onopen = () => {
      socket.send(JSON.stringify(['EVENT', fullEvent]))
      setStatus('Order sent')
      socket.close()
    }

    socket.onerror = () => {
      setStatus('Relay connection error')
    }

    return id
  }

  return { sendOrder, status }
}

export function MostroOrderStatus({ status }: { status: string | null }) {
  return (
    <div className="text-sm text-center text-white font-mono mt-2">
      {status && <p>Status: {status}</p>}
    </div>
  )
}
