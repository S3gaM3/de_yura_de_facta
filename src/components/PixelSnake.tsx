import { useState, useEffect, useRef } from 'react'
import { useAchievements } from '../contexts/AchievementContext'
import { addXP, XP_REWARDS } from '../lib/xp'
import './PixelSnake.css'

type MathProblem = {
  question: string
  answer: number
  options: number[]
}

// Генерация упрощенных вопросов из школьной программы
function generateMathProblem(): MathProblem {
  const type = Math.floor(Math.random() * 15)
  let question = ''
  let answer = 0

  switch (type) {
    case 0: {
      // Простая арифметика
      const a = Math.floor(Math.random() * 20) + 1
      const b = Math.floor(Math.random() * 20) + 1
      answer = a + b
      question = `Сколько будет ${a} + ${b}?`
      break
    }
    case 1: {
      // Вычитание
      const a = Math.floor(Math.random() * 30) + 10
      const b = Math.floor(Math.random() * 10) + 1
      answer = a - b
      question = `Сколько будет ${a} - ${b}?`
      break
    }
    case 2: {
      // Умножение
      const a = Math.floor(Math.random() * 10) + 1
      const b = Math.floor(Math.random() * 10) + 1
      answer = a * b
      question = `Сколько будет ${a} × ${b}?`
      break
    }
    case 3: {
      // Деление
      const b = Math.floor(Math.random() * 9) + 2
      const answer = Math.floor(Math.random() * 10) + 1
      const a = b * answer
      question = `Сколько будет ${a} ÷ ${b}?`
      break
    }
    case 4: {
      // Простое уравнение
      const x = Math.floor(Math.random() * 20) + 1
      const a = Math.floor(Math.random() * 5) + 1
      answer = x
      question = `Решите: ${a}x = ${a * x}. Найдите x.`
      break
    }
    case 5: {
      // История: Год основания Москвы
      answer = 1147
      question = `В каком году была основана Москва?`
      break
    }
    case 6: {
      // История: Год начала ВОВ
      answer = 1941
      question = `В каком году началась Великая Отечественная война?`
      break
    }
    case 7: {
      // География: Количество океанов
      answer = 5
      question = `Сколько океанов на Земле?`
      break
    }
    case 8: {
      // География: Количество материков
      answer = 6
      question = `Сколько материков на Земле?`
      break
    }
    case 9: {
      // Биология: Количество хромосом у человека
      answer = 46
      question = `Сколько хромосом у человека?`
      break
    }
    case 10: {
      // Физика: Скорость света (округленно)
      answer = 300000
      question = `Скорость света в вакууме (км/с, округленно)?`
      break
    }
    case 11: {
      // Литература: Количество томов "Войны и мира"
      answer = 4
      question = `Сколько томов в романе "Война и мир" Толстого?`
      break
    }
    case 12: {
      // Химия: Атомный номер кислорода
      answer = 8
      question = `Какой атомный номер у кислорода?`
      break
    }
    case 13: {
      // Математика: Площадь квадрата
      const side = Math.floor(Math.random() * 10) + 1
      answer = side * side
      question = `Площадь квадрата со стороной ${side} равна?`
      break
    }
    case 14: {
      // Математика: Периметр квадрата
      const side = Math.floor(Math.random() * 10) + 1
      answer = side * 4
      question = `Периметр квадрата со стороной ${side} равен?`
      break
    }
    default: {
      // Простая арифметика по умолчанию
      const a = Math.floor(Math.random() * 15) + 1
      const b = Math.floor(Math.random() * 15) + 1
      answer = a + b
      question = `Сколько будет ${a} + ${b}?`
    }
  }

  // Генерируем варианты ответов
  const options = [answer]
  while (options.length < 4) {
    let wrong: number
    if (answer < 100) {
      // Для маленьких чисел
      wrong = answer + Math.floor(Math.random() * 20) - 10
      if (wrong < 0) wrong = Math.abs(wrong)
    } else if (answer < 10000) {
      // Для средних чисел (годы, хромосомы)
      wrong = answer + Math.floor(Math.random() * 100) - 50
      if (wrong < 0) wrong = Math.abs(wrong)
    } else {
      // Для больших чисел (скорость света)
      wrong = answer + Math.floor(Math.random() * 100000) - 50000
      if (wrong < 0) wrong = Math.abs(wrong)
    }
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
  const trapZoneRef = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth - 120 : 0,
    y: typeof window !== 'undefined' ? 20 : 0, // Правый верхний угол
    width: 100,
    height: 100,
  })

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
    const zone = trapZoneRef.current
    return (
      x >= zone.x &&
      x <= zone.x + zone.width &&
      y >= zone.y &&
      y <= zone.y + zone.height
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
        if (checkTrapZone(prev.x, prev.y)) {
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
    }
  }, [active, mousePos, showProblem, onCaught, trapped])

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (trapTimer) {
        clearTimeout(trapTimer)
      }
    }
  }, [trapTimer])

  const reactivateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const answerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleAnswer = (option: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(option)
    const isCorrect = option === problem?.answer
    setCorrect(isCorrect)

    if (answerTimerRef.current) {
      clearTimeout(answerTimerRef.current)
    }

    answerTimerRef.current = setTimeout(() => {
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
        if (reactivateTimerRef.current) {
          clearTimeout(reactivateTimerRef.current)
        }
        reactivateTimerRef.current = setTimeout(() => {
          if (unlocked.length >= 5 && !trapped) {
            setActive(true)
            setPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
          }
          reactivateTimerRef.current = null
        }, 10000)
      } else {
        // Неправильный ответ - генерируем новую задачу, но модальное окно остается открытым
        setSelectedAnswer(null)
        setCorrect(null)
        setProblem(generateMathProblem())
      }
      answerTimerRef.current = null
    }, 2000)
  }

  // Очистка таймеров при размонтировании
  useEffect(() => {
    return () => {
      if (answerTimerRef.current) {
        clearTimeout(answerTimerRef.current)
      }
      if (reactivateTimerRef.current) {
        clearTimeout(reactivateTimerRef.current)
      }
    }
  }, [])

  // Очистка таймера реактивации при размонтировании
  useEffect(() => {
    return () => {
      if (reactivateTimerRef.current) {
        clearTimeout(reactivateTimerRef.current)
      }
    }
  }, [])

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
      trapZoneRef.current.x = window.innerWidth - 120
      trapZoneRef.current.y = 20 // Правый верхний угол
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
          left: `${trapZoneRef.current.x}px`,
          top: `${trapZoneRef.current.y}px`,
          width: `${trapZoneRef.current.width}px`,
          height: `${trapZoneRef.current.height}px`,
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
