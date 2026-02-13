import { findEgg, getFoundEggs } from '../lib/easterEggs'
import { addXP, XP_REWARDS } from '../lib/xp'
import confetti from 'canvas-confetti'
import './Gallery.css'

const PHOTOS = [
  { src: '1.jpg', alt: 'Пётр' },
  { src: '2.jpg', alt: 'Пётр' },
]

const base = import.meta.env.BASE_URL

function fireConfetti() {
  confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } })
}

export function Gallery() {
  const handleDoubleClick = () => {
    if (!getFoundEggs().includes('egg_5')) {
      if (findEgg('egg_5')) {
        fireConfetti()
        addXP(XP_REWARDS.easterEgg)
      }
    }
  }

  return (
    <section className="gallery" id="gallery">
      <h2>Ещё Петя</h2>
      <div className="gallery__grid">
        {PHOTOS.map((photo) => (
          <div key={photo.src} className="gallery__item">
            <img
              src={`${base}${photo.src}`}
              alt={photo.alt}
              className="gallery__img"
              loading="lazy"
              onDoubleClick={handleDoubleClick}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
