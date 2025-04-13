'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import * as bip39 from 'bip39'
import { bytesToHex } from '@noble/hashes/utils'
import { getPublicKey } from '@noble/secp256k1'
import { nip19 } from 'nostr-tools'

export default function Register() {
  const [mnemonic, setMnemonic] = useState('')
  const [privkey, setPrivkey] = useState('')
  const [npub, setNpub] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const router = useRouter()

  const generateKey = async () => {
    const mnemonicPhrase = bip39.generateMnemonic()
    const seed = await bip39.mnemonicToSeed(mnemonicPhrase)
    const privateKeyBytes = seed.slice(0, 32)
    const privateKeyHex = bytesToHex(privateKeyBytes)
    const pubkeyBytes = getPublicKey(privateKeyHex, true)
    const pubkeyHex = bytesToHex(pubkeyBytes)
    const npubFormat = nip19.npubEncode(pubkeyHex)

    setMnemonic(mnemonicPhrase)
    setPrivkey(privateKeyHex)
    setNpub(npubFormat)

    localStorage.setItem('nostr-mnemonic', mnemonicPhrase)
    localStorage.setItem('nostr-privkey', privateKeyHex)
    localStorage.setItem('nostr-pubkey', pubkeyHex)
    localStorage.setItem('nostr-npub', npubFormat)
  }

  const handleCopy = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return
    try {
      await navigator.clipboard.writeText(mnemonic)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Clipboard error:', err)
    }
  }

 const handleLogin = async () => {
    try {
      if (!mnemonic || !privkey || !npub) {
        setError('You must generate and save your keys first.')
        return
      }
      router.push(`/`)
    } catch (err) {
      console.error(err)
      setError('Failed to login with provided mnemonic.')
    }
  }

  return (
    <div>
      <Button className="bg-lime-500 text-black hover:bg-white cursor-pointer w-full lg:w-1/3" onClick={generateKey}>
        Generate Key
      </Button>

      {privkey && (
        <>
          <div className="bg-[#111] text-white border border-gray-500 p-4 rounded-xl space-y-2 mt-8 py-8 lg:w-1/3 mx-auto">
            <p className="font-semibold">Your Mnemonic is:</p>
            <p className="break-words text-xl p-8 w-full text-center border border-gray-500 rounded-xl">{mnemonic}</p>
            <Button onClick={handleCopy} variant="outline" className="w-full bg-white text-black border-white cursor-pointer">
              {copied ? '✓ Copied' : 'Copy Phrase'}
            </Button>
            <p className="text-xs italic text-gray-500">This phrase gives full access. Back it up safely.</p>

            <div className="mt-8">
              <p><strong>Nostr ID (npub):</strong></p>
              <p className="break-words text-sm my-4 border border-gray-500 rounded-sm p-2">{npub}</p>
              <p><strong>Private Key:</strong></p>
              <p className="break-words text-sm my-4 border border-gray-500 rounded-sm p-2">{privkey}</p>
            </div>
          </div>

          <div>
            <Button onClick={handleLogin} className="bg-lime-500 text-black font-bold my-4 lg:w-1/3 cursor-pointer hover:bg-white">
              Mnemonic saved safely! Let&apos;s go!
            </Button>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </>
      )}
    </div>
  )
}
