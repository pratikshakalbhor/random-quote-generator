/**
 * Pick a random quote that is different from the given quote (by id).
 * Falls back gracefully when the list holds fewer than two quotes.
 */
export function pickRandom(quotes, currentQuote) {
  if (!Array.isArray(quotes) || quotes.length === 0) {
    return null
  }

  if (quotes.length === 1) {
    return quotes[0]
  }

  const currentId = currentQuote ? currentQuote.id : null
  let candidate = null
  do {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    candidate = quotes[randomIndex]
  } while (candidate.id === currentId)

  return candidate
}

export default pickRandom
