import './LegalGameSection.css'

export function LegalGameSection() {
  return (
    <section className="legal-game-section" id="legal-game">
      <h2>⚖️ Юридическая академия</h2>
      <p className="legal-game-section__intro">
        Станьте профессионалом высшего уровня! Прокачивайте силу, ловкость и интеллект, чтобы достичь 100 уровня.
      </p>
      <div className="legal-game-section__features">
        <div className="legal-game-section__feature">
          <span className="legal-game-section__feature-icon">💪</span>
          <h3>Тренировка силы</h3>
          <p>Разбирайте документы, повышайте выносливость</p>
        </div>
        <div className="legal-game-section__feature">
          <span className="legal-game-section__feature-icon">⚡</span>
          <h3>Тренировка ловкости</h3>
          <p>Ищите улики, развивайте скорость реакции</p>
        </div>
        <div className="legal-game-section__feature">
          <span className="legal-game-section__feature-icon">🧠</span>
          <h3>Тренировка интеллекта</h3>
          <p>Отвечайте на вопросы по юриспруденции</p>
        </div>
      </div>
      <a href="#legal-game" className="legal-game-section__btn">
        Начать игру
      </a>
    </section>
  )
}
