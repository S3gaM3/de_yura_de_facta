import { useState, useEffect, useRef } from 'react'
import './ReactionGame.css'

type ReactionGameProps = {
  onBack: () => void
  onComplete?: () => void
}

export function ReactionGame({ onBack, onComplete }: ReactionGameProps) {
  const [waiting, setWaiting] = useState(false)
  const [ready, setReady] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [round, setRound] = useState(0)
  const [times, setTimes] = useState<number[]>([])
  const startTimeRef = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startRound = () => {
    setReady(false)
    setClicked(false)
    setReactionTime(null)
    const delay = 1000 + Math.random() * 3000
    timerRef.current = setTimeout(() => {
      setReady(true)
      startTimeRef.current = Date.now()
    }, delay)
    setWaiting(true)
  }

  const handleClick = () => {
    if (!ready || clicked) return
    const time = Date.now() - startTimeRef.current
    setReactionTime(time)
    setClicked(true)
    setTimes((prev) => {
      const next = [...prev, time]
      if (next.length >= 5) {
        setTimeout(() => onComplete?.(), 1000)
      }
      return next
    })
    setRound((r) => r + 1)
  }

  useEffect(() => {
    if (round < 5 && !waiting) {
      startRound()
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [round, waiting])

  const avgTime = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null

  return (
    <div className="reaction-game">
      <h3 className="reaction-game__title">Тест на реакцию</h3>
      <p className="reaction-game__round">Раунд {round + 1} / 5</p>
      {times.length >= 5 ? (
        <div className="reaction-game__result">
          <p>Средняя реакция: {avgTime} мс</p>
          <p className="reaction-game__result-msg">
            {avgTime && avgTime < 200 ? 'Молниеносно!' : avgTime && avgTime < 300 ? 'Отлично!' : 'Неплохо!'}
          </p>
        </div>
      ) : (
        <div className="reaction-game__area" onClick={handleClick}>
          {waiting && !ready && <span className="reaction-game__wait">Жди...</span>}
          {ready && !clicked && <span className="reaction-game__go">КЛИКНИ!</span>}
          {clicked && reactionTime !== null && (
            <span className="reaction-game__time">{reactionTime} мс</span>
          )}
        </div>
      )}
      <button type="button" className="reaction-game__back" onClick={onBack}>Назад к играм</button>
    </div>
  )
}
