import { PlayerStats } from '../../lib/legalGame'
import './SpecializationPanel.css'

interface SpecializationPanelProps {
  stats: PlayerStats
  onStatsChange: (stats: PlayerStats) => void
  onBack: () => void
}

export function SpecializationPanel({ stats, onStatsChange, onBack }: SpecializationPanelProps) {
  const selectSpecialization = (spec: 'civil' | 'criminal' | 'arbitration') => {
    if (stats.specialization) return // Уже выбрана

    onStatsChange({
      ...stats,
      specialization: spec,
    })
  }

  const specializations = [
    {
      id: 'civil' as const,
      name: 'Гражданское право',
      description: 'Бонус +10% к опыту интеллекта, открываются особые задания',
      icon: '📜',
    },
    {
      id: 'criminal' as const,
      name: 'Уголовное право',
      description: 'Бонус к силе (меньше усталости, больше кликов за энергию)',
      icon: '⚖️',
    },
    {
      id: 'arbitration' as const,
      name: 'Арбитраж',
      description: 'Бонус к ловкости (цели дольше висят)',
      icon: '🏛️',
    },
  ]

  return (
    <div className="specialization-panel">
      <div className="specialization-panel__header">
        <h2>🎯 Выбор специализации</h2>
        <button className="specialization-panel__back" onClick={onBack}>
          ← Назад
        </button>
      </div>

      {stats.specialization ? (
        <div className="specialization-panel__current">
          <h3>Текущая специализация:</h3>
          <div className="specialization-panel__current-spec">
            {specializations.find(s => s.id === stats.specialization)?.icon}
            <span>{specializations.find(s => s.id === stats.specialization)?.name}</span>
          </div>
          <p>Специализацию нельзя изменить после выбора</p>
        </div>
      ) : (
        <>
          <p className="specialization-panel__intro">
            Выберите специализацию, которая определит ваш путь в юридической карьере.
            Выбор нельзя будет изменить!
          </p>
          <div className="specialization-panel__list">
            {specializations.map(spec => (
              <div 
                key={spec.id}
                className="specialization-panel__item"
                onClick={() => selectSpecialization(spec.id)}
              >
                <div className="specialization-panel__item-icon">{spec.icon}</div>
                <div className="specialization-panel__item-info">
                  <h4>{spec.name}</h4>
                  <p>{spec.description}</p>
                </div>
                <button className="specialization-panel__item-btn">
                  Выбрать
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
