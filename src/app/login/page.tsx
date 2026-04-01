'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-sm sdv-panel p-8">
        <h1 className="pixel-heading text-lg text-[#ffd700] text-center mb-1">Sign In</h1>
        <p className="text-xl text-[#a89070] text-center mb-6">Welcome back, farmer</p>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="sdv-panel-light px-4 py-2 text-[#e57373] text-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-lg text-[#c4a265] mb-1">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="sdv-input w-full" />
          </div>

          <div>
            <label htmlFor="password" className="block text-lg text-[#c4a265] mb-1">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="sdv-input w-full" />
          </div>

          <button type="submit" disabled={loading} className="sdv-button w-full text-xl bg-[#4caf50] border-[#2e7d32] hover:bg-[#66bb6a] disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-4 text-center text-lg text-[#a89070]">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[#ffd700] hover:text-[#ffeb3b]">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
