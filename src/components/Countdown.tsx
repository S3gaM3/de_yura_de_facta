import { useState, useEffect } from 'react'
import './Countdown.css'

function getTimeUntilFeb14() {
  const now = new Date()
  const year = now.getMonth() < 1 || (now.getMonth() === 1 && now.getDate() < 14) ? now.getFullYear() : now.getFullYear() + 1
  const feb14 = new Date(year, 1, 14, 0, 0, 0, 0)
  const diff = feb14.getTime() - now.getTime()
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isToday: true }
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    isToday: false,
  }
}

export function Countdown() {
  const [t, setT] = useState(getTimeUntilFeb14())

  useEffect(() => {
    const id = setInterval(() => setT(getTimeUntilFeb14()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="countdown" id="countdown">
      <h2>До 14 февраля осталось</h2>
      {t.isToday ? (
        <p className="countdown__today">Сегодня тот самый день! ♥</p>
      ) : (
        <div className="countdown__grid">
          <div className="countdown__item">
            <span className="countdown__value">{t.days}</span>
            <span className="countdown__label">дней</span>
          </div>
          <div className="countdown__item">
            <span className="countdown__value">{String(t.hours).padStart(2, '0')}</span>
            <span className="countdown__label">часов</span>
          </div>
          <div className="countdown__item">
            <span className="countdown__value">{String(t.minutes).padStart(2, '0')}</span>
            <span className="countdown__label">минут</span>
          </div>
          <div className="countdown__item">
            <span className="countdown__value">{String(t.seconds).padStart(2, '0')}</span>
            <span className="countdown__label">секунд</span>
          </div>
        </div>
      )}
    </section>
  )
}
