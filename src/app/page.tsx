import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-[url('/img/bg-stars.png')] bg-repeat">
      <div className="text-center max-w-2xl">
        {/* Season icons row */}
        <div className="flex justify-center gap-6 mb-6">
          {['spring', 'summer', 'fall', 'winter'].map((s) => (
            <Image key={s} src={`/img/weather/${s}.png`} alt={s} width={32} height={32} className="pixelated" />
          ))}
        </div>

        <h1 className="pixel-heading text-3xl md:text-4xl mb-4 text-[#ffd700] drop-shadow-[0_2px_0_#8b5e3c]">
          Stardew Tracker
        </h1>
        <p className="text-2xl text-[#f5e6c8] mb-2">
          Track your daily Stardew Valley progress
        </p>
        <p className="text-xl text-[#a89070] mb-8">
          Log crops, gifts, activities, gold earned — day by day, season by season.
        </p>

        <div className="flex gap-4 justify-center mb-16">
          <Link href="/signup" className="sdv-button text-xl px-8 py-3 bg-[#4caf50] border-[#2e7d32] hover:bg-[#66bb6a]">
            New Farm
          </Link>
          <Link href="/login" className="sdv-button text-xl px-8 py-3">
            Sign In
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          <div className="sdv-panel p-5">
            <div className="flex items-center gap-3 mb-3">
              <Image src="/img/weather/sunny.png" alt="calendar" width={24} height={24} className="pixelated" />
              <h3 className="pixel-heading text-xs text-[#ffd700]">Daily Logs</h3>
            </div>
            <p className="text-lg text-[#c4a265]">Track what you did each in-game day — farming, mining, fishing, and more.</p>
          </div>
          <div className="sdv-panel p-5">
            <div className="flex items-center gap-3 mb-3">
              <Image src="/img/portraits/abigail.png" alt="gifts" width={24} height={24} className="pixelated rounded" />
              <h3 className="pixel-heading text-xs text-[#ffd700]">Gift Tracker</h3>
            </div>
            <p className="text-lg text-[#c4a265]">Remember who you gifted what, and how they reacted. Never forget a birthday.</p>
          </div>
          <div className="sdv-panel p-5">
            <div className="flex items-center gap-3 mb-3">
              <Image src="/img/ui/gold.png" alt="gold" width={24} height={24} className="pixelated" />
              <h3 className="pixel-heading text-xs text-[#ffd700]">Gold Tracking</h3>
            </div>
            <p className="text-lg text-[#c4a265]">See your earnings and spending over time. Track your farm&apos;s financial health.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
