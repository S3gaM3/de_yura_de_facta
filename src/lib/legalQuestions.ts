// База вопросов по юриспруденции

export type LegalQuestion = {
  question: string
  options: string[]
  correct: number
  difficulty: number // 1-10, где 10 - самый сложный
  category: string
}

export const LEGAL_QUESTIONS: LegalQuestion[] = [
  // Легкие вопросы (1-3)
  {
    question: 'Что означает аббревиатура ГК РФ?',
    options: ['Гражданский кодекс Российской Федерации', 'Государственный кодекс', 'Главный кодекс', 'Городской кодекс'],
    correct: 0,
    difficulty: 1,
    category: 'Основы права'
  },
  {
    question: 'С какого возраста наступает полная дееспособность в РФ?',
    options: ['16 лет', '18 лет', '21 год', '14 лет'],
    correct: 1,
    difficulty: 1,
    category: 'Гражданское право'
  },
  {
    question: 'Что такое оферта?',
    options: ['Отказ от договора', 'Предложение заключить договор', 'Расторжение договора', 'Изменение договора'],
    correct: 1,
    difficulty: 2,
    category: 'Договорное право'
  },
  {
    question: 'Какой срок исковой давности по общему правилу в РФ?',
    options: ['1 год', '3 года', '5 лет', '10 лет'],
    correct: 1,
    difficulty: 2,
    category: 'Гражданское право'
  },
  {
    question: 'Что такое акцепт?',
    options: ['Принятие оферты', 'Отказ от оферты', 'Изменение оферты', 'Отзыв оферты'],
    correct: 0,
    difficulty: 2,
    category: 'Договорное право'
  },
  {
    question: 'НДС в РФ (базовая ставка):',
    options: ['10%', '20%', '18%', '15%'],
    correct: 1,
    difficulty: 2,
    category: 'Налоговое право'
  },
  {
    question: 'ИП отвечает по обязательствам:',
    options: ['Только уставным капиталом', 'Всем своим имуществом', 'Не отвечает', 'Только прибылью'],
    correct: 1,
    difficulty: 2,
    category: 'Предпринимательское право'
  },
  {
    question: 'Что такое неустойка?',
    options: ['Штраф за нарушение договора', 'Процент по кредиту', 'Налог', 'Комиссия'],
    correct: 0,
    difficulty: 3,
    category: 'Договорное право'
  },
  {
    question: 'ООО отвечает по обязательствам:',
    options: ['Всем имуществом учредителей', 'Только уставным капиталом', 'Не отвечает', 'Только прибылью'],
    correct: 1,
    difficulty: 3,
    category: 'Корпоративное право'
  },
  {
    question: 'Что такое претензия?',
    options: ['Иск в суд', 'Требование до суда', 'Договор', 'Соглашение'],
    correct: 1,
    difficulty: 3,
    category: 'Процессуальное право'
  },
  
  // Средние вопросы (4-6)
  {
    question: 'Что означает «форс-мажор»?',
    options: ['Нарушение договора', 'Обстоятельства непреодолимой силы', 'Штраф', 'Процент'],
    correct: 1,
    difficulty: 4,
    category: 'Договорное право'
  },
  {
    question: 'Что такое доверенность?',
    options: ['Договор', 'Документ, дающий право действовать от имени', 'Соглашение', 'Иск'],
    correct: 1,
    difficulty: 4,
    category: 'Гражданское право'
  },
  {
    question: 'Что означает «регресс»?',
    options: ['Возврат', 'Обратное требование', 'Штраф', 'Процент'],
    correct: 1,
    difficulty: 4,
    category: 'Гражданское право'
  },
  {
    question: 'Что такое цессия?',
    options: ['Передача долга', 'Передача права требования', 'Расторжение', 'Изменение'],
    correct: 1,
    difficulty: 5,
    category: 'Гражданское право'
  },
  {
    question: 'Что означает «конфиденциальность» в договоре?',
    options: ['Публичность', 'Секретность информации', 'Открытость', 'Прозрачность'],
    correct: 1,
    difficulty: 5,
    category: 'Договорное право'
  },
  {
    question: 'Срок давности для оспаривания сделки по ст. 177 ГК РФ:',
    options: ['1 год', '3 года', '5 лет', '10 лет'],
    correct: 0,
    difficulty: 5,
    category: 'Гражданское право'
  },
  {
    question: 'Что такое виндикационный иск?',
    options: ['Иск о взыскании долга', 'Иск об истребовании имущества из чужого незаконного владения', 'Иск о признании права', 'Иск о возмещении вреда'],
    correct: 1,
    difficulty: 6,
    category: 'Вещное право'
  },
  {
    question: 'Что такое негаторный иск?',
    options: ['Иск об устранении нарушений права', 'Иск о взыскании долга', 'Иск о признании', 'Иск о возмещении'],
    correct: 0,
    difficulty: 6,
    category: 'Вещное право'
  },
  {
    question: 'Срок для предъявления требований кредиторам при ликвидации ООО:',
    options: ['1 месяц', '2 месяца', '3 месяца', '6 месяцев'],
    correct: 1,
    difficulty: 6,
    category: 'Корпоративное право'
  },
  
  // Сложные вопросы (7-10)
  {
    question: 'Что такое субсидиарная ответственность?',
    options: ['Дополнительная ответственность после основного должника', 'Солидарная ответственность', 'Ограниченная ответственность', 'Полная ответственность'],
    correct: 0,
    difficulty: 7,
    category: 'Гражданское право'
  },
  {
    question: 'Срок для оспаривания решения общего собрания участников ООО:',
    options: ['1 месяц', '2 месяца', '3 месяца', '6 месяцев'],
    correct: 1,
    difficulty: 7,
    category: 'Корпоративное право'
  },
  {
    question: 'Что такое эвикция?',
    options: ['Изъятие вещи у покупателя третьим лицом', 'Передача вещи', 'Возврат вещи', 'Повреждение вещи'],
    correct: 0,
    difficulty: 8,
    category: 'Договорное право'
  },
  {
    question: 'Срок для предъявления требований о недостатках товара по ст. 477 ГК РФ (если не установлен гарантийный срок):',
    options: ['В пределах разумного срока, но не более 2 лет', '1 год', '3 года', '5 лет'],
    correct: 0,
    difficulty: 8,
    category: 'Договорное право'
  },
  {
    question: 'Что такое реституция?',
    options: ['Возврат в первоначальное состояние', 'Штраф', 'Компенсация', 'Неустойка'],
    correct: 0,
    difficulty: 9,
    category: 'Гражданское право'
  },
  {
    question: 'Срок для оспаривания крупной сделки ООО:',
    options: ['1 месяц', '2 месяца', '3 месяца', '6 месяцев'],
    correct: 2,
    difficulty: 9,
    category: 'Корпоративное право'
  },
  {
    question: 'Что такое конклюдентные действия?',
    options: ['Действия, выражающие волю совершить сделку', 'Скрытые действия', 'Противоправные действия', 'Бездействие'],
    correct: 0,
    difficulty: 10,
    category: 'Гражданское право'
  },
  {
    question: 'Срок для предъявления требований о признании сделки недействительной по ст. 179 ГК РФ:',
    options: ['1 год', '3 года', '5 лет', '10 лет'],
    correct: 0,
    difficulty: 10,
    category: 'Гражданское право'
  },
]

// Получение вопросов по уровню сложности
export function getQuestionsByDifficulty(difficulty: number): LegalQuestion[] {
  return LEGAL_QUESTIONS.filter(q => q.difficulty === difficulty)
}

// Получение вопросов для уровня персонажа
export function getQuestionsForLevel(level: number): LegalQuestion[] {
  if (level < 10) {
    return LEGAL_QUESTIONS.filter(q => q.difficulty <= 3)
  } else if (level < 30) {
    return LEGAL_QUESTIONS.filter(q => q.difficulty <= 5)
  } else if (level < 60) {
    return LEGAL_QUESTIONS.filter(q => q.difficulty <= 7)
  } else {
    return LEGAL_QUESTIONS
  }
}

// Получение вопросов для экзамена
export function getExamQuestions(examLevel: number): LegalQuestion[] {
  const baseDifficulty = Math.min(Math.floor(examLevel / 10), 10)
  const questions = LEGAL_QUESTIONS.filter(q => q.difficulty >= baseDifficulty && q.difficulty <= baseDifficulty + 2)
  
  // Если вопросов недостаточно, добавляем вопросы из более широкого диапазона
  if (questions.length < 10) {
    const additional = LEGAL_QUESTIONS.filter(q => q.difficulty >= baseDifficulty - 1 && q.difficulty <= baseDifficulty + 3)
    return additional.slice(0, 10)
  }
  
  return questions.slice(0, 10)
}
