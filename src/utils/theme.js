export const THEME_KEY = 'random-quote-generator:theme'
export const DEFAULT_THEME = 'system'
export const THEME_ORDER = ['system', 'light', 'dark']

export const THEMES = {
  system: { label: 'System', icon: '◐' },
  light: { label: 'Light', icon: '☀' },
  dark: { label: 'Dark', icon: '☾' },
}

// Keep in sync with --color-bg in styles/global.css (and the inline script
// in index.html, which runs before the stylesheet is applied).
export const THEME_COLORS = {
  light: '#f5f7fa',
  dark: '#0f1020',
}

export function isTheme(value) {
  return Object.prototype.hasOwnProperty.call(THEMES, value)
}

export function nextTheme(theme) {
  const index = THEME_ORDER.indexOf(theme)
  return THEME_ORDER[(index + 1) % THEME_ORDER.length]
}

export function systemPrefersDark() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
}

/**
 * Apply a theme to <html> and point the browser-UI colour at the resulting
 * background, so the address bar matches whichever theme is in effect.
 */
export function applyTheme(theme) {
  if (typeof document === 'undefined') return

  const isDark = theme === 'dark' || (theme === 'system' && systemPrefersDark())
  document.documentElement.dataset.theme = theme

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', isDark ? THEME_COLORS.dark : THEME_COLORS.light)
  }
}
