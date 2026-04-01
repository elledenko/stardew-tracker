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
      .insert({
        user_id: user.id,
        name,
        farmer_name: farmerName,
        farm_type: farmType,
      })

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
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="farm-name" className="block text-sm font-medium text-gray-300 mb-1">Farm Name</label>
          <input
            id="farm-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Sunshine Farm"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-500"
          />
        </div>

        <div>
          <label htmlFor="farmer-name" className="block text-sm font-medium text-gray-300 mb-1">Farmer Name</label>
          <input
            id="farmer-name"
            type="text"
            value={farmerName}
            onChange={(e) => setFarmerName(e.target.value)}
            required
            placeholder="Your character name"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-500"
          />
        </div>

        <div>
          <label htmlFor="farm-type" className="block text-sm font-medium text-gray-300 mb-1">Farm Type</label>
          <select
            id="farm-type"
            value={farmType}
            onChange={(e) => setFarmType(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {FARM_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 text-white rounded-lg font-medium transition-colors"
      >
        {loading ? 'Creating...' : 'Create Farm'}
      </button>
    </form>
  )
}
