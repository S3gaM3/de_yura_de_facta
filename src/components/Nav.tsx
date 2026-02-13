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

type NavProps = {
  secretUnlocked?: boolean
}

export function Nav({ secretUnlocked }: NavProps) {
  const [visible, setVisible] = useState(false)
  const links = [...LINKS, ...(secretUnlocked ? [{ id: 'secret', label: 'Секрет' }] : [])]

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`nav ${visible ? 'nav--visible' : ''}`} aria-label="Навигация">
      <ul className="nav__list">
        {links.map(({ id, label }) => (
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
