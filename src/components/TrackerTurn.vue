<template>
  <mc-icon v-show="modelValue" :icon="trackerTurnIcon(modelValue)" :height="28" />
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
