import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Farm } from '@/lib/types'
import { LogoutButton } from '@/components/logout-button'
import { NewFarmForm } from '@/components/new-farm-form'

const SEASON_ICONS: Record<string, string> = {
  Spring: '/img/weather/spring.png',
  Summer: '/img/weather/summer.png',
  Fall: '/img/weather/fall.png',
  Winter: '/img/weather/winter.png',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: farms } = await supabase
    .from('farms')
    .select('*')
    .order('updated_at', { ascending: false })

  return (
    <div className="min-h-screen">
      <header className="sdv-panel rounded-none border-x-0 border-t-0">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="pixel-heading text-sm text-[#ffd700]">Stardew Tracker</h1>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="pixel-heading text-base text-[#ffd700] mb-6">Your Farms</h2>

        {farms && farms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {farms.map((farm: Farm) => (
              <Link
                key={farm.id}
                href={`/farm/${farm.id}`}
                className="sdv-panel p-5 hover:border-[#c4a265] transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src={SEASON_ICONS[farm.current_season] || SEASON_ICONS.Spring}
                    alt={farm.current_season}
                    width={20}
                    height={20}
                    className="pixelated"
                  />
                  <h3 className="text-xl text-[#ffd700] group-hover:text-[#ffeb3b] transition-colors">{farm.name}</h3>
                </div>
                <div className="text-lg text-[#a89070] space-y-0.5">
                  <p>Farmer: {farm.farmer_name}</p>
                  <p>{farm.farm_type} Farm</p>
                  <p className="text-[#c4a265]">{farm.current_season} {farm.current_day}, Year {farm.current_year}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-xl text-[#a89070] mb-8">No farms yet. Create your first one below!</p>
        )}

        <div className="sdv-panel p-6">
          <h3 className="pixel-heading text-xs text-[#ffd700] mb-4">New Farm</h3>
          <NewFarmForm />
        </div>
      </main>
    </div>
  )
}
