import { PlayerStats } from '../../lib/legalGame'
import { OFFICE_UPGRADES } from '../../lib/legalOffice'
import './OfficePanel.css'

interface OfficePanelProps {
  stats: PlayerStats
  onStatsChange: (stats: PlayerStats) => void
  onBack: () => void
}

export function OfficePanel({ stats, onStatsChange, onBack }: OfficePanelProps) {
  const buyOfficeUpgrade = (upgradeId: string) => {
    const upgrade = OFFICE_UPGRADES.find(u => u.id === upgradeId)
    if (!upgrade) return

    const existingUpgrade = (stats.officeUpgrades || []).find(u => u.id === upgradeId)
    if (existingUpgrade?.purchased) return

    if (stats.coins < upgrade.cost) return

    const updatedOfficeUpgrades = [...(stats.officeUpgrades || [])]
    const existingIndex = updatedOfficeUpgrades.findIndex(u => u.id === upgradeId)
    
    if (existingIndex >= 0) {
      updatedOfficeUpgrades[existingIndex] = {
        ...updatedOfficeUpgrades[existingIndex],
        purchased: true,
      }
    } else {
      updatedOfficeUpgrades.push({
        ...upgrade,
        purchased: true,
      })
    }

    onStatsChange({
      ...stats,
      coins: stats.coins - upgrade.cost,
      officeUpgrades: updatedOfficeUpgrades,
    })
  }

  const isPurchased = (upgradeId: string): boolean => {
    const upgrade = (stats.officeUpgrades || []).find(u => u.id === upgradeId)
    return upgrade?.purchased || false
  }

  return (
    <div className="office-panel">
      <div className="office-panel__header">
        <h2>🏢 Кабинет юриста</h2>
        <button className="office-panel__back" onClick={onBack}>
          ← Назад
        </button>
      </div>

      <div className="office-panel__coins">
        💰 Монет: {stats.coins}
      </div>

      <div className="office-panel__list">
        {OFFICE_UPGRADES.map(upgrade => {
          const purchased = isPurchased(upgrade.id)
          const canAfford = stats.coins >= upgrade.cost

          return (
            <div 
              key={upgrade.id} 
              className={`office-panel__item ${purchased ? 'office-panel__item--purchased' : ''} ${!canAfford ? 'office-panel__item--locked' : ''}`}
            >
              <div className="office-panel__item-info">
                <h4>{upgrade.name}</h4>
                <p>{upgrade.description}</p>
                <p className="office-panel__item-effect">
                  Эффект: {upgrade.effect === 'strength_xp_5' ? '+5% к опыту силы' :
                          upgrade.effect === 'intellect_xp_5' ? '+5% к опыту интеллекта' :
                          upgrade.effect === 'agility_xp_2' ? '+2% к опыту ловкости' :
                          upgrade.effect === 'all_xp_3' ? '+3% ко всему опыту' :
                          upgrade.effect === 'energy_regen_10' ? '+10% к восстановлению энергии' :
                          upgrade.effect === 'autoclicker' ? 'Автокликер' : upgrade.effect}
                </p>
              </div>
              <button
                className="office-panel__item-btn"
                onClick={() => buyOfficeUpgrade(upgrade.id)}
                disabled={purchased || !canAfford}
              >
                {purchased ? 'Куплено' : `${upgrade.cost} 💰`}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
