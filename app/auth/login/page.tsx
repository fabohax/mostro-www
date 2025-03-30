'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import * as bip39 from 'bip39'
import { bytesToHex } from '@noble/hashes/utils'
import { getPublicKey } from '@noble/secp256k1'
import { nip19 } from 'nostr-tools'

export default function Login() {
  const [mnemonic, setMnemonic] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    try {
      if (!bip39.validateMnemonic(mnemonic.trim())) {
        setError('Invalid mnemonic phrase.')
        return
      }

      const seed = await bip39.mnemonicToSeed(mnemonic.trim())
      const privateKeyBytes = seed.slice(0, 32)
      const privkey = bytesToHex(privateKeyBytes)
      const pubkeyBytes = getPublicKey(privkey, true)
      const pubkey = bytesToHex(pubkeyBytes)
      const npub = nip19.npubEncode(pubkey)

      // Save to localStorage
      localStorage.setItem('nostr-mnemonic', mnemonic.trim())
      localStorage.setItem('nostr-privkey', privkey)
      localStorage.setItem('nostr-pubkey', pubkey)
      localStorage.setItem('nostr-npub', npub)

      router.push(`/u/${npub}`)
    } catch (err) {
      console.error(err)
      setError('Failed to login with provided mnemonic.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white w-full p-6 font-mono">
      <div className="text-center space-y-6 w-full max-w-xl">
        <h1 className="text-2xl font-bold">Login with Mnemonic</h1>
        
        <textarea
          rows={4}
          value={mnemonic}
          onChange={(e) => setMnemonic(e.target.value)}
          placeholder="Enter your 12-word mnemonic phrase here"
          className="w-full p-4 rounded bg-neutral-900 border border-neutral-700 text-white resize-none"
        />

        {error && <p className="text-red-500">{error}</p>}

        <Button
          className="bg-lime-500 text-black hover:bg-white w-full cursor-pointer"
          onClick={handleLogin}
        >
          Let&apos;s Go
        </Button>

        <p className="text-gray-500 text-sm mt-4">
          All data is stored locally in your browser. Nothing leaves your device.
        </p>
      </div>
    </div>
  )
}
