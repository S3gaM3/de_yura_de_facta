import { useState } from 'react'
import './FunFacts.css'

const FUN_FACTS = [
  { title: 'Пётр и договоры', text: 'Пётр может найти ошибку в договоре быстрее, чем ChatGPT найдёт ответ на вопрос. Это факт.' },
  { title: 'Пятничные договоры', text: 'Статистика показывает: 87% договоров приходят Пётру в пятницу после 17:00. Совпадение? Не думаем.' },
  { title: 'Пётр и время', text: 'Когда Пётр говорит "примерно в 15:00", это значит "где-то между 14:30 и 16:30". И это нормально!' },
  { title: 'Юридический юмор', text: 'Пётр — единственный человек, который может смеяться над шутками про ГК РФ. И мы его за это ценим.' },
  { title: 'Пётр и котики', text: 'Пётр в кошачьих ушках — это не фотошоп. Это реальность. И мы это зафиксировали.' },
  { title: 'Договорная магия', text: 'Пётр может переписать договор так, что он станет понятным даже дизайнерам. Это магия.' },
  { title: 'Пётр и дедлайны', text: 'Пётр знает все дедлайны. Даже те, о которых мы ещё не знаем.' },
  { title: 'Юридическая интуиция', text: 'Пётр чувствует проблемные места в договоре интуитивно. Как супергерой, но с ГК РФ.' },
]

export function FunFacts() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <section className="fun-facts" id="fun-facts">
      <h2>Ещё больше фактов про Петра</h2>
      <div className="fun-facts__grid">
        {FUN_FACTS.map((fact, i) => (
          <div
            key={i}
            className={`fun-facts__card ${selected === i ? 'fun-facts__card--open' : ''}`}
            onClick={() => setSelected(selected === i ? null : i)}
          >
            <h3 className="fun-facts__title">{fact.title}</h3>
            {selected === i && <p className="fun-facts__text">{fact.text}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}
