import { Quest } from './legalGame'

export const STORY_QUESTS: Quest[] = [
  {
    id: 'story_1',
    name: 'Первые шаги',
    description: 'Пройдите 3 тренировки интеллекта',
    type: 'story',
    progress: 0,
    target: 3,
    reward: { type: 'coins', amount: 50 },
    completed: false,
  },
  {
    id: 'story_2',
    name: 'Подготовка документов',
    description: 'Натренируйте силу 500 раз',
    type: 'story',
    progress: 0,
    target: 500,
    reward: { type: 'coins', amount: 100 },
    completed: false,
  },
  {
    id: 'story_3',
    name: 'Поиск улик',
    description: 'Попадите по 50 целям в тренировке ловкости',
    type: 'story',
    progress: 0,
    target: 50,
    reward: { type: 'coins', amount: 75 },
    completed: false,
  },
  {
    id: 'story_4',
    name: 'Первый экзамен',
    description: 'Сдайте экзамен на 10 уровень',
    type: 'story',
    progress: 0,
    target: 1,
    reward: { type: 'coins', amount: 200 },
    completed: false,
  },
]

export function generateDailyQuests(): Quest[] {
  return [
    {
      id: `daily_${Date.now()}_1`,
      name: 'Ежедневная тренировка силы',
      description: 'Натренируйте силу 200 раз',
      type: 'daily',
      progress: 0,
      target: 200,
      reward: { type: 'energy', amount: 20 },
      completed: false,
    },
    {
      id: `daily_${Date.now()}_2`,
      name: 'Ежедневная тренировка интеллекта',
      description: 'Ответьте правильно на 10 вопросов',
      type: 'daily',
      progress: 0,
      target: 10,
      reward: { type: 'xp', amount: 50 },
      completed: false,
    },
    {
      id: `daily_${Date.now()}_3`,
      name: 'Ежедневная тренировка ловкости',
      description: 'Попадите по 30 целям',
      type: 'daily',
      progress: 0,
      target: 30,
      reward: { type: 'coins', amount: 25 },
      completed: false,
    },
  ]
}

export function updateQuestProgress(quest: Quest, progress: number): Quest {
  const newProgress = Math.min(quest.progress + progress, quest.target)
  return {
    ...quest,
    progress: newProgress,
    completed: newProgress >= quest.target,
  }
}

export function getQuestProgress(questId: string, stats: { activeQuests: Quest[] }): number {
  const quest = stats.activeQuests.find(q => q.id === questId)
  return quest?.progress || 0
}
