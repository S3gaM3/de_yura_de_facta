import { useState, useEffect } from 'react'
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
import { LegalGame } from './components/legal/LegalGame'
import { LegalGameSection } from './components/LegalGameSection'
import './App.css'

export default function App() {
  const [verified, setVerified] = useState(false)
  const [showGame, setShowGame] = useState(false)

  useEffect(() => {
    const hash = window.location.hash
    if (hash === '#legal-game') {
      setShowGame(true)
    }
    
    const handleHashChange = () => {
      setShowGame(window.location.hash === '#legal-game')
    }
    
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (showGame) {
    return (
      <>
        <AgeGate onVerified={() => setVerified(true)} />
        {verified && <LegalGame />}
      </>
    )
  }

  return (
    <>
      <AgeGate onVerified={() => setVerified(true)} />
      {verified && (
        <>
          <FallingHearts />
          <div className="app-wrap">
            <main className="app">
              <BackgroundMusic />
              <Nav />
              <Hero />
              <Countdown />
              <Gallery />
              <PetrQuotes />
              <FunFacts />
              <Facts />
              <ValentineCard />
              <Contract />
              <WishWall />
              <LegalGameSection />
              <Footer />
            </main>
          </div>
          <PixelSnake />
        </>
      )}
    </>
  )
}
