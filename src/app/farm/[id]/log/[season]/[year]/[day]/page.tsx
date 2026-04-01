import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { DailyLogEditor } from '@/components/daily-log-editor'

const SEASON_ICONS: Record<string, string> = {
  Spring: '/img/weather/spring.png',
  Summer: '/img/weather/summer.png',
  Fall: '/img/weather/fall.png',
  Winter: '/img/weather/winter.png',
}

export default async function DailyLogPage({
  params,
}: {
  params: Promise<{ id: string; season: string; year: string; day: string }>
}) {
  const { id, season, year: yearStr, day: dayStr } = await params
  const year = parseInt(yearStr)
  const day = parseInt(dayStr)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: farm } = await supabase.from('farms').select('*').eq('id', id).single()
  if (!farm) notFound()

  const { data: existingLog } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('farm_id', id)
    .eq('season', season)
    .eq('year', year)
    .eq('day', day)
    .single()

  let activities = null
  let gifts = null
  let crops = null

  if (existingLog) {
    const [activitiesRes, giftsRes, cropsRes] = await Promise.all([
      supabase.from('activities').select('*').eq('log_id', existingLog.id).order('created_at'),
      supabase.from('gifts').select('*').eq('log_id', existingLog.id).order('created_at'),
      supabase.from('crops').select('*').eq('log_id', existingLog.id).order('created_at'),
    ])
    activities = activitiesRes.data
    gifts = giftsRes.data
    crops = cropsRes.data
  }

  return (
    <div className="min-h-screen">
      <header className="sdv-panel rounded-none border-x-0 border-t-0">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href={`/farm/${id}`} className="text-lg text-[#a89070] hover:text-[#ffd700] transition-colors">
            ← {farm.name}
          </Link>
          <div className="flex items-center gap-2">
            <Image src={SEASON_ICONS[season] || SEASON_ICONS.Spring} alt={season} width={18} height={18} className="pixelated" />
            <span className="pixel-heading text-xs text-[#ffd700]">{season} {day}, Year {year}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <DailyLogEditor
          farmId={id}
          season={season}
          year={year}
          day={day}
          existingLog={existingLog}
          existingActivities={activities || []}
          existingGifts={gifts || []}
          existingCrops={crops || []}
        />
      </main>
    </div>
  )
}
