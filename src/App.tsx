import { useState, useEffect, useCallback, useRef } from 'react'
import { AgeGate } from './components/AgeGate'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
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
import { PixelSnake } from './components/PixelSnake'
import { SecretSite } from './components/SecretSite'
import { SecretPlace2 } from './components/SecretPlace2'
import { AchievementPanel } from './components/AchievementPanel'
import { AchievementEffects } from './components/AchievementEffects'
import { EasterEggHint } from './components/EasterEggHint'
import { XPBar } from './components/XPBar'
import { useAchievements } from './contexts/AchievementContext'
import { useXP } from './hooks/useXP'
import { findEgg } from './lib/easterEggs'
import { addXP, XP_REWARDS } from './lib/xp'
import confetti from 'canvas-confetti'
import './App.css'

export default function App() {
  const [verified, setVerified] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const [showSecretPlace2, setShowSecretPlace2] = useState(false)
  const heartClickCount = useRef(0)
  const scrollCount = useRef(0)
  const { unlock, rewards, unlocked } = useAchievements()
  const xp = useXP()

  // URL ?secret=petr → открыть секрет и egg_15
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('secret') === 'petr') {
      setShowSecret(true)
      if (findEgg('egg_15')) {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } })
        addXP(XP_REWARDS.easterEgg)
      }
    }
  }, [])

  // Временные достижения при загрузке
  useEffect(() => {
    const now = new Date()
    const d = now.getDate()
    const m = now.getMonth()
    const h = now.getHours()
    const day = now.getDay()

    if (d === 14 && m === 1) unlock('main_12')
    if (h >= 23) unlock('main_13')
    if (h < 8) unlock('main_14')
    if (day === 5) unlock('main_15')
    if (day === 0 || day === 6) unlock('main_16')

    try {
      const prev = localStorage.getItem('petr-first-visit')
      if (prev) unlock('main_17')
      else localStorage.setItem('petr-first-visit', Date.now().toString())
    } catch {
      /* ignore */
    }
  }, [unlock])

  // Ctrl+Shift+P → egg_3
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault()
        if (findEgg('egg_3')) {
          confetti({ particleCount: 60, spread: 70 })
          addXP(XP_REWARDS.easterEgg)
        }
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  // Konami → egg_9
  useEffect(() => {
    const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA']
    let idx = 0
    const h = (e: KeyboardEvent) => {
      if (e.key === seq[idx]) {
        idx += 1
        if (idx >= seq.length) {
          idx = 0
          if (findEgg('egg_9')) {
            confetti({ particleCount: 80, spread: 90 })
            addXP(XP_REWARDS.easterEgg)
          }
        }
      } else {
        idx = 0
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  // Отслеживание скролла (throttle: 1 подсчёт за 400ms, минимум 80px)
  useEffect(() => {
    let lastY = window.scrollY
    let lastCountTime = 0
    const h = () => {
      const y = window.scrollY
      const now = Date.now()
      if (Math.abs(y - lastY) > 80 && now - lastCountTime > 400) {
        scrollCount.current += 1
        lastY = y
        lastCountTime = now
        if (scrollCount.current === 1) unlock('main_1')
        if (scrollCount.current >= 20) unlock('main_20')
        if (scrollCount.current >= 50) unlock('main_21')
      }
    }
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [unlock])

  const handleTitleTripleTap = useCallback(() => {
    if (findEgg('egg_10')) {
      confetti({ particleCount: 50, spread: 60 })
      addXP(XP_REWARDS.easterEgg)
    }
  }, [])

  const handleHeartClick = useCallback(() => {
    heartClickCount.current += 1
    const c = heartClickCount.current
    if (c === 1) unlock('main_2')
    if (c === 5) setShowSecret(true)
    if (c === 7 && findEgg('egg_1')) {
      confetti({ particleCount: 60, spread: 70 })
      addXP(XP_REWARDS.easterEgg)
    }
    if (c >= 10) unlock('main_8')
    if (c >= 50) unlock('main_10')
    if (c >= 100) unlock('main_19')
    if (c >= 500) unlock('main_22')
  }, [unlock])

  const handleSecretUnlock = useCallback(
    (id: string) => {
      const ok = unlock(id)
      if (ok && id === 'secret_1') addXP(15)
      return ok
    },
    [unlock]
  )

  const showPixelSnake = unlocked.length >= 5

  if (!verified) {
    return <AgeGate onVerified={() => setVerified(true)} />
  }

  if (showSecretPlace2) {
    return (
      <>
        <AchievementEffects rewards={rewards} zone="main" />
        <AchievementPanel zone="main" />
        <XPBar xp={xp} />
        <SecretPlace2 onBack={() => setShowSecretPlace2(false)} />
      </>
    )
  }

  if (showSecret) {
    return (
      <>
        <AchievementEffects rewards={rewards} zone="secret" />
        <AchievementPanel zone="secret" />
        <EasterEggHint />
        <div className="secret-site-xp">
          <XPBar xp={xp} />
        </div>
        <SecretSite
          onBack={() => setShowSecret(false)}
          onUnlock={handleSecretUnlock}
        />
      </>
    )
  }

  return (
    <>
      <FallingHearts />
      <AchievementEffects rewards={rewards} zone="main" />
      <AchievementPanel zone="main" />
      <EasterEggHint />
      <div className="app-xp-bar">
        <XPBar xp={xp} />
      </div>
      <div className="app-wrap">
        <main className="app">
          <BackgroundMusic />
          <Nav />
          <Hero
            onHeartClick={handleHeartClick}
            onTitleTripleTap={handleTitleTripleTap}
          />
          <Countdown />
          <Gallery />
          <PetrQuotes />
          <FunFacts />
          <Facts />
          <ValentineCard />
          <Contract />
          <WishWall onSecretPlaceFound={() => setShowSecretPlace2(true)} />
          <Footer />
        </main>
      </div>
      {showPixelSnake && <PixelSnake />}
    </>
  )
}
