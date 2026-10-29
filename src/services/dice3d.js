/* global $diceCore */
const CALLBACK_DELAY = 500

let canvas = null
let diceBox = null

function fitCanvas () {
  canvas.style.width = `${window.innerWidth - 8}px`
  canvas.style.height = `${window.innerHeight}px`
}

// The 3D dice library is loaded with plain <script> tags. If it is missing,
// rolls fall back to plain JS so the app keeps working without the animation.
export function initialize (canvasId) {
  if (diceBox) return

  if (typeof $diceCore === 'undefined') {
    console.warn('[dice3d] $diceCore not available, 3D dice disabled')
    return
  }

  try {
    canvas = $diceCore.id(canvasId)
    fitCanvas()
    $diceCore.dice.use_true_random = false
    $diceCore.dice.use_shadows = false
    $diceCore.dice.dice_color = '#000070'
    $diceCore.dice.label_color = '#ffffff'
    diceBox = new $diceCore.dice.dice_box(canvas)
    diceBox.animate_selector = false
    canvas.style.display = 'none'
  } catch (err) {
    console.warn('[dice3d] initialization failed, 3D dice disabled:', err.message)
    canvas = null
    diceBox = null
  }
}

export function roll ({ formula = '2d6', callbackFn }) {
  if (!diceBox) {
    const [, count = 1, faces = 6] = formula.match(/^(\d+)d(\d+)$/) || []
    const dices = Array.from({ length: Number(count) }, () => Math.floor(Math.random() * Number(faces)) + 1)
    const total = dices.reduce((sum, dice) => sum + dice, 0)
    setTimeout(() => callbackFn({ dices, total }), 0)
    return
  }

  const afterRoll = (_notation, dices) => {
    setTimeout(() => {
      canvas.style.display = 'none'
      callbackFn({ dices, total: dices.reduce((sum, dice) => sum + dice, 0) })
    }, CALLBACK_DELAY)
  }

  fitCanvas()
  canvas.style.display = ''
  diceBox.start_throw(
    () => $diceCore.dice.parse_notation(formula),
    (_vectors, _notation, callback) => callback(),
    afterRoll
  )
}
