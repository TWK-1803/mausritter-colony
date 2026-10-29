import { get, set } from '@/services/storage'

const KEY_ENEMIES = 'enemies'

export function loadEnemies () {
  return get(KEY_ENEMIES, [])
}

export function saveEnemies (enemies) {
  set(KEY_ENEMIES, enemies)
}
