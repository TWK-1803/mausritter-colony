<template>
  <template v-if="modelValue === 2">
    <mc-icon icon="paws" :height="28" class="turn-icon-paws-dark" />
    <mc-icon icon="paws-light" :height="28" class="turn-icon-paws-light" />
  </template>
  <mc-icon v-else-if="modelValue" :icon="trackerTurnIcon(modelValue)" :height="28" />
</template>

<script>
import { trackerTurnIcon } from '@/services/tracker'

export default {
  name: 'TrackerTurn',
  props: {
    modelValue: { type: Number, default: 0 }
  },
  data () {
    return {
      trackerTurnIcon
    }
  }
}
</script>
