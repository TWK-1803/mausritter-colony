export const TURN_TRACKER_EMPTY = 0
export const TURN_TRACKER_LIGHT = 1
export const TURN_TRACKER_MOVE = 2
export const TURN_TRACKER_EAT = 3
export const TURN_TRACKER_LAST = TURN_TRACKER_EAT

const ICONS = {
  [TURN_TRACKER_LIGHT]: 'light',
  [TURN_TRACKER_MOVE]: 'paws',
  [TURN_TRACKER_EAT]: 'food'
}

export function trackerTurnColorClass (value) {
  return value === TURN_TRACKER_LIGHT ? 'tracker-turn-light' : ''
}

export function trackerTurnIcon (value) {
  return ICONS[value] || ''
}
