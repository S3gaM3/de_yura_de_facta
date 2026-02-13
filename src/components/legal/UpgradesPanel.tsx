import { PlayerStats } from '../../lib/legalGame'
import { AVAILABLE_UPGRADES, getUpgradesByCategory, canAffordUpgrade } from '../../lib/legalUpgrades'
import './UpgradesPanel.css'

interface UpgradesPanelProps {
  stats: PlayerStats
  onStatsChange: (stats: PlayerStats) => void
  onBack: () => void
}

export function UpgradesPanel({ stats, onStatsChange, onBack }: UpgradesPanelProps) {
  const buyUpgrade = (upgradeId: string) => {
    const upgrade = AVAILABLE_UPGRADES.find(u => u.id === upgradeId)
    if (!upgrade) return

    const currentUpgrade = stats.upgrades.find(u => u.id === upgradeId)
    const currentLevel = currentUpgrade?.level || 0
    
    if (currentLevel >= upgrade.maxLevel) return
    
    const cost = upgrade.cost * (currentLevel + 1)
    if (stats.coins < cost) return

    const updatedUpgrades = [...stats.upgrades]
    const existingIndex = updatedUpgrades.findIndex(u => u.id === upgradeId)
    
    if (existingIndex >= 0) {
      updatedUpgrades[existingIndex] = {
        ...updatedUpgrades[existingIndex],
        level: updatedUpgrades[existingIndex].level + 1,
      }
    } else {
      updatedUpgrades.push({
        ...upgrade,
        level: 1,
      })
    }

    onStatsChange({
      ...stats,
      coins: stats.coins - cost,
      upgrades: updatedUpgrades,
    })
  }

  const getUpgradeLevel = (upgradeId: string): number => {
    const upgrade = stats.upgrades.find(u => u.id === upgradeId)
    return upgrade?.level || 0
  }

  const categories: Array<'strength' | 'agility' | 'intellect' | 'general'> = ['strength', 'agility', 'intellect', 'general']
  const categoryNames = {
    strength: '💪 Сила',
    agility: '⚡ Ловкость',
    intellect: '🧠 Интеллект',
    general: '⭐ Общие',
  }

  return (
    <div className="upgrades-panel">
      <div className="upgrades-panel__header">
        <h2>🔧 Улучшения</h2>
        <button className="upgrades-panel__back" onClick={onBack}>
          ← Назад
        </button>
      </div>

      <div className="upgrades-panel__coins">
        💰 Монет: {stats.coins}
      </div>

      {categories.map(category => {
        const upgrades = getUpgradesByCategory(category)
        return (
          <div key={category} className="upgrades-panel__category">
            <h3>{categoryNames[category]}</h3>
            <div className="upgrades-panel__list">
              {upgrades.map(upgrade => {
                const level = getUpgradeLevel(upgrade.id)
                const canAfford = canAffordUpgrade(stats, upgrade)
                const isMaxLevel = level >= upgrade.maxLevel

                return (
                  <div 
                    key={upgrade.id} 
                    className={`upgrades-panel__item ${isMaxLevel ? 'upgrades-panel__item--max' : ''} ${!canAfford ? 'upgrades-panel__item--locked' : ''}`}
                  >
                    <div className="upgrades-panel__item-info">
                      <h4>{upgrade.name}</h4>
                      <p>{upgrade.description}</p>
                      <p className="upgrades-panel__item-level">
                        Уровень: {level} / {upgrade.maxLevel}
                      </p>
                    </div>
                    <button
                      className="upgrades-panel__item-btn"
                      onClick={() => buyUpgrade(upgrade.id)}
                      disabled={!canAfford || isMaxLevel}
                    >
                      {isMaxLevel ? 'Макс' : `${upgrade.cost * (level + 1)} 💰`}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
