<template>
  <div class="m-1 p-2">
    <div class="select is-small mb-2">
      <select v-model="selectedType" @change="addEnemyType">
        <option value="">{{ $t('Add common enemy...') }}</option>
        <option v-for="type in ENEMY_TYPES" :key="type.name" :value="type.name">{{ type.name }}</option>
      </select>
    </div>

    <form class="columns is-multiline is-variable is-1 mb-2" @submit.prevent="addCustomEnemy">
      <div class="column is-4">
        <input v-model.trim="draft.name" class="input is-small" type="text" required :placeholder="$t('Name')">
      </div>
      <div class="column is-4">
        <input v-model.trim="draft.description" class="input is-small" type="text" :placeholder="$t('Description')">
      </div>
      <div class="column is-4">
        <input v-model.trim="draft.attacks" class="input is-small" type="text" :placeholder="$t('Attacks')">
      </div>
      <div class="column is-12">
        <input v-model.trim="draft.notes" class="input is-small" type="text" :placeholder="$t('Notes')">
      </div>
      <div v-for="stat in STATS" :key="stat.key" class="column is-2">
        <input v-model.number="draft[stat.key]" class="input is-small" type="number" min="0" required :placeholder="$t(stat.label)">
      </div>
      <div class="column is-2">
        <input v-model.number="draft.armour" class="input is-small" type="number" min="0" :placeholder="$t('Armour')">
      </div>
      <div class="column is-2">
        <button class="button is-small is-primary is-fullwidth" type="submit">{{ $t('Add enemy') }}</button>
      </div>
    </form>

    <p v-if="!enemies.length" class="has-text-weight-bold m-2">{{ $t('No enemies in this encounter.') }}</p>

    <div class="is-flex is-flex-wrap-wrap">
      <div v-for="enemy in enemies" :key="enemy.id" class="card m-1 enemy" :class="{ 'enemy-defeated': isDefeated(enemy) }">
        <header class="card-header">
          <div class="card-header-title is-flex is-justify-content-space-between">
            <div>
              <div class="is-size-5">
                {{ enemy.name }}
                <span v-if="isDefeated(enemy)" class="tag is-danger ml-1">{{ $t('Defeated') }}</span>
              </div>
              <div v-if="enemy.description" class="is-size-7 has-text-weight-normal">{{ enemy.description }}</div>
            </div>
            <mc-icon is-button icon="trash" height="24" class="ml-4" @click="removeEnemy(enemy.id)" />
          </div>
        </header>

        <div class="card-content m-0 py-0 px-1">
          <table class="table is-striped has-text-centered">
            <tbody>
              <tr class="is-size-7">
                <td />
                <td>{{ $t('Max') }}</td>
                <td class="has-text-info" colspan="3">{{ $t('Current') }}</td>
              </tr>
              <tr v-for="stat in STATS" :key="stat.key">
                <td class="has-text-left has-text-weight-bold">{{ $t(stat.label) }}</td>
                <td>{{ enemy[stat.key + '_max'] }}</td>
                <td><button class="button is-small" @click="adjust(enemy, stat.key, -1)">-</button></td>
                <td class="is-size-5 has-text-info">{{ enemy[stat.key] }}</td>
                <td><button class="button is-small" @click="adjust(enemy, stat.key, 1)">+</button></td>
              </tr>
            </tbody>
          </table>
          <div class="px-1 pb-2">
            <p><span class="has-text-weight-bold">{{ $t('Armour') }}</span> {{ enemy.armour }}</p>
            <p v-if="enemy.attacks"><span class="has-text-weight-bold">{{ $t('Attacks') }}</span> {{ enemy.attacks }}</p>
            <p v-for="note in enemy.notes" :key="note" class="is-size-7">{{ note }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import { ENEMY_TYPES } from '@/services/enemy-types'
import { loadEnemies, saveEnemies } from '@/services/enemies'

const STATS = [
  { key: 'hp', label: 'HP' },
  { key: 'str', label: 'STR' },
  { key: 'dex', label: 'DEX' },
  { key: 'wil', label: 'WIL' }
]

const newDraft = () => ({ name: '', description: '', attacks: '', notes: '', hp: null, str: null, dex: null, wil: null, armour: 0 })

const createEnemy = ({ name, description = '', attacks = '', notes = [], hp, str, dex, wil, armour = 0 }) => ({
  id: uuidv4(),
  name,
  description,
  attacks,
  notes,
  armour,
  hp, hp_max: hp,
  str, str_max: str,
  dex, dex_max: dex,
  wil, wil_max: wil
})

export default {
  name: 'Encounter',
  data () {
    return {
      ENEMY_TYPES,
      STATS,
      draft: newDraft(),
      enemies: loadEnemies(),
      selectedType: ''
    }
  },
  watch: {
    enemies: {
      deep: true,
      handler: saveEnemies
    }
  },
  methods: {
    addCustomEnemy () {
      const { notes, armour, ...rest } = this.draft
      this.enemies.push(createEnemy({ ...rest, armour: armour || 0, notes: notes ? [notes] : [] }))
      this.draft = newDraft()
    },
    addEnemyType () {
      const type = ENEMY_TYPES.find(({ name }) => name === this.selectedType)
      if (type) this.enemies.push(createEnemy(type))
      this.selectedType = ''
    },
    adjust (enemy, key, delta) {
      enemy[key] = Math.min(enemy[`${key}_max`], Math.max(0, enemy[key] + delta))
    },
    isDefeated (enemy) {
      return enemy.str <= 0
    },
    removeEnemy (id) {
      this.enemies = this.enemies.filter(enemy => enemy.id !== id)
    }
  }
}
</script>
