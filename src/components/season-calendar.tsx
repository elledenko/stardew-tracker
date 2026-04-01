'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { DailyLog } from '@/lib/types'

interface SeasonCalendarProps {
  farmId: string
  season: string
  year: number
  logs: Record<string, DailyLog>
}

const DAYS_OF_WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export function SeasonCalendar({ farmId, season, year, logs }: SeasonCalendarProps) {
  const days = Array.from({ length: 28 }, (_, i) => i + 1)

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS_OF_WEEK.map((d, i) => (
          <div key={i} className="text-center text-lg text-[#a89070]">{d}</div>
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
                aspect-square flex flex-col items-center justify-center transition-all hover:scale-105
                ${hasLog
                  ? 'sdv-panel-light bg-[#2d4a1a]/50 border-[#4caf50]/50'
                  : 'bg-[#1e1233]/50 border border-[#8b5e3c]/30 hover:border-[#8b5e3c]'
                }
              `}
            >
              <span className="text-lg font-bold text-[#f5e6c8]">{day}</span>
              {hasLog && (
                <span className="flex items-center gap-0.5">
                  <Image src="/img/ui/gold.png" alt="g" width={10} height={10} className="pixelated" />
                  <span className={`text-xs ${goldNet >= 0 ? 'text-[#ffd700]' : 'text-[#e57373]'}`}>
                    {goldNet >= 0 ? '+' : ''}{goldNet}
                  </span>
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
