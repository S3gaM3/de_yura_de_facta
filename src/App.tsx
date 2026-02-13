import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { AgeGate } from './components/AgeGate'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Countdown } from './components/Countdown'
import { Gallery } from './components/Gallery'
import { Facts } from './components/Facts'
import { ValentineCard } from './components/ValentineCard'
import { Contract } from './components/Contract'
import { WishWall } from './components/WishWall'
import { Footer } from './components/Footer'
import { FallingHearts } from './components/FallingHearts'
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

export default function App() {
  const [verified, setVerified] = useState(false)
  const [confettiFired, setConfettiFired] = useState(false)

  useEffect(() => {
    const handleFirstScroll = () => {
      if (!confettiFired) {
        fireConfetti()
        setConfettiFired(true)
      }
    }
    window.addEventListener('scroll', handleFirstScroll, { once: true })
    return () => window.removeEventListener('scroll', handleFirstScroll)
  }, [confettiFired])

  return (
    <>
      <AgeGate onVerified={() => setVerified(true)} />
      {verified && (
    <>
      <FallingHearts />
      <div className="app-wrap">
    <main className="app">
      <Nav />
      <Hero onConfetti={fireConfetti} />
      <Countdown />
      <Gallery />
      <Facts onConfetti={fireConfetti} />
      <ValentineCard onConfetti={fireConfetti} />
      <Contract onConfetti={fireConfetti} />
      <WishWall />
      <Footer />
    </main>
      </div>
    </>
      )}
    </>
  )
}
