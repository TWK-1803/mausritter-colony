import { createStore } from 'vuex'

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
    preferences: {}
  }),
  getters: {
    preferences: state => state.preferences
  },
  mutations: {
    setPrefs (state, preferences) {
      state.preferences = preferences
    }
  },
  actions: {
    loadPreferences ({ commit }) {
      commit('setPrefs', loadPrefs())
    },
    savePreferences ({ commit }, { key, value }) {
      commit('setPrefs', savePrefsKey(key, value))
    }
  }
})
