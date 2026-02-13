import { useState, useEffect } from 'react'
import { loadStats, saveStats, calculateLevel, getTitle, needsExam, getNextExamLevel, PlayerStats, updateEnergy, getMaxEnergy, canPerformAction, useEnergy, getActionCost, canPrestige, prestige, getUnlockedGames } from '../../lib/legalGame'
import { STORY_QUESTS, generateDailyQuests, updateQuestProgress } from '../../lib/legalQuests'
import { getRandomEvent, isEventActive } from '../../lib/legalEvents'
import { StrengthTraining } from './StrengthTraining'
import { AgilityTraining } from './AgilityTraining'
import { IntellectTraining } from './IntellectTraining'
import { Exam } from './Exam'
import { UpgradesPanel } from './UpgradesPanel'
import { QuestsPanel } from './QuestsPanel'
import { OfficePanel } from './OfficePanel'
import { SpecializationPanel } from './SpecializationPanel'
import './LegalGame.css'

type TrainingType = 'strength' | 'agility' | 'intellect' | null
type PanelType = 'upgrades' | 'quests' | 'office' | 'specialization' | null

export function LegalGame() {
  const [stats, setStats] = useState(loadStats())
  const [currentTraining, setCurrentTraining] = useState<TrainingType>(null)
  const [showExam, setShowExam] = useState(false)
  const [currentPanel, setCurrentPanel] = useState<PanelType>(null)

  // Обновление энергии каждую секунду
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => updateEnergy(prev))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Обновление максимальной энергии при изменении уровня
  useEffect(() => {
    const newMaxEnergy = getMaxEnergy(stats.level)
    if (newMaxEnergy !== stats.maxEnergy) {
      setStats(prev => ({ ...prev, maxEnergy: newMaxEnergy, energy: Math.min(prev.energy, newMaxEnergy) }))
    }
  }, [stats.level])

  // Обновление разблокированных игр
  useEffect(() => {
    const unlocked = getUnlockedGames(stats.level)
    if (JSON.stringify(unlocked) !== JSON.stringify(stats.unlockedGames)) {
      setStats(prev => ({ ...prev, unlockedGames: unlocked }))
    }
  }, [stats.level])

  // Инициализация квестов
  useEffect(() => {
    if (stats.activeQuests.length === 0) {
      const storyQuests = STORY_QUESTS.filter(q => !stats.completedQuests.includes(q.id))
      const dailyQuests = generateDailyQuests()
      setStats(prev => ({
        ...prev,
        activeQuests: [...storyQuests, ...dailyQuests],
      }))
    }
  }, [])

  // Случайные события (раз в час с шансом 10%)
  useEffect(() => {
    const checkEvent = () => {
      if (!stats.randomEvent || !isEventActive(stats.randomEvent)) {
        const chance = Math.random()
        if (chance < 0.1) { // 10% шанс
          const event = getRandomEvent()
          setStats(prev => ({ ...prev, randomEvent: event }))
        }
      }
    }
    const interval = setInterval(checkEvent, 60 * 60 * 1000) // Проверка каждый час
    checkEvent() // Проверка сразу
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const newLevel = calculateLevel(stats)
    const newTitle = getTitle(newLevel)
    
    if (newLevel !== stats.level || newTitle !== stats.title) {
      setStats((prev: PlayerStats) => ({ ...prev, level: newLevel, title: newTitle }))
    }
    
    if (needsExam(newLevel) && stats.lastExamLevel < getNextExamLevel(newLevel)) {
      setShowExam(true)
    }
  }, [stats.strength, stats.agility, stats.intellect, stats.level, stats.lastExamLevel])

  useEffect(() => {
    saveStats(stats)
  }, [stats])

  const updateStat = (stat: 'strength' | 'agility' | 'intellect', xp: number) => {
    const cost = getActionCost(stat)
    
    setStats((prev: PlayerStats) => {
      if (!canPerformAction(prev, cost)) {
        return prev // Недостаточно энергии
      }

      let updated = useEnergy(prev, cost)
      
      const currentXP = stat === 'strength' ? updated.strengthXP : stat === 'agility' ? updated.agilityXP : updated.intellectXP
      const currentValue = updated[stat]
      const required = 100 * (currentValue + 1)
      const newXP = currentXP + xp
      
      // Обновляем квесты
      const questUpdates: PlayerStats['activeQuests'] = updated.activeQuests.map(quest => {
        if (quest.completed) return quest
        
        if (stat === 'strength' && (quest.id.includes('strength') || quest.id.includes('сил'))) {
          return updateQuestProgress(quest, 1)
        }
        if (stat === 'agility' && (quest.id.includes('agility') || quest.id.includes('ловк'))) {
          return updateQuestProgress(quest, 1)
        }
        if (stat === 'intellect' && (quest.id.includes('intellect') || quest.id.includes('интеллект'))) {
          return updateQuestProgress(quest, 1)
        }
        return quest
      })
      
      // Проверяем выполненные квесты
      const completedQuests = questUpdates.filter(q => q.completed)
      let newCoins = updated.coins
      const newCompletedQuests = [...updated.completedQuests]
      
      completedQuests.forEach(quest => {
        if (!newCompletedQuests.includes(quest.id)) {
          newCompletedQuests.push(quest.id)
          if (quest.reward.type === 'coins') {
            newCoins += quest.reward.amount
          } else if (quest.reward.type === 'energy') {
            updated.energy = Math.min(updated.maxEnergy, updated.energy + quest.reward.amount)
          }
        }
      })
      
      if (newXP >= required) {
        const result: PlayerStats = {
          ...updated,
          [stat]: currentValue + 1,
          activeQuests: questUpdates,
          completedQuests: newCompletedQuests,
          coins: newCoins,
        }
        if (stat === 'strength') result.strengthXP = newXP - required
        else if (stat === 'agility') result.agilityXP = newXP - required
        else result.intellectXP = newXP - required
        return result
      }
      
      const result: PlayerStats = {
        ...updated,
        activeQuests: questUpdates,
        completedQuests: newCompletedQuests,
        coins: newCoins,
      }
      if (stat === 'strength') result.strengthXP = newXP
      else if (stat === 'agility') result.agilityXP = newXP
      else result.intellectXP = newXP
      return result
    })
  }

  const handleExamComplete = (passed: boolean) => {
    if (passed) {
      const nextLevel = getNextExamLevel(stats.level)
      setStats(prev => ({
        ...prev,
        level: nextLevel,
        lastExamLevel: nextLevel,
        title: getTitle(nextLevel),
        coins: prev.coins + 100, // Награда за экзамен
      }))
    }
    setShowExam(false)
  }

  if (showExam) {
    return (
      <Exam
        examLevel={getNextExamLevel(stats.level)}
        stats={stats}
        onComplete={handleExamComplete}
        onBack={() => setShowExam(false)}
      />
    )
  }

  if (currentPanel === 'upgrades') {
    return (
      <UpgradesPanel
        stats={stats}
        onStatsChange={setStats}
        onBack={() => setCurrentPanel(null)}
      />
    )
  }

  if (currentPanel === 'quests') {
    return (
      <QuestsPanel
        stats={stats}
        onStatsChange={setStats}
        onBack={() => setCurrentPanel(null)}
      />
    )
  }

  if (currentPanel === 'office') {
    return (
      <OfficePanel
        stats={stats}
        onStatsChange={setStats}
        onBack={() => setCurrentPanel(null)}
      />
    )
  }

  if (currentPanel === 'specialization') {
    return (
      <SpecializationPanel
        stats={stats}
        onStatsChange={setStats}
        onBack={() => setCurrentPanel(null)}
      />
    )
  }

  if (currentTraining === 'strength') {
    return (
      <StrengthTraining
        stats={stats}
        onXPGain={(xp) => updateStat('strength', xp)}
        onBack={() => setCurrentTraining(null)}
      />
    )
  }

  if (currentTraining === 'agility') {
    return (
      <AgilityTraining
        stats={stats}
        onXPGain={(xp) => updateStat('agility', xp)}
        onBack={() => setCurrentTraining(null)}
      />
    )
  }

  if (currentTraining === 'intellect') {
    return (
      <IntellectTraining
        stats={stats}
        onXPGain={(xp) => updateStat('intellect', xp)}
        onBack={() => setCurrentTraining(null)}
      />
    )
  }

  const energyPercent = (stats.energy / stats.maxEnergy) * 100
  const timeToFullEnergy = Math.ceil((stats.maxEnergy - stats.energy) * 2) // минут

  return (
    <div className="legal-game">
      <div className="legal-game__header">
        <div className="legal-game__avatar">⚖️</div>
        <div className="legal-game__info">
          <h2 className="legal-game__title">{stats.title}</h2>
          <p className="legal-game__level">Уровень {stats.level} / 100</p>
          <div className="legal-game__progress">
            <div 
              className="legal-game__progress-bar"
              style={{ width: `${(stats.level / 100) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Энергия */}
      <div className="legal-game__energy">
        <div className="legal-game__energy-header">
          <span>⚡ Энергия</span>
          <span>{stats.energy} / {stats.maxEnergy}</span>
        </div>
        <div className="legal-game__energy-bar">
          <div 
            className="legal-game__energy-bar-fill"
            style={{ width: `${energyPercent}%` }}
          />
        </div>
        {stats.energy < stats.maxEnergy && (
          <p className="legal-game__energy-time">
            Восстановление через {timeToFullEnergy} мин
          </p>
        )}
      </div>

      {/* Монеты */}
      <div className="legal-game__coins">
        💰 {stats.coins} монет
      </div>

      {/* Случайное событие */}
      {stats.randomEvent && isEventActive(stats.randomEvent) && (
        <div className="legal-game__event">
          <h3>🎉 {stats.randomEvent.name}</h3>
          <p>{stats.randomEvent.description}</p>
        </div>
      )}

      {/* Специализация */}
      {stats.level >= 20 && !stats.specialization && (
        <div className="legal-game__specialization-notice">
          <p>🎯 Доступна специализация!</p>
          <button onClick={() => setCurrentPanel('specialization')}>
            Выбрать специализацию
          </button>
        </div>
      )}

      <div className="legal-game__stats">
        <div className="legal-game__stat">
          <div className="legal-game__stat-header">
            <span className="legal-game__stat-label">💪 Сила</span>
            <span className="legal-game__stat-value">{stats.strength}</span>
          </div>
          <div className="legal-game__stat-progress">
            <div 
              className="legal-game__stat-progress-bar"
              style={{ width: `${(stats.strengthXP / (100 * (stats.strength + 1))) * 100}%` }}
            />
          </div>
        </div>

        <div className="legal-game__stat">
          <div className="legal-game__stat-header">
            <span className="legal-game__stat-label">⚡ Ловкость</span>
            <span className="legal-game__stat-value">{stats.agility}</span>
          </div>
          <div className="legal-game__stat-progress">
            <div 
              className="legal-game__stat-progress-bar"
              style={{ width: `${(stats.agilityXP / (100 * (stats.agility + 1))) * 100}%` }}
            />
          </div>
        </div>

        <div className="legal-game__stat">
          <div className="legal-game__stat-header">
            <span className="legal-game__stat-label">🧠 Интеллект</span>
            <span className="legal-game__stat-value">{stats.intellect}</span>
          </div>
          <div className="legal-game__stat-progress">
            <div 
              className="legal-game__stat-progress-bar"
              style={{ width: `${(stats.intellectXP / (100 * (stats.intellect + 1))) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {needsExam(stats.level) && stats.lastExamLevel < getNextExamLevel(stats.level) && (
        <div className="legal-game__exam-notice">
          <p>⚠️ Доступен экзамен на {getNextExamLevel(stats.level)} уровень!</p>
          <button 
            className="legal-game__exam-btn"
            onClick={() => setShowExam(true)}
          >
            Сдать экзамен
          </button>
        </div>
      )}

      <div className="legal-game__trainings">
        <button 
          className="legal-game__training-btn"
          onClick={() => setCurrentTraining('strength')}
          disabled={!canPerformAction(stats, getActionCost('strength'))}
        >
          <span className="legal-game__training-icon">💪</span>
          <span className="legal-game__training-title">Тренировка силы</span>
          <span className="legal-game__training-desc">Разбор документов</span>
        </button>

        <button 
          className="legal-game__training-btn"
          onClick={() => setCurrentTraining('agility')}
          disabled={!canPerformAction(stats, getActionCost('agility'))}
        >
          <span className="legal-game__training-icon">⚡</span>
          <span className="legal-game__training-title">Тренировка ловкости</span>
          <span className="legal-game__training-desc">Поиск улик</span>
        </button>

        <button 
          className="legal-game__training-btn"
          onClick={() => setCurrentTraining('intellect')}
          disabled={!canPerformAction(stats, getActionCost('intellect'))}
        >
          <span className="legal-game__training-icon">🧠</span>
          <span className="legal-game__training-title">Тренировка интеллекта</span>
          <span className="legal-game__training-desc">Судебные дебаты</span>
        </button>
      </div>

      {/* Престиж */}
      {canPrestige(stats) && (
        <div className="legal-game__prestige">
          <h3>🌟 Престиж доступен!</h3>
          <p>Начните заново с постоянным бонусом +{((stats.prestigeLevel + 1) * 5)}% ко всему опыту</p>
          <button 
            className="legal-game__prestige-btn"
            onClick={() => {
              if (confirm('Вы уверены, что хотите переродиться? Весь прогресс будет сброшен, но вы получите постоянный бонус.')) {
                setStats(prestige(stats))
              }
            }}
          >
            Переродиться (Престиж {stats.prestigeLevel + 1})
          </button>
        </div>
      )}

      {/* Панели управления */}
      <div className="legal-game__panels">
        <button 
          className="legal-game__panel-btn"
          onClick={() => setCurrentPanel('upgrades')}
        >
          🔧 Улучшения
        </button>
        <button 
          className="legal-game__panel-btn"
          onClick={() => setCurrentPanel('quests')}
        >
          📋 Задания
        </button>
        <button 
          className="legal-game__panel-btn"
          onClick={() => setCurrentPanel('office')}
        >
          🏢 Кабинет
        </button>
        {stats.level >= 20 && (
          <button 
            className="legal-game__panel-btn"
            onClick={() => setCurrentPanel('specialization')}
          >
            🎯 Специализация
          </button>
        )}
      </div>
    </div>
  )
}
