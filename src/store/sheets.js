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
    async list ({ commit }, tableId) {
      commit('setList', await request(`/sheets?vtable=${tableId}`))
    },
    remove (_context, { tableId, name }) {
      return request(`/sheets?vtable=${tableId}&name=${encodeURIComponent(name)}`, { method: 'DELETE' })
    }
  },
  mutations: {
    setList (state, data) {
      state.list = (Array.isArray(data) ? data : []).map(sheet => ({ ...sheet, updated: new Date(sheet.updated) }))
    }
  }
}
