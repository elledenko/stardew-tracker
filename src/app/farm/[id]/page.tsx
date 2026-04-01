import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { SEASONS, SEASON_COLORS, SEASON_BG } from '@/lib/game-data'
import type { Farm, DailyLog } from '@/lib/types'
import { SeasonCalendar } from '@/components/season-calendar'
import { FarmHeader } from '@/components/farm-header'

export default async function FarmPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: farm } = await supabase
    .from('farms')
    .select('*')
    .eq('id', id)
    .single()

  if (!farm) notFound()

  const { data: logs } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('farm_id', id)
    .eq('year', farm.current_year)
    .order('day', { ascending: true })

  const logsBySeasonDay: Record<string, DailyLog> = {}
  logs?.forEach((log: DailyLog) => {
    logsBySeasonDay[`${log.season}-${log.day}`] = log
  })

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-200 transition-colors">
              ← Back
            </Link>
            <h1 className="text-xl font-bold">{farm.name}</h1>
          </div>
          <FarmHeader farm={farm as Farm} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-gray-400">
            {farm.farmer_name} &middot; {farm.farm_type} Farm &middot; Year {farm.current_year}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {SEASONS.map((season) => (
            <div
              key={season}
              className={`bg-gradient-to-br ${SEASON_BG[season]} bg-gray-900 rounded-xl border border-gray-800 p-5`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 rounded-full ${SEASON_COLORS[season]}`} />
                <h3 className="font-semibold text-lg">{season}</h3>
              </div>
              <SeasonCalendar
                farmId={id}
                season={season}
                year={farm.current_year}
                logs={logsBySeasonDay}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
