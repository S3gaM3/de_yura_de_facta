import { useState, useEffect, useRef } from 'react'
import './ChoosePath.css'

type Step = {
  text: string
  choices: { label: string; next: number }[]
}

const STEPS: Step[] = [
  {
    text: 'Ты нашёл потайную дверь. За ней — три коридора.',
    choices: [
      { label: 'Пойти налево', next: 1 },
      { label: 'Пойти направо', next: 2 },
      { label: 'Прямо', next: 3 },
    ],
  },
  {
    text: 'В конце коридора — зеркало. В отражении что-то машет.',
    choices: [
      { label: 'Подойти ближе', next: 4 },
      { label: 'Вернуться', next: 0 },
    ],
  },
  {
    text: 'Темно. Слышен звук капели. Включить фонарик?',
    choices: [
      { label: 'Включить', next: 5 },
      { label: 'Идти в темноте', next: 6 },
    ],
  },
  {
    text: 'Прямо перед тобой — ещё одна дверь. На ней надпись: «Только для своих».',
    choices: [
      { label: 'Открыть', next: 7 },
      { label: 'Постучать', next: 8 },
    ],
  },
  { text: 'Зеркало оказалось порталом. Ты в секретной зоне. Добро пожаловать. ✦', choices: [] },
  { text: 'Фонарик выхватил из темноты табличку: «Ты прошёл. Молодец.»', choices: [] },
  { text: 'В темноте ты наступил на кнопку. Пол открылся. Попробуй другой путь.', choices: [] },
  { text: 'За дверью — комната с играми. Ты свой. ✦', choices: [] },
  { text: 'Никто не ответил. Дверь заперта. Выбери другой вариант.', choices: [] },
]

type ChoosePathSecretProps = {
  onBack: () => void
  onComplete?: () => void
}

export function ChoosePathSecret({ onBack, onComplete }: ChoosePathSecretProps) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isStep = current.choices.length > 0
  const completedRef = useRef(false)
  useEffect(() => {
    if (!isStep && onComplete && !completedRef.current) {
      completedRef.current = true
      onComplete()
    }
  }, [isStep, onComplete])

  return (
    <div className="choose-path">
      <h3 className="choose-path__title">Выбери правильный путь</h3>
      <div className="choose-path__card">
        <p className="choose-path__text">{current.text}</p>
        {isStep && (
          <ul className="choose-path__choices">
            {current.choices.map((c, i) => (
              <li key={i}>
                <button type="button" className="choose-path__btn" onClick={() => setStep(c.next)}>
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        )}
        {!isStep && (
          <div className="choose-path__end">
            <button type="button" className="choose-path__restart" onClick={() => setStep(0)}>
              Начать заново
            </button>
          </div>
        )}
      </div>
      <button type="button" className="choose-path__back" onClick={onBack}>Назад к играм</button>
    </div>
  )
}
