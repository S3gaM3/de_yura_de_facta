import { useState, useEffect, useRef, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { useAchievements } from './contexts/AchievementContext'
import { AgeGate } from './components/AgeGate'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { SecretSite } from './components/SecretSite'
import { Countdown } from './components/Countdown'
import { Gallery } from './components/Gallery'
import { Facts } from './components/Facts'
import { ValentineCard } from './components/ValentineCard'
import { Contract } from './components/Contract'
import { WishWall } from './components/WishWall'
import { Footer } from './components/Footer'
import { FallingHearts } from './components/FallingHearts'
import { BackgroundMusic } from './components/BackgroundMusic'
import { AchievementEffects } from './components/AchievementEffects'
import { AchievementPanel } from './components/AchievementPanel'
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

export default function App() {
  const { unlock, rewards } = useAchievements()
  const [verified, setVerified] = useState(false)
  const [confettiFired, setConfettiFired] = useState(false)
  const [secretUnlocked, setSecretUnlocked] = useState(getSecretUnlocked)
  const heartClicks = useRef(0)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onUnlock = useCallback((id: string) => {
    const isNew = unlock(id)
    if (isNew && (id === 'quiz_done' || id === 'quizzes_3')) fireRainbowConfetti()
    return isNew
  }, [unlock])

  const onHeartClick = useCallback(() => {
    if (resetTimer.current) {
      clearTimeout(resetTimer.current)
      resetTimer.current = null
    }
    heartClicks.current += 1
    if (heartClicks.current >= 1) onUnlock('heart_click')
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
    const handleFirstScroll = () => {
      if (!confettiFired) {
        fireConfetti()
        setConfettiFired(true)
        onUnlock('first_scroll')
      }
    }
    window.addEventListener('scroll', handleFirstScroll, { once: true })
    return () => window.removeEventListener('scroll', handleFirstScroll)
  }, [confettiFired, onUnlock])

  return (
    <>
      <AgeGate onVerified={() => setVerified(true)} />
      {verified && (
    secretUnlocked ? (
      <>
        <AchievementEffects rewards={rewards} zone="secret" />
        <AchievementPanel zone="secret" />
        <SecretSite onBack={() => setSecretUnlocked(false)} onUnlock={onUnlock} />
      </>
    ) : (
    <>
      <AchievementEffects rewards={rewards} zone="main" />
      <AchievementPanel zone="main" />
      <FallingHearts />
      <div className="app-wrap">
    <main className="app">
      <BackgroundMusic />
      <Nav />
      <Hero onHeartClick={onHeartClick} />
      <Countdown />
      <Gallery />
      <Facts onConfetti={fireConfetti} onFactOpen={(count) => count >= 3 && onUnlock('open_facts_3')} />
      <ValentineCard onConfetti={fireConfetti} onOpen={() => onUnlock('open_valentine')} />
      <Contract onConfetti={fireConfetti} onSign={() => onUnlock('sign_contract')} />
      <WishWall onWishAdd={() => onUnlock('leave_wish')} />
      <Footer />
    </main>
      </div>
    </>
    )
      )}
    </>
  )
}
