import type { Achievement } from './achievements'

/** Генерация 100 достижений */
function genAchievements(): Achievement[] {
  const list: Achievement[] = []
  let mainId = 1
  let secretId = 1
  let comboId = 1

  // Основной сайт (40 достижений)
  const main = [
    { name: 'Первый скролл', desc: 'Прокрутил страницу', reward: 'confetti' },
    { name: 'Сердечко', desc: 'Нажал на сердечко', reward: 'hearts_more' },
    { name: 'Открытка', desc: 'Открыл открытку', reward: 'theme_soft' },
    { name: 'Подписант', desc: 'Подписал договор', reward: 'theme_gold' },
    { name: 'На стене', desc: 'Оставил пожелание', reward: 'sparkle' },
    { name: 'Любопытный', desc: 'Открыл 3 факта', reward: 'glow_cards' },
    { name: 'Фактолог', desc: 'Открыл все факты', reward: 'glow_cards' },
    { name: 'Сердечный', desc: 'Нажал сердечко 10 раз', reward: 'hearts_more' },
    { name: 'Пожелатель', desc: 'Оставил 3 пожелания', reward: 'sparkle' },
    { name: 'Сердечный мастер', desc: 'Нажал сердечко 50 раз', reward: 'hearts_more' },
    { name: 'Писатель', desc: 'Оставил 10 пожеланий', reward: 'sparkle' },
    { name: 'Пунктуальный', desc: 'Зашёл в день 14.02', reward: 'theme_gold' },
    { name: 'Ночной посетитель', desc: 'Зашёл после 23:00', reward: 'theme_soft' },
    { name: 'Утренний', desc: 'Зашёл до 8:00', reward: 'confetti' },
    { name: 'Пятничный', desc: 'Зашёл в пятницу', reward: 'sparkle' },
    { name: 'Выходной', desc: 'Зашёл в выходной', reward: 'hearts_more' },
    { name: 'Повторный', desc: 'Вернулся на сайт', reward: 'glow_cards' },
    { name: 'Стеностроитель', desc: 'Оставил 5 пожеланий', reward: 'sparkle' },
    { name: 'Сердечный король', desc: 'Нажал сердечко 100 раз', reward: 'hearts_more' },
    { name: 'Прокрутчик', desc: 'Прокрутил 20 раз', reward: 'confetti' },
    { name: 'Скролл-мастер', desc: 'Прокрутил 50 раз', reward: 'confetti' },
    { name: 'Сердечный бог', desc: 'Нажал сердечко 500 раз', reward: 'hearts_more' },
  ]

  main.forEach((a) => {
    list.push({ id: `main_${mainId++}`, name: a.name, description: a.desc, reward: a.reward, zone: 'main' })
  })

  // Секретная зона (только реализованные достижения)
  const secret = [
    { name: 'Потайная дверь', desc: 'Попал в секретную зону', reward: 'secret_theme' },
    { name: 'Эрудит', desc: 'Прошёл викторину', reward: 'confetti_rainbow' },
    { name: 'Кейсер', desc: 'Открыл кейс', reward: 'stars_bg' },
    { name: 'Путник', desc: 'Прошёл «Выбери путь»', reward: 'theme_cool' },
    { name: 'Знаток', desc: 'Прошёл 3 викторины', reward: 'rainbow_hearts' },
    { name: 'Игра на память', desc: 'Пройди игру на память', reward: 'confetti_rainbow' },
    { name: 'Змейка', desc: 'Пройди змейку', reward: 'stars_bg' },
    { name: 'Тест на реакцию', desc: 'Пройди тест на реакцию', reward: 'theme_cool' },
  ]

  secret.forEach((a) => {
    list.push({ id: `secret_${secretId++}`, name: a.name, description: a.desc, reward: a.reward, zone: 'secret' })
  })

  // Комбо и специальные (только реализованные)
  const combo = [
    { name: 'Второе секретное место', desc: 'Попал во второе секретное место через стену пожеланий', reward: 'theme_gold', zone: 'main' },
  ]

  combo.forEach((a) => {
    list.push({ id: `combo_${comboId++}`, name: a.name, description: a.desc, reward: a.reward, zone: a.zone as 'main' | 'secret' })
  })

  return list
}

export const ACHIEVEMENTS_EXTENDED = genAchievements()
