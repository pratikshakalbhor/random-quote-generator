import { useCallback, useEffect, useRef, useState } from 'react'
import quotes from './data/quotes.json'
import QuoteCard from './components/QuoteCard.jsx'
import FavoritesList from './components/FavoritesList.jsx'
import { pickRandom } from './utils/pickRandom.js'
import useLocalStorage from './hooks/useLocalStorage.js'
import './styles/global.css'

const FAVORITES_KEY = 'random-quote-generator:favorites'
// Must match the --motion-duration token in styles/global.css.
// Out (200ms) + in (200ms) keeps the whole transition at ~400ms.
const TRANSITION_MS = 200

// Stored favorites come from localStorage, so drop anything that is not a
// usable quote object (e.g. `[null]` or `{}`) and ignore repeated ids. This
// keeps a hand-edited or corrupted value from crashing the render or producing
// duplicate React keys.
function normalizeFavorites(value) {
  if (!Array.isArray(value)) return []

  const seenIds = new Set()
  return value.filter((quote) => {
    const isValid =
      Boolean(quote) &&
      typeof quote === 'object' &&
      quote.id !== undefined &&
      quote.id !== null

    if (!isValid || seenIds.has(quote.id)) return false
    seenIds.add(quote.id)
    return true
  })
}

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

  const [favorites, setFavorites] = useLocalStorage(FAVORITES_KEY, [])

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

  const handleToggleFavorite = useCallback(
    (target) => {
      if (!target) return
      setFavorites((prev) => {
        const list = Array.isArray(prev) ? prev : []
        const exists = list.some((fav) => fav.id === target.id)
        if (exists) {
          return list.filter((fav) => fav.id !== target.id)
        }
        return [...list, target]
      })
    },
    [setFavorites]
  )

  const handleRemoveFavorite = useCallback(
    (quoteId) => {
      setFavorites((prev) =>
        (Array.isArray(prev) ? prev : []).filter((fav) => fav.id !== quoteId)
      )
    },
    [setFavorites]
  )

  const favoritesList = normalizeFavorites(favorites)
  const isFavorite = favoritesList.some((fav) => fav.id === quote.id)

  return (
    <div className="app">
      <header className="app__header">
        <h1>Random Quote Generator</h1>
        <p className="app__favorites-count">
          Favorites: {favoritesList.length}
        </p>
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
            <QuoteCard
              quote={quote}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        </section>

        <button type="button" className="btn" onClick={handleNewQuote}>
          New Quote
        </button>
      </main>

      <FavoritesList favorites={favoritesList} onRemove={handleRemoveFavorite} />

      <footer className="app__footer">
        <p>Proverbs and public-domain sayings.</p>
      </footer>
    </div>
  )
}

export default App
