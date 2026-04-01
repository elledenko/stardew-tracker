import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { SEASONS } from '@/lib/game-data'
import type { Farm, DailyLog } from '@/lib/types'
import { SeasonCalendar } from '@/components/season-calendar'
import { FarmHeader } from '@/components/farm-header'

const SEASON_ICONS: Record<string, string> = {
  Spring: '/img/weather/spring.png',
  Summer: '/img/weather/summer.png',
  Fall: '/img/weather/fall.png',
  Winter: '/img/weather/winter.png',
}

const SEASON_BG: Record<string, string> = {
  Spring: 'from-[#2d4a1a]/30',
  Summer: 'from-[#4a3a1a]/30',
  Fall: 'from-[#4a2a1a]/30',
  Winter: 'from-[#1a2a4a]/30',
}

export default async function FarmPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: farm } = await supabase.from('farms').select('*').eq('id', id).single()
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
      <header className="sdv-panel rounded-none border-x-0 border-t-0">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-lg text-[#a89070] hover:text-[#ffd700] transition-colors">
              ← Back
            </Link>
            <h1 className="pixel-heading text-sm text-[#ffd700]">{farm.name}</h1>
          </div>
          <FarmHeader farm={farm as Farm} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6 text-lg text-[#a89070]">
          {farm.farmer_name} · {farm.farm_type} Farm · Year {farm.current_year}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {SEASONS.map((season) => (
            <div key={season} className={`sdv-panel p-5 bg-gradient-to-br ${SEASON_BG[season]} to-transparent`}>
              <div className="flex items-center gap-3 mb-4">
                <Image src={SEASON_ICONS[season]} alt={season} width={20} height={20} className="pixelated" />
                <h3 className="pixel-heading text-xs text-[#ffd700]">{season}</h3>
              </div>
              <SeasonCalendar farmId={id} season={season} year={farm.current_year} logs={logsBySeasonDay} />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
