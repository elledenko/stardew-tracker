import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SEASON_COLORS } from '@/lib/game-data'
import type { Farm } from '@/lib/types'
import { LogoutButton } from '@/components/logout-button'
import { NewFarmForm } from '@/components/new-farm-form'

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
      <header className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">
            Stardew Tracker
          </h1>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Your Farms</h2>
        </div>

        {farms && farms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {farms.map((farm: Farm) => (
              <Link
                key={farm.id}
                href={`/farm/${farm.id}`}
                className="bg-gray-900 rounded-xl p-5 border border-gray-800 hover:border-gray-600 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-3 h-3 rounded-full ${SEASON_COLORS[farm.current_season] || 'bg-gray-500'}`} />
                  <h3 className="font-semibold text-lg group-hover:text-green-400 transition-colors">{farm.name}</h3>
                </div>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>Farmer: {farm.farmer_name}</p>
                  <p>Farm Type: {farm.farm_type}</p>
                  <p>{farm.current_season} {farm.current_day}, Year {farm.current_year}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-8">No farms yet. Create your first one below!</p>
        )}

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold mb-4">New Farm</h3>
          <NewFarmForm />
        </div>
      </main>
    </div>
  )
}
