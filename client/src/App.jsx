import { useState } from 'react'
import './App.css'
import sightWords from './data/sightWords'
import Practice from './Practice'

function App() {
  const [page, setPage] = useState('home')
  const [selectedLevel, setSelectedLevel] = useState(1)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [started, setStarted] = useState(false)

  if (page === 'practice') {
    return <Practice onBack={() => setPage('home')} />
  }

  const words = sightWords[selectedLevel]
  const currentWord = words[currentIndex]

  const handleStart = () => {
    setCurrentIndex(0)
    setStarted(true)
  }

  const handleLevelSelect = (level) => {
    setSelectedLevel(level)
    setCurrentIndex(0)
    setStarted(false)
  }

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setStarted(false)
      setCurrentIndex(0)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  return (
    <div className="app">
      <nav className="navbar">
        <span className="nav-logo">Word Echo</span>
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); setPage('practice') }}>Practice</a></li>
          <li><a href="#">About Us</a></li>
        </ul>
      </nav>

      <main className="main">
        <h1 className="title">Word Echo</h1>
        <p className="status">
          {started
            ? `LEVEL ${selectedLevel} · ${currentIndex + 1} / ${words.length}`
            : 'READY'}
        </p>

        <div className="game-area">
          <div className="word-card">
            <span className="word-text">
              {started ? currentWord : 'Say The Word'}
            </span>
          </div>

          <div className="levels">
            {[1, 2, 3].map((level) => (
              <button
                key={level}
                className={`level-btn ${selectedLevel === level ? 'active' : ''}`}
                onClick={() => handleLevelSelect(level)}
              >
                LEVEL {level}
              </button>
            ))}
          </div>
        </div>

        {started ? (
          <div className="nav-btns">
            <button className="nav-btn" onClick={handlePrev} disabled={currentIndex === 0}>
              PREV
            </button>
            <button className="nav-btn" onClick={handleNext}>
              {currentIndex === words.length - 1 ? 'FINISH' : 'NEXT'}
            </button>
          </div>
        ) : (
          <button className="start-btn" onClick={handleStart}>START</button>
        )}
      </main>
    </div>
  )
}

export default App
