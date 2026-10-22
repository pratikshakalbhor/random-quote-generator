import { useId } from 'react'

/**
 * Labeled genre <select>. A native select keeps the whole list keyboard
 * accessible (Tab, arrow keys, type-ahead) for free.
 */
function GenreFilter({ options, value, onChange }) {
  const selectId = useId()

  return (
    <div className="genre-filter">
      <label className="genre-filter__label" htmlFor={selectId}>
        Genre
      </label>
      <select
        id={selectId}
        className="genre-filter__select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
    </div>
  )
}

export default GenreFilter
