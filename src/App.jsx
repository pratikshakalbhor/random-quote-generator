import { useState } from 'react'
import quotes from './data/quotes.json'
import QuoteCard from './components/QuoteCard.jsx'
import { pickRandom } from './utils/pickRandom.js'
import './styles/global.css'

function App() {
  const [quote, setQuote] = useState(() => pickRandom(quotes))

  const handleNewQuote = () => {
    setQuote((previousQuote) => pickRandom(quotes, previousQuote))
  }

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
          <QuoteCard quote={quote} />
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
