import { Upgrade } from './legalGame'

export const AVAILABLE_UPGRADES: Upgrade[] = [
  // Сила
  {
    id: 'strength_xp_boost',
    name: 'Усиленная тренировка',
    description: 'Увеличивает опыт за клик на 10%',
    category: 'strength',
    level: 0,
    maxLevel: 10,
    cost: 1,
    effect: (level) => 1 + level * 0.1,
  },
  {
    id: 'strength_autoclicker',
    name: 'Помощник',
    description: 'Автоматически кликает раз в секунду',
    category: 'strength',
    level: 0,
    maxLevel: 5,
    cost: 2,
    effect: (level) => level, // Уровень = количество автокликов в секунду
  },
  {
    id: 'strength_xp_reduction',
    name: 'Эффективность',
    description: 'Уменьшает требуемый опыт на 5%',
    category: 'strength',
    level: 0,
    maxLevel: 10,
    cost: 1,
    effect: (level) => 1 - level * 0.05,
  },
  
  // Ловкость
  {
    id: 'agility_target_time',
    name: 'Замедление времени',
    description: 'Увеличивает время появления цели на 10%',
    category: 'agility',
    level: 0,
    maxLevel: 10,
    cost: 1,
    effect: (level) => 1 + level * 0.1,
  },
  {
    id: 'agility_xp_boost',
    name: 'Точность',
    description: 'Увеличивает опыт за попадание на 20%',
    category: 'agility',
    level: 0,
    maxLevel: 5,
    cost: 2,
    effect: (level) => 1 + level * 0.2,
  },
  {
    id: 'agility_xp_reduction',
    name: 'Навык',
    description: 'Уменьшает требуемый опыт на 5%',
    category: 'agility',
    level: 0,
    maxLevel: 10,
    cost: 1,
    effect: (level) => 1 - level * 0.05,
  },
  
  // Интеллект
  {
    id: 'intellect_time_boost',
    name: 'Размышление',
    description: 'Добавляет 5 секунд на ответ',
    category: 'intellect',
    level: 0,
    maxLevel: 5,
    cost: 2,
    effect: (level) => level * 5,
  },
  {
    id: 'intellect_hint',
    name: 'Подсказка',
    description: 'Подсвечивает правильный ответ через 5 секунд',
    category: 'intellect',
    level: 0,
    maxLevel: 1,
    cost: 3,
    effect: (level) => level,
  },
  {
    id: 'intellect_xp_boost',
    name: 'Эрудиция',
    description: 'Увеличивает опыт за правильный ответ на 15%',
    category: 'intellect',
    level: 0,
    maxLevel: 10,
    cost: 1,
    effect: (level) => 1 + level * 0.15,
  },
  
  // Общие
  {
    id: 'energy_max',
    name: 'Выносливость',
    description: 'Увеличивает максимальную энергию на 10',
    category: 'general',
    level: 0,
    maxLevel: 20,
    cost: 2,
    effect: (level) => level * 10,
  },
  {
    id: 'energy_regen',
    name: 'Восстановление',
    description: 'Ускоряет восстановление энергии на 5%',
    category: 'general',
    level: 0,
    maxLevel: 10,
    cost: 2,
    effect: (level) => 1 + level * 0.05,
  },
  {
    id: 'coins_boost',
    name: 'Доходы',
    description: 'Увеличивает получаемые монеты на 10%',
    category: 'general',
    level: 0,
    maxLevel: 10,
    cost: 1,
    effect: (level) => 1 + level * 0.1,
  },
]

export function getUpgrade(id: string): Upgrade | undefined {
  return AVAILABLE_UPGRADES.find(u => u.id === id)
}

export function getUpgradesByCategory(category: 'strength' | 'agility' | 'intellect' | 'general'): Upgrade[] {
  return AVAILABLE_UPGRADES.filter(u => u.category === category)
}

export function canAffordUpgrade(stats: { coins: number; upgrades?: Upgrade[] }, upgrade: Upgrade): boolean {
  const currentLevel = stats.upgrades?.find(u => u.id === upgrade.id)?.level || 0
  if (currentLevel >= upgrade.maxLevel) return false
  const cost = upgrade.cost * (currentLevel + 1)
  return stats.coins >= cost
}

export function applyUpgradeEffect(upgradeId: string, level: number, baseValue: number): number {
  const upgrade = getUpgrade(upgradeId)
  if (!upgrade) return baseValue
  return baseValue * upgrade.effect(level)
}
