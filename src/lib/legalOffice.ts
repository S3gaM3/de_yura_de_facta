import { OfficeUpgrade } from './legalGame'

export const OFFICE_UPGRADES: OfficeUpgrade[] = [
  {
    id: 'desk',
    name: 'Улучшенный стол',
    description: '+5% к опыту силы',
    cost: 100,
    purchased: false,
    effect: 'strength_xp_5',
  },
  {
    id: 'bookshelf',
    name: 'Книжный шкаф',
    description: '+5% к опыту интеллекта',
    cost: 100,
    purchased: false,
    effect: 'intellect_xp_5',
  },
  {
    id: 'computer',
    name: 'Современный компьютер',
    description: 'Ускоряет восстановление энергии на 10%',
    cost: 150,
    purchased: false,
    effect: 'energy_regen_10',
  },
  {
    id: 'secretary',
    name: 'Секретарь',
    description: 'Автоматически выполняет часть тренировок',
    cost: 500,
    purchased: false,
    effect: 'autoclicker',
  },
  {
    id: 'chair',
    name: 'Эргономичное кресло',
    description: '+3% ко всему опыту',
    cost: 200,
    purchased: false,
    effect: 'all_xp_3',
  },
  {
    id: 'lamp',
    name: 'Настольная лампа',
    description: '+2% к опыту ловкости',
    cost: 75,
    purchased: false,
    effect: 'agility_xp_2',
  },
]

export function getOfficeUpgrade(id: string): OfficeUpgrade | undefined {
  return OFFICE_UPGRADES.find(u => u.id === id)
}

export function applyOfficeEffect(upgradeId: string, baseValue: number): number {
  const upgrade = getOfficeUpgrade(upgradeId)
  if (!upgrade || !upgrade.purchased) return baseValue
  
  switch (upgrade.effect) {
    case 'strength_xp_5':
      return baseValue * 1.05
    case 'intellect_xp_5':
      return baseValue * 1.05
    case 'agility_xp_2':
      return baseValue * 1.02
    case 'all_xp_3':
      return baseValue * 1.03
    default:
      return baseValue
  }
}
