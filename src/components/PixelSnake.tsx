import { useState, useEffect, useRef } from 'react'
import { useAchievements } from '../contexts/AchievementContext'
import { addXP, XP_REWARDS } from '../lib/xp'
import './PixelSnake.css'

type MathProblem = {
  question: string
  answer: number
  options: number[]
}

// Генерация уравнений уровня 9 класса
function generateMathProblem(): MathProblem {
  const type = Math.floor(Math.random() * 5)
  let question = ''
  let answer = 0

  switch (type) {
    case 0: {
      // Квадратное уравнение: x² + bx + c = 0 (упрощенное)
      const root1 = Math.floor(Math.random() * 10) - 5
      const root2 = Math.floor(Math.random() * 10) - 5
      const b = -(root1 + root2)
      const c = root1 * root2
      answer = root1
      question = `Решите: x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0. Найдите один из корней.`
      break
    }
    case 1: {
      // Линейное уравнение
      const x = Math.floor(Math.random() * 20) - 10
      const a = Math.floor(Math.random() * 5) + 1
      const b = Math.floor(Math.random() * 10) - 5
      answer = x
      const result = a * x + b
      question = `Решите: ${a}x ${b >= 0 ? '+' : ''}${b} = ${result}. Найдите x.`
      break
    }
    case 2: {
      // Система уравнений (упрощенная)
      const x = Math.floor(Math.random() * 10) + 1
      const y = Math.floor(Math.random() * 10) + 1
      answer = x + y
      question = `Решите систему: x + y = ${answer}, x - y = ${x - y}. Найдите x + y.`
      break
    }
    case 3: {
      // Степени
      const base = Math.floor(Math.random() * 5) + 2
      const power = Math.floor(Math.random() * 3) + 2
      answer = Math.pow(base, power)
      question = `Вычислите: ${base}^${power}`
      break
    }
    case 4: {
      // Логарифмы (упрощенные)
      const value = Math.floor(Math.random() * 8) + 1
      answer = value
      question = `Решите: log₂(${Math.pow(2, value)}) = ?`
      break
    }
    default: {
      answer = Math.floor(Math.random() * 20) + 1
      question = `Вычислите: ${answer * 2} / 2`
    }
  }

  // Генерируем варианты ответов
  const options = [answer]
  while (options.length < 4) {
    const wrong = answer + Math.floor(Math.random() * 10) - 5
    if (wrong !== answer && !options.includes(wrong)) {
      options.push(wrong)
    }
  }
  // Перемешиваем
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]]
  }

  return { question, answer, options }
}

type PixelSnakeProps = {
  onCaught?: () => void
  onXPChange?: (newXP: ReturnType<typeof addXP>) => void
}

export function PixelSnake({ onCaught, onXPChange }: PixelSnakeProps) {
  const { unlocked } = useAchievements()
  const [active, setActive] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [showProblem, setShowProblem] = useState(false)
  const [problem, setProblem] = useState<MathProblem | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [correct, setCorrect] = useState<boolean | null>(null)
  const [trapped, setTrapped] = useState(false)
  const [trapTimer, setTrapTimer] = useState<number | null>(null)
  const [trapTimeLeft, setTrapTimeLeft] = useState(150)
  const trapStartTimeRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number>()
  const snakeRef = useRef<HTMLDivElement>(null)
  
  // Загон в правом нижнем углу (100x100px)
  const TRAP_ZONE = {
    x: typeof window !== 'undefined' ? window.innerWidth - 120 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight - 120 : 0,
    width: 100,
    height: 100,
  }

  // Блокировка скролла и взаимодействия при открытом модальном окне
  useEffect(() => {
    if (showProblem) {
      // Блокируем скролл
      document.body.style.overflow = 'hidden'
      // Блокируем взаимодействие с элементами под модальным окном
      document.body.style.pointerEvents = 'none'
      const modalContent = document.querySelector('.pixel-snake__modal-content')
      if (modalContent) {
        ;(modalContent as HTMLElement).style.pointerEvents = 'all'
      }
    } else {
      document.body.style.overflow = ''
      document.body.style.pointerEvents = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.pointerEvents = ''
    }
  }, [showProblem])

  // Активация после 5 достижений
  useEffect(() => {
    if (unlocked.length >= 5 && !active) {
      setActive(true)
      // Начальная позиция змейки
      setPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    }
  }, [unlocked.length, active])

  // Отслеживание курсора
  useEffect(() => {
    if (!active) return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [active])

  // Проверка попадания в загон
  const checkTrapZone = (x: number, y: number): boolean => {
    return (
      x >= TRAP_ZONE.x &&
      x <= TRAP_ZONE.x + TRAP_ZONE.width &&
      y >= TRAP_ZONE.y &&
      y <= TRAP_ZONE.y + TRAP_ZONE.height
    )
  }

  // Движение змейки к курсору
  useEffect(() => {
    if (!active || showProblem || trapped) return

    let lastTime = performance.now()
    const moveSnake = (currentTime: number) => {
      const deltaTime = Math.min((currentTime - lastTime) / 16, 2) // Ограничение для стабильности
      lastTime = currentTime

      setPosition((prev) => {
        // Проверяем, попала ли змейка в загон
        if (checkTrapZone(prev.x, prev.y) && !trapped) {
          setTrapped(true)
          trapStartTimeRef.current = Date.now()
          setTrapTimeLeft(150)
          // Таймер на 2.5 минуты (150 секунд)
          const timer = window.setTimeout(() => {
            setTrapped(false)
            setTrapTimer(null)
            trapStartTimeRef.current = null
            setTrapTimeLeft(150)
          }, 150000) // 2.5 минуты = 150000 мс
          setTrapTimer(timer)
          return prev // Останавливаем движение
        }

        const dx = mousePos.x - prev.x
        const dy = mousePos.y - prev.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 60) {
          // Догнала курсор - показываем задачу
          setProblem(generateMathProblem())
          setShowProblem(true)
          onCaught?.()
          return prev
        }

        const speed = Math.min(distance * 0.008 * deltaTime, 1) // Максимальная скорость (замедлено в 10 раз)
        const angle = Math.atan2(dy, dx)
        
        return {
          x: prev.x + Math.cos(angle) * speed,
          y: prev.y + Math.sin(angle) * speed,
        }
      })
      animationFrameRef.current = requestAnimationFrame(moveSnake)
    }

    animationFrameRef.current = requestAnimationFrame(moveSnake)
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (trapTimer) {
        clearTimeout(trapTimer)
      }
    }
  }, [active, mousePos, showProblem, onCaught, trapped, trapTimer])

  const handleAnswer = (option: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(option)
    const isCorrect = option === problem?.answer
    setCorrect(isCorrect)

    setTimeout(() => {
      if (isCorrect) {
        // Правильный ответ - начисляем XP и закрываем модальное окно
        const newXP = addXP(XP_REWARDS.mathProblemSolved)
        onXPChange?.(newXP)
        setShowProblem(false)
        setProblem(null)
        setSelectedAnswer(null)
        setCorrect(null)
        // Змейка исчезает на 10 секунд
        setActive(false)
        setTimeout(() => {
          if (unlocked.length >= 5) {
            setActive(true)
          }
        }, 10000)
      } else {
        // Неправильный ответ - генерируем новую задачу, но модальное окно остается открытым
        setSelectedAnswer(null)
        setCorrect(null)
        setProblem(generateMathProblem())
      }
    }, 2000)
  }

  // Обновление таймера загона
  useEffect(() => {
    if (!trapped) return
    
    const interval = setInterval(() => {
      if (trapStartTimeRef.current) {
        const elapsed = Math.floor((Date.now() - trapStartTimeRef.current) / 1000)
        const remaining = Math.max(0, 150 - elapsed)
        setTrapTimeLeft(remaining)
        if (remaining === 0) {
          clearInterval(interval)
        }
      }
    }, 1000)
    
    return () => clearInterval(interval)
  }, [trapped])

  // Обновление позиции загона при изменении размера окна
  useEffect(() => {
    const updateTrapZone = () => {
      TRAP_ZONE.x = window.innerWidth - 120
      TRAP_ZONE.y = window.innerHeight - 120
    }
    window.addEventListener('resize', updateTrapZone)
    return () => window.removeEventListener('resize', updateTrapZone)
  }, [])

  if (!active) return null

  return (
    <>
      {/* Загон в правом нижнем углу */}
      <div
        className={`pixel-snake__trap ${trapped ? 'pixel-snake__trap--active' : ''}`}
        style={{
          left: `${TRAP_ZONE.x}px`,
          top: `${TRAP_ZONE.y}px`,
          width: `${TRAP_ZONE.width}px`,
          height: `${TRAP_ZONE.height}px`,
        }}
      >
        {trapped ? (
          <div className="pixel-snake__trap-timer">
            <div className="pixel-snake__trap-text">Змейка поймана!</div>
            <div className="pixel-snake__trap-countdown">
              {trapTimeLeft}с
            </div>
          </div>
        ) : (
          <div className="pixel-snake__trap-hint">Загони змейку сюда!</div>
        )}
      </div>
      <div
        ref={snakeRef}
        className={`pixel-snake ${trapped ? 'pixel-snake--trapped' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div className="pixel-snake__head">🐍</div>
      </div>
      {showProblem && problem && (
        <div 
          className="pixel-snake__modal"
          onClick={(e) => {
            // Предотвращаем закрытие при клике вне контента
            e.stopPropagation()
          }}
          onContextMenu={(e) => {
            // Блокируем контекстное меню
            e.preventDefault()
          }}
        >
          <div 
            className="pixel-snake__modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="pixel-snake__modal-title">🐍 Змейка догнала тебя!</h3>
            <p className="pixel-snake__modal-subtitle">Реши уравнение, чтобы продолжить:</p>
            <p className="pixel-snake__modal-question">{problem.question}</p>
            <div className="pixel-snake__modal-options">
              {problem.options.map((option, i) => (
                <button
                  key={i}
                  type="button"
                  className={`pixel-snake__modal-btn ${
                    selectedAnswer === option
                      ? correct
                        ? 'pixel-snake__modal-btn--correct'
                        : 'pixel-snake__modal-btn--wrong'
                      : ''
                  }`}
                  onClick={() => handleAnswer(option)}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </button>
              ))}
            </div>
            {correct === false && (
              <p className="pixel-snake__modal-hint">❌ Неправильно! Попробуй ещё раз.</p>
            )}
            {correct === true && (
              <p className="pixel-snake__modal-success">✅ Правильно! Можешь продолжать.</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
