import { findEgg, getFoundEggs } from '../lib/easterEggs'
import { addXP, XP_REWARDS } from '../lib/xp'
import confetti from 'canvas-confetti'
import './Footer.css'

function fireConfetti() {
  confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } })
}

export function Footer() {
  const handleClick = () => {
    const clickCount = parseInt(localStorage.getItem('footer-clicks') || '0') + 1
    localStorage.setItem('footer-clicks', clickCount.toString())
    if (clickCount >= 5 && !getFoundEggs().includes('egg_8')) {
      if (findEgg('egg_8')) {
        fireConfetti()
        addXP(XP_REWARDS.easterEgg)
      }
    }
  }

  return (
    <footer className="footer" onClick={handleClick}>
      <p>
        Сделано с ♥ к 14 февраля. Пётр, мы тебя ценим (и немного стебём).
      </p>
    </footer>
  )
}
