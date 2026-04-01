'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { FARM_TYPES } from '@/lib/game-data'

export function NewFarmForm() {
  const [name, setName] = useState('')
  const [farmerName, setFarmerName] = useState('')
  const [farmType, setFarmType] = useState('Standard')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Not logged in')
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('farms')
      .insert({ user_id: user.id, name, farmer_name: farmerName, farm_type: farmType })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setName('')
      setFarmerName('')
      setFarmType('Standard')
      setLoading(false)
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="sdv-panel-light px-4 py-2 text-[#e57373] text-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="farm-name" className="block text-lg text-[#c4a265] mb-1">Farm Name</label>
          <input
            id="farm-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
            required placeholder="Sunshine Farm" className="sdv-input w-full"
          />
        </div>
        <div>
          <label htmlFor="farmer-name" className="block text-lg text-[#c4a265] mb-1">Farmer Name</label>
          <input
            id="farmer-name" type="text" value={farmerName} onChange={(e) => setFarmerName(e.target.value)}
            required placeholder="Your character name" className="sdv-input w-full"
          />
        </div>
        <div>
          <label htmlFor="farm-type" className="block text-lg text-[#c4a265] mb-1">Farm Type</label>
          <select
            id="farm-type" value={farmType} onChange={(e) => setFarmType(e.target.value)}
            className="sdv-input w-full"
          >
            {FARM_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" disabled={loading} className="sdv-button bg-[#4caf50] border-[#2e7d32] hover:bg-[#66bb6a] disabled:opacity-50">
        {loading ? 'Creating...' : 'Create Farm'}
      </button>
    </form>
  )
}
