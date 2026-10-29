import { createStore } from 'vuex'

import { request } from '@/services/api'
import { loadPrefs, savePrefsKey } from '@/services/preferences'
import history from './history'
import sheets from './sheets'
import vtable from './vtable'

export const store = createStore({
  modules: {
    history,
    sheets,
    vtable
  },
  state: () => ({
    locale: null,
    preferences: {}
  }),
  getters: {
    locale: state => state.locale,
    preferences: state => state.preferences
  },
  mutations: {
    setLocale (state, locale) {
      state.locale = locale
    },
    setPrefs (state, preferences) {
      state.preferences = preferences
    }
  },
  actions: {
    changeLocale ({ commit }, locale) {
      commit('setLocale', locale)
    },
    loadPreferences ({ commit }) {
      commit('setPrefs', loadPrefs())
    },
    savePreferences ({ commit }, { key, value }) {
      commit('setPrefs', savePrefsKey(key, value))
    },
    sendDiceResult (_context, { vTable, diceResult }) {
      return request(`/dices?vtable=${vTable}&sheet=${vTable}`, { method: 'POST', body: diceResult })
    }
  }
})
