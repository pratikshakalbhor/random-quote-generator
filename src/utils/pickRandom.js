/**
 * Pick a random quote from `pool` that is not the quote identified by
 * `currentId` (the "never the same quote twice in a row" rule).
 *
 * The current quote is excluded by filtering rather than by retrying, so a
 * pool that only holds the current quote (a genre with a single quote) simply
 * returns it again instead of looping forever.
 *
 * @param {Array} pool candidates to choose from
 * @param {number|null} [currentId] id of the quote currently displayed
 * @returns {Object|null} a quote, or null when the pool is empty
 */
export function pickRandom(pool, currentId = null) {
  if (!Array.isArray(pool) || pool.length === 0) {
    return null
  }

  const candidates = pool.filter((quote) => quote && quote.id !== currentId)
  const source = candidates.length > 0 ? candidates : pool

  return source[Math.floor(Math.random() * source.length)]
}

export default pickRandom
