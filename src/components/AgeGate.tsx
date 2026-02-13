import { useState, useEffect } from 'react'
import './AgeGate.css'

const STORAGE_KEY = 'petr-age-verified'
const YEAR_MIN = 1970
const YEAR_MAX = 2010
const CORRECT_START = 1990
const CORRECT_END = 1999

function getStored(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

type AgeGateProps = {
  onVerified: () => void
}

export function AgeGate({ onVerified }: AgeGateProps) {
  const [status, setStatus] = useState<'ask' | 'ok' | 'reject'>(() =>
    getStored() ? 'ok' : 'ask'
  )
  const [year, setYear] = useState(1985)

  useEffect(() => {
    if (status === 'ok') onVerified()
  }, [status, onVerified])

  const handleConfirm = () => {
    const ok = year >= CORRECT_START && year <= CORRECT_END
    if (ok) {
      try {
        localStorage.setItem(STORAGE_KEY, '1')
      } catch {
        // ignore
      }
      setStatus('ok')
      onVerified()
    } else {
      setStatus('reject')
    }
  }

  const handleRetry = () => {
    setStatus('ask')
  }

  if (status === 'ok') return null

  if (status === 'reject') {
    return (
      <div className="agegate agegate--fullscreen">
        <div className="agegate__card agegate__card--reject">
          <h1 className="agegate__title">Гуляй отсюда</h1>
          <p className="agegate__text">Просмотр не разрешён.</p>
          <button type="button" className="agegate__btn" onClick={handleRetry}>
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="agegate agegate--fullscreen">
      <div className="agegate__card">
        <h1 className="agegate__title">Подтверждение</h1>
        <p className="agegate__question">Когда была популярна Love is…?</p>
        <div className="agegate__slider-wrap">
          <div className="agegate__years">
            <span>{YEAR_MIN}</span>
            <span>{YEAR_MAX}</span>
          </div>
          <input
            type="range"
            className="agegate__range"
            min={YEAR_MIN}
            max={YEAR_MAX}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            aria-label="Выбери год"
          />
          <p className="agegate__year-value">{year}</p>
          <button
            type="button"
            className="agegate__btn"
            onClick={handleConfirm}
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  )
}
