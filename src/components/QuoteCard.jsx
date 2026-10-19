function QuoteCard({ quote, isFavorite = false, onToggleFavorite }) {
  if (!quote) return null

  const rawAuthor = quote.author
  const isUnknown = rawAuthor === null || rawAuthor === undefined || String(rawAuthor).trim() === ''
  const author = isUnknown ? 'Unknown author' : String(rawAuthor).trim()

  const handleToggle = () => {
    if (typeof onToggleFavorite === 'function') {
      onToggleFavorite(quote)
    }
  }

  const favoriteLabel = isFavorite ? 'Remove from favorites' : 'Add to favorites'
  const favoriteIcon = isFavorite ? '★' : '☆'

  return (
    <article className="quote-card">
      <div className="quote-card__actions">
        <button
          type="button"
          className={`favorite-toggle ${isFavorite ? 'favorite-toggle--active' : ''}`}
          aria-pressed={isFavorite}
          aria-label={favoriteLabel}
          title={favoriteLabel}
          onClick={handleToggle}
        >
          <span aria-hidden="true" className="favorite-toggle__icon">
            {favoriteIcon}
          </span>
        </button>
      </div>
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
