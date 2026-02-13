import { useState, useMemo, useEffect } from 'react'
import { PlayerStats } from '../../lib/legalGame'
import { getQuestionsForLevel, LegalQuestion } from '../../lib/legalQuestions'
import './Training.css'

type IntellectTrainingProps = {
  stats: PlayerStats
  onXPGain: (xp: number) => void
  onBack: () => void
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function IntellectTraining({ stats, onXPGain, onBack }: IntellectTrainingProps) {
  const [currentQuestion, setCurrentQuestion] = useState<LegalQuestion | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([])

  const required = 50 * (stats.intellect + 1)
  const currentXP = stats.intellectXP
  const progress = (currentXP / required) * 100

  const questions = useMemo(() => {
    return shuffleArray(getQuestionsForLevel(stats.level))
  }, [stats.level])

  const loadNextQuestion = () => {
    if (questions.length === 0) return
    
    const question = questions[totalAnswered % questions.length]
    const shuffled = shuffleArray(question.options)
    setCurrentQuestion(question)
    setShuffledOptions(shuffled)
    setSelectedAnswer(null)
    setIsCorrect(null)
  }

  useEffect(() => {
    if (questions.length > 0 && !currentQuestion) {
      loadNextQuestion()
    }
  }, [questions.length, currentQuestion])

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null || !currentQuestion) return
    
    const correctIndex = shuffledOptions.findIndex(opt => opt === currentQuestion.options[currentQuestion.correct])
    const isRight = index === correctIndex
    
    setSelectedAnswer(index)
    setIsCorrect(isRight)
    setTotalAnswered(prev => prev + 1)
    
    if (isRight) {
      setCorrectCount(prev => prev + 1)
      const xpGain = Math.max(1, Math.floor(currentQuestion.difficulty / 2))
      onXPGain(xpGain)
    }
    
    setTimeout(() => {
      loadNextQuestion()
    }, 2000)
  }

  if (!currentQuestion) {
    return (
      <div className="training">
        <div className="training__header">
          <button className="training__back" onClick={onBack}>← Назад</button>
          <h2 className="training__title">🧠 Тренировка интеллекта</h2>
        </div>
        <p>Загрузка вопросов...</p>
      </div>
    )
  }

  return (
    <div className="training">
      <div className="training__header">
        <button className="training__back" onClick={onBack}>← Назад</button>
        <h2 className="training__title">🧠 Тренировка интеллекта</h2>
        <p className="training__subtitle">Судебные дебаты</p>
      </div>

      <div className="training__stats">
        <div className="training__stat">
          <span>Интеллект: {stats.intellect}</span>
          <div className="training__progress">
            <div className="training__progress-bar" style={{ width: `${progress}%` }} />
            <span className="training__progress-text">{currentXP} / {required}</span>
          </div>
        </div>
        <div className="training__stat">
          <span>Правильных ответов: {correctCount} / {totalAnswered}</span>
          {totalAnswered > 0 && (
            <span>Точность: {Math.round((correctCount / totalAnswered) * 100)}%</span>
          )}
        </div>
      </div>

      <div className="intellect-training__area">
        <div className="intellect-training__question">
          <p className="intellect-training__question-text">{currentQuestion.question}</p>
          <p className="intellect-training__question-category">Категория: {currentQuestion.category}</p>
        </div>

        <div className="intellect-training__options">
          {shuffledOptions.map((option, index) => {
            const correctIndex = shuffledOptions.findIndex(opt => opt === currentQuestion.options[currentQuestion.correct])
            let className = 'intellect-training__option'
            
            if (selectedAnswer !== null) {
              if (index === correctIndex) {
                className += ' intellect-training__option--correct'
              } else if (index === selectedAnswer && !isCorrect) {
                className += ' intellect-training__option--wrong'
              }
            }
            
            return (
              <button
                key={index}
                className={className}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
              >
                <span className="intellect-training__option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="intellect-training__option-text">{option}</span>
              </button>
            )
          })}
        </div>

        {selectedAnswer !== null && (
          <div className={`intellect-training__feedback ${isCorrect ? 'intellect-training__feedback--correct' : 'intellect-training__feedback--wrong'}`}>
            {isCorrect ? '✅ Правильно!' : '❌ Неправильно. Попробуй ещё раз.'}
          </div>
        )}
      </div>
    </div>
  )
}
