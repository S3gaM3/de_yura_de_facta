import { useState } from 'react'
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

export function Quiz({ title, questions, onBack, onComplete }: QuizProps) {
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)

  const q = questions[index]
  const isLast = index === questions.length - 1

  const handleAnswer = (choice: number) => {
    if (answered) return
    setSelectedChoice(choice)
    setAnswered(true)
    if (choice === q.correct) setScore((s) => s + 1)
  }

  const handleNext = () => {
    if (isLast) {
      setFinished(true)
      onComplete?.()
    } else {
      setIndex((i) => i + 1)
      setAnswered(false)
      setSelectedChoice(null)
    }
  }

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
        {q.options.map((opt, i) => (
          <li key={i}>
            <button
              type="button"
              className={`quiz__opt ${answered ? (i === q.correct ? 'quiz__opt--correct' : (selectedChoice === i ? 'quiz__opt--wrong' : '')) : ''}`}
              onClick={() => handleAnswer(i)}
              disabled={answered}
            >
              {opt}
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
