function QuoteCard({ quote }) {
  if (!quote) return null

  const rawAuthor = quote.author
  const isUnknown = rawAuthor === null || rawAuthor === undefined || String(rawAuthor).trim() === ''
  const author = isUnknown ? 'Unknown author' : String(rawAuthor).trim()

  return (
    <article className="quote-card">
      <blockquote className="quote-card__quote">
        <p>{quote.text}</p>
      </blockquote>
      <footer className="quote-card__footer">
        <p className="quote-card__author">— {author}</p>
        <span className="genre-chip">{quote.genre}</span>
      </footer>
    </article>
  )
}

export default QuoteCard
