import { useState, useEffect, useRef, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { useAchievements } from './contexts/AchievementContext'
import { getXP, addXP, XP_REWARDS } from './lib/xp'
import { findEgg, getFoundEggs } from './lib/easterEggs'
import { AgeGate } from './components/AgeGate'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { SecretSite } from './components/SecretSite'
import { SecretPlace2 } from './components/SecretPlace2'
import { Countdown } from './components/Countdown'
import { Gallery } from './components/Gallery'
import { Facts } from './components/Facts'
import { FunFacts } from './components/FunFacts'
import { PetrQuotes } from './components/PetrQuotes'
import { ValentineCard } from './components/ValentineCard'
import { Contract } from './components/Contract'
import { WishWall } from './components/WishWall'
import { Footer } from './components/Footer'
import { FallingHearts } from './components/FallingHearts'
import { BackgroundMusic } from './components/BackgroundMusic'
import { AchievementEffects } from './components/AchievementEffects'
import { AchievementPanel } from './components/AchievementPanel'
import { XPBar } from './components/XPBar'
import { EasterEggHint } from './components/EasterEggHint'
import { PixelSnake } from './components/PixelSnake'
import './App.css'

function fireConfetti() {
  const count = 120
  const defaults = { origin: { y: 0.7 }, colors: ['#e11d48', '#f9a8d4', '#f43f5e', '#fef3f7'] }
  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio) })
  }
  fire(0.25, { spread: 26, startVelocity: 55 })
  fire(0.2, { spread: 60 })
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
  fire(0.1, { spread: 120, startVelocity: 45 })
}

function fireRainbowConfetti() {
  const colors = ['#e11d48', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#8b5cf6', '#ec4899']
  const count = 100
  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({ origin: { y: 0.7 }, colors, ...opts, particleCount: Math.floor(count * particleRatio) })
  }
  fire(0.3, { spread: 60 })
  fire(0.2, { spread: 100, decay: 0.9 })
  fire(0.2, { spread: 120, startVelocity: 30 })
}

function getSecretUnlocked(): boolean {
  try {
    return localStorage.getItem('petr-secret-unlocked') === '1'
  } catch {
    return false
  }
}

function getSecretPlace2Unlocked(): boolean {
  try {
    return localStorage.getItem('petr-secret-place-2-unlocked') === '1'
  } catch {
    return false
  }
}

export default function App() {
  const { unlock, rewards, isUnlocked } = useAchievements()
  const [verified, setVerified] = useState(false)
  const [confettiFired, setConfettiFired] = useState(false)
  const [secretUnlocked, setSecretUnlocked] = useState(getSecretUnlocked)
  const [secretPlace2Unlocked, setSecretPlace2Unlocked] = useState(getSecretPlace2Unlocked)
  const [xp, setXP] = useState(getXP)
  const heartClicks = useRef(0)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollCount = useRef(0)
  const factOpens = useRef(0)
  const wishCount = useRef(0)

  const onUnlock = useCallback((id: string) => {
    const isNew = unlock(id)
    if (isNew) {
      const newXP = addXP(XP_REWARDS.achievement)
      setXP(newXP)
      if (id === 'quiz_done' || id === 'quizzes_3') fireRainbowConfetti()
    }
    return isNew
  }, [unlock])

  const handleLevelUp = useCallback(() => {
    fireConfetti()
  }, [])

  const handleSecretText = useCallback(() => {
    if (!secretPlace2Unlocked) {
      setSecretPlace2Unlocked(true)
      try {
        localStorage.setItem('petr-secret-place-2-unlocked', '1')
      } catch {
        // ignore
      }
      fireRainbowConfetti()
      setXP(() => addXP(XP_REWARDS.easterEgg))
      onUnlock('combo_1') // Можно добавить специальное достижение
    }
  }, [secretPlace2Unlocked, onUnlock])

  const onHeartClick = useCallback(() => {
    if (resetTimer.current) {
      clearTimeout(resetTimer.current)
      resetTimer.current = null
    }
    heartClicks.current += 1
    // XP за клик по сердечку убрано - слишком легко
    
    // Пасхальное яйцо: 7 кликов подряд
    if (heartClicks.current === 7 && !getFoundEggs().includes('egg_1')) {
      if (findEgg('egg_1')) {
        fireConfetti()
        setXP(() => addXP(XP_REWARDS.easterEgg))
      }
    }
    
    if (heartClicks.current >= 1) onUnlock('main_2') // heart_click
    if (heartClicks.current >= 5) {
      heartClicks.current = 0
      setSecretUnlocked(true)
      try {
        localStorage.setItem('petr-secret-unlocked', '1')
      } catch {
        // ignore
      }
      fireConfetti()
    } else {
      resetTimer.current = setTimeout(() => {
        heartClicks.current = 0
        resetTimer.current = null
      }, 4000)
    }
  }, [onUnlock])

  useEffect(() => {
    const handleScroll = () => {
      scrollCount.current += 1
      // XP за прокрутку убрано - слишком легко получать опыт
      
      if (!confettiFired) {
        fireConfetti()
        setConfettiFired(true)
        onUnlock('main_1') // first_scroll
      }
      
      // Пасхальное яйцо: прокрутка снизу вверх 10 раз
      if (scrollCount.current >= 10 && !getFoundEggs().includes('egg_7')) {
        if (findEgg('egg_7')) {
          fireConfetti()
          setXP(() => addXP(XP_REWARDS.easterEgg))
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [confettiFired, onUnlock])

  // Пасхальное яйцо: консоль petr()
  useEffect(() => {
    // @ts-ignore
    window.petr = () => {
      if (!getFoundEggs().includes('egg_2')) {
        if (findEgg('egg_2')) {
          fireConfetti()
          setXP(() => addXP(XP_REWARDS.easterEgg))
          console.log('🥚 Пасхальное яйцо найдено!')
        }
      }
    }
  }, [])

  // Пасхальное яйцо: URL параметр
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('secret') === 'petr' && !getFoundEggs().includes('egg_16')) {
      if (findEgg('egg_16')) {
        fireConfetti()
        setXP(() => addXP(XP_REWARDS.easterEgg))
      }
    }
  }, [])

  // Пасхальное яйцо: localStorage
  useEffect(() => {
    try {
      if (localStorage.getItem('petr-easter') === 'found' && !getFoundEggs().includes('egg_17')) {
        if (findEgg('egg_17')) {
          fireConfetti()
          setXP(() => addXP(XP_REWARDS.easterEgg))
        }
      }
    } catch {
      // ignore
    }
  }, [])

  // Автоматическая проверка достижений по условиям (время, день недели и т.д.)
  useEffect(() => {
    const checkTimeBasedAchievements = () => {
      const now = new Date()
      const hour = now.getHours()
      const day = now.getDay()
      const date = now.getDate()
      const month = now.getMonth()

      // Ночной посетитель (после 23:00)
      if (hour >= 23 && !isUnlocked('main_19')) {
        onUnlock('main_19')
      }
      // Утренний (до 8:00)
      if (hour < 8 && !isUnlocked('main_20')) {
        onUnlock('main_20')
      }
      // Пятничный (пятница = 5)
      if (day === 5 && !isUnlocked('main_21')) {
        onUnlock('main_21')
      }
      // Выходной (суббота = 6 или воскресенье = 0)
      if ((day === 0 || day === 6) && !isUnlocked('main_22')) {
        onUnlock('main_22')
      }
      // Пунктуальный (14 февраля)
      if (date === 14 && month === 1 && !isUnlocked('main_18')) {
        onUnlock('main_18')
      }
      // Повторный (проверка через localStorage)
      const lastVisit = localStorage.getItem('petr-last-visit')
      if (lastVisit && !isUnlocked('main_25')) {
        onUnlock('main_25')
      }
      localStorage.setItem('petr-last-visit', Date.now().toString())
    }

    checkTimeBasedAchievements()
    // Проверяем каждую минуту
    const interval = setInterval(checkTimeBasedAchievements, 60000)
    return () => clearInterval(interval)
  }, [onUnlock, isUnlocked])

  return (
    <>
      <AgeGate onVerified={() => setVerified(true)} />
      {verified && (
    secretPlace2Unlocked ? (
      <>
        <AchievementEffects rewards={rewards} zone="secret" />
        <AchievementPanel zone="secret" />
        <XPBar xp={xp} onLevelUp={handleLevelUp} />
        <EasterEggHint />
        <SecretPlace2 onBack={() => setSecretPlace2Unlocked(false)} />
      </>
    ) : secretUnlocked ? (
      <>
        <AchievementEffects rewards={rewards} zone="secret" />
        <AchievementPanel zone="secret" />
        <XPBar xp={xp} onLevelUp={handleLevelUp} />
        <EasterEggHint />
        <SecretSite
          onBack={() => setSecretUnlocked(false)}
          onUnlock={(id) => {
            const isNew = onUnlock(id)
            if (isNew && id.includes('quiz')) {
              setXP(() => addXP(XP_REWARDS.quizComplete))
            } else if (isNew && id.includes('case')) {
              setXP(() => addXP(XP_REWARDS.caseOpen))
            } else if (isNew && id.includes('path')) {
              setXP(() => addXP(XP_REWARDS.pathComplete))
            }
            return isNew
          }}
        />
      </>
    ) : (
    <>
      <AchievementEffects rewards={rewards} zone="main" />
      <AchievementPanel zone="main" />
      <XPBar xp={xp} onLevelUp={handleLevelUp} />
      <EasterEggHint />
      <FallingHearts />
      <div className="app-wrap">
    <main className="app">
      <BackgroundMusic />
      <Nav />
      <Hero onHeartClick={onHeartClick} />
      <Countdown />
      <Gallery />
      <PetrQuotes />
      <FunFacts />
      <Facts
        onConfetti={fireConfetti}
        onFactOpen={(count) => {
          factOpens.current = count
          // XP за открытие фактов убрано - слишком легко
          if (count >= 3) onUnlock('main_6') // open_facts_3
          if (count >= 5) onUnlock('main_7') // open all facts
        }}
      />
      <ValentineCard
        onConfetti={fireConfetti}
        onOpen={() => {
          setXP(() => addXP(XP_REWARDS.valentineOpen))
          onUnlock('main_3') // open_valentine
        }}
      />
      <Contract
        onConfetti={fireConfetti}
        onSign={() => {
          setXP(() => addXP(XP_REWARDS.contractSign))
          onUnlock('main_4') // sign_contract
        }}
      />
      <WishWall
        onWishAdd={() => {
          wishCount.current += 1
          setXP(() => addXP(XP_REWARDS.wishAdd))
          onUnlock('main_5') // leave_wish
          if (wishCount.current >= 3) onUnlock('main_10')
          if (wishCount.current >= 5) onUnlock('main_16')
        }}
        onSecretText={handleSecretText}
      />
      <Footer />
    </main>
      </div>
    </>
    )
      )}
      <PixelSnake
        onCaught={() => {
          // Змейка догнала курсор
        }}
        onXPChange={(newXP) => {
          setXP(() => newXP)
        }}
      />
    </>
  )
}
