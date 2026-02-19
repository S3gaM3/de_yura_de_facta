import { useState } from 'react'
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
import './App.css'

export default function App() {
  const [verified, setVerified] = useState(false)

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
              <Footer />
            </main>
          </div>
          <PixelSnake />
        </>
      )}
    </>
  )
}
