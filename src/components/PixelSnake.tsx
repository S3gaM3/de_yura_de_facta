import { useState, useEffect, useRef } from 'react'
import './PixelSnake.css'

type MathProblem = {
  question: string
  answer: number
  options: number[]
}

type SnakeMode = 'chase' | 'avoid' | 'follow' | 'teleport' | 'multiply'

// Генерация вопросов из школьной программы
function generateMathProblem(): MathProblem {
  const type = Math.floor(Math.random() * 15)
  let question = ''
  let answer = 0

  switch (type) {
    case 0: {
      const a = Math.floor(Math.random() * 20) + 1
      const b = Math.floor(Math.random() * 20) + 1
      answer = a + b
      question = `Сколько будет ${a} + ${b}?`
      break
    }
    case 1: {
      const a = Math.floor(Math.random() * 30) + 10
      const b = Math.floor(Math.random() * 10) + 1
      answer = a - b
      question = `Сколько будет ${a} - ${b}?`
      break
    }
    case 2: {
      const a = Math.floor(Math.random() * 10) + 1
      const b = Math.floor(Math.random() * 10) + 1
      answer = a * b
      question = `Сколько будет ${a} × ${b}?`
      break
    }
    case 3: {
      const b = Math.floor(Math.random() * 9) + 2
      const answer = Math.floor(Math.random() * 10) + 1
      const a = b * answer
      question = `Сколько будет ${a} ÷ ${b}?`
      break
    }
    case 4: {
      const x = Math.floor(Math.random() * 20) + 1
      const a = Math.floor(Math.random() * 5) + 1
      answer = x
      question = `Решите: ${a}x = ${a * x}. Найдите x.`
      break
    }
    case 5: {
      answer = 1147
      question = `В каком году была основана Москва?`
      break
    }
    case 6: {
      answer = 1941
      question = `В каком году началась Великая Отечественная война?`
      break
    }
    case 7: {
      answer = 5
      question = `Сколько океанов на Земле?`
      break
    }
    case 8: {
      answer = 6
      question = `Сколько материков на Земле?`
      break
    }
    case 9: {
      answer = 46
      question = `Сколько хромосом у человека?`
      break
    }
    case 10: {
      answer = 300000
      question = `Скорость света в вакууме (км/с, округленно)?`
      break
    }
    case 11: {
      answer = 4
      question = `Сколько томов в романе "Война и мир" Толстого?`
      break
    }
    case 12: {
      answer = 8
      question = `Какой атомный номер у кислорода?`
      break
    }
    case 13: {
      const side = Math.floor(Math.random() * 10) + 1
      answer = side * side
      question = `Площадь квадрата со стороной ${side} равна?`
      break
    }
    case 14: {
      const side = Math.floor(Math.random() * 10) + 1
      answer = side * 4
      question = `Периметр квадрата со стороной ${side} равен?`
      break
    }
    default: {
      const a = Math.floor(Math.random() * 15) + 1
      const b = Math.floor(Math.random() * 15) + 1
      answer = a + b
      question = `Сколько будет ${a} + ${b}?`
    }
  }

  const options = [answer]
  while (options.length < 4) {
    let wrong: number
    if (answer < 100) {
      wrong = answer + Math.floor(Math.random() * 20) - 10
      if (wrong < 0) wrong = Math.abs(wrong)
    } else if (answer < 10000) {
      wrong = answer + Math.floor(Math.random() * 100) - 50
      if (wrong < 0) wrong = Math.abs(wrong)
    } else {
      wrong = answer + Math.floor(Math.random() * 100000) - 50000
      if (wrong < 0) wrong = Math.abs(wrong)
    }
    if (wrong !== answer && !options.includes(wrong)) {
      options.push(wrong)
    }
  }
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]]
  }

  return { question, answer, options }
}

export function PixelSnake() {
  const [active, setActive] = useState(true)
  const [mode, setMode] = useState<SnakeMode>('chase')
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [snakes, setSnakes] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [showProblem, setShowProblem] = useState(false)
  const [problem, setProblem] = useState<MathProblem | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [correct, setCorrect] = useState<boolean | null>(null)
  const [trapped, setTrapped] = useState(false)
  const [trapTimeLeft, setTrapTimeLeft] = useState(150)
  const [speed] = useState(0.008)
  const [score, setScore] = useState(0)
  const trapStartTimeRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number>()
  const snakeRef = useRef<HTMLDivElement>(null)
  const trapZoneRef = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth - 120 : 0,
    y: typeof window !== 'undefined' ? 20 : 0,
    width: 100,
    height: 100,
  })
  const modeChangeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastModeChangeRef = useRef<number>(0)

  // Инициализация
  useEffect(() => {
    setPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    setSnakes([{ id: 0, x: window.innerWidth / 2, y: window.innerHeight / 2 }])
  }, [])

  // Блокировка при открытом модальном окне
  useEffect(() => {
    if (showProblem) {
      document.body.style.overflow = 'hidden'
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

  // Отслеживание курсора
  useEffect(() => {
    if (!active) return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [active])

  // Смена режима каждые 30 секунд
  useEffect(() => {
    if (!active) return

    const changeMode = () => {
      const modes: SnakeMode[] = ['chase', 'avoid', 'follow', 'teleport', 'multiply']
      const currentIndex = modes.indexOf(mode)
      const nextIndex = (currentIndex + 1) % modes.length
      const nextMode = modes[nextIndex]
      setMode(nextMode)
      lastModeChangeRef.current = Date.now()
      
      if (nextMode === 'multiply' && snakes.length === 1) {
        // Умножаем змейку
        setSnakes((prev) => [
          ...prev,
          { id: Date.now(), x: position.x + 50, y: position.y + 50 },
          { id: Date.now() + 1, x: position.x - 50, y: position.y - 50 },
        ])
      } else if (nextMode !== 'multiply' && snakes.length > 1) {
        // Возвращаемся к одной змейке
        setSnakes([{ id: 0, x: position.x, y: position.y }])
      }
    }

    modeChangeTimerRef.current = setInterval(changeMode, 30000)
    return () => {
      if (modeChangeTimerRef.current) {
        clearInterval(modeChangeTimerRef.current)
      }
    }
  }, [active, mode, position.x, position.y])

  // Клавиатурное управление (пробел для телепорта)
  useEffect(() => {
    if (!active || mode !== 'teleport') return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !showProblem) {
        e.preventDefault()
        // Телепортируем змейку в случайное место
        setPosition({
          x: Math.random() * (window.innerWidth - 100),
          y: Math.random() * (window.innerHeight - 100),
        })
        setScore((s) => s + 1)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [active, mode, showProblem])

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

  // Движение змейки
  useEffect(() => {
    if (!active || showProblem || trapped) return

    let lastTime = performance.now()
    const moveSnake = (currentTime: number) => {
      const deltaTime = Math.min((currentTime - lastTime) / 16, 2)
      lastTime = currentTime

      setPosition((prev) => {
        if (checkTrapZone(prev.x, prev.y)) {
          setTrapped(true)
          trapStartTimeRef.current = Date.now()
          setTrapTimeLeft(150)
          window.setTimeout(() => {
            setTrapped(false)
            trapStartTimeRef.current = null
            setTrapTimeLeft(150)
          }, 150000)
          return prev
        }

        const dx = mousePos.x - prev.x
        const dy = mousePos.y - prev.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 60 && mode === 'chase') {
          setProblem(generateMathProblem())
          setShowProblem(true)
          return prev
        }

        let moveX = 0
        let moveY = 0

        switch (mode) {
          case 'chase':
            // Преследование
            moveX = dx * speed * deltaTime
            moveY = dy * speed * deltaTime
            break
          case 'avoid':
            // Избегание - движется в противоположную сторону
            moveX = -dx * speed * deltaTime * 0.5
            moveY = -dy * speed * deltaTime * 0.5
            break
          case 'follow':
            // Следование с задержкой
            moveX = dx * speed * deltaTime * 0.7
            moveY = dy * speed * deltaTime * 0.7
            break
          case 'teleport':
            // Случайные телепортации
            if (Math.random() < 0.01) {
              return {
                x: Math.random() * (window.innerWidth - 100),
                y: Math.random() * (window.innerHeight - 100),
              }
            }
            moveX = dx * speed * deltaTime
            moveY = dy * speed * deltaTime
            break
          case 'multiply':
            // Ускоренное движение
            moveX = dx * speed * deltaTime * 1.5
            moveY = dy * speed * deltaTime * 1.5
            break
        }

        const newX = Math.max(0, Math.min(window.innerWidth - 50, prev.x + moveX))
        const newY = Math.max(0, Math.min(window.innerHeight - 50, prev.y + moveY))

        return { x: newX, y: newY }
      })

      // Движение дополнительных змеек в режиме multiply
      if (mode === 'multiply' && snakes.length > 1) {
        setSnakes((prevSnakes) =>
          prevSnakes.map((snake) => {
            const dx = mousePos.x - snake.x
            const dy = mousePos.y - snake.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 60) {
              setProblem(generateMathProblem())
              setShowProblem(true)
              return snake
            }

            const moveX = dx * speed * deltaTime * 1.2
            const moveY = dy * speed * deltaTime * 1.2

            return {
              ...snake,
              x: Math.max(0, Math.min(window.innerWidth - 50, snake.x + moveX)),
              y: Math.max(0, Math.min(window.innerHeight - 50, snake.y + moveY)),
            }
          })
        )
      }

      animationFrameRef.current = requestAnimationFrame(moveSnake)
    }

    animationFrameRef.current = requestAnimationFrame(moveSnake)
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [active, mousePos, showProblem, trapped, mode, speed, snakes])

  // Таймер загона
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
      trapZoneRef.current.y = 20
    }
    window.addEventListener('resize', updateTrapZone)
    return () => window.removeEventListener('resize', updateTrapZone)
  }, [])

  const handleAnswer = (option: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(option)
    const isCorrect = option === problem?.answer
    setCorrect(isCorrect)

    setTimeout(() => {
      if (isCorrect) {
        setScore((s) => s + 1)
        setShowProblem(false)
        setProblem(null)
        setSelectedAnswer(null)
        setCorrect(null)
        setActive(false)
        setTimeout(() => {
          setActive(true)
          setPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
          if (mode === 'multiply') {
            setSnakes([{ id: 0, x: window.innerWidth / 2, y: window.innerHeight / 2 }])
          }
        }, 5000)
      } else {
        setSelectedAnswer(null)
        setCorrect(null)
        setProblem(generateMathProblem())
      }
    }, 2000)
  }

  const getModeName = () => {
    switch (mode) {
      case 'chase': return 'Преследование'
      case 'avoid': return 'Избегание'
      case 'follow': return 'Следование'
      case 'teleport': return 'Телепорт (Пробел)'
      case 'multiply': return 'Умножение'
      default: return ''
    }
  }

  if (!active && !showProblem) return null

  return (
    <>
      {/* Информационная панель */}
      <div className="pixel-snake__info">
        <div className="pixel-snake__info-item">
          <span>Режим: {getModeName()}</span>
        </div>
        <div className="pixel-snake__info-item">
          <span>Счёт: {score}</span>
        </div>
        {mode === 'teleport' && (
          <div className="pixel-snake__info-item pixel-snake__info-item--hint">
            <span>Нажми ПРОБЕЛ для телепорта</span>
          </div>
        )}
      </div>

      {/* Загон */}
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
            <div className="pixel-snake__trap-countdown">{trapTimeLeft}с</div>
          </div>
        ) : (
          <div className="pixel-snake__trap-hint">Загони змейку сюда!</div>
        )}
      </div>

      {/* Змейки */}
      {snakes.map((snake) => (
        <div
          key={snake.id}
          ref={snake.id === 0 ? snakeRef : null}
          className={`pixel-snake ${trapped ? 'pixel-snake--trapped' : ''} ${mode === 'multiply' ? 'pixel-snake--multiply' : ''}`}
          style={{
            left: `${snake.id === 0 ? position.x : snake.x}px`,
            top: `${snake.id === 0 ? position.y : snake.y}px`,
          }}
        >
          <div className="pixel-snake__head">🐍</div>
        </div>
      ))}

      {/* Модальное окно с задачей */}
      {showProblem && problem && (
        <div className="pixel-snake__modal">
          <div className="pixel-snake__modal-content">
            <h3 className="pixel-snake__modal-title">🐍 Змейка догнала тебя!</h3>
            <p className="pixel-snake__modal-subtitle">Реши задачу, чтобы продолжить:</p>
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
