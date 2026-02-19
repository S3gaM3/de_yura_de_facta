import React from 'react'
import ReactDOM from 'react-dom/client'
import { AchievementProvider } from './contexts/AchievementContext'
import App from './App'
import './index.css'
import confetti from 'canvas-confetti'
import { findEgg } from './lib/easterEggs'
import { addXP, XP_REWARDS } from './lib/xp'

function petrEgg() {
  if (findEgg('egg_2')) {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } })
    addXP(XP_REWARDS.easterEgg)
  }
}

function petrEaster16() {
  try {
    if (localStorage.getItem('petr-easter') === 'found') {
      if (findEgg('egg_16')) {
        confetti({ particleCount: 70, spread: 80 })
        addXP(XP_REWARDS.easterEgg)
      }
    }
  } catch {
    /* ignore */
  }
}

if (typeof window !== 'undefined') {
  const w = window as unknown as { petr: () => void; petrEaster: () => void }
  w.petr = petrEgg
  w.petrEaster = petrEaster16
  setInterval(petrEaster16, 2000)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AchievementProvider>
      <App />
    </AchievementProvider>
  </React.StrictMode>,
)
