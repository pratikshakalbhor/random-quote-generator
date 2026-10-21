import { useCallback, useEffect, useRef, useState } from 'react'
import QuoteCard from './components/QuoteCard.jsx'
import GenreFilter from './components/GenreFilter.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import FavoritesList from './components/FavoritesList.jsx'
import { pickRandom } from './utils/pickRandom.js'
import { ALL_GENRES, GENRE_OPTIONS, isKnownGenre, quotesForGenre } from './utils/genres.js'
import {
  DEFAULT_THEME,
  THEME_KEY,
  applyTheme,
  isTheme,
} from './utils/theme.js'
import useLocalStorage from './hooks/useLocalStorage.js'
import './styles/global.css'

const FAVORITES_KEY = 'random-quote-generator:favorites'
const GENRE_KEY = 'random-quote-generator:genre'
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
  // Invalid stored values (hand-edited storage) fall back to System.
  const [storedTheme, setStoredTheme] = useLocalStorage(THEME_KEY, DEFAULT_THEME)
  const theme = isTheme(storedTheme) ? storedTheme : DEFAULT_THEME

  // The stored genre may predate a data change; anything unknown falls back
  // to "All" so the UI and the quote pool always agree with quotes.json.
  const [storedGenre, setStoredGenre] = useLocalStorage(GENRE_KEY, ALL_GENRES)
  const genre = isKnownGenre(storedGenre) ? storedGenre : ALL_GENRES

  const [quote, setQuote] = useState(() => pickRandom(quotesForGenre(genre)))
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [frozenHeight, setFrozenHeight] = useState(null)

  const cardWrapRef = useRef(null)
  const timeoutRef = useRef(null)
  const previousGenreRef = useRef(genre)

  const [favorites, setFavorites] = useLocalStorage(FAVORITES_KEY, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  // Normalize a stale stored value (e.g. a genre removed from quotes.json).
  useEffect(() => {
    if (storedGenre !== genre) {
      setStoredGenre(genre)
    }
  }, [storedGenre, genre, setStoredGenre])

  // Apply the theme to <html> and keep the browser-UI colour in sync. In
  // System mode, follow live OS theme changes too. index.html applies the stored
  // theme before first paint; this effect keeps React and storage in agreement.
  useEffect(() => {
    applyTheme(theme)

    if (theme !== 'system' || typeof window.matchMedia !== 'function') {
      return undefined
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => applyTheme('system')
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  useEffect(() => {
    if (storedTheme !== theme) {
      setStoredTheme(theme)
    }
  }, [storedTheme, theme, setStoredTheme])

  // Shared by "New Quote" and genre changes: fade/slide out, swap, fade in.
  const showQuoteFrom = useCallback((nextPool) => {
    // Respect prefers-reduced-motion: swap instantly, no fade and no delay.
    if (prefersReducedMotion()) {
      setQuote((previousQuote) => pickRandom(nextPool, previousQuote?.id ?? null))
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
      setQuote((previousQuote) => pickRandom(nextPool, previousQuote?.id ?? null))
      setIsTransitioning(false)
      setFrozenHeight(null)
      timeoutRef.current = null
    }, TRANSITION_MS)
  }, [])

  const handleNewQuote = useCallback(
    () => showQuoteFrom(quotesForGenre(genre)),
    [showQuoteFrom, genre]
  )

  // Changing the filter swaps in a quote from the new genre right away,
  // using the same transition as "New Quote". The ref guard keeps the first
  // commit (and StrictMode's double-invoked effects) from re-picking.
  useEffect(() => {
    if (previousGenreRef.current === genre) return
    previousGenreRef.current = genre
    showQuoteFrom(quotesForGenre(genre))
  }, [genre, showQuoteFrom])

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
        <div className="app__header-top">
          <ThemeToggle theme={theme} onChange={setStoredTheme} />
        </div>
        <h1>Random Quote Generator</h1>
        <p className="app__favorites-count">
          Favorites: {favoritesList.length}
        </p>
      </header>

      <main className="app__main">
        <GenreFilter options={GENRE_OPTIONS} value={genre} onChange={setStoredGenre} />
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
