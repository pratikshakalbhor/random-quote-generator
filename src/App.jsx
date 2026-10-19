import { useCallback, useEffect, useRef, useState } from 'react'
import quotes from './data/quotes.json'
import QuoteCard from './components/QuoteCard.jsx'
import { pickRandom } from './utils/pickRandom.js'
import './styles/global.css'

// Must match the --motion-duration token in styles/global.css.
// Out (200ms) + in (200ms) keeps the whole transition at ~400ms.
const TRANSITION_MS = 200

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function App() {
  const [quote, setQuote] = useState(() => pickRandom(quotes))
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [frozenHeight, setFrozenHeight] = useState(null)

  const cardWrapRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  const handleNewQuote = useCallback(() => {
    // Respect prefers-reduced-motion: swap instantly, no fade and no delay.
    if (prefersReducedMotion()) {
      setQuote((previousQuote) => pickRandom(quotes, previousQuote))
      return
    }

    const wrap = cardWrapRef.current
    if (wrap) {
      setFrozenHeight(wrap.offsetHeight)
    }

    setIsTransitioning(true)

    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setQuote((previousQuote) => pickRandom(quotes, previousQuote))
      setIsTransitioning(false)
      setFrozenHeight(null)
      timeoutRef.current = null
    }, TRANSITION_MS)
  }, [])

  return (
    <div className="app">
      <header className="app__header">
        <h1>Random Quote Generator</h1>
      </header>

      <main className="app__main">
        <section
          className="quote-region"
          aria-live="polite"
          aria-atomic="true"
          aria-label="Random quote"
        >
          <div
            ref={cardWrapRef}
            className={`quote-transition ${isTransitioning ? 'quote-transition--active' : ''}`}
            style={frozenHeight !== null ? { minHeight: `${frozenHeight}px` } : undefined}
          >
            <QuoteCard quote={quote} />
          </div>
        </section>

        <button type="button" className="btn" onClick={handleNewQuote}>
          New Quote
        </button>
      </main>

      <footer className="app__footer">
        <p>Proverbs and public-domain sayings.</p>
      </footer>
    </div>
  )
}

export default App
