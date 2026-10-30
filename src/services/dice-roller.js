export function highestOfDices (dices) {
  dices.sort((a, b) => b - a)
  return dices[0]
}

export function lowestOfDices (dices) {
  dices.sort((a, b) => a - b)
  return dices[0]
}

// Rolls a full dice formula string such as "2d6+1d4-2".
// Returns { total, parts } where parts is an array of { term, rolls, value }
// describing each term in the expression.
export function rollFormula (formula) {
  const normalised = formula.replace(/\s/g, '').toLowerCase()
  if (!normalised) throw new Error('Empty formula')

  // Split on + / - while keeping the sign as part of the token
  const tokens = normalised.match(/[+-]?[^+-]+/g)
  if (!tokens) throw new Error(`Invalid formula: ${formula}`)

  const parts = tokens.map(token => {
    const sign = token.startsWith('-') ? -1 : 1
    const raw = token.replace(/^[+-]/, '')
    const diceMatch = raw.match(/^(\d+)d(\d+)$/)

    if (diceMatch) {
      const count = parseInt(diceMatch[1], 10)
      const faces = parseInt(diceMatch[2], 10)
      const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * faces) + 1)
      const value = sign * rolls.reduce((s, r) => s + r, 0)
      return { term: token, rolls, value }
    }

    const flat = parseInt(raw, 10)
    if (!isNaN(flat)) return { term: token, rolls: [], value: sign * flat }

    throw new Error(`Unrecognised term: ${token}`)
  })

  const total = parts.reduce((s, p) => s + p.value, 0)
  return { total, parts }
}
