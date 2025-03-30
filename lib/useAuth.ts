// lib/useAuth.ts
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useAuthGuard() {
  const router = useRouter()

  useEffect(() => {
    const pubkey = localStorage.getItem('nostr-pubkey')
    if (!pubkey) {
      router.push('/auth/login')
    }
  }, [router])
}
