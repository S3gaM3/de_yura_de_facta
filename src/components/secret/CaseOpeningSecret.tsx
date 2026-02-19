import { useState, useEffect, useRef } from 'react'
import './CaseOpening.css'

const ITEMS = [
  'Бесконечный запас кофе',
  'Кнопка «Пропустить понедельник»',
  'Ответ на любой вопрос',
  'Невидимость на 10 минут',
  'Второй выходной в неделю',
  'Удача на весь день',
  'Разговорчивый кот',
  'Бесплатный обед',
  'Сертификат «Прошёл секрет»',
  'Тайная суперсила на выбор',
]

type CaseOpeningSecretProps = {
  onBack: () => void
  onOpen?: () => void
}

export function CaseOpeningSecret({ onBack, onOpen }: CaseOpeningSecretProps) {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  const handleOpen = () => {
    if (spinning) return
    setSpinning(true)
    setResult(null)
    const duration = 2500 + Math.random() * 1500
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      setResult(ITEMS[Math.floor(Math.random() * ITEMS.length)])
      setSpinning(false)
      onOpen?.()
    }, duration)
  }

  return (
    <div className="case-opening">
      <h3 className="case-opening__title">Открытие кейса</h3>
      <p className="case-opening__hint">Один клик — один сюрприз.</p>
      <div className={`case-opening__box ${spinning ? 'case-opening__box--spin' : ''}`}>
        {spinning ? (
          <span className="case-opening__placeholder">?</span>
        ) : result ? (
          <span className="case-opening__result">{result}</span>
        ) : (
          <span className="case-opening__placeholder">Кейс</span>
        )}
      </div>
      <button type="button" className="case-opening__btn" onClick={handleOpen} disabled={spinning}>
        {spinning ? 'Открываем...' : 'Открыть кейс'}
      </button>
      <button type="button" className="case-opening__back" onClick={onBack}>Назад к играм</button>
    </div>
  )
}
