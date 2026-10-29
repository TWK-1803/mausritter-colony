export function highestOfDices (dices) {
  dices.sort((a, b) => b - a)
  return dices[0]
}

export function lowestOfDices (dices) {
  dices.sort((a, b) => a - b)
  return dices[0]
}
