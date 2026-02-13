import { RandomEvent } from './legalGame'

export const RANDOM_EVENTS: RandomEvent[] = [
  {
    id: 'urgent_hearing',
    name: 'Срочное заседание',
    description: 'На 5 минут все тренировки дают двойной опыт',
    effect: 'double_xp',
    duration: 5 * 60 * 1000, // 5 минут
    activeUntil: null,
  },
  {
    id: 'difficult_client',
    name: 'Сложный клиент',
    description: 'Следующий экзамен требует меньше энергии',
    effect: 'exam_energy_reduction',
    duration: 60 * 60 * 1000, // 1 час
    activeUntil: null,
  },
  {
    id: 'legal_conference',
    name: 'Юридическая конференция',
    description: 'Можно обменять часть опыта одной характеристики на другую',
    effect: 'xp_exchange',
    duration: 30 * 60 * 1000, // 30 минут
    activeUntil: null,
  },
  {
    id: 'bonus_day',
    name: 'Бонусный день',
    description: '+50% ко всем наградам',
    effect: 'bonus_rewards',
    duration: 24 * 60 * 60 * 1000, // 24 часа
    activeUntil: null,
  },
]

export function getRandomEvent(): RandomEvent {
  const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)]
  return {
    ...event,
    activeUntil: Date.now() + event.duration,
  }
}

export function isEventActive(event: RandomEvent | null): boolean {
  if (!event || !event.activeUntil) return false
  return Date.now() < event.activeUntil
}

export function applyEventEffect(event: RandomEvent | null, baseValue: number): number {
  if (!isEventActive(event)) return baseValue
  
  switch (event.effect) {
    case 'double_xp':
      return baseValue * 2
    case 'bonus_rewards':
      return baseValue * 1.5
    default:
      return baseValue
  }
}
