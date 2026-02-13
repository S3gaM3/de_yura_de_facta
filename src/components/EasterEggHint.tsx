import { useState, useEffect } from 'react'
import { getHintForAchievementCount } from '../lib/easterEggs'
import { getUnlocked } from '../lib/achievements'
import './EasterEggHint.css'

export function EasterEggHint() {
  const [hint, setHint] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null
    
    const checkHint = () => {
      const unlocked = getUnlocked()
      const count = unlocked.length
      const newHint = getHintForAchievementCount(count)
      if (newHint && newHint !== hint) {
        setHint(newHint)
        setVisible(true)
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => setVisible(false), 8000)
      }
    }
    checkHint()
    const interval = setInterval(checkHint, 2000)
    return () => {
      clearInterval(interval)
      if (timer) clearTimeout(timer)
    }
  }, [hint])

  if (!hint || !visible) return null

  return (
    <div className="easter-hint">
      <div className="easter-hint__icon">🥚</div>
      <div className="easter-hint__content">
        <p className="easter-hint__title">Подсказка к пасхальному яйцу</p>
        <p className="easter-hint__text">{hint}</p>
      </div>
      <button type="button" className="easter-hint__close" onClick={() => setVisible(false)}>×</button>
    </div>
  )
}
