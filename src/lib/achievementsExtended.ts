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
    { name: 'Прокрутил', desc: 'Прокрутил 5 раз', reward: 'confetti' },
    { name: 'Пожелатель', desc: 'Оставил 3 пожелания', reward: 'sparkle' },
    { name: 'Договорник', desc: 'Подписал договор быстро', reward: 'theme_gold' },
    { name: 'Открыватель', desc: 'Открыл открытку за 2 сек', reward: 'theme_soft' },
    { name: 'Скроллер', desc: 'Прокрутил до конца', reward: 'confetti' },
    { name: 'Исследователь', desc: 'Посетил все секции', reward: 'glow_cards' },
    { name: 'Сердечный мастер', desc: 'Нажал сердечко 50 раз', reward: 'hearts_more' },
    { name: 'Писатель', desc: 'Оставил 10 пожеланий', reward: 'sparkle' },
    { name: 'Фотограф', desc: 'Посмотрел все фото', reward: 'glow_cards' },
    { name: 'Пунктуальный', desc: 'Зашёл в день 14.02', reward: 'theme_gold' },
    { name: 'Ночной посетитель', desc: 'Зашёл после 23:00', reward: 'theme_soft' },
    { name: 'Утренний', desc: 'Зашёл до 8:00', reward: 'confetti' },
    { name: 'Пятничный', desc: 'Зашёл в пятницу', reward: 'sparkle' },
    { name: 'Выходной', desc: 'Зашёл в выходной', reward: 'hearts_more' },
    { name: 'Быстрый', desc: 'Прокрутил быстро', reward: 'confetti' },
    { name: 'Медленный', desc: 'Прокрутил медленно', reward: 'theme_soft' },
    { name: 'Повторный', desc: 'Вернулся на сайт', reward: 'glow_cards' },
    { name: 'Постоянный', desc: 'Зашёл 5 дней подряд', reward: 'theme_gold' },
    { name: 'Любитель фактов', desc: 'Открыл факт 5 раз', reward: 'sparkle' },
    { name: 'Договорный эксперт', desc: 'Прочитал весь договор', reward: 'theme_gold' },
    { name: 'Открыточный', desc: 'Открыл открытку 3 раза', reward: 'theme_soft' },
    { name: 'Стеностроитель', desc: 'Оставил 5 пожеланий', reward: 'sparkle' },
    { name: 'Сердечный король', desc: 'Нажал сердечко 100 раз', reward: 'hearts_more' },
    { name: 'Прокрутчик', desc: 'Прокрутил 20 раз', reward: 'confetti' },
    { name: 'Исследователь фактов', desc: 'Открыл каждый факт', reward: 'glow_cards' },
    { name: 'Пожелательный', desc: 'Оставил пожелание длиннее 50 символов', reward: 'sparkle' },
    { name: 'Быстрый подписант', desc: 'Подписал договор за 5 сек', reward: 'theme_gold' },
    { name: 'Открыватель карточек', desc: 'Открыл открытку и договор', reward: 'theme_soft' },
    { name: 'Фотолюбитель', desc: 'Посмотрел фото 3 раза', reward: 'glow_cards' },
    { name: 'Скролл-мастер', desc: 'Прокрутил 50 раз', reward: 'confetti' },
    { name: 'Сердечный бог', desc: 'Нажал сердечко 500 раз', reward: 'hearts_more' },
    { name: 'Полный комплект', desc: 'Выполнил все основные действия', reward: 'glow_cards' },
  ]

  main.forEach((a) => {
    list.push({ id: `main_${mainId++}`, name: a.name, description: a.desc, reward: a.reward, zone: 'main' })
  })

  // Секретная зона (30 достижений)
  const secret = [
    { name: 'Потайная дверь', desc: 'Попал в секретную зону', reward: 'secret_theme' },
    { name: 'Эрудит', desc: 'Прошёл викторину', reward: 'confetti_rainbow' },
    { name: 'Кейсер', desc: 'Открыл кейс', reward: 'stars_bg' },
    { name: 'Путник', desc: 'Прошёл «Выбери путь»', reward: 'theme_cool' },
    { name: 'Знаток', desc: 'Прошёл 3 викторины', reward: 'rainbow_hearts' },
    { name: 'Математик', desc: 'Прошёл математическую викторину', reward: 'confetti_rainbow' },
    { name: 'Дизайнер', desc: 'Прошёл дизайн-викторину', reward: 'stars_bg' },
    { name: 'Фотограф-эксперт', desc: 'Прошёл фото-викторину', reward: 'theme_cool' },
    { name: 'Юрист', desc: 'Прошёл юриспруденцию', reward: 'rainbow_hearts' },
    { name: 'Мемолог', desc: 'Прошёл мемы и сленг', reward: 'confetti_rainbow' },
    { name: '90-е', desc: 'Прошёл сленг 90-х', reward: 'stars_bg' },
    { name: 'Кейс-мастер', desc: 'Открыл 5 кейсов', reward: 'theme_cool' },
    { name: 'Путешественник', desc: 'Прошёл путь 3 раза', reward: 'rainbow_hearts' },
    { name: 'Викторинный', desc: 'Прошёл все викторины', reward: 'confetti_rainbow' },
    { name: 'Идеальный', desc: 'Набрал 100% в викторине', reward: 'stars_bg' },
    { name: 'Быстрый', desc: 'Прошёл викторину быстро', reward: 'theme_cool' },
    { name: 'Кейс-охотник', desc: 'Открыл 10 кейсов', reward: 'rainbow_hearts' },
    { name: 'Путеводитель', desc: 'Прошёл все пути', reward: 'confetti_rainbow' },
    { name: 'Эксперт викторин', desc: 'Прошёл 10 викторин', reward: 'stars_bg' },
    { name: 'Мастер кейсов', desc: 'Открыл 20 кейсов', reward: 'theme_cool' },
    { name: 'Идеальный путь', desc: 'Прошёл путь идеально', reward: 'rainbow_hearts' },
    { name: 'Викторинный бог', desc: 'Прошёл 20 викторин', reward: 'confetti_rainbow' },
    { name: 'Кейс-легенда', desc: 'Открыл 50 кейсов', reward: 'stars_bg' },
    { name: 'Путевой мастер', desc: 'Прошёл путь 10 раз', reward: 'theme_cool' },
    { name: 'Всезнайка', desc: 'Набрал 100% в 5 викторинах', reward: 'rainbow_hearts' },
    { name: 'Секретный исследователь', desc: 'Играл во все игры', reward: 'confetti_rainbow' },
    { name: 'Секретный мастер', desc: 'Выполнил все секретные достижения', reward: 'stars_bg' },
    { name: 'Легенда секрета', desc: 'Прошёл всё в секрете', reward: 'theme_cool' },
    { name: 'Секретный бог', desc: '100% секретных достижений', reward: 'rainbow_hearts' },
    { name: 'Абсолютный секрет', desc: 'Полное освоение секрета', reward: 'confetti_rainbow' },
  ]

  secret.forEach((a) => {
    list.push({ id: `secret_${secretId++}`, name: a.name, description: a.desc, reward: a.reward, zone: 'secret' })
  })

  // Комбо и специальные (30 достижений)
  const combo = [
    { name: 'Комбо: Скролл+Сердце', desc: 'Прокрутил и нажал сердечко', reward: 'hearts_more', zone: 'main' },
    { name: 'Комбо: Открытка+Договор', desc: 'Открыл открытку и подписал', reward: 'theme_gold', zone: 'main' },
    { name: 'Комбо: Факты+Пожелания', desc: 'Открыл факт и оставил пожелание', reward: 'sparkle', zone: 'main' },
    { name: 'Комбо: Все секции', desc: 'Посетил все секции за раз', reward: 'glow_cards', zone: 'main' },
    { name: 'Комбо: Викторина+Кейс', desc: 'Прошёл викторину и открыл кейс', reward: 'confetti_rainbow', zone: 'secret' },
    { name: 'Комбо: Путь+Викторина', desc: 'Прошёл путь и викторину', reward: 'theme_cool', zone: 'secret' },
    { name: 'Комбо: Все игры', desc: 'Сыграл во все игры секрета', reward: 'rainbow_hearts', zone: 'secret' },
    { name: 'Спец: Первый день', desc: 'Зашёл в первый день', reward: 'confetti', zone: 'main' },
    { name: 'Спец: Неделя', desc: 'Заходил неделю', reward: 'theme_soft', zone: 'main' },
    { name: 'Спец: Месяц', desc: 'Заходил месяц', reward: 'theme_gold', zone: 'main' },
    { name: 'Спец: Долгожитель', desc: 'Заходил 100 дней', reward: 'glow_cards', zone: 'main' },
    { name: 'Спец: Ночной волк', desc: 'Заходил ночью 10 раз', reward: 'sparkle', zone: 'main' },
    { name: 'Спец: Ранняя пташка', desc: 'Заходил утром 10 раз', reward: 'hearts_more', zone: 'main' },
    { name: 'Спец: Пятничный', desc: 'Заходил в пятницу 5 раз', reward: 'confetti', zone: 'main' },
    { name: 'Спец: Выходной мастер', desc: 'Заходил в выходные 10 раз', reward: 'theme_soft', zone: 'main' },
    { name: 'Спец: Быстрый игрок', desc: 'Прошёл игру за минуту', reward: 'confetti_rainbow', zone: 'secret' },
    { name: 'Спец: Медленный', desc: 'Провёл час в секрете', reward: 'stars_bg', zone: 'secret' },
    { name: 'Спец: Ночной секрет', desc: 'Зашёл в секрет ночью', reward: 'theme_cool', zone: 'secret' },
    { name: 'Спец: Утренний секрет', desc: 'Зашёл в секрет утром', reward: 'rainbow_hearts', zone: 'secret' },
    { name: 'Спец: Секретный долгожитель', desc: 'Провёл 10 часов в секрете', reward: 'confetti_rainbow', zone: 'secret' },
    { name: 'Спец: Комбо мастер', desc: 'Выполнил 10 комбо', reward: 'glow_cards', zone: 'main' },
    { name: 'Спец: Секретный комбо', desc: 'Выполнил 10 секретных комбо', reward: 'stars_bg', zone: 'secret' },
    { name: 'Спец: Абсолютный комбо', desc: 'Выполнил все комбо', reward: 'theme_gold', zone: 'main' },
    { name: 'Спец: Секретный абсолют', desc: 'Выполнил все секретные комбо', reward: 'theme_cool', zone: 'secret' },
    { name: 'Спец: Легенда комбо', desc: '50 комбо достижений', reward: 'rainbow_hearts', zone: 'main' },
    { name: 'Спец: Секретная легенда', desc: '50 секретных комбо', reward: 'confetti_rainbow', zone: 'secret' },
    { name: 'Спец: Мастер времени', desc: 'Заходил в разное время', reward: 'sparkle', zone: 'main' },
    { name: 'Спец: Секретный мастер времени', desc: 'Заходил в секрет в разное время', reward: 'stars_bg', zone: 'secret' },
    { name: 'Спец: Полный комплект', desc: 'Все основные достижения', reward: 'glow_cards', zone: 'main' },
    { name: 'Спец: Секретный комплект', desc: 'Все секретные достижения', reward: 'theme_cool', zone: 'secret' },
  ]

  combo.forEach((a) => {
    list.push({ id: `combo_${comboId++}`, name: a.name, description: a.desc, reward: a.reward, zone: a.zone as 'main' | 'secret' })
  })

  return list
}

export const ACHIEVEMENTS_EXTENDED = genAchievements()
