import { useMemo } from 'react'
import './FallingHearts.css'

const COLORS = ['#e63950', '#ff6b6b', '#ff8a8a', '#f8b4b4']
const COUNT = 28

function seed(id: number) {
  const x = Math.sin(id * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

export function FallingHearts() {
  const hearts = useMemo(() => {
    return Array.from({ length: COUNT }, (_, i) => ({
      id: i,
      left: seed(i) * 100,
      delay: seed(i + 1) * 20,
      duration: 18 + seed(i + 2) * 14,
      opacity: 0.04 + seed(i + 3) * 0.09,
      color: COLORS[Math.floor(seed(i + 4) * COLORS.length)],
      size: 10 + Math.floor(seed(i + 5) * 12),
    }))
  }, [])

  return (
    <div className="falling-hearts" aria-hidden>
      {hearts.map((h) => (
        <span
          key={h.id}
          className="falling-hearts__item"
          style={{
            left: `${h.left}%`,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
            opacity: h.opacity,
            color: h.color,
            fontSize: `${h.size}px`,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  )
}
