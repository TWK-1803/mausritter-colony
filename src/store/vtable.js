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
    async update ({ commit, state }, { data }) {
      await save(state.tableId, data)
      commit('setCurrent', { tableId: state.tableId, data })
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
