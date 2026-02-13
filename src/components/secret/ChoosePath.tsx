import { useState } from 'react'
import './ChoosePath.css'

type Step = {
  text: string
  choices: { label: string; next: number }[]
}

const STEPS: Step[] = [
  {
    text: 'Пётр получил договор в пятницу в 18:00. Что делать?',
    choices: [
      { label: 'Проверить сразу', next: 1 },
      { label: 'Отложить на понедельник', next: 2 },
      { label: 'Написать «надо переписать» и выйти', next: 3 },
    ],
  },
  {
    text: 'Ты начал проверять. В пункте 3.2 противоречие с 7.1. Дальше?',
    choices: [
      { label: 'Вернуть с замечаниями', next: 4 },
      { label: 'Подписать устно', next: 5 },
    ],
  },
  {
    text: 'Понедельник. Коллега спрашивает про договор.',
    choices: [
      { label: '«Устно согласовано»', next: 5 },
      { label: '«Сейчас проверю»', next: 4 },
    ],
  },
  {
    text: 'Выходной режим активирован. Коллектив в чате: «Пётр, ты где?»',
    choices: [
      { label: 'Ответить', next: 6 },
      { label: 'Не читать чат', next: 7 },
    ],
  },
  { text: 'Правильный путь: договор проверен, замечания отправлены. Пётр молодец. ♥', choices: [] },
  { text: 'Устно не считается — так сказал бы Пётр. Попробуй другой путь.', choices: [] },
  { text: 'Пётр на связи. Коллектив доволен. Но лучше не слать договоры в пятницу вечером. ♥', choices: [] },
  { text: 'Пётр отдыхает. В понедельник разберётся. Выбери другой вариант для идеала.', choices: [] },
]

type ChoosePathProps = {
  onBack: () => void
}

export function ChoosePath({ onBack }: ChoosePathProps) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isStep = current.choices.length > 0

  const handleChoice = (next: number) => setStep(next)

  const handleRestart = () => setStep(0)

  return (
    <div className="choose-path">
      <h3 className="choose-path__title">Выбери правильный путь</h3>
      <div className="choose-path__card">
        <p className="choose-path__text">
          {current.text}
        </p>
        {isStep && (
          <ul className="choose-path__choices">
            {current.choices.map((c, i) => (
              <li key={i}>
                <button
                  type="button"
                  className="choose-path__btn"
                  onClick={() => handleChoice(c.next)}
                >
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        )}
        {!isStep && (
          <div className="choose-path__end">
            <button type="button" className="choose-path__restart" onClick={handleRestart}>
              Начать заново
            </button>
          </div>
        )}
      </div>
      <button type="button" className="choose-path__back" onClick={onBack}>Назад к играм</button>
    </div>
  )
}
