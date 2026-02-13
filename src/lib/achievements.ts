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

/** Все достижения */
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_scroll', name: 'Первый скролл', description: 'Прокрутил страницу', reward: 'confetti', zone: 'main' },
  { id: 'heart_click', name: 'Сердечко', description: 'Нажал на сердечко', reward: 'hearts_more', zone: 'main' },
  { id: 'open_valentine', name: 'Открытка', description: 'Открыл открытку от коллектива', reward: 'theme_soft', zone: 'main' },
  { id: 'sign_contract', name: 'Подписант', description: 'Подписал договор о дружбе', reward: 'theme_gold', zone: 'main' },
  { id: 'leave_wish', name: 'На стене', description: 'Оставил пожелание на стене', reward: 'sparkle', zone: 'main' },
  { id: 'open_facts_3', name: 'Любопытный', description: 'Открыл 3 факта', reward: 'glow_cards', zone: 'main' },
  { id: 'enter_secret', name: 'Потайная дверь', description: 'Попал в секретную зону', reward: 'secret_theme', zone: 'secret' },
  { id: 'quiz_done', name: 'Эрудит', description: 'Прошёл викторину до конца', reward: 'confetti_rainbow', zone: 'secret' },
  { id: 'case_opened', name: 'Кейсер', description: 'Открыл кейс', reward: 'stars_bg', zone: 'secret' },
  { id: 'path_done', name: 'Путник', description: 'Прошёл «Выбери путь» до конца', reward: 'theme_cool', zone: 'secret' },
  { id: 'quizzes_3', name: 'Знаток', description: 'Прошёл 3 викторины в секрете', reward: 'rainbow_hearts', zone: 'secret' },
]

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
