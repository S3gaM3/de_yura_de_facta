import { useCallback, useEffect, useRef, useState } from 'react'
import './Hero.css'

type HeroProps = {
  onHeartClick?: () => void
  onTitleTripleTap?: () => void
}

export function Hero({ onHeartClick, onTitleTripleTap }: HeroProps) {
  const [heartScale, setHeartScale] = useState(1)
  const [photoError, setPhotoError] = useState(false)
  const [photoExt, setPhotoExt] = useState<'jpg' | 'png'>('jpg')

  const handleHeartClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onHeartClick?.()
  }, [onHeartClick])

  const tapTimesRef = useRef<number[]>([])
  const handleTitleTap = useCallback(() => {
    const now = Date.now()
    tapTimesRef.current = tapTimesRef.current.filter((t) => now - t < 500)
    tapTimesRef.current.push(now)
    if (tapTimesRef.current.length >= 3) {
      tapTimesRef.current = []
      onTitleTripleTap?.()
    }
  }, [onTitleTripleTap])

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
        <h1
          className="hero__title"
          onClick={handleTitleTap}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleTitleTap()
          }}
          role="button"
          tabIndex={0}
          aria-label="Пётр"
        >
          Пётр
          <span
            className="hero__heart hero__heart--clickable"
            style={{ transform: `scale(${heartScale})` }}
            aria-label="Сердечко"
            role="button"
            tabIndex={0}
            onClick={(e) => handleHeartClick(e)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                e.stopPropagation()
                onHeartClick?.()
              }
            }}
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
