import { get, set } from '@/services/storage'

export const THEME_LIGHT = 'light'
export const THEME_DARK = 'dark'

const KEY_THEME = 'theme'

export function loadTheme () {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const theme = get(KEY_THEME, prefersDark ? THEME_DARK : THEME_LIGHT)
  return [THEME_LIGHT, THEME_DARK].includes(theme) ? theme : THEME_LIGHT
}

export function saveTheme (theme) {
  set(KEY_THEME, theme)
}

// Bulma 1.x switches its CSS variables with the data-theme attribute
export function applyTheme (theme) {
  document.documentElement.setAttribute('data-theme', theme)
}
