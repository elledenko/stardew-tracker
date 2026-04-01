export const SEASONS: string[] = ['Spring', 'Summer', 'Fall', 'Winter']

export const WEATHER_OPTIONS: string[] = ['Sunny', 'Rainy', 'Stormy', 'Snowy', 'Windy', 'Festival']

export const ACTIVITY_CATEGORIES = [
  { value: 'farming', label: 'Farming', icon: '🌾' },
  { value: 'mining', label: 'Mining', icon: '⛏️' },
  { value: 'fishing', label: 'Fishing', icon: '🎣' },
  { value: 'foraging', label: 'Foraging', icon: '🍄' },
  { value: 'social', label: 'Social', icon: '💬' },
  { value: 'combat', label: 'Combat', icon: '⚔️' },
  { value: 'other', label: 'Other', icon: '📦' },
]

export const VILLAGERS = [
  'Abigail', 'Alex', 'Caroline', 'Clint', 'Demetrius', 'Dwarf',
  'Elliott', 'Emily', 'Evelyn', 'George', 'Gus', 'Haley',
  'Harvey', 'Jas', 'Jodi', 'Kent', 'Krobus', 'Leah',
  'Leo', 'Lewis', 'Linus', 'Marnie', 'Maru', 'Pam',
  'Penny', 'Pierre', 'Robin', 'Sam', 'Sandy', 'Sebastian',
  'Shane', 'Vincent', 'Willy', 'Wizard'
]

export const GIFT_REACTIONS = [
  { value: 'love', label: 'Love', icon: '❤️' },
  { value: 'like', label: 'Like', icon: '💛' },
  { value: 'neutral', label: 'Neutral', icon: '😐' },
  { value: 'dislike', label: 'Dislike', icon: '👎' },
  { value: 'hate', label: 'Hate', icon: '💔' },
]

export const CROP_ACTIONS = [
  { value: 'planted', label: 'Planted', icon: '🌱' },
  { value: 'harvested', label: 'Harvested', icon: '🧺' },
  { value: 'watered', label: 'Watered', icon: '💧' },
  { value: 'died', label: 'Died', icon: '💀' },
]

export const FARM_TYPES = [
  'Standard', 'Riverland', 'Forest', 'Hill-top', 'Wilderness', 'Four Corners', 'Beach', 'Meadowlands'
]

export const SEASON_COLORS: Record<string, string> = {
  Spring: 'bg-green-500',
  Summer: 'bg-yellow-500',
  Fall: 'bg-orange-500',
  Winter: 'bg-blue-400',
}

export const SEASON_BG: Record<string, string> = {
  Spring: 'from-green-900/20 to-green-800/10',
  Summer: 'from-yellow-900/20 to-yellow-800/10',
  Fall: 'from-orange-900/20 to-orange-800/10',
  Winter: 'from-blue-900/20 to-blue-800/10',
}
