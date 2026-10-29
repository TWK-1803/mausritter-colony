import { get, set } from '@/services/storage'

const KEY_PREFS = 'preferences'

export function loadPrefs () {
  return get(KEY_PREFS, {})
}

export function savePrefsKey (key, value) {
  const prefs = { ...loadPrefs(), [key]: value }
  set(KEY_PREFS, prefs)
  return prefs
}
