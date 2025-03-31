'use client';

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
    const orderId = crypto.randomUUID()
    const tags: string[][] = [['d', orderId]]

    const rumorContent = [
      {
        order: {
          version: 1,
          action: 'new-order',
          trade_index: 1,
          payload: {
            order: {
              kind: order.type,
              status: 'pending',
              amount: 0,
              fiat_code: order.fiat_code,
              fiat_amount: order.amount,
              payment_method: order.payment_method,
              premium: order.premium,
              created_at: now
            }
          }
        }
      }
    ]

    const encoded = JSON.stringify(rumorContent)
    const hash = sha256(new TextEncoder().encode(encoded))
    const sigRaw = await signAsync(hash, hexToBytes(privkey))
    const r = sigRaw.r.toString(16).padStart(64, '0')
    const s = sigRaw.s.toString(16).padStart(64, '0')
    const sig = bytesToHex(new Uint8Array([...hexToBytes(r), ...hexToBytes(s)]))

    rumorContent.push({
      order: {
        version: 1,
        action: 'signature',
        trade_index: rumorContent.length,
        payload: {
          order: {
            kind: 'signature',
            status: 'signed',
            amount: 0,
            fiat_code: '',
            fiat_amount: 0,
            payment_method: '',
            premium: 0,
            created_at: now
          }
        }
      }
    })

    const content = JSON.stringify(rumorContent)
    const serialized = [0, pubkey, now, 38383, tags, content]
    const eventHash = sha256(new TextEncoder().encode(JSON.stringify(serialized)))
    const id = bytesToHex(eventHash)

    const fullEvent: NostrEvent = {
      kind: 38383,
      created_at: now,
      tags,
      content,
      pubkey,
      id,
      sig
    }

    const RELAY = process.env.NEXT_PUBLIC_RELAY_URL
    if (!RELAY) {
      setStatus('Relay URL is not defined')
      return null
    }

    const socket = new WebSocket(RELAY)

    socket.onopen = () => {
      socket.send(JSON.stringify(['EVENT', fullEvent]))
      setStatus('Order sent')
      socket.close()
    }

    socket.onerror = () => {
      setStatus('Relay connection error')
    }

    return orderId
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