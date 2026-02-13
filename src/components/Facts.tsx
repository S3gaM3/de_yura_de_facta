import { useState } from 'react'
import './Facts.css'

const FACTS = [
  'Единственный юрист в компании. Когда Пётр в отпуске, договоры подписываем глазами закрыты.',
  'На вопрос «можно ли так написать в договоре?» отвечает «можно, но не нужно» — и мы до сих пор не знаем, что это значит.',
  'Пунктуальность как у атомных часов. Если Пётр сказал «в 15:00» — в 14:59 уже смотрит на часы.',
  'Читает не только ГК РФ, но и все переписки в общем чате. Мы это знаем. Пётр, привет.',
  'На 14 февраля коллектив дарит ему не конфеты, а обещание не слать договоры в пятницу после 17:00. Хотя бы раз в год.',
  'Когда в офисе тишина, все думают: «Пётр проверяет очередной договор». И не ошибаются.',
  'Любимая фраза: «Надо переписать». Вторая по популярности: «Я же говорил».',
  'Один держит на себе юридическую ответственность всей компании. Мы его ценим. И стебём. Немного.',
]

type FactsProps = {
  onConfetti: () => void
  onFactOpen?: (openedCount: number) => void
}

export function Facts({ onConfetti, onFactOpen }: FactsProps) {
  const [revealed, setRevealed] = useState<number | null>(null)
  const [openedSet, setOpenedSet] = useState<Set<number>>(() => new Set())

  const handleClick = (i: number) => {
    const next = revealed === i ? null : i
    setRevealed(next)
    if (next !== null) {
      onConfetti()
      if (!openedSet.has(next)) {
        const nextSet = new Set(openedSet)
        nextSet.add(next)
        setOpenedSet(nextSet)
        onFactOpen?.(nextSet.size)
      }
    }
  }

  return (
    <section className="facts" id="facts">
      <h2>Факты о Пете (проверено коллегами)</h2>
      <ul className="facts__list">
        {FACTS.map((text, i) => (
          <li
            key={i}
            className={`facts__item ${revealed === i ? 'facts__item--open' : ''}`}
            onClick={() => handleClick(i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleClick(i)
              }
            }}
            role="button"
            tabIndex={0}
          >
            <span className="facts__number">{i + 1}</span>
            <span className="facts__text">{text}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
