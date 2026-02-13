import { useState } from 'react'
import { useAchievements } from '../contexts/AchievementContext'
import './AchievementPanel.css'

type AchievementPanelProps = {
  zone: 'main' | 'secret'
}

export function AchievementPanel({ zone }: AchievementPanelProps) {
  const { achievements, isUnlocked } = useAchievements()
  const [open, setOpen] = useState(false)
  const list = achievements.filter((a) => a.zone === zone)
  const unlockedCount = list.filter((a) => isUnlocked(a.id)).length

  return (
    <div className={`achievement-panel-wrap ${zone === 'secret' ? 'achievement-panel-wrap--secret' : ''}`}>
      <button
        type="button"
        className="achievement-panel__btn"
        onClick={() => setOpen((o) => !o)}
        title="Достижения"
        aria-label={open ? 'Закрыть достижения' : 'Открыть достижения'}
      >
        <span className="achievement-panel__icon">🏆</span>
        <span className="achievement-panel__count">{unlockedCount}/{list.length}</span>
      </button>
      {open && (
        <div className="achievement-panel">
          <div className="achievement-panel__header">
            <span>Достижения</span>
            <button type="button" className="achievement-panel__close" onClick={() => setOpen(false)} aria-label="Закрыть">×</button>
          </div>
          <ul className="achievement-panel__list">
            {list.map((a) => (
              <li key={a.id} className={`achievement-panel__item ${isUnlocked(a.id) ? 'achievement-panel__item--unlocked' : ''}`}>
                <span className="achievement-panel__item-icon">{isUnlocked(a.id) ? '✓' : '○'}</span>
                <div className="achievement-panel__item-text">
                  <strong>{a.name}</strong>
                  <span>{a.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
