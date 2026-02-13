import { useState, useEffect } from 'react'
import './Quiz.css'

export type QuizQuestion = {
  question: string
  options: string[]
  correct: number
}

type QuizProps = {
  title: string
  questions: QuizQuestion[]
  onBack: () => void
  onComplete?: () => void
}

// Перемешивание массива (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function Quiz({ title, questions, onBack, onComplete }: QuizProps) {
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const [shuffledOptions, setShuffledOptions] = useState<{ options: string[]; correctIndex: number } | null>(null)

  const q = questions[index]
  const isLast = index === questions.length - 1

  // Перемешиваем варианты ответов при смене вопроса
  useEffect(() => {
    if (q) {
      const shuffled = shuffleArray(q.options)
      const correctIndex = shuffled.findIndex((opt) => opt === q.options[q.correct])
      setShuffledOptions({ options: shuffled, correctIndex })
      setAnswered(false)
      setSelectedChoice(null)
    }
  }, [index, q])

  const handleAnswer = (choice: number) => {
    if (answered || !shuffledOptions) return
    setSelectedChoice(choice)
    setAnswered(true)
    if (choice === shuffledOptions.correctIndex) setScore((s) => s + 1)
  }

  const handleNext = () => {
    if (isLast) {
      setFinished(true)
      onComplete?.()
    } else {
      setIndex((i) => i + 1)
    }
  }

  if (!q || !shuffledOptions) return null

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="quiz">
        <h3 className="quiz__game-title">{title}</h3>
        <div className="quiz__result">
          <p>Результат: {score} из {questions.length} ({pct}%)</p>
          <p className="quiz__result-msg">
            {pct === 100 ? 'Идеально! ♥' : pct >= 70 ? 'Отлично!' : 'Попробуй ещё раз.'}
          </p>
        </div>
        <button type="button" className="quiz__back" onClick={onBack}>Назад к играм</button>
      </div>
    )
  }

  return (
    <div className="quiz">
      <h3 className="quiz__game-title">{title}</h3>
      <p className="quiz__progress">{index + 1} / {questions.length}</p>
      <p className="quiz__question">{q.question}</p>
      <ul className="quiz__options">
        {shuffledOptions.options.map((opt, i) => (
          <li key={i}>
            <button
              type="button"
              className={`quiz__opt ${answered ? (i === shuffledOptions.correctIndex ? 'quiz__opt--correct' : (selectedChoice === i ? 'quiz__opt--wrong' : '')) : ''}`}
              onClick={() => handleAnswer(i)}
              disabled={answered}
            >
              <span className="quiz__opt-letter">{String.fromCharCode(65 + i)}</span>
              <span className="quiz__opt-text">{opt}</span>
            </button>
          </li>
        ))}
      </ul>
      {answered && (
        <button type="button" className="quiz__next" onClick={handleNext}>
          {isLast ? 'Результат' : 'Далее'}
        </button>
      )}
      <button type="button" className="quiz__back quiz__back--inline" onClick={onBack}>Назад</button>
    </div>
  )
}
