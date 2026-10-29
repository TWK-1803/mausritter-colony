import { request } from '@/services/api'

export default {
  namespaced: true,
  state: {
    list: []
  },
  getters: {
    list: state => state.list
  },
  actions: {
    clear (_context, tableId) {
      return request(`/dices?vtable=${tableId}`, { method: 'DELETE' })
    },
    async list ({ commit }, tableId) {
      commit('setList', await request(`/dices?vtable=${tableId}`))
    }
  },
  mutations: {
    setList (state, data) {
      state.list = (Array.isArray(data) ? data : []).flatMap(line => {
        try {
          return [{ ...line, _date: new Date(line.timestamp), _json: JSON.parse(line.json) }]
        } catch (error) {
          console.error('[history] json parse error:', error)
          return []
        }
      })
    }
  }
}
