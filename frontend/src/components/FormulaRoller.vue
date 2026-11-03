<template>
  <div class="panel">
    <div class="panel-heading">
      Formula roller
    </div>

    <div class="panel-block">
      <form class="is-flex is-align-items-center is-flex-grow-1" @submit.prevent="roll">
        <input
          v-model.trim="formula"
          class="input is-small mr-2"
          type="text"
          placeholder="e.g. 2d6+1d4+3"
          spellcheck="false"
        >
        <button class="button is-small is-primary" type="submit">Roll</button>
      </form>
    </div>

    <div v-if="error" class="panel-block">
      <p class="has-text-danger is-size-7">{{ error }}</p>
    </div>

    <div v-if="result" class="panel-block is-flex is-flex-direction-column is-align-items-flex-start">
      <div class="is-flex is-align-items-center">
        <span class="is-size-4 has-text-weight-bold mr-2">{{ result.total }}</span>
        <span class="is-size-7 has-text-grey">{{ resultBreakdown }}</span>
      </div>
      <div class="is-size-7 has-text-grey mt-1">
        <span v-for="(part, i) in result.parts" :key="i">
          <template v-if="i > 0">&nbsp;</template>
          <span class="has-text-weight-semibold">{{ part.term }}</span>
          <template v-if="part.rolls.length"> [{{ part.rolls.join(', ') }}]</template>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { rollFormula } from '@/services/dice-roller'

export default {
  name: 'FormulaRoller',
  emits: ['rolled'],
  data () {
    return {
      formula: '',
      result: null,
      error: null
    }
  },
  computed: {
    resultBreakdown () {
      if (!this.result) return ''
      return this.result.parts.map(p => p.value).join(' + ').replace(/\+ -/g, '- ')
    }
  },
  methods: {
    roll () {
      this.error = null
      this.result = null
      try {
        this.result = rollFormula(this.formula)
        const allRolls = this.result.parts.flatMap(p => p.rolls)
        this.$emit('rolled', {
          context: this.formula,
          dices: allRolls,
          total: this.result.total
        })
      } catch (e) {
        this.error = e.message
      }
    }
  }
}
</script>
