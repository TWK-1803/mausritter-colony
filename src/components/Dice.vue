<template>
  <mc-icon :icon="'d' + faces" class="is-clickable" :height="height" @click="rollDice" />
</template>

<script>
import { roll } from '@/services/dice3d'
import { highestOfDices, lowestOfDices } from '@/services/dice-roller'

export default {
  name: 'Dice',
  props: {
    advantage: { type: String, default: '' },
    context: { type: String, default: '' },
    faces: { type: Number, default: 6 },
    height: { type: Number, default: 24 },
    number: { type: Number, default: 1 }
  },
  emits: ['rolled'],
  methods: {
    rollDice () {
      roll({
        formula: `${this.advantage ? 2 : this.number}d${this.faces}`,
        callbackFn: ({ dices, total }) => {
          this.$emit('rolled', {
            advantage: this.advantage,
            context: this.context,
            dices,
            faces: this.faces,
            total: this.pickTotal(dices, total)
          })
        }
      })
    },
    pickTotal (dices, total) {
      if (this.advantage === 'a') return lowestOfDices(dices)
      if (this.advantage === 'd') return highestOfDices(dices)
      return total
    }
  }
}
</script>
