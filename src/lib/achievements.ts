import { ACHIEVEMENTS_EXTENDED } from './achievementsExtended'

/** Достижение */
export type Achievement = {
  id: string
  name: string
  description: string
  /** id награды-эффекта (тема или анимация) */
  reward: string
  /** main | secret */
  zone: 'main' | 'secret'
}

/** Все достижения (100 штук) */
export const ACHIEVEMENTS: Achievement[] = ACHIEVEMENTS_EXTENDED

/** Награда-эффект */
export type EffectId = string

export const EFFECT_ORDER: EffectId[] = [
  'confetti',
  'hearts_more',
  'theme_soft',
  'theme_gold',
  'sparkle',
  'glow_cards',
  'secret_theme',
  'confetti_rainbow',
  'stars_bg',
  'theme_cool',
  'rainbow_hearts',
]

const STORAGE_KEY = 'petr-achievements'

export function getUnlocked(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

export function unlockAchievement(id: string): boolean {
  const list = getUnlocked()
  if (list.includes(id)) return false
  const next = [...list, id]
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    return true
  } catch {
    return false
  }
}

export function getRewardsForUnlocked(unlocked: string[]): Set<string> {
  const set = new Set<string>()
  for (const a of ACHIEVEMENTS) {
    if (unlocked.includes(a.id)) set.add(a.reward)
  }
  return set
}
