<template>
  <div id="app" class="application-background">
    <div id="dice-canvas" class="dice3d-canvas" />

    <div class="is-flex is-flex-direction-row is-justify-content-start background-white-50 vertical-align px-2">
      <img max-height="32px" src="/img/logo.png">
      <div class="is-size-3 has-text-weight-bold mr-2">
        Mausritter-Colony
        <span class="px-2 has-background-danger has-text-white">BETA</span>
      </div>

      <button v-for="lang in LOCALES" :key="lang" class="button is-small mr-2" :class="locale === lang ? 'is-primary' : ''" @click="changeLocale(lang)">
        <mc-icon :icon="lang" height="24" class="mr-1"/>
        <span v-show="locale !== lang">{{ $t(lang) }}</span>
      </button>

      <button class="button is-small mr-2" :title="$t('Toggle dark mode')" @click="toggleTheme">
        <mc-icon :icon="theme === 'dark' ? 'sun' : 'moon'" height="24" />
      </button>

      <a href="https://mausritter-sheet.dco.ninja" target="_blank">
        Mausritter-Sheet
      </a>

      <div class="is-flex is-flex-grow-1 is-justify-content-flex-end">
        <img src="@/assets/img/compatible-with-mausritter-88x32.png" contain class="is-clickable" @click="showAbout = true" />
      </div>
    </div>

    <div class="columns m-1">
      <div class="column is-half-tablet is-two-thirds-desktop">
        <div v-show="error" class="notification is-error">
          <button class="delete" @click="error = null" />
          {{ error }}
        </div>

        <div class="is-flex is-flex-direction-column">
          <accordion class="table-background">
            <template #header>
              {{ $t('Table') }}
            </template>

            <template #content>
              <div class="m-1">
                <div class="p-2 has-text-weight-normal">
                  <p class="is-size-5 has-text-weight-bold">{{ $t('Welcome') }}</p>

                  <div class="notification background-white-50">
                    <p>{{ $t('Mausritter-Colony is a very simple tool that will help you, the GM, to manage a Mausritter adventure. All data older than 3 months will be deleted.') }}</p>
                    <p class="has-text-weight-bold">{{ $t('Mausritter-Colony is not a virtual tabletop. You will have to manually refresh the mice list and the dices history.') }}</p>

                    <div class="mt-2">
                      <hr>
                      <span class="subtitle">{{ $t('To begin to play:') }}</span>
                      <div>
                        <span class="subtitle">1 <mc-icon icon="arrow-right" /></span>
                        {{ $t('Tell your player to create/load their mouse on') }} <a target="mausritter-sheet" href="https://mausritter-sheet.dco.ninja/">Mausritter Sheet</a>. {{ $t('At the top of the sheet, a table ID can be input.') }}
                        <img class="ml-4" src="@/assets/img/table-id-input.png" contain />
                      </div>
                      <div>
                        <span class="subtitle">2 <mc-icon icon="arrow-right" /></span>
                        {{ $t('Share this table ID with your players:') }}
                        <span class="is-family-monospace has-text-weight-bold is-size-5 is-clickable ml-1" @click="copyToClipboard" :data-tooltip="$t('Click to copy to clipboard')">
                          {{ vtable }}
                          <mc-icon is-button icon="copy" class="ml-1" />
                        </span>
                        <div v-show="showNotifications" class="notification is-info is-light">
                          <button class="delete" @click="showNotifications = false" />
                          {{ $t('{name} is now copied to clipboard.', { name: vtable }) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </accordion>

          <accordion class="table-background">
            <template #header>
              {{ $t('Turn tracker') }}
            </template>

            <template #header-append>
              <mc-icon is-button icon="help" height="24" @click="showHelp = !showHelp" />
            </template>

            <template #content>
              <div class="m-1">
                <div v-show="showNotifications" class="notification is-info is-light">
                  <button class="delete" @click="showNotifications = false" />
                  {{ $t('{name} is now copied to clipboard.', { name: vtable }) }}
                </div>

                <div>
                  <tracker ref="turn-tracker" />
                </div>

                <transition name="fade">
                  <div v-if="showHelp" class="m-2 mt-4 notification background-white-50 is-flex is-flex-wrap-wrap">
                    <button class="delete" @click="showHelp = false" />

                    <div>
                      <p>{{ $t('Click on a box to change its content.') }}</p>
                      <p class="is-align-items-center is-flex">
                        <mc-icon icon="light" height="20" class="mr-1" />
                        {{ $t('A turn using lighting with a torch or a lantern.') }}
                      </p>
                      <p class="is-align-items-center is-flex">
                        <mc-icon icon="paws" height="20" class="mr-1" />
                        {{ $t('A turn walking.') }}
                      </p>
                      <p class="is-align-items-center is-flex">
                        <mc-icon icon="food" height="20" class="mr-1" />
                        {{ $t('A turn to rest and eat.') }}
                      </p>
                    </div>

                    <div class="mx-4">
                      {{ $t('In a dungeon, roll d6 for encounter every three turns.') }}
                      <p>
                        {{ $t('1: Encounter, 2: Omen of encounter. Roll for type.') }}
                      </p>
                    </div>

                    <div>
                      {{ $t('In the wilderness, roll d6 for encounter at Sunrise and Sunset.') }}
                      <p>
                        {{ $t('If an encounter or omen is rolled, roll d12 to find the hour.') }}
                      </p>
                    </div>
                  </div>
                </transition>
              </div>
            </template>
          </accordion>

          <accordion class="table-background">
            <template #header>
              {{ $t('Encounter') }}
            </template>

            <template #content>
              <encounter />
            </template>
          </accordion>

          <accordion class="table-background">
            <template #header>
              {{ $t('Mice') }} <span class="ml-2 tag is-rounded is-dark">{{ sheets.length }}</span>
            </template>

            <template #header-append>
              <mc-icon v-if="vtable" is-button icon="refresh" height="24" :class="isLoadingMice ? 'rotate' : ''" @click="refreshMice" />
            </template>

            <template #content>
              <div v-if="vtable" class="is-flex is-flex-wrap-wrap">
                <div v-if="sheets.length === 0" class="is-size-5 has-text-weight-bold m-4">
                  {{ $t('No player is connected. Refresh this panel with the double round arrows in its title:') }}
                  <mc-icon is-button icon="refresh" height="24" @click="refreshMice" />
                </div>
                <div v-else v-for="(sheet, index) in sheets" :key="index" class="p-2">
                  <sheet :level="sheet.level" :dex="sheet.dex" :dex_max="sheet.dex_max" :hp="sheet.hp" :hp_max="sheet.hp_max" :last-update="sheet.updated" :name="sheet.name" :str="sheet.str" :str_max="sheet.str_max" :wil="sheet.wil" :wil_max="sheet.wil_max" @remove="removeSheet" />
                </div>
              </div>
            </template>
          </accordion>
        </div>
      </div>

      <div class="column">
        <div class="panel">
          <div class="panel-heading is-flex is-flex-direction-row is-justify-content-space-between">
            Dices
            <div class="is-flex is-flex-direction-row">
              <div class="buttons has-addons are-small">
                <button class="button small" :class="diceAdvantage === '' ? 'has-background-info has-text-info-light' : ''" @click="diceAdvantage = ''">{{ $t('neutral') }}</button>
                <button class="button" :class="diceAdvantage === 'a' ? 'has-background-info has-text-info-light' : ''" @click="diceAdvantage = 'a'">{{ $t('advantage') }}</button>
                <button class="button" :class="diceAdvantage === 'd' ? 'has-background-info has-text-info-light' : ''" @click="diceAdvantage = 'd'">{{ $t('disadvantage') }}</button>
              </div>
            </div>
          </div>

          <div class="notification panel-block dices-launcher">
            {{ $t('Roll dice') }}
            <div v-for="dice in DICE_FACES" :key="dice" class="mx-4 is-clickable dice">
              <dice :faces="dice" :advantage="diceAdvantage" :height="32" @rolled="diceRolled" color="blue" />
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-heading is-flex is-flex-direction-row is-justify-content-space-between">
            {{ $t('History') }}
            <mc-icon v-if="vtable" is-button icon="trash" height="24" @click="clearHistory" />
            <mc-icon v-if="vtable" is-button icon="refresh" height="24" :class="isLoadingHistory ? 'rotate' : ''" @click="refreshHistory" />
          </div>

          <div v-if="vtable" class="panel-block">
            <history v-if="history.length" :value="history" />
            <div v-else class="is-size-5 has-text-weight-bold m-4">
              {{ $t('No roll. Roll a die or update the history by clicking on the double round arrows in its title:') }}
              <mc-icon is-button icon="refresh" height="24" @click="refreshHistory" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <about :show="showAbout" />
  </div>
</template>

<script>
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid'
import About from '@/components/About.vue'
import Accordion from '@/components/Accordion.vue'
import Dice from '@/components/Dice.vue'
import Encounter from '@/components/Encounter.vue'
import History from '@/components/History.vue'
import Sheet from '@/components/Sheet.vue'
import Tracker from '@/components/Tracker.vue'
import { copyToClipboard } from '@/services/clipboard'
import { PREF_VTABLE_ID } from '@/services/defines'
import { initialize as initializeDice } from '@/services/dice3d'
import { DEFAULT_LOCALE, LOCALES, loadLocale, saveLocale } from '@/services/locales'
import { applyTheme, loadTheme, saveTheme, THEME_DARK, THEME_LIGHT } from '@/services/theme'

const DICE_FACES = [4, 6, 8, 10, 12, 20]
const MIN_LOADING_MS = 500

export default {
  name: 'App',
  components: { About, Accordion, Dice, Encounter, History, Sheet, Tracker },
  data () {
    return {
      DICE_FACES,
      LOCALES,
      diceAdvantage: '',
      error: null,
      isLoadingHistory: false,
      isLoadingMice: false,
      locale: null,
      showAbout: false,
      showHelp: true,
      showNotifications: false,
      theme: THEME_LIGHT
    }
  },
  computed: {
    history () { return this.$store.getters['history/list'] },
    prefs () { return this.$store.getters['preferences'] },
    sheets () { return this.$store.getters['sheets/list'] },
    vtable () { return this.prefs[PREF_VTABLE_ID] }
  },
  methods: {
    changeLocale (newLocale) {
      this.locale = newLocale || DEFAULT_LOCALE
      this.$i18n.locale = this.locale
      this.$store.dispatch('changeLocale', this.locale)
      saveLocale(this.locale)
    },
    async clearHistory () {
      if (!this.vtable) return
      await this.run('isLoadingHistory', 'history/clear')
      this.refreshHistory()
    },
    async copyToClipboard () {
      await copyToClipboard(this.vtable)
      this.showNotifications = true
      setTimeout(() => { this.showNotifications = false }, 5000)
    },
    async diceRolled (diceResult) {
      await this.$store.dispatch('sendDiceResult', { vTable: this.vtable, diceResult })
      await this.refreshHistory()
    },
    refreshHistory () {
      if (this.vtable) return this.run('isLoadingHistory', 'history/list')
    },
    refreshMice () {
      if (this.vtable) return this.run('isLoadingMice', 'sheets/list')
    },
    async removeSheet ({ name }) {
      if (!this.vtable) return
      await this.$store.dispatch('sheets/remove', { tableId: this.vtable, name })
      this.refreshMice()
    },
    async run (loadingFlag, action) {
      this[loadingFlag] = true
      try {
        await this.$store.dispatch(action, this.vtable)
      } catch (error) {
        console.error(`[app] ${action} error:`, error)
        this.error = error.message
      }
      setTimeout(() => { this[loadingFlag] = false }, MIN_LOADING_MS)
    },
    serialize () {
      return { turns: this.$refs['turn-tracker'].serialize() }
    },
    toggleTheme () {
      this.theme = this.theme === THEME_DARK ? THEME_LIGHT : THEME_DARK
      applyTheme(this.theme)
      saveTheme(this.theme)
    }
  },
  created () {
    this.theme = loadTheme()
    applyTheme(this.theme)

    this.$store.dispatch('loadPreferences')
    if (!this.vtable) {
      this.$store.dispatch('savePreferences', { key: PREF_VTABLE_ID, value: uuidv5('mausritter-colony', uuidv4()) })
    }
  },
  async mounted () {
    this.changeLocale(loadLocale())

    // The 3D dice library is loaded with deferred scripts
    window.addEventListener('load', () => initializeDice('dice-canvas'))

    // The backend is optional: the app works offline without it
    try {
      await this.$store.dispatch('vtable/get', this.vtable)
      const current = this.$store.getters['vtable/current']
      if (current === false) {
        await this.$store.dispatch('vtable/create', { tableId: this.vtable, data: this.serialize() })
      } else if (current) {
        this.$refs['turn-tracker'].set(current)
      }
    } catch (error) {
      console.warn('[app] backend unavailable, running offline:', error.message)
    }
  }
}
</script>