const storage = window.localStorage

export function set (key, value) {
  storage.setItem(key, JSON.stringify(value))
}

export function get (key, defaultValue) {
  const value = storage.getItem(key)
  if (value === null || value === 'undefined' || value === '') return defaultValue
  return JSON.parse(value)
}
