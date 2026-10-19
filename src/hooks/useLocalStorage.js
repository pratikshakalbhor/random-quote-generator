import { useCallback, useEffect, useState } from 'react'

/**
 * Read a value from localStorage. Invalid or corrupted JSON falls back safely
 * to the provided initial value instead of throwing.
 */
function readValue(key, initialValue) {
  const fallback = typeof initialValue === 'function' ? initialValue() : initialValue

  if (typeof window === 'undefined' || !window.localStorage) {
    return fallback
  }

  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) {
      return fallback
    }
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

/**
 * A small reusable localStorage-backed state hook.
 * Accepts a plain value or a functional updater, just like useState.
 * Storage reads/writes are wrapped so corrupted data or a full/blocked
 * localStorage never breaks the app.
 */
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => readValue(key, initialValue))

  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch {
      // Storage may be unavailable (private mode) or full; ignore.
    }
  }, [key, storedValue])

  const setValue = useCallback((value) => {
    setStoredValue(value)
  }, [])

  return [storedValue, setValue]
}

export default useLocalStorage
