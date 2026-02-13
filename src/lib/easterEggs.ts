/** Пасхальное яйцо */
export type EasterEgg = {
  id: string
  name: string
  hint: string
  /** Как найти (описание действия) */
  howToFind: string
  reward: string
}

/** 19 пасхальных яиц */
export const EASTER_EGGS: EasterEgg[] = [
  { id: 'egg_1', name: 'Скрытое сердечко', hint: 'Найди сердечко в неожиданном месте', howToFind: 'Кликни на сердечко в заголовке 7 раз подряд', reward: 'theme_soft' },
  { id: 'egg_2', name: 'Тайный код', hint: 'Попробуй ввести код в консоли', howToFind: 'Открой консоль браузера (F12) и введи: petr()', reward: 'confetti' },
  { id: 'egg_3', name: 'Секретная комбинация', hint: 'Комбинация клавиш откроет секрет', howToFind: 'Нажми Ctrl+Shift+P на главной странице', reward: 'hearts_more' },
  { id: 'egg_4', name: 'Скрытый текст', hint: 'Ищи невидимый текст на странице', howToFind: 'Выдели весь текст на странице фактов', reward: 'sparkle' },
  { id: 'egg_5', name: 'Двойной клик', hint: 'Двойной клик по фото откроет секрет', howToFind: 'Двойной клик по фото Петра в галерее', reward: 'glow_cards' },
  { id: 'egg_6', name: 'Таймер', hint: 'Подожди определённое время', howToFind: 'Оставайся на странице договора 30 секунд без действий', reward: 'theme_gold' },
  { id: 'egg_7', name: 'Обратный порядок', hint: 'Попробуй делать всё наоборот', howToFind: 'Прокрути страницу снизу вверх 10 раз', reward: 'confetti' },
  { id: 'egg_8', name: 'Секретная кнопка', hint: 'Кнопка спрятана в футере', howToFind: 'Кликни 5 раз по тексту футера', reward: 'hearts_more' },
  { id: 'egg_9', name: 'Код Коннами', hint: 'Легендарная комбинация', howToFind: 'Введи код Коннами: ↑↑↓↓←→←→BA', reward: 'theme_soft' },
  { id: 'egg_10', name: 'Тройной тап', hint: 'Три быстрых тапа по экрану', howToFind: 'Тройной тап по заголовку "Пётр"', reward: 'sparkle' },
  { id: 'egg_11', name: 'Секретная зона: Комбинация', hint: 'В секрете попробуй комбинацию', howToFind: 'В секретной зоне нажми все кнопки игр по порядку', reward: 'confetti_rainbow' },
  { id: 'egg_13', name: 'Секретная зона: Все игры', hint: 'Сыграй во все игры подряд', howToFind: 'Запусти все игры в секрете без возврата', reward: 'theme_cool' },
  { id: 'egg_14', name: 'Секретная зона: Идеальный результат', hint: 'Набери 100% во всех викторинах', howToFind: 'Пройди все викторины на 100%', reward: 'rainbow_hearts' },
  { id: 'egg_15', name: 'URL магия', hint: 'Попробуй изменить URL', howToFind: 'Добавь ?secret=petr в конец URL', reward: 'stars_bg' },
  { id: 'egg_16', name: 'Локальное хранилище', hint: 'Проверь localStorage', howToFind: 'В консоли выполни: localStorage.setItem("petr-easter", "found")', reward: 'theme_cool' },
  { id: 'egg_17', name: 'Комбинация действий', hint: 'Выполни действия в правильном порядке', howToFind: 'Открой факт → Открой открытку → Подпиши договор → Оставь пожелание', reward: 'glow_cards' },
  { id: 'egg_18', name: 'Секретная зона: Мастер', hint: 'Стань мастером секрета', howToFind: 'Выполни все секретные достижения', reward: 'rainbow_hearts' },
  { id: 'egg_19', name: 'Абсолютное яйцо', hint: 'Найди все остальные яйца', howToFind: 'Найди все 18 предыдущих яиц', reward: 'confetti_rainbow' },
]

const STORAGE_KEY = 'petr-easter-eggs'

export function getFoundEggs(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

export function findEgg(id: string): boolean {
  const list = getFoundEggs()
  if (list.includes(id)) return false
  const next = [...list, id]
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    return true
  } catch {
    return false
  }
}

/** Подсказка показывается каждые 5 достижений - теперь показывает явную инструкцию */
export function getHintForAchievementCount(count: number): string | null {
  const eggIndex = Math.floor(count / 5) - 1
  if (eggIndex >= 0 && eggIndex < EASTER_EGGS.length) {
    const found = getFoundEggs()
    const egg = EASTER_EGGS[eggIndex]
    if (!found.includes(egg.id)) {
      return egg.howToFind // Используем явную инструкцию вместо подсказки
    }
  }
  return null
}
