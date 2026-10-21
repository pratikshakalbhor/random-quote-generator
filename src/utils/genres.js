import quotes from '../data/quotes.json'

/**
 * Genre options are derived from the data — never hardcoded — so adding or
 * renaming a genre in quotes.json updates the filter automatically.
 * "All" is always the first option and means "every quote".
 */
export const ALL_GENRES = 'All'

export const GENRE_OPTIONS = [
  ALL_GENRES,
  ...[...new Set(quotes.map((quote) => quote.genre).filter(Boolean))].sort(),
]

export function isKnownGenre(genre) {
  return GENRE_OPTIONS.includes(genre)
}

/**
 * The quotes allowed for a given genre. Unknown or "All" values return the
 * full dataset, so a stale stored value degrades to no filtering at all.
 */
export function quotesForGenre(genre) {
  if (!isKnownGenre(genre) || genre === ALL_GENRES) return quotes
  return quotes.filter((quote) => quote.genre === genre)
}
