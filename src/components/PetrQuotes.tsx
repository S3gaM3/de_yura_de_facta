import { useState } from 'react'
import './PetrQuotes.css'

const QUOTES = [
  '«Можно, но не нужно»',
  '«Надо переписать»',
  '«Я же говорил»',
  '«Примерно в 15:00»',
  '«Без гайдов не подписываю»',
  '«Это не по ГК РФ»',
  '«Отправьте в пятницу после 17:00»',
  '«Проверю в понедельник»',
  '«Договор должен быть понятным»',
  '«Где подпись?»',
]

export function PetrQuotes() {
  const [current, setCurrent] = useState(0)

  const nextQuote = () => {
    setCurrent((c) => (c + 1) % QUOTES.length)
  }

  return (
    <section className="petr-quotes" id="quotes">
      <h2>Цитаты Петра</h2>
      <div className="petr-quotes__box">
        <p className="petr-quotes__text">"{QUOTES[current]}"</p>
        <button type="button" className="petr-quotes__btn" onClick={nextQuote}>
          Следующая цитата →
        </button>
      </div>
    </section>
  )
}
