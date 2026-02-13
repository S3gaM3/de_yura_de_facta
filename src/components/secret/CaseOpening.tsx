import { useState } from 'react'
import './CaseOpening.css'

const ITEMS = [
  'Договор без правок',
  'Пятница после 17:00 свободна',
  'Кофе от коллег',
  '«Надо переписать» — только раз в день',
  'Пункт 3.2 не противоречит 7.1',
  'Бесплатный обед',
  'День без согласований',
  'Сертификат «Лучший юрист»',
  'Кот в ушках (виртуальный)',
  'Благодарность от коллектива',
]

type CaseOpeningProps = {
  onBack: () => void
}

export function CaseOpening({ onBack }: CaseOpeningProps) {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleOpen = () => {
    if (spinning) return
    setSpinning(true)
    setResult(null)
    const duration = 2500 + Math.random() * 1500
    const timer = setTimeout(() => {
      setResult(ITEMS[Math.floor(Math.random() * ITEMS.length)])
      setSpinning(false)
    }, duration)
    return () => clearTimeout(timer)
  }

  return (
    <div className="case-opening">
      <h3 className="case-opening__title">Открытие кейса</h3>
      <p className="case-opening__hint">Один клик — один сюрприз для Петра.</p>
      <div className={`case-opening__box ${spinning ? 'case-opening__box--spin' : ''}`}>
        {spinning ? (
          <span className="case-opening__placeholder">?</span>
        ) : result ? (
          <span className="case-opening__result">{result}</span>
        ) : (
          <span className="case-opening__placeholder">Кейс</span>
        )}
      </div>
      <button
        type="button"
        className="case-opening__btn"
        onClick={handleOpen}
        disabled={spinning}
      >
        {spinning ? 'Открываем...' : 'Открыть кейс'}
      </button>
      <button type="button" className="case-opening__back" onClick={onBack}>Назад к играм</button>
    </div>
  )
}
