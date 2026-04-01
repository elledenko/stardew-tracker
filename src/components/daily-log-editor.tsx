'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  WEATHER_OPTIONS,
  ACTIVITY_CATEGORIES,
  VILLAGERS,
  GIFT_REACTIONS,
  CROP_ACTIONS,
} from '@/lib/game-data'
import type { DailyLog, Activity, Gift, Crop } from '@/lib/types'

interface Props {
  farmId: string
  season: string
  year: number
  day: number
  existingLog: DailyLog | null
  existingActivities: Activity[]
  existingGifts: Gift[]
  existingCrops: Crop[]
}

export function DailyLogEditor({
  farmId, season, year, day,
  existingLog, existingActivities, existingGifts, existingCrops,
}: Props) {
  const supabase = createClient()
  const router = useRouter()

  const [weather, setWeather] = useState<string>(existingLog?.weather || 'Sunny')
  const [goldEarned, setGoldEarned] = useState(existingLog?.gold_earned || 0)
  const [goldSpent, setGoldSpent] = useState(existingLog?.gold_spent || 0)
  const [energyUsed, setEnergyUsed] = useState(existingLog?.energy_used || 0)
  const [notes, setNotes] = useState(existingLog?.notes || '')
  const [saving, setSaving] = useState(false)
  const [logId, setLogId] = useState(existingLog?.id || null)

  // Activities state
  const [activities, setActivities] = useState<Activity[]>(existingActivities)
  const [newActivityCategory, setNewActivityCategory] = useState('farming')
  const [newActivityDesc, setNewActivityDesc] = useState('')

  // Gifts state
  const [gifts, setGifts] = useState<Gift[]>(existingGifts)
  const [newGiftVillager, setNewGiftVillager] = useState('Abigail')
  const [newGiftItem, setNewGiftItem] = useState('')
  const [newGiftReaction, setNewGiftReaction] = useState('neutral')

  // Crops state
  const [crops, setCrops] = useState<Crop[]>(existingCrops)
  const [newCropName, setNewCropName] = useState('')
  const [newCropQty, setNewCropQty] = useState(1)
  const [newCropAction, setNewCropAction] = useState('planted')

  const ensureLog = useCallback(async (): Promise<string | null> => {
    if (logId) return logId

    const { data, error } = await supabase
      .from('daily_logs')
      .insert({
        farm_id: farmId,
        season,
        day,
        year,
        weather,
        gold_earned: goldEarned,
        gold_spent: goldSpent,
        energy_used: energyUsed,
        notes,
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error creating log:', error)
      return null
    }

    setLogId(data.id)
    return data.id
  }, [logId, supabase, farmId, season, day, year, weather, goldEarned, goldSpent, energyUsed, notes])

  async function handleSaveLog() {
    setSaving(true)
    if (logId) {
      await supabase
        .from('daily_logs')
        .update({ weather, gold_earned: goldEarned, gold_spent: goldSpent, energy_used: energyUsed, notes, updated_at: new Date().toISOString() })
        .eq('id', logId)
    } else {
      await ensureLog()
    }
    setSaving(false)
    router.refresh()
  }

  async function addActivity() {
    if (!newActivityDesc.trim()) return
    const currentLogId = await ensureLog()
    if (!currentLogId) return

    const { data, error } = await supabase
      .from('activities')
      .insert({ log_id: currentLogId, category: newActivityCategory, description: newActivityDesc })
      .select()
      .single()

    if (!error && data) {
      setActivities([...activities, data])
      setNewActivityDesc('')
    }
  }

  async function toggleActivity(id: string, completed: boolean) {
    await supabase.from('activities').update({ completed: !completed }).eq('id', id)
    setActivities(activities.map((a) => a.id === id ? { ...a, completed: !completed } : a))
  }

  async function deleteActivity(id: string) {
    await supabase.from('activities').delete().eq('id', id)
    setActivities(activities.filter((a) => a.id !== id))
  }

  async function addGift() {
    if (!newGiftItem.trim()) return
    const currentLogId = await ensureLog()
    if (!currentLogId) return

    const { data, error } = await supabase
      .from('gifts')
      .insert({ log_id: currentLogId, villager: newGiftVillager, item: newGiftItem, reaction: newGiftReaction })
      .select()
      .single()

    if (!error && data) {
      setGifts([...gifts, data])
      setNewGiftItem('')
    }
  }

  async function deleteGift(id: string) {
    await supabase.from('gifts').delete().eq('id', id)
    setGifts(gifts.filter((g) => g.id !== id))
  }

  async function addCrop() {
    if (!newCropName.trim()) return
    const currentLogId = await ensureLog()
    if (!currentLogId) return

    const { data, error } = await supabase
      .from('crops')
      .insert({ log_id: currentLogId, crop_name: newCropName, quantity: newCropQty, action: newCropAction })
      .select()
      .single()

    if (!error && data) {
      setCrops([...crops, data])
      setNewCropName('')
      setNewCropQty(1)
    }
  }

  async function deleteCrop(id: string) {
    await supabase.from('crops').delete().eq('id', id)
    setCrops(crops.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Day Overview */}
      <section className="bg-gray-900 rounded-xl border border-gray-800 p-5">
        <h2 className="text-lg font-semibold mb-4">Day Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Weather</label>
            <select
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              {WEATHER_OPTIONS.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Gold Earned</label>
            <input
              type="number"
              min={0}
              value={goldEarned}
              onChange={(e) => setGoldEarned(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Gold Spent</label>
            <input
              type="number"
              min={0}
              value={goldSpent}
              onChange={(e) => setGoldSpent(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Energy Used</label>
            <input
              type="number"
              min={0}
              value={energyUsed}
              onChange={(e) => setEnergyUsed(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="What happened today on the farm?"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-500 resize-none"
          />
        </div>
        <button
          onClick={handleSaveLog}
          disabled={saving}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 text-white rounded-lg font-medium transition-colors"
        >
          {saving ? 'Saving...' : logId ? 'Update Day' : 'Save Day'}
        </button>
      </section>

      {/* Activities */}
      <section className="bg-gray-900 rounded-xl border border-gray-800 p-5">
        <h2 className="text-lg font-semibold mb-4">Activities</h2>

        {activities.length > 0 && (
          <div className="space-y-2 mb-4">
            {activities.map((activity) => {
              const cat = ACTIVITY_CATEGORIES.find((c) => c.value === activity.category)
              return (
                <div key={activity.id} className="flex items-center gap-3 bg-gray-800/50 rounded-lg px-3 py-2">
                  <button
                    onClick={() => toggleActivity(activity.id, activity.completed)}
                    className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      activity.completed
                        ? 'bg-green-600 border-green-500 text-white'
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {activity.completed && '✓'}
                  </button>
                  <span className="text-sm">{cat?.icon}</span>
                  <span className={`flex-1 text-sm ${activity.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                    {activity.description}
                  </span>
                  <button onClick={() => deleteActivity(activity.id)} className="text-gray-500 hover:text-red-400 text-sm">✕</button>
                </div>
              )
            })}
          </div>
        )}

        <div className="flex gap-2">
          <select
            value={newActivityCategory}
            onChange={(e) => setNewActivityCategory(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            {ACTIVITY_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
            ))}
          </select>
          <input
            type="text"
            value={newActivityDesc}
            onChange={(e) => setNewActivityDesc(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addActivity()}
            placeholder="What did you do?"
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-500"
          />
          <button
            onClick={addActivity}
            className="px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Add
          </button>
        </div>
      </section>

      {/* Gifts */}
      <section className="bg-gray-900 rounded-xl border border-gray-800 p-5">
        <h2 className="text-lg font-semibold mb-4">Gifts Given</h2>

        {gifts.length > 0 && (
          <div className="space-y-2 mb-4">
            {gifts.map((gift) => {
              const reaction = GIFT_REACTIONS.find((r) => r.value === gift.reaction)
              return (
                <div key={gift.id} className="flex items-center gap-3 bg-gray-800/50 rounded-lg px-3 py-2">
                  <span className="text-sm font-medium text-gray-200 w-24">{gift.villager}</span>
                  <span className="flex-1 text-sm text-gray-300">{gift.item}</span>
                  <span className="text-sm">{reaction?.icon} {reaction?.label}</span>
                  <button onClick={() => deleteGift(gift.id)} className="text-gray-500 hover:text-red-400 text-sm">✕</button>
                </div>
              )
            })}
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <select
            value={newGiftVillager}
            onChange={(e) => setNewGiftVillager(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            {VILLAGERS.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          <input
            type="text"
            value={newGiftItem}
            onChange={(e) => setNewGiftItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addGift()}
            placeholder="Item gifted"
            className="flex-1 min-w-[120px] px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-500"
          />
          <select
            value={newGiftReaction}
            onChange={(e) => setNewGiftReaction(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            {GIFT_REACTIONS.map((r) => (
              <option key={r.value} value={r.value}>{r.icon} {r.label}</option>
            ))}
          </select>
          <button
            onClick={addGift}
            className="px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Add
          </button>
        </div>
      </section>

      {/* Crops */}
      <section className="bg-gray-900 rounded-xl border border-gray-800 p-5">
        <h2 className="text-lg font-semibold mb-4">Crops</h2>

        {crops.length > 0 && (
          <div className="space-y-2 mb-4">
            {crops.map((crop) => {
              const action = CROP_ACTIONS.find((a) => a.value === crop.action)
              return (
                <div key={crop.id} className="flex items-center gap-3 bg-gray-800/50 rounded-lg px-3 py-2">
                  <span className="text-sm">{action?.icon}</span>
                  <span className="flex-1 text-sm text-gray-200">{crop.crop_name}</span>
                  <span className="text-sm text-gray-400">×{crop.quantity}</span>
                  <span className="text-sm text-gray-400">{action?.label}</span>
                  <button onClick={() => deleteCrop(crop.id)} className="text-gray-500 hover:text-red-400 text-sm">✕</button>
                </div>
              )
            })}
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            value={newCropName}
            onChange={(e) => setNewCropName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCrop()}
            placeholder="Crop name"
            className="flex-1 min-w-[120px] px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-500"
          />
          <input
            type="number"
            min={1}
            value={newCropQty}
            onChange={(e) => setNewCropQty(parseInt(e.target.value) || 1)}
            className="w-16 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <select
            value={newCropAction}
            onChange={(e) => setNewCropAction(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            {CROP_ACTIONS.map((a) => (
              <option key={a.value} value={a.value}>{a.icon} {a.label}</option>
            ))}
          </select>
          <button
            onClick={addCrop}
            className="px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Add
          </button>
        </div>
      </section>
    </div>
  )
}
