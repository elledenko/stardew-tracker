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
      .update({ current_season: season, current_day: day, current_year: year, updated_at: new Date().toISOString() })
      .eq('id', farm.id)
    setEditing(false)
    router.refresh()
  }

  if (!editing) {
    return (
      <button onClick={() => setEditing(true)} className="text-lg text-[#c4a265] hover:text-[#ffd700] transition-colors">
        {farm.current_season} {farm.current_day}, Year {farm.current_year} — Edit
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <select value={season} onChange={(e) => setSeason(e.target.value as Farm['current_season'])} className="sdv-input text-lg py-1">
        {SEASONS.map((s) => (<option key={s} value={s}>{s}</option>))}
      </select>
      <input type="number" min={1} max={28} value={day} onChange={(e) => setDay(parseInt(e.target.value) || 1)} className="sdv-input w-16 text-lg py-1" />
      <span className="text-lg text-[#a89070]">Year</span>
      <input type="number" min={1} value={year} onChange={(e) => setYear(parseInt(e.target.value) || 1)} className="sdv-input w-16 text-lg py-1" />
      <button onClick={handleSave} className="sdv-button text-lg py-1 bg-[#4caf50] border-[#2e7d32]">Save</button>
      <button onClick={() => setEditing(false)} className="sdv-button text-lg py-1">Cancel</button>
    </div>
  )
}
