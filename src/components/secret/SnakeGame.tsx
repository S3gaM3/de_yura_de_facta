import { useState, useEffect, useCallback, useRef } from 'react'
import './SnakeGame.css'

const GRID_SIZE = 20
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_DIRECTION = { x: 1, y: 0 }
const GAME_SPEED = 150

type SnakeGameProps = {
  onBack: () => void
  onComplete?: () => void
}

export function SnakeGame({ onBack, onComplete }: SnakeGameProps) {
  const [snake, setSnake] = useState(INITIAL_SNAKE)
  const [food, setFood] = useState({ x: 15, y: 15 })
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const directionRef = useRef(INITIAL_DIRECTION)

  const generateFood = useCallback(() => {
    const x = Math.floor(Math.random() * GRID_SIZE)
    const y = Math.floor(Math.random() * GRID_SIZE)
    return { x, y }
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key
      if (key === 'ArrowUp' && directionRef.current.y === 0) {
        directionRef.current = { x: 0, y: -1 }
      } else if (key === 'ArrowDown' && directionRef.current.y === 0) {
        directionRef.current = { x: 0, y: 1 }
      } else if (key === 'ArrowLeft' && directionRef.current.x === 0) {
        directionRef.current = { x: -1, y: 0 }
      } else if (key === 'ArrowRight' && directionRef.current.x === 0) {
        directionRef.current = { x: 1, y: 0 }
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  useEffect(() => {
    if (gameOver) return
    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = { x: prev[0].x + directionRef.current.x, y: prev[0].y + directionRef.current.y }
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true)
          return prev
        }
        if (prev.some((s) => s.x === head.x && s.y === head.y)) {
          setGameOver(true)
          return prev
        }
        const newSnake = [head, ...prev]
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => {
            const next = s + 10
            if (next >= 50) {
              setTimeout(() => onComplete?.(), 500)
            }
            return next
          })
          setFood(generateFood())
          return newSnake
        }
        return newSnake.slice(0, -1)
      })
    }, GAME_SPEED)
    return () => clearInterval(interval)
  }, [food, gameOver, generateFood, onComplete])

  return (
    <div className="snake-game">
      <h3 className="snake-game__title">Змейка</h3>
      <p className="snake-game__score">Счёт: {score}</p>
      {gameOver ? (
        <div className="snake-game__over">
          <p>Игра окончена! Счёт: {score}</p>
          <button type="button" className="snake-game__restart" onClick={() => window.location.reload()}>
            Заново
          </button>
        </div>
      ) : (
        <>
          <div className="snake-game__grid">
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
              const x = i % GRID_SIZE
              const y = Math.floor(i / GRID_SIZE)
              const isSnake = snake.some((s) => s.x === x && s.y === y)
              const isHead = snake[0]?.x === x && snake[0]?.y === y
              const isFood = food.x === x && food.y === y
              return (
                <div
                  key={i}
                  className={`snake-game__cell ${isSnake ? 'snake-game__cell--snake' : ''} ${isHead ? 'snake-game__cell--head' : ''} ${isFood ? 'snake-game__cell--food' : ''}`}
                />
              )
            })}
          </div>
          <p className="snake-game__hint">Используй стрелки для управления</p>
        </>
      )}
      <button type="button" className="snake-game__back" onClick={onBack}>Назад к играм</button>
    </div>
  )
}
