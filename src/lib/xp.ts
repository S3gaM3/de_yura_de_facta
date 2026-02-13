/** Система опыта и уровней */
const STORAGE_KEY = 'petr-xp'
const XP_PER_LEVEL = 100

export type XPData = {
  total: number
  level: number
  currentLevelXP: number
  nextLevelXP: number
}

export function getXP(): XPData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      const total = typeof data.total === 'number' ? data.total : 0
      return calculateLevel(total)
    }
  } catch {
    // ignore
  }
  return { total: 0, level: 1, currentLevelXP: 0, nextLevelXP: XP_PER_LEVEL }
}

function calculateLevel(total: number): XPData {
  const level = Math.floor(total / XP_PER_LEVEL) + 1
  const currentLevelXP = total % XP_PER_LEVEL
  const nextLevelXP = XP_PER_LEVEL
  return { total, level, currentLevelXP, nextLevelXP }
}

export function addXP(amount: number): XPData {
  const current = getXP()
  const newTotal = current.total + amount
  const newData = calculateLevel(newTotal)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ total: newTotal }))
  } catch {
    // ignore
  }
  return newData
}

/** XP за действия (усложнено - только за реальные достижения) */
export const XP_REWARDS = {
  scroll: 0, // Убрано - слишком легко
  heartClick: 0, // Убрано - слишком легко
  factOpen: 0, // Убрано - слишком легко
  valentineOpen: 5, // Уменьшено
  contractSign: 8, // Уменьшено
  wishAdd: 3, // Уменьшено
  secretEnter: 15, // Уменьшено
  quizComplete: 20, // Уменьшено
  caseOpen: 8, // Уменьшено
  pathComplete: 12, // Уменьшено
  achievement: 30, // Уменьшено
  easterEgg: 50, // Уменьшено
  mathProblemSolved: 15, // Новое - за решение задачи змейки
}
