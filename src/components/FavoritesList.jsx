function FavoritesList({ favorites, onRemove }) {
  if (!Array.isArray(favorites) || favorites.length === 0) {
    return (
      <section className="favorites favorites--empty">
        <h2 className="favorites__title">Favorites</h2>
        <p className="favorites__empty">No favorites saved yet. Tap the star to add one!</p>
      </section>
    )
  }

  const getAuthor = (quote) => {
    const rawAuthor = quote?.author
    const isUnknown =
      rawAuthor === null || rawAuthor === undefined || String(rawAuthor).trim() === ''
    return isUnknown ? 'Unknown author' : String(rawAuthor).trim()
  }

  return (
    <section className="favorites">
      <h2 className="favorites__title">Favorites</h2>
      <ul className="favorites__list">
        {favorites.map((quote) => (
          <li key={quote.id} className="favorites__item">
            <article className="quote-card quote-card--favorite">
              <blockquote className="quote-card__quote">
                <p>{quote.text}</p>
              </blockquote>
              <footer className="quote-card__footer">
                <p className="quote-card__author">— {getAuthor(quote)}</p>
                <span className="genre-chip">{quote.genre}</span>
              </footer>
              <div className="favorites__actions">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => onRemove(quote.id)}
                >
                  Remove
                </button>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default FavoritesList
