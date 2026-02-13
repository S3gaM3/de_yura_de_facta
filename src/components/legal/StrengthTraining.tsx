import { useState, useRef, useEffect } from 'react'
import { PlayerStats } from '../../lib/legalGame'
import { applyUpgradeEffect } from '../../lib/legalUpgrades'
import './Training.css'

type StrengthTrainingProps = {
  stats: PlayerStats
  onXPGain: (xp: number) => void
  onBack: () => void
}

export function StrengthTraining({ stats, onXPGain, onBack }: StrengthTrainingProps) {
  const [clicks, setClicks] = useState(0)
  const [energy, setEnergy] = useState(100)
  const [isTired, setIsTired] = useState(false)
  const clickCountRef = useRef(0)
  const lastClickTimeRef = useRef(0)

  // Применяем улучшение на уменьшение требуемого опыта
  const reductionUpgrade = (stats.upgrades || []).find(u => u.id === 'strength_xp_reduction')
  const reductionLevel = reductionUpgrade?.level || 0
  const baseRequired = 100 * (stats.strength + 1)
  const required = Math.floor(baseRequired * applyUpgradeEffect('strength_xp_reduction', reductionLevel, 1))
  const currentXP = stats.strengthXP
  const progress = (currentXP / required) * 100

  const handleClick = () => {
    const now = Date.now()
    
    // Проверка на усталость (защита от спама)
    if (isTired) return
    
    if (now - lastClickTimeRef.current < 50) {
      // Слишком быстрые клики
      clickCountRef.current += 1
      if (clickCountRef.current > 10) {
        setIsTired(true)
        setEnergy(0)
        setTimeout(() => {
          setIsTired(false)
          setEnergy(100)
          clickCountRef.current = 0
        }, 2000)
        return
      }
    } else {
      clickCountRef.current = 0
    }
    
    lastClickTimeRef.current = now
    setClicks(prev => prev + 1)
    setEnergy(prev => Math.max(0, prev - 0.5))
    // Применяем улучшение на увеличение опыта
    const xpBoostUpgrade = (stats.upgrades || []).find(u => u.id === 'strength_xp_boost')
    const xpBoostLevel = xpBoostUpgrade?.level || 0
    const xpGain = Math.floor(applyUpgradeEffect('strength_xp_boost', xpBoostLevel, 1))
    onXPGain(xpGain)
  }

  useEffect(() => {
    if (energy < 100 && !isTired) {
      const timer = setInterval(() => {
        setEnergy(prev => Math.min(100, prev + 0.2))
      }, 100)
      return () => clearInterval(timer)
    }
  }, [energy, isTired])

  return (
    <div className="training">
      <div className="training__header">
        <button className="training__back" onClick={onBack}>← Назад</button>
        <h2 className="training__title">💪 Тренировка силы</h2>
        <p className="training__subtitle">Разбор документов</p>
      </div>

      <div className="training__stats">
        <div className="training__stat">
          <span>Сила: {stats.strength}</span>
          <div className="training__progress">
            <div className="training__progress-bar" style={{ width: `${progress}%` }} />
            <span className="training__progress-text">{currentXP} / {required}</span>
          </div>
        </div>
        <div className="training__stat">
          <span>Энергия: {Math.round(energy)}%</span>
          <div className="training__energy-bar">
            <div 
              className={`training__energy-fill ${isTired ? 'training__energy-fill--tired' : ''}`}
              style={{ width: `${energy}%` }}
            />
          </div>
        </div>
      </div>

      <div className="strength-training__area">
        <div className="strength-training__stack">
          <div 
            className="strength-training__documents"
            style={{ height: `${Math.max(20, 100 - (clicks % 20) * 4)}px` }}
          />
        </div>
        <button
          className={`strength-training__btn ${isTired ? 'strength-training__btn--tired' : ''}`}
          onClick={handleClick}
          disabled={isTired}
        >
          {isTired ? 'Отдохни...' : 'Разобрать документ'}
        </button>
        <p className="strength-training__hint">
          Кликай по кнопке, чтобы разобрать документы. Каждый клик даёт 1 очко опыта силы.
        </p>
      </div>
    </div>
  )
}
