import { useEffect, useState } from 'react'
import './Hero.css'

export function Hero() {
  const [heartScale, setHeartScale] = useState(1)
  const [photoError, setPhotoError] = useState(false)
  const [photoExt, setPhotoExt] = useState<'jpg' | 'png'>('jpg')

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartScale((s) => (s === 1 ? 1.08 : 1))
    }, 800)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="hero" id="hero">
      <div className="hero__bg" aria-hidden />
      <div className="hero__content">
        {!photoError && (
          <img
            src={`${import.meta.env.BASE_URL}hero.${photoExt}`}
            alt="Пётр в кошачьих ушках и лапках"
            className="hero__photo"
            onError={() => (photoExt === 'jpg' ? setPhotoExt('png') : setPhotoError(true))}
          />
        )}
        <span className="hero__badge">14 февраля</span>
        <h1 className="hero__title">
          Пётр
          <span
            className="hero__heart"
            style={{ transform: `scale(${heartScale})` }}
            aria-label="Сердечко"
          >
            ♥
          </span>
        </h1>
        <p className="hero__subtitle">
          Единственный юрист компании. Любимый коллега. Объект доброго стеба от дружного коллектива.
        </p>
        <a href="#countdown" className="hero__cta">
          До дня всех влюблённых
        </a>
      </div>
    </section>
  )
}
