import { useState, useEffect } from 'react'
import type { XPData } from '../lib/xp'
import './XPBar.css'

type XPBarProps = {
  xp: XPData
  onLevelUp?: () => void
}

export function XPBar({ xp, onLevelUp }: XPBarProps) {
  const [prevLevel, setPrevLevel] = useState(xp.level)
  const percent = (xp.currentLevelXP / xp.nextLevelXP) * 100

  useEffect(() => {
    if (xp.level > prevLevel) {
      setPrevLevel(xp.level)
      onLevelUp?.()
    }
  }, [xp.level, prevLevel, onLevelUp])

  return (
    <div className="xp-bar">
      <div className="xp-bar__info">
        <span className="xp-bar__level">Уровень {xp.level}</span>
        <span className="xp-bar__xp">{xp.currentLevelXP} / {xp.nextLevelXP} XP</span>
      </div>
      <div className="xp-bar__track">
        <div className="xp-bar__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
