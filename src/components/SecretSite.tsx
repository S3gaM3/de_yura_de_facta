import { useState, useEffect, useCallback } from 'react'
import { Quiz } from './secret/Quiz'
import { CaseOpeningSecret } from './secret/CaseOpeningSecret'
import { ChoosePathSecret } from './secret/ChoosePathSecret'
import { MemoryGame } from './secret/MemoryGame'
import { SnakeGame } from './secret/SnakeGame'
import { ReactionGame } from './secret/ReactionGame'
import { mathQuiz, designQuiz, photoQuiz, lawQuiz, memeQuiz, slang90Quiz } from './secret/quizData'
import './SecretSite.css'

type GameId = 'cases' | 'path' | 'math' | 'design' | 'photo' | 'law' | 'meme' | 'slang90' | 'memory' | 'snake' | 'reaction' | null

const GAMES: { id: GameId; label: string }[] = [
  { id: 'cases', label: 'Открытие кейсов' },
  { id: 'path', label: 'Выбери правильный путь' },
  { id: 'math', label: 'Математическая викторина' },
  { id: 'design', label: 'Дизайн и Photoshop/Illustrator' },
  { id: 'photo', label: 'Викторина: фотограф' },
  { id: 'law', label: 'Викторина: юриспруденция' },
  { id: 'meme', label: 'Мемы и молодёжный сленг' },
  { id: 'slang90', label: 'Сленг 90-х' },
  { id: 'memory', label: 'Игра на память' },
  { id: 'snake', label: 'Змейка' },
  { id: 'reaction', label: 'Тест на реакцию' },
]

type SecretSiteProps = {
  onBack: () => void
  onUnlock: (id: string) => boolean
}

export function SecretSite({ onBack, onUnlock }: SecretSiteProps) {
  const [activeGame, setActiveGame] = useState<GameId>(null)
  const [, setQuizCount] = useState(0)

  useEffect(() => {
    onUnlock('secret_1') // enter_secret
  }, [onUnlock])

  const handleQuizComplete = useCallback(() => {
    onUnlock('secret_2') // quiz_done
    setQuizCount((c) => {
      const next = c + 1
      if (next >= 3) onUnlock('secret_5') // quizzes_3
      return next
    })
  }, [onUnlock])

  const renderGame = () => {
    const back = () => setActiveGame(null)
    switch (activeGame) {
      case 'math':
        return <Quiz title="Математическая викторина" questions={mathQuiz} onBack={back} onComplete={handleQuizComplete} />
      case 'design':
        return <Quiz title="Дизайн и Photoshop/Illustrator" questions={designQuiz} onBack={back} onComplete={handleQuizComplete} />
      case 'photo':
        return <Quiz title="Викторина: фотограф" questions={photoQuiz} onBack={back} onComplete={handleQuizComplete} />
      case 'law':
        return <Quiz title="Викторина: юриспруденция" questions={lawQuiz} onBack={back} onComplete={handleQuizComplete} />
      case 'meme':
        return <Quiz title="Мемы и молодёжный сленг" questions={memeQuiz} onBack={back} onComplete={handleQuizComplete} />
      case 'slang90':
        return <Quiz title="Сленг 90-х" questions={slang90Quiz} onBack={back} onComplete={handleQuizComplete} />
      case 'cases':
        return <CaseOpeningSecret onBack={back} onOpen={() => onUnlock('secret_3')} /> // case_opened
      case 'path':
        return <ChoosePathSecret onBack={back} onComplete={() => onUnlock('secret_4')} /> // path_done
      case 'memory':
        return <MemoryGame onBack={back} onComplete={() => onUnlock('secret_31')} />
      case 'snake':
        return <SnakeGame onBack={back} onComplete={() => onUnlock('secret_32')} />
      case 'reaction':
        return <ReactionGame onBack={back} onComplete={() => onUnlock('secret_33')} />
      default:
        return null
    }
  }

  return (
    <div className="secret-site">
      <header className="secret-site__header">
        <h1 className="secret-site__logo">Секретная зона</h1>
        <button type="button" className="secret-site__back" onClick={onBack}>
          Вернуться на главную
        </button>
      </header>
      <main className="secret-site__main">
        {!activeGame ? (
          <>
            <p className="secret-site__intro">
              Ты попал куда надо. Здесь свои правила и свои приколы.
            </p>
            <p className="secret-site__sub">
              Выбери игру и не рассказывай, откуда ты здесь оказался.
            </p>
            <ul className="secret-site__list">
              {GAMES.map((g) => (
                <li key={g.id}>
                  <button
                    type="button"
                    className="secret-site__game-btn"
                    onClick={() => setActiveGame(g.id)}
                  >
                    {g.label}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="secret-site__game-area">
            {renderGame()}
          </div>
        )}
      </main>
    </div>
  )
}
