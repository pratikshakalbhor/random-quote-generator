import { THEMES, nextTheme } from '../utils/theme.js'

/**
 * Cycles System -> Light -> Dark. The aria-label names the mode on screen and
 * the one the next click will switch to; the icon and label are visible too.
 */
function ThemeToggle({ theme, onChange }) {
  const current = THEMES[theme] ?? THEMES.system
  const upcoming = THEMES[nextTheme(theme)]
  const description = `Theme: ${current.label}. Switch to ${upcoming.label}.`

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={description}
      title={description}
      onClick={() => onChange(nextTheme(theme))}
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        {current.icon}
      </span>
      <span className="theme-toggle__label">{current.label}</span>
    </button>
  )
}

export default ThemeToggle
