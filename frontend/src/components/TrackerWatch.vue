<template>
  <div class="is-flex is-flex-direction-row is-align-items-center">
    <table class="tracker">
      <thead v-if="title">
        <tr class="is-size-5 has-text-centered">
          <th :colspan="canClear ? 5 : 6">{{ title }}</th>
          <th v-show="canClear">
            <mc-icon is-button icon="trash" height="24" @click="$emit('clear')" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, y) in modelValue" :key="'row-' + y">
          <td v-if="showTurnNumber">{{ y + 1 }}</td>
          <td v-for="(cell, x) in row" :key="'cell-' + x + '-' + y" class="is-clickable has-text-centered" @click="$emit('change', { y, x })">
            <div class="is-align-items-center is-justify-content-center is-flex tracker-cell" :class="cellClass(y, x)">
              <tracker-turn :model-value="cell" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="titleLeft" class="tracker-left-title is-vertical">
      <p :class="{ 'has-text-weight-bold': titleLeftBold }">{{ titleLeft }}</p>
    </div>
  </div>
</template>

<script>
import { trackerTurnColorClass } from '@/services/tracker'
import TrackerTurn from './TrackerTurn.vue'

export default {
  name: 'TrackerWatch',
  components: { TrackerTurn },
  props: {
    canClear: { type: Boolean, default: false },
    modelValue: { type: Array, required: true },
    showTurnNumber: { type: Boolean, default: false },
    title: { type: String, default: '' },
    titleLeft: { type: String, default: '' },
    titleLeftBold: { type: Boolean, default: false }
  },
  emits: ['change', 'clear'],
  methods: {
    cellClass (y, x) {
      return [y === 2 || y === 5 ? 'encounter' : '', trackerTurnColorClass(this.modelValue[y][x])]
    }
  }
}
</script>
