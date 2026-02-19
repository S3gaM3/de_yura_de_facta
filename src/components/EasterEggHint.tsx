import { useState, useEffect } from 'react'
import { getHintForAchievementCount } from '../lib/easterEggs'
import { useAchievements } from '../contexts/AchievementContext'
import './EasterEggHint.css'

export function EasterEggHint() {
  const { unlocked } = useAchievements()
  const [hint, setHint] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const count = unlocked.length
    const newHint = getHintForAchievementCount(count)
    if (newHint) {
      setHint(newHint)
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 8000)
      return () => clearTimeout(timer)
    }
  }, [unlocked.length])

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
