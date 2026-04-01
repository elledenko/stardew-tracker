'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { SEASONS } from '@/lib/game-data'
import type { Farm } from '@/lib/types'

export function FarmHeader({ farm }: { farm: Farm }) {
  const [editing, setEditing] = useState(false)
  const [season, setSeason] = useState(farm.current_season)
  const [day, setDay] = useState(farm.current_day)
  const [year, setYear] = useState(farm.current_year)
  const supabase = createClient()
  const router = useRouter()

  async function handleSave() {
    await supabase
      .from('farms')
      .update({
        current_season: season,
        current_day: day,
        current_year: year,
        updated_at: new Date().toISOString(),
      })
      .eq('id', farm.id)

    setEditing(false)
    router.refresh()
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="text-sm text-gray-400 hover:text-green-400 transition-colors"
      >
        {farm.current_season} {farm.current_day}, Year {farm.current_year} — Edit
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={season}
        onChange={(e) => setSeason(e.target.value as Farm['current_season'])}
        className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-gray-100"
      >
        {SEASONS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <input
        type="number"
        min={1}
        max={28}
        value={day}
        onChange={(e) => setDay(parseInt(e.target.value) || 1)}
        className="w-16 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-gray-100"
      />
      <span className="text-sm text-gray-400">Year</span>
      <input
        type="number"
        min={1}
        value={year}
        onChange={(e) => setYear(parseInt(e.target.value) || 1)}
        className="w-16 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-gray-100"
      />
      <button
        onClick={handleSave}
        className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-sm text-white transition-colors"
      >
        Save
      </button>
      <button
        onClick={() => setEditing(false)}
        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-200 transition-colors"
      >
        Cancel
      </button>
    </div>
  )
}
