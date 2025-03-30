'use client'
import { useAuthGuard } from '@/lib/useAuth'
import Header from '@/components/header'

export default function Dashboard() {
  useAuthGuard()

  return (
    <>
        <div className="min-h-screen bg-[#101010] text-white p-0 font-mono space-y-6 items-center">
            <Header/>
            <span>Welcome to your dashboard</span>
        </div>
    </>
  )
}
