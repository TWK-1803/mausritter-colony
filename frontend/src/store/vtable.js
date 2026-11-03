import { request } from '@/services/api'

const save = (tableId, data) => request(`/vtables?vtable=${tableId}`, {
  method: 'POST',
  body: { data: JSON.stringify(data) }
})

export default {
  namespaced: true,
  state: {
    current: null,
    tableId: null
  },
  getters: {
    current: state => state.current
  },
  actions: {
    async create ({ commit }, { tableId, data }) {
      await save(tableId, data)
      commit('setCurrent', { tableId, data })
    },
    async get ({ commit }, tableId) {
      const body = await request(`/vtables?vtable=${tableId}`)
      commit('setCurrent', { tableId, data: body?.data })
    },
    // `data` is a partial update ({ turns } or { enemies }) merged into the stored document,
    // so each writer keeps the other's data. Nothing is saved until the table has been loaded.
    async update ({ commit, state }, { data }) {
      if (!state.tableId) return
      const merged = { ...state.current, ...data }
      // Commit first so a second update dispatched while this one is saving merges onto it
      commit('setCurrent', { tableId: state.tableId, data: merged })
      await save(state.tableId, merged)
    }
  },
  mutations: {
    setCurrent (state, { tableId, data }) {
      state.tableId = tableId
      try {
        state.current = typeof data === 'string' ? JSON.parse(data) : data
      } catch {
        state.current = null
      }
    }
  }
}
