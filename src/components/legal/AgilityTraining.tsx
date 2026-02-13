import { useState, useEffect, useRef } from 'react'
import { PlayerStats } from '../../lib/legalGame'
import './Training.css'

type AgilityTrainingProps = {
  stats: PlayerStats
  onXPGain: (xp: number) => void
  onBack: () => void
}

type Target = {
  id: number
  x: number
  y: number
  appearedAt: number
  lifetime: number
}

export function AgilityTraining({ stats, onXPGain, onBack }: AgilityTrainingProps) {
  const [targets, setTargets] = useState<Target[]>([])
  const [score, setScore] = useState(0)
  const [misses, setMisses] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const targetIdRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const required = 50 * (stats.agility + 1)
  const currentXP = stats.agilityXP
  const progress = (currentXP / required) * 100

  // Вычисление времени жизни цели в зависимости от уровня ловкости
  const getTargetLifetime = () => {
    const baseTime = 2000 // 2 секунды
    const reduction = stats.agility * 50 // уменьшаем на 50мс за уровень
    return Math.max(500, baseTime - reduction) // минимум 0.5 секунды
  }

  const spawnTarget = () => {
    if (!containerRef.current) return
    
    const container = containerRef.current
    const x = Math.random() * (container.clientWidth - 80)
    const y = Math.random() * (container.clientHeight - 80)
    
    const newTarget: Target = {
      id: targetIdRef.current++,
      x,
      y,
      appearedAt: Date.now(),
      lifetime: getTargetLifetime(),
    }
    
    setTargets(prev => [...prev, newTarget])
    
    // Удаляем цель через время жизни
    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== newTarget.id))
      setMisses(prev => prev + 1)
    }, newTarget.lifetime)
  }

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const interval = setInterval(() => {
      spawnTarget()
    }, Math.max(500, 1500 - stats.agility * 50)) // Интервал уменьшается с ростом ловкости

    return () => clearInterval(interval)
  }, [isActive, stats.agility])

  const handleTargetClick = (targetId: number) => {
    setTargets(prev => prev.filter(t => t.id !== targetId))
    setScore(prev => prev + 1)
    onXPGain(1)
  }

  const startTraining = () => {
    setIsActive(true)
    setScore(0)
    setMisses(0)
    setTargets([])
    spawnTarget()
  }

  const stopTraining = () => {
    setIsActive(false)
    setTargets([])
  }

  return (
    <div className="training">
      <div className="training__header">
        <button className="training__back" onClick={onBack}>← Назад</button>
        <h2 className="training__title">⚡ Тренировка ловкости</h2>
        <p className="training__subtitle">Поиск улик</p>
      </div>

      <div className="training__stats">
        <div className="training__stat">
          <span>Ловкость: {stats.agility}</span>
          <div className="training__progress">
            <div className="training__progress-bar" style={{ width: `${progress}%` }} />
            <span className="training__progress-text">{currentXP} / {required}</span>
          </div>
        </div>
        <div className="training__stat">
          <span>Попаданий: {score}</span>
          <span>Пропущено: {misses}</span>
        </div>
      </div>

      <div className="agility-training__area" ref={containerRef}>
        {!isActive ? (
          <div className="agility-training__start">
            <button className="agility-training__start-btn" onClick={startTraining}>
              Начать тренировку
            </button>
            <p className="agility-training__hint">
              На экране будут появляться улики. Кликай на них как можно быстрее!
            </p>
          </div>
        ) : (
          <>
            {targets.map(target => {
              const elapsed = Date.now() - target.appearedAt
              const remaining = Math.max(0, target.lifetime - elapsed)
              const opacity = remaining / target.lifetime
              
              return (
                <button
                  key={target.id}
                  className="agility-training__target"
                  style={{
                    left: `${target.x}px`,
                    top: `${target.y}px`,
                    opacity,
                  }}
                  onClick={() => handleTargetClick(target.id)}
                >
                  🔍
                </button>
              )
            })}
            <button className="agility-training__stop-btn" onClick={stopTraining}>
              Остановить
            </button>
          </>
        )}
      </div>
    </div>
  )
}
