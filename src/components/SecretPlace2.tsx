import { useState } from 'react'
import './SecretPlace2.css'

type SecretPlace2Props = {
  onBack: () => void
}

export function SecretPlace2({ onBack }: SecretPlace2Props) {
  const [clickCount, setClickCount] = useState(0)

  return (
    <div className="secret-place-2">
      <header className="secret-place-2__header">
        <h1 className="secret-place-2__title">✨ Ещё одно секретное место ✨</h1>
        <button type="button" className="secret-place-2__back" onClick={onBack}>
          Вернуться
        </button>
      </header>
      <main className="secret-place-2__main">
        <div className="secret-place-2__content">
          <p className="secret-place-2__intro">
            Ты нашёл это место через стену пожеланий. Молодец!
          </p>
          <p className="secret-place-2__text">
            Здесь можно что-то добавить. Например, ещё больше приколов про Петра или что-то совсем другое.
          </p>
          <div className="secret-place-2__interactive">
            <button
              type="button"
              className="secret-place-2__btn"
              onClick={() => {
                setClickCount((c) => c + 1)
                if (clickCount >= 9) {
                  alert('🎉 Ты кликнул 10 раз! Это достижение!')
                }
              }}
            >
              Кликни меня {clickCount > 0 && `(${clickCount})`}
            </button>
          </div>
          <div className="secret-place-2__mystery">
            <p>🔮 Что-то таинственное...</p>
            <p>Может быть, здесь будут новые игры или секреты?</p>
          </div>
        </div>
      </main>
    </div>
  )
}
