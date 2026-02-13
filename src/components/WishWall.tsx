import { useState, useEffect, useCallback } from 'react'
import './WishWall.css'

const STORAGE_KEY = 'petr-wishes'

export type Wish = {
  id: string
  text: string
  author: string
  date: number
}

function loadWishes(): Wish[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function saveWishes(wishes: Wish[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes))
  } catch {
    // ignore
  }
}

export function WishWall() {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [text, setText] = useState('')
  const [author, setAuthor] = useState('')

  useEffect(() => {
    setWishes(loadWishes())
  }, [])

  const persist = useCallback((next: Wish[]) => {
    setWishes(next)
    saveWishes(next)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    
    const wish: Wish = {
      id: crypto.randomUUID(),
      text: trimmed,
      author: author.trim() || 'Аноним',
      date: Date.now(),
    }
    persist([wish, ...wishes])
    setText('')
  }

  const handleRemove = (id: string) => {
    persist(wishes.filter((w) => w.id !== id))
  }

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <section className="wishwall" id="wishwall">
      <h2>Стена пожеланий</h2>
      <p className="wishwall__intro">
        Оставь Пете пожелание — оно сохранится на этой стене даже после перезагрузки страницы.
      </p>
      <form className="wishwall__form" onSubmit={handleSubmit}>
        <textarea
          className="wishwall__input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Напиши пожелание..."
          rows={3}
          maxLength={500}
        />
        <div className="wishwall__row">
          <input
            type="text"
            className="wishwall__author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Твоё имя (или оставь пустым)"
            maxLength={50}
          />
          <button type="submit" className="wishwall__btn" disabled={!text.trim()}>
            Оставить
          </button>
        </div>
      </form>
      <ul className="wishwall__list">
        {wishes.map((w) => (
          <li key={w.id} className="wishwall__card">
            <p className="wishwall__card-text">{w.text}</p>
            <div className="wishwall__card-meta">
              <span className="wishwall__card-author">{w.author}</span>
              <span className="wishwall__card-date">{formatDate(w.date)}</span>
              <button
                type="button"
                className="wishwall__card-remove"
                onClick={() => handleRemove(w.id)}
                title="Удалить"
                aria-label="Удалить пожелание"
              >
                ×
              </button>
            </div>
          </li>
        ))}
      </ul>
      {wishes.length === 0 && (
        <p className="wishwall__empty">Пока ни одного пожелания. Будь первым!</p>
      )}
    </section>
  )
}
