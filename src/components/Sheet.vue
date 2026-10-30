<template>
  <div class="card">
    <header class="card-header">
      <div class="card-header-title is-flex is-flex-direction-row is-justify-content-space-between mx-1 p-0">
        <mc-icon icon="mouse-face" height="48" />

        <div class="ml-1 is-flex is-flex-direction-column">
          <div class="is-size-5">{{ sheetName }}</div>
          <div>Level {{ level }} {{ sheetBackground }}</div>
          <div class="is-size-7">Last update: {{ lastUpdate.toLocaleString() }}</div>
        </div>

        <div class="ml-4">
          <div class="dropdown" :class="{ 'is-active': deleteMenu }">
            <div class="dropdown-trigger">
              <mc-icon icon="menu" class="is-clickable" :class="{ boxed: deleteMenu }" height="24" @click="deleteMenu = !deleteMenu" />
            </div>
            <div class="dropdown-menu" role="menu">
              <div class="dropdown-content">
                <div class="has-text-right">
                  <mc-icon icon="menu-back" class="is-clickable" height="24" @click="deleteMenu = false" />
                </div>
                <a href="#" class="dropdown-item" @click="remove">
                  Remove from table
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="card-content m-0 py-0 px-1">
      <div class="content">
        <table class="table is-striped has-text-centered">
          <tbody>
            <tr class="is-size-7">
              <td />
              <td>Max</td>
              <td class="has-text-info">Current</td>
            </tr>
            <tr v-for="stat in stats" :key="stat.label">
              <td class="has-text-left has-text-weight-bold">{{ stat.label }}</td>
              <td>{{ stat.max }}</td>
              <td class="is-size-5 has-text-info">{{ stat.current }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sheet',
  props: {
    dex: { type: Number, required: true },
    dex_max: { type: Number, required: true },
    hp: { type: Number, required: true },
    hp_max: { type: Number, required: true },
    lastUpdate: { type: Date, required: true },
    level: { type: Number, required: true },
    name: { type: String, required: true },
    str: { type: Number, required: true },
    str_max: { type: Number, required: true },
    wil: { type: Number, required: true },
    wil_max: { type: Number, required: true }
  },
  emits: ['remove'],
  data () {
    return {
      deleteMenu: false
    }
  },
  computed: {
    backgroundIndex () { return this.name.indexOf('(') },
    sheetBackground () { return this.backgroundIndex > 0 ? this.name.slice(this.backgroundIndex) : '' },
    sheetName () { return this.backgroundIndex > 0 ? this.name.slice(0, this.backgroundIndex) : this.name },
    stats () {
      return [
        { label: 'STR', current: this.str, max: this.str_max },
        { label: 'DEX', current: this.dex, max: this.dex_max },
        { label: 'WIL', current: this.wil, max: this.wil_max },
        { label: 'HP', current: this.hp, max: this.hp_max }
      ]
    }
  },
  methods: {
    remove () {
      this.$emit('remove', { name: this.name })
      this.$nextTick(() => { this.deleteMenu = false })
    }
  }
}
</script>
