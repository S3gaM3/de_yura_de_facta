import { useState } from 'react'
import { Quiz } from './secret/Quiz'
import { CaseOpening } from './secret/CaseOpening'
import { ChoosePath } from './secret/ChoosePath'
import { petrQuiz, mathQuiz, designQuiz, photoQuiz, lawQuiz, memeQuiz, slang90Quiz } from './secret/quizData'
import './SecretSection.css'

type GameId = 'petr' | 'cases' | 'path' | 'math' | 'design' | 'photo' | 'law' | 'meme' | 'slang90' | null

const GAMES: { id: GameId; label: string }[] = [
  { id: 'petr', label: 'Викторина по Петру' },
  { id: 'cases', label: 'Открытие кейсов' },
  { id: 'path', label: 'Выбери правильный путь' },
  { id: 'math', label: 'Математическая викторина' },
  { id: 'design', label: 'Дизайн и Photoshop/Illustrator' },
  { id: 'photo', label: 'Викторина: фотограф' },
  { id: 'law', label: 'Викторина: юриспруденция' },
  { id: 'meme', label: 'Мемы и молодёжный сленг' },
  { id: 'slang90', label: 'Сленг 90-х' },
]

export function SecretSection() {
  const [activeGame, setActiveGame] = useState<GameId>(null)

  const renderGame = () => {
    switch (activeGame) {
      case 'petr':
        return <Quiz title="Викторина по Петру" questions={petrQuiz} onBack={() => setActiveGame(null)} />
      case 'math':
        return <Quiz title="Математическая викторина" questions={mathQuiz} onBack={() => setActiveGame(null)} />
      case 'design':
        return <Quiz title="Дизайн и Photoshop/Illustrator" questions={designQuiz} onBack={() => setActiveGame(null)} />
      case 'photo':
        return <Quiz title="Викторина: фотограф" questions={photoQuiz} onBack={() => setActiveGame(null)} />
      case 'law':
        return <Quiz title="Викторина: юриспруденция" questions={lawQuiz} onBack={() => setActiveGame(null)} />
      case 'meme':
        return <Quiz title="Мемы и молодёжный сленг" questions={memeQuiz} onBack={() => setActiveGame(null)} />
      case 'slang90':
        return <Quiz title="Сленг 90-х" questions={slang90Quiz} onBack={() => setActiveGame(null)} />
      case 'cases':
        return <CaseOpening onBack={() => setActiveGame(null)} />
      case 'path':
        return <ChoosePath onBack={() => setActiveGame(null)} />
      default:
        return null
    }
  }

  return (
    <section className="secret" id="secret">
      <h2 className="secret__title">Ты нашёл секрет</h2>
      <p className="secret__text">
        Пётр, если это читаешь ты — мы не удивлены. Юристы проверяют каждый пункт.
      </p>
      <p className="secret__text">
        П.1. Ты по-прежнему единственный и незаменимый.<br />
        П.2. Стебаем по-доброму.<br />
        П.3. С Днём святого Валентина. ♥
      </p>
      <p className="secret__sign">— Коллектив (те самые)</p>

      <div className="secret__games">
        <h3 className="secret__games-title">Игры</h3>
        {activeGame ? (
          <div className="secret__game-area">
            {renderGame()}
          </div>
        ) : (
          <ul className="secret__game-list">
            {GAMES.map((g) => (
              <li key={g.id}>
                <button
                  type="button"
                  className="secret__game-btn"
                  onClick={() => setActiveGame(g.id)}
                >
                  {g.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
