import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { SEASON_COLORS } from '@/lib/game-data'
import { DailyLogEditor } from '@/components/daily-log-editor'

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

  const { data: farm } = await supabase
    .from('farms')
    .select('*')
    .eq('id', id)
    .single()

  if (!farm) notFound()

  // Get or prepare the daily log
  const { data: existingLog } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('farm_id', id)
    .eq('season', season)
    .eq('year', year)
    .eq('day', day)
    .single()

  // Get related data if log exists
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
      <header className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href={`/farm/${id}`} className="text-gray-400 hover:text-gray-200 transition-colors">
            ← {farm.name}
          </Link>
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${SEASON_COLORS[season] || 'bg-gray-500'}`} />
            <span className="font-semibold">{season} {day}, Year {year}</span>
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
