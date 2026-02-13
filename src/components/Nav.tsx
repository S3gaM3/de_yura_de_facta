import { useState, useEffect } from 'react'
import './Nav.css'

const LINKS = [
  { id: 'hero', label: 'Пётр' },
  { id: 'countdown', label: 'До 14.02' },
  { id: 'gallery', label: 'Фото' },
  { id: 'facts', label: 'Факты' },
  { id: 'valentine', label: 'Открытка' },
  { id: 'contract', label: 'Договор' },
  { id: 'wishwall', label: 'Стена' },
]

export function Nav() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`nav ${visible ? 'nav--visible' : ''}`} aria-label="Навигация">
      <ul className="nav__list">
        {LINKS.map(({ id, label }) => (
          <li key={id}>
            <a href={`#${id}`} className="nav__link">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
