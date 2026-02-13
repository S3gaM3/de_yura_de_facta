import { useState } from 'react'
import './ValentineCard.css'

type ValentineCardProps = {
  onConfetti: () => void
  onOpen?: () => void
}

export function ValentineCard({ onConfetti, onOpen }: ValentineCardProps) {
  const [opened, setOpened] = useState(false)

  const handleOpen = () => {
    if (!opened) {
      setOpened(true)
      onConfetti()
      onOpen?.()
    }
  }

  return (
    <section className="valentine" id="valentine">
      <h2>Открытка от коллектива</h2>
      <div
        className={`valentine__card ${opened ? 'valentine__card--opened' : ''}`}
        onClick={handleOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleOpen()
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={opened ? 'Открытка открыта' : 'Открыть открытку'}
      >
        <div className="valentine__flap" />
        <div className="valentine__inner">
          <p className="valentine__greeting">Пётр, с Днём святого Валентина!</p>
          <p className="valentine__body">
            Ты — наш единственный юрист, и мы бы не справились без тебя (и твоих правок в договорах).
            Спасибо, что терпишь наши «а можно одной строкой?» и «ну это же формальность».
            Любим. Нет, правда. И да, этот сайт мы согласовали устно. Шучу. Или нет.
          </p>
          <p className="valentine__sign">— Дружный коллектив ♥</p>
        </div>
      </div>
    </section>
  )
}
