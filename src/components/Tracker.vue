<template>
  <div class="is-flex is-flex-wrap-wrap">
    <tracker-watch
      v-for="watch in WATCHES"
      :key="watch.name"
      can-clear
      :title="watch.title"
      :title-left="watch.titleLeft"
      :title-left-bold="watch.bold"
      :model-value="$data[watch.name]"
      @change="onChange(watch.name, $event)"
      @clear="onClear(watch.name)"
    />
  </div>
</template>

<script>
import { TURN_TRACKER_LAST } from '@/services/tracker'
import TrackerWatch from './TrackerWatch.vue'

const WATCHES = [
  { name: 'night', title: 'Night watch', titleLeft: 'Sunrise', bold: true },
  { name: 'morning', title: 'Morning watch', titleLeft: 'Noon', bold: false },
  { name: 'afternoon', title: 'Afternoon watch', titleLeft: 'Sunset', bold: true },
  { name: 'evening', title: 'Evening watch', titleLeft: '', bold: false }
]

const newWatch = () => Array.from({ length: 6 }, () => Array(6).fill(0))

export default {
  name: 'Tracker',
  components: { TrackerWatch },
  data () {
    return {
      WATCHES,
      afternoon: newWatch(),
      evening: newWatch(),
      morning: newWatch(),
      night: newWatch()
    }
  },
  methods: {
    onChange (watchName, { y, x }) {
      const watch = this[watchName].map(row => [...row])
      watch[y][x] = watch[y][x] >= TURN_TRACKER_LAST ? 0 : watch[y][x] + 1
      this[watchName] = watch
      this.$store.dispatch('vtable/update', { data: this.serialize() })
    },
    onClear (watchName) {
      this[watchName] = newWatch()
      this.$store.dispatch('vtable/update', { data: this.serialize() })
    },
    serialize () {
      return {
        afternoon: this.afternoon,
        evening: this.evening,
        morning: this.morning,
        night: this.night
      }
    },
    set (data) {
      if (!data) return
      for (const { name } of WATCHES) {
        if (data[name]) this[name] = [...data[name]]
      }
    }
  }
}
</script>
