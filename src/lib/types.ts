export type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter'
export type Weather = 'Sunny' | 'Rainy' | 'Stormy' | 'Snowy' | 'Windy' | 'Festival'
export type ActivityCategory = 'farming' | 'mining' | 'fishing' | 'foraging' | 'social' | 'combat' | 'other'
export type GiftReaction = 'love' | 'like' | 'neutral' | 'dislike' | 'hate'
export type CropAction = 'planted' | 'harvested' | 'watered' | 'died'

export interface Farm {
  id: string
  user_id: string
  name: string
  farmer_name: string
  farm_type: string
  current_season: Season
  current_year: number
  current_day: number
  created_at: string
  updated_at: string
}

export interface DailyLog {
  id: string
  farm_id: string
  season: Season
  day: number
  year: number
  gold_earned: number
  gold_spent: number
  energy_used: number
  weather: Weather
  notes: string
  created_at: string
  updated_at: string
}

export interface Activity {
  id: string
  log_id: string
  category: ActivityCategory
  description: string
  completed: boolean
  created_at: string
}

export interface Gift {
  id: string
  log_id: string
  villager: string
  item: string
  reaction: GiftReaction
  created_at: string
}

export interface Crop {
  id: string
  log_id: string
  crop_name: string
  quantity: number
  action: CropAction
  created_at: string
}
