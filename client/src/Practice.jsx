import { useState, useRef } from 'react'
import sightWords from './data/sightWords'

export default function Practice({ onBack }) {
  const [selectedLevel, setSelectedLevel] = useState(1)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [started, setStarted] = useState(false)
  const [feedback, setFeedback] = useState(null) // 'correct' | 'wrong' | null
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)

  const words = sightWords[selectedLevel]
  const currentWord = words[currentIndex]

  const handleStart = () => {
    setCurrentIndex(0)
    setFeedback(null)
    setStarted(true)
  }

  const handleLevelSelect = (level) => {
    setSelectedLevel(level)
    setCurrentIndex(0)
    setFeedback(null)
    setStarted(false)
  }

  const handleNext = () => {
    setFeedback(null)
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setStarted(false)
      setCurrentIndex(0)
    }
  }

  const handleListen = () => {
    const utterance = new SpeechSynthesisUtterance(currentWord)
    utterance.rate = 0.85
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  const handleSayIt = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Your browser does not support speech recognition.')
      return
    }

    if (listening) {
      recognitionRef.current?.stop()
      return
    }

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 3

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)

    recognition.onresult = (e) => {
      const heard = Array.from(e.results[0])
        .map((r) => r.transcript.trim().toLowerCase())
      const correct = heard.includes(currentWord.toLowerCase())
      setFeedback(correct ? 'correct' : 'wrong')
    }

    recognition.onerror = () => {
      setListening(false)
      setFeedback('wrong')
    }

    recognition.start()
  }

  return (
    <div className="app">
      <nav className="navbar">
        <span className="nav-logo">Word Echo</span>
        <ul className="nav-links">
          <li><a href="#" onClick={(e) => { e.preventDefault(); onBack() }}>Home</a></li>
          <li><a href="#">About Us</a></li>
        </ul>
      </nav>

      <main className="main">
        <h1 className="title">Practice</h1>
        <p className="status">
          {started
            ? `LEVEL ${selectedLevel} · ${currentIndex + 1} / ${words.length}`
            : 'READY'}
        </p>

        <div className="game-area">
          <div className={`word-card ${feedback ? `word-card--${feedback}` : ''}`}>
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

        {feedback && (
          <p className={`practice-feedback practice-feedback--${feedback}`}>
            {feedback === 'correct' ? 'Correct!' : 'Try again!'}
          </p>
        )}

        {started ? (
          <div className="practice-btns">
            <button className="practice-btn practice-btn--listen" onClick={handleListen}>
              LISTEN
            </button>
            <button
              className={`practice-btn practice-btn--say ${listening ? 'listening' : ''}`}
              onClick={handleSayIt}
            >
              {listening ? 'LISTENING...' : 'SAY IT'}
            </button>
            {feedback === 'correct' && (
              <button className="nav-btn" onClick={handleNext}>
                {currentIndex === words.length - 1 ? 'FINISH' : 'NEXT'}
              </button>
            )}
          </div>
        ) : (
          <button className="start-btn" onClick={handleStart}>START</button>
        )}
      </main>
    </div>
  )
}
