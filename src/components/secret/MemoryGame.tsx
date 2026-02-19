import { useState, useEffect, useRef } from 'react'
import './MemoryGame.css'

const SYMBOLS = ['♥', '★', '◆', '●', '▲', '■', '♦', '♠']

type MemoryGameProps = {
  onBack: () => void
  onComplete?: () => void
}

export function MemoryGame({ onBack, onComplete }: MemoryGameProps) {
  const [cards, setCards] = useState<{ id: number; symbol: string; flipped: boolean; matched: boolean }[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)
  const completedRef = useRef(false)

  useEffect(() => {
    const pairs = [...SYMBOLS.slice(0, 6), ...SYMBOLS.slice(0, 6)]
    const shuffled = pairs.sort(() => Math.random() - 0.5)
    setCards(shuffled.map((s, i) => ({ id: i, symbol: s, flipped: false, matched: false })))
  }, [])

  useEffect(() => {
    if (flipped.length !== 2 || !cards.length) return
    const [a, b] = flipped
    if (a >= cards.length || b >= cards.length) return
    if (cards[a].symbol === cards[b].symbol) {
      const unmatchedCount = cards.filter((c) => !c.matched).length
      setCards((prev) => prev.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c)))
      setFlipped([])
      setMoves((m) => m + 1)
      if (unmatchedCount === 2 && !completedRef.current) {
        completedRef.current = true
        setTimeout(() => {
          setWon(true)
          onComplete?.()
        }, 500)
      }
    } else {
      setTimeout(() => {
        setCards((prev) => prev.map((c) => ({ ...c, flipped: false })))
        setFlipped([])
      }, 1000)
      setMoves((m) => m + 1)
    }
  }, [flipped, cards, onComplete])

  const handleClick = (i: number) => {
    if (cards[i].flipped || cards[i].matched || flipped.length >= 2 || won) return
    setCards((prev) => prev.map((c, idx) => (idx === i ? { ...c, flipped: true } : c)))
    setFlipped((prev) => [...prev, i])
  }

  return (
    <div className="memory-game">
      <h3 className="memory-game__title">Игра на память</h3>
      <p className="memory-game__stats">Ходов: {moves}</p>
      {won ? (
        <div className="memory-game__won">
          <p>Победа! Ходов: {moves}</p>
          <button type="button" className="memory-game__restart" onClick={() => window.location.reload()}>
            Заново
          </button>
        </div>
      ) : (
        <div className="memory-game__grid">
          {cards.map((card, i) => (
            <button
              key={card.id}
              type="button"
              className={`memory-game__card ${card.flipped || card.matched ? 'memory-game__card--flipped' : ''} ${card.matched ? 'memory-game__card--matched' : ''}`}
              onClick={() => handleClick(i)}
              disabled={card.flipped || card.matched}
            >
              {card.flipped || card.matched ? card.symbol : '?'}
            </button>
          ))}
        </div>
      )}
      <button type="button" className="memory-game__back" onClick={onBack}>Назад к играм</button>
    </div>
  )
}
