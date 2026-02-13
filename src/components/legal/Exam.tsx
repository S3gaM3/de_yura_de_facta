import { useState, useEffect, useRef, useMemo } from 'react'
import { PlayerStats, getTitle } from '../../lib/legalGame'
import { getExamQuestions, LegalQuestion } from '../../lib/legalQuestions'
import './Exam.css'

type ExamProps = {
  examLevel: number
  stats: PlayerStats // Может использоваться для будущих проверок
  onComplete: (passed: boolean) => void
  onBack: () => void
}

type ExamStage = 'strength' | 'agility' | 'intellect' | 'complete'

export function Exam({ examLevel, stats: _stats, onComplete, onBack }: ExamProps) {
  const [stage, setStage] = useState<ExamStage>('strength')
  const [strengthClicks, setStrengthClicks] = useState(0)
  const [strengthTimeLeft, setStrengthTimeLeft] = useState(0)
  const [agilityTargets, setAgilityTargets] = useState<Array<{ id: number; x: number; y: number; appearedAt: number }>>([])
  const [agilityHit, setAgilityHit] = useState(0)
  const [intellectQuestions, setIntellectQuestions] = useState<LegalQuestion[]>([])
  const [currentIntellectQ, setCurrentIntellectQ] = useState(0)
  const [intellectAnswers, setIntellectAnswers] = useState<boolean[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const targetIdRef = useRef(0)

  // Параметры экзамена в зависимости от уровня
  const examParams = useMemo(() => ({
    strengthClicksRequired: Math.min(100 + Math.floor(examLevel / 10) * 100, 1000),
    strengthTime: Math.max(60, 120 - Math.floor(examLevel / 10) * 10),
    agilityTargetsRequired: Math.min(10 + Math.floor(examLevel / 10) * 5, 100),
    agilityTargetLifetime: Math.max(500, 2000 - Math.floor(examLevel / 10) * 150),
    intellectQuestionsCount: Math.min(3 + Math.floor(examLevel / 10), 10),
  }), [examLevel])

  useEffect(() => {
    const questions = getExamQuestions(examLevel)
    const sliced = questions.slice(0, examParams.intellectQuestionsCount)
    setIntellectQuestions(sliced)
    if (sliced.length > 0) {
      const q = sliced[0]
      setShuffledOptions(shuffleArray(q.options))
    }
  }, [examLevel, examParams])

  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Этап силы
  useEffect(() => {
    if (stage !== 'strength') return
    
    setStrengthTimeLeft(examParams.strengthTime)
    const timer = setInterval(() => {
      setStrengthTimeLeft(prev => {
        if (prev <= 1) {
          if (strengthClicks >= examParams.strengthClicksRequired) {
            setTimeout(() => setStage('agility'), 500)
          } else {
            setTimeout(() => onComplete(false), 500)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [stage, strengthClicks, examParams])

  const handleStrengthClick = () => {
    if (stage !== 'strength' || strengthTimeLeft <= 0) return
    setStrengthClicks(prev => {
      const newClicks = prev + 1
      if (newClicks >= examParams.strengthClicksRequired && stage === 'strength') {
        setTimeout(() => setStage('agility'), 500)
      }
      return newClicks
    })
  }

  // Этап ловкости
  useEffect(() => {
    if (stage !== 'agility') return
    
    const spawnTarget = () => {
      if (!containerRef.current) return
      
      if (agilityHit >= examParams.agilityTargetsRequired) {
        setTimeout(() => setStage('intellect'), 500)
        return
      }
      
      const container = containerRef.current
      const x = Math.random() * (container.clientWidth - 80)
      const y = Math.random() * (container.clientHeight - 80)
      
      const target = {
        id: targetIdRef.current++,
        x,
        y,
        appearedAt: Date.now(),
      }
      
      setAgilityTargets(prev => [...prev, target])
      
      setTimeout(() => {
        setAgilityTargets(prev => prev.filter(t => t.id !== target.id))
      }, examParams.agilityTargetLifetime)
    }

    spawnTarget()
    const interval = setInterval(() => {
      if (agilityHit < examParams.agilityTargetsRequired) {
        spawnTarget()
      }
    }, examParams.agilityTargetLifetime / 2)
    
    return () => clearInterval(interval)
  }, [stage, agilityHit, examParams])

  const handleAgilityClick = (targetId: number) => {
    setAgilityTargets(prev => prev.filter(t => t.id !== targetId))
    setAgilityHit(prev => {
      const newHit = prev + 1
      if (newHit >= examParams.agilityTargetsRequired && stage === 'agility') {
        setTimeout(() => setStage('intellect'), 500)
      }
      return newHit
    })
  }

  // Этап интеллекта
  const handleIntellectAnswer = (index: number) => {
    if (selectedAnswer !== null || !intellectQuestions[currentIntellectQ]) return
    
    const q = intellectQuestions[currentIntellectQ]
    const correctIndex = shuffledOptions.findIndex(opt => opt === q.options[q.correct])
    const isRight = index === correctIndex
    
    setSelectedAnswer(index)
    
    setTimeout(() => {
      const newAnswers = [...intellectAnswers, isRight]
      setIntellectAnswers(newAnswers)
      
      if (currentIntellectQ < intellectQuestions.length - 1) {
        setCurrentIntellectQ(prev => prev + 1)
        const nextQ = intellectQuestions[currentIntellectQ + 1]
        setShuffledOptions(shuffleArray(nextQ.options))
        setSelectedAnswer(null)
      } else {
        // Проверяем результат
        const correctCount = newAnswers.filter(a => a).length
        const required = Math.ceil(intellectQuestions.length * 0.8)
        if (correctCount >= required) {
          setStage('complete')
          setTimeout(() => onComplete(true), 2000)
        } else {
          setTimeout(() => onComplete(false), 2000)
        }
      }
    }, 2000)
  }

  return (
    <div className="exam">
      <div className="exam__header">
        <h2 className="exam__title">⚖️ Экзамен на {examLevel} уровень</h2>
        <p className="exam__subtitle">
          {stage === 'strength' && 'Этап 1/3: Марафон документов'}
          {stage === 'agility' && 'Этап 2/3: Поиск улик'}
          {stage === 'intellect' && 'Этап 3/3: Судебный допрос'}
          {stage === 'complete' && 'Экзамен пройден!'}
        </p>
      </div>

      {stage === 'strength' && (
        <div className="exam__stage">
          <div className="exam__stage-info">
            <p>Кликов: {strengthClicks} / {examParams.strengthClicksRequired}</p>
            <p>Время: {strengthTimeLeft}с</p>
          </div>
          <div className="exam__strength-area">
            <div className="exam__strength-stack">
              <div 
                className="exam__strength-docs"
                style={{ height: `${Math.max(20, 100 - (strengthClicks % 20) * 4)}px` }}
              />
            </div>
            <button 
              className="exam__strength-btn"
              onClick={handleStrengthClick}
              disabled={strengthTimeLeft <= 0}
            >
              Разобрать документ
            </button>
          </div>
        </div>
      )}

      {stage === 'agility' && (
        <div className="exam__stage">
          <div className="exam__stage-info">
            <p>Попаданий: {agilityHit} / {examParams.agilityTargetsRequired}</p>
          </div>
          <div className="exam__agility-area" ref={containerRef}>
            {agilityTargets.map(target => (
              <button
                key={target.id}
                className="exam__agility-target"
                style={{
                  left: `${target.x}px`,
                  top: `${target.y}px`,
                }}
                onClick={() => handleAgilityClick(target.id)}
              >
                🔍
              </button>
            ))}
          </div>
        </div>
      )}

      {stage === 'intellect' && intellectQuestions[currentIntellectQ] && (
        <div className="exam__stage">
          <div className="exam__stage-info">
            <p>Вопрос {currentIntellectQ + 1} / {intellectQuestions.length}</p>
            <p>Правильных: {intellectAnswers.filter(a => a).length}</p>
          </div>
          <div className="exam__intellect-area">
            <div className="exam__intellect-question">
              <p>{intellectQuestions[currentIntellectQ].question}</p>
            </div>
            <div className="exam__intellect-options">
              {shuffledOptions.map((option, index) => {
                const q = intellectQuestions[currentIntellectQ]
                const correctIndex = shuffledOptions.findIndex(opt => opt === q.options[q.correct])
                let className = 'exam__intellect-option'
                
                if (selectedAnswer !== null) {
                  if (index === correctIndex) {
                    className += ' exam__intellect-option--correct'
                  } else if (index === selectedAnswer) {
                    className += ' exam__intellect-option--wrong'
                  }
                }
                
                return (
                  <button
                    key={index}
                    className={className}
                    onClick={() => handleIntellectAnswer(index)}
                    disabled={selectedAnswer !== null}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {stage === 'complete' && (
        <div className="exam__complete">
          <h3>🎉 Поздравляем!</h3>
          <p>Вы успешно сдали экзамен и достигли {examLevel} уровня!</p>
          <p>Новый титул: {getTitle(examLevel)}</p>
        </div>
      )}

      <button className="exam__back-btn" onClick={onBack}>
        Отменить экзамен
      </button>
    </div>
  )
}
