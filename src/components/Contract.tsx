import { useState } from 'react'
import './Contract.css'

type ContractProps = {
  onConfetti: () => void
}

export function Contract({ onConfetti }: ContractProps) {
  const [signed, setSigned] = useState(false)

  const handleSign = () => {
    if (!signed) {
      setSigned(true)
      onConfetti()
    }
  }

  return (
    <section className="contract" id="contract">
      <h2>Договор о дружбе (шутка)</h2>
      <div className="contract__box">
        <header className="contract__header">
          <strong>ДОГОВОР О ВЗАИМНОЙ СИМПАТИИ И ДОБРОМ СТЕБЕ</strong>
          <span>№ 1 от 14.02.2026</span>
        </header>
        <div className="contract__body">
          <p><strong>Сторона 1:</strong> Пётр (единственный юрист).</p>
          <p><strong>Сторона 2:</strong> Дружный коллектив.</p>
          <p><strong>Предмет:</strong> Стороны обязуются продолжать работать вместе, иногда шутить друг над другом, а в День святого Валентина — признаваться в любви. В неофициальной форме.</p>
          <p><strong>П.1.</strong> Коллектив обязуется не слать договоры в пятницу после 17:00. Хотя бы иногда.</p>
          <p><strong>П.2.</strong> Пётр обязуется не отвечать «надо переписать» на каждое первое письмо. Хотя бы на второе.</p>
          <p><strong>П.3.</strong> Обе стороны признают, что данный документ не имеет юридической силы и является поздравлением.</p>
        </div>
        <div className="contract__sign">
          {signed ? (
            <span className="contract__signed">Подписано ♥ Спасибо, Пётр!</span>
          ) : (
            <button type="button" className="contract__btn" onClick={handleSign}>
              Подписать договор (виртуально)
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
