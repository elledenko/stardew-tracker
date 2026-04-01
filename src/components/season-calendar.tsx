'use client'

import Link from 'next/link'
import type { DailyLog } from '@/lib/types'

interface SeasonCalendarProps {
  farmId: string
  season: string
  year: number
  logs: Record<string, DailyLog>
}

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function SeasonCalendar({ farmId, season, year, logs }: SeasonCalendarProps) {
  const days = Array.from({ length: 28 }, (_, i) => i + 1)

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS_OF_WEEK.map((d) => (
          <div key={d} className="text-center text-xs text-gray-500 py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const log = logs[`${season}-${day}`]
          const hasLog = !!log
          const goldNet = log ? log.gold_earned - log.gold_spent : 0

          return (
            <Link
              key={day}
              href={`/farm/${farmId}/log/${season}/${year}/${day}`}
              className={`
                aspect-square flex flex-col items-center justify-center rounded-lg text-sm
                transition-all hover:scale-105
                ${hasLog
                  ? 'bg-green-900/40 border border-green-700/50 text-green-300'
                  : 'bg-gray-800/50 border border-gray-700/30 text-gray-400 hover:border-gray-600'
                }
              `}
            >
              <span className="font-medium">{day}</span>
              {hasLog && (
                <span className={`text-[10px] ${goldNet >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {goldNet >= 0 ? '+' : ''}{goldNet}g
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
