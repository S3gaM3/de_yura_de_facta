// Система сохранения и загрузки прогресса игры

export type Upgrade = {
  id: string
  name: string
  description: string
  category: 'strength' | 'agility' | 'intellect' | 'general'
  level: number
  maxLevel: number
  cost: number
  effect: (level: number) => number
}

export type Specialization = 'civil' | 'criminal' | 'arbitration' | null

export type OfficeUpgrade = {
  id: string
  name: string
  description: string
  cost: number
  purchased: boolean
  effect: string
}

export type Quest = {
  id: string
  name: string
  description: string
  type: 'story' | 'daily' | 'special'
  progress: number
  target: number
  reward: {
    type: 'xp' | 'energy' | 'coins' | 'upgrade'
    amount: number
  }
  completed: boolean
}

export type RandomEvent = {
  id: string
  name: string
  description: string
  effect: string
  duration: number
  activeUntil: number | null
}

export type PlayerStats = {
  strength: number
  agility: number
  intellect: number
  strengthXP: number
  agilityXP: number
  intellectXP: number
  level: number
  totalXP: number
  title: string
  lastExamLevel: number
  energy: number
  maxEnergy: number
  lastEnergyUpdate: number
  coins: number
  upgrades: Upgrade[]
  specialization: Specialization
  officeUpgrades: OfficeUpgrade[]
  activeQuests: Quest[]
  completedQuests: string[]
  randomEvent: RandomEvent | null
  prestigeLevel: number
  unlockedGames: {
    strength: string[]
    agility: string[]
    intellect: string[]
  }
}

const STORAGE_KEY = 'legal-academy-progress'

const DEFAULT_STATS: PlayerStats = {
  strength: 1,
  agility: 1,
  intellect: 1,
  strengthXP: 0,
  agilityXP: 0,
  intellectXP: 0,
  level: 1,
  totalXP: 0,
  title: 'Стажёр',
  lastExamLevel: 0,
  energy: 100,
  maxEnergy: 100,
  lastEnergyUpdate: Date.now(),
  coins: 0,
  upgrades: [],
  specialization: null,
  officeUpgrades: [],
  activeQuests: [],
  completedQuests: [],
  randomEvent: null,
  prestigeLevel: 0,
  unlockedGames: {
    strength: ['clicker'],
    agility: ['targets'],
    intellect: ['quiz'],
  },
}

export function loadStats(): PlayerStats {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      const stats = { ...DEFAULT_STATS, ...parsed }
      // Обновляем энергию при загрузке
      return updateEnergy(stats)
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_STATS }
}

export function saveStats(stats: PlayerStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  } catch {
    // ignore
  }
}

// Вычисление уровня на основе характеристик
export function calculateLevel(stats: PlayerStats): number {
  const total = stats.strength + stats.agility + stats.intellect
  const baseLevel = Math.floor(1 + total / 3)
  return Math.min(baseLevel, 100) // Максимум 100 без престижа
}

// Восстановление энергии
export function updateEnergy(stats: PlayerStats): PlayerStats {
  const now = Date.now()
  const timePassed = now - stats.lastEnergyUpdate
  const energyPerMinute = 0.5 // 1 энергия в 2 минуты
  const energyGained = Math.floor((timePassed / 60000) * energyPerMinute)
  
  if (energyGained > 0) {
    const newEnergy = Math.min(stats.energy + energyGained, stats.maxEnergy)
    return {
      ...stats,
      energy: newEnergy,
      lastEnergyUpdate: now,
    }
  }
  
  return stats
}

// Получение максимальной энергии на основе уровня
export function getMaxEnergy(level: number): number {
  return 100 + Math.floor(level * 2)
}

// Получение стоимости действия
export function getActionCost(action: 'strength' | 'agility' | 'intellect'): number {
  return 1 // Базовая стоимость
}

// Проверка доступности действия
export function canPerformAction(stats: PlayerStats, cost: number): boolean {
  return stats.energy >= cost
}

// Использование энергии
export function useEnergy(stats: PlayerStats, amount: number): PlayerStats {
  return {
    ...stats,
    energy: Math.max(0, stats.energy - amount),
  }
}

// Вычисление опыта, необходимого для повышения характеристики
export function getXPRequiredForStat(currentValue: number): number {
  return 100 * (currentValue + 1)
}

// Получение титула на основе уровня
export function getTitle(level: number): string {
  if (level < 10) return 'Стажёр'
  if (level < 20) return 'Юрист'
  if (level < 30) return 'Адвокат'
  if (level < 40) return 'Старший адвокат'
  if (level < 50) return 'Партнёр'
  if (level < 60) return 'Судья'
  if (level < 70) return 'Прокурор'
  if (level < 80) return 'Юрисконсульт'
  if (level < 90) return 'Мастер права'
  if (level < 100) return 'Профессор'
  return 'Патриарх юриспруденции'
}

// Проверка, нужен ли экзамен для перехода на следующий уровень
export function needsExam(level: number): boolean {
  return level >= 9 && level % 10 === 9
}

// Получение следующего экзаменационного уровня
export function getNextExamLevel(currentLevel: number): number {
  if (currentLevel < 9) return 10
  const nextDecade = Math.floor(currentLevel / 10) * 10 + 10
  return Math.min(nextDecade, 100)
}

// Система престижа
export function canPrestige(stats: PlayerStats): boolean {
  return stats.level >= 100 && stats.prestigeLevel < 10
}

export function prestige(stats: PlayerStats): PlayerStats {
  if (!canPrestige(stats)) return stats

  return {
    ...DEFAULT_STATS,
    prestigeLevel: stats.prestigeLevel + 1,
    // Сохраняем некоторые улучшения
    upgrades: stats.upgrades,
    officeUpgrades: stats.officeUpgrades,
    specialization: stats.specialization,
    // Бонус к опыту
    coins: Math.floor(stats.coins * 0.1), // Сохраняем 10% монет
    completedQuests: [], // Сбрасываем квесты
    activeQuests: [], // Сбрасываем активные квесты
  }
}

// Разблокировка новых игр на основе уровня
export function getUnlockedGames(level: number): {
  strength: string[]
  agility: string[]
  intellect: string[]
} {
  const games = {
    strength: ['clicker'],
    agility: ['targets'],
    intellect: ['quiz'],
  }

  if (level >= 10) {
    games.strength.push('hold-clicker')
    games.agility.push('group-targets')
    games.intellect.push('multi-choice')
  }

  if (level >= 20) {
    games.strength.push('drag-documents')
    games.agility.push('moving-targets')
    games.intellect.push('matching')
  }

  if (level >= 30) {
    games.strength.push('rhythm-clicker')
    games.agility.push('maze-targets')
    games.intellect.push('essay')
  }

  if (level >= 40) {
    games.strength.push('combo-clicker')
    games.agility.push('hidden-targets')
    games.intellect.push('case-analysis')
  }

  return games
}
