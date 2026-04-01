import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
          Stardew Tracker
        </h1>
        <p className="text-xl text-gray-400 mb-2">
          Track your daily Stardew Valley progress
        </p>
        <p className="text-gray-500 mb-8">
          Log crops, gifts, activities, gold earned — day by day, season by season.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/signup"
            className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg font-medium transition-colors"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="text-2xl mb-2">📅</div>
            <h3 className="font-semibold mb-1">Daily Logs</h3>
            <p className="text-sm text-gray-400">Track what you did each in-game day — farming, mining, fishing, and more.</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="text-2xl mb-2">🎁</div>
            <h3 className="font-semibold mb-1">Gift Tracker</h3>
            <p className="text-sm text-gray-400">Remember who you gifted what, and how they reacted. Never forget a birthday.</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="text-2xl mb-2">💰</div>
            <h3 className="font-semibold mb-1">Gold Tracking</h3>
            <p className="text-sm text-gray-400">See your earnings and spending over time. Track your farm&apos;s financial health.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
