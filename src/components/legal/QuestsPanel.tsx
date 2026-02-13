import { PlayerStats } from '../../lib/legalGame'
import { updateQuestProgress } from '../../lib/legalQuests'
import './QuestsPanel.css'

interface QuestsPanelProps {
  stats: PlayerStats
  onStatsChange: (stats: PlayerStats) => void
  onBack: () => void
}

export function QuestsPanel({ stats, onStatsChange, onBack }: QuestsPanelProps) {
  const claimReward = (questId: string) => {
    const quest = stats.activeQuests.find(q => q.id === questId)
    if (!quest || !quest.completed) return

    let newStats: PlayerStats = {
      ...stats,
      completedQuests: [...stats.completedQuests, questId],
      activeQuests: stats.activeQuests.filter(q => q.id !== questId),
    }

    if (quest.reward.type === 'coins') {
      newStats.coins += quest.reward.amount
    } else if (quest.reward.type === 'energy') {
      newStats.energy = Math.min(newStats.maxEnergy, newStats.energy + quest.reward.amount)
    }

    onStatsChange(newStats)
  }

  const storyQuests = stats.activeQuests.filter(q => q.type === 'story')
  const dailyQuests = stats.activeQuests.filter(q => q.type === 'daily')
  const specialQuests = stats.activeQuests.filter(q => q.type === 'special')

  return (
    <div className="quests-panel">
      <div className="quests-panel__header">
        <h2>📋 Задания</h2>
        <button className="quests-panel__back" onClick={onBack}>
          ← Назад
        </button>
      </div>

      {storyQuests.length > 0 && (
        <div className="quests-panel__section">
          <h3>📖 Сюжетные задания</h3>
          {storyQuests.map(quest => (
            <div 
              key={quest.id} 
              className={`quests-panel__quest ${quest.completed ? 'quests-panel__quest--completed' : ''}`}
            >
              <div className="quests-panel__quest-info">
                <h4>{quest.name}</h4>
                <p>{quest.description}</p>
                <div className="quests-panel__quest-progress">
                  <div 
                    className="quests-panel__quest-progress-bar"
                    style={{ width: `${(quest.progress / quest.target) * 100}%` }}
                  />
                  <span>{quest.progress} / {quest.target}</span>
                </div>
              </div>
              {quest.completed && (
                <button 
                  className="quests-panel__quest-claim"
                  onClick={() => claimReward(quest.id)}
                >
                  Получить награду
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {dailyQuests.length > 0 && (
        <div className="quests-panel__section">
          <h3>📅 Ежедневные задания</h3>
          {dailyQuests.map(quest => (
            <div 
              key={quest.id} 
              className={`quests-panel__quest ${quest.completed ? 'quests-panel__quest--completed' : ''}`}
            >
              <div className="quests-panel__quest-info">
                <h4>{quest.name}</h4>
                <p>{quest.description}</p>
                <div className="quests-panel__quest-progress">
                  <div 
                    className="quests-panel__quest-progress-bar"
                    style={{ width: `${(quest.progress / quest.target) * 100}%` }}
                  />
                  <span>{quest.progress} / {quest.target}</span>
                </div>
                <p className="quests-panel__quest-reward">
                  Награда: {quest.reward.type === 'coins' ? `${quest.reward.amount} 💰` : 
                           quest.reward.type === 'energy' ? `${quest.reward.amount} ⚡` : 
                           `${quest.reward.amount} XP`}
                </p>
              </div>
              {quest.completed && (
                <button 
                  className="quests-panel__quest-claim"
                  onClick={() => claimReward(quest.id)}
                >
                  Получить награду
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {specialQuests.length > 0 && (
        <div className="quests-panel__section">
          <h3>⭐ Особые задания</h3>
          {specialQuests.map(quest => (
            <div 
              key={quest.id} 
              className={`quests-panel__quest ${quest.completed ? 'quests-panel__quest--completed' : ''}`}
            >
              <div className="quests-panel__quest-info">
                <h4>{quest.name}</h4>
                <p>{quest.description}</p>
                <div className="quests-panel__quest-progress">
                  <div 
                    className="quests-panel__quest-progress-bar"
                    style={{ width: `${(quest.progress / quest.target) * 100}%` }}
                  />
                  <span>{quest.progress} / {quest.target}</span>
                </div>
              </div>
              {quest.completed && (
                <button 
                  className="quests-panel__quest-claim"
                  onClick={() => claimReward(quest.id)}
                >
                  Получить награду
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {stats.activeQuests.length === 0 && (
        <div className="quests-panel__empty">
          <p>Нет активных заданий</p>
          <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.5rem' }}>
            Новые задания появятся автоматически
          </p>
        </div>
      )}
    </div>
  )
}
