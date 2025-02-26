export default {
    namespaced: true,
    state: {
      items: [],
      isSidebarOpen: false
    },
    mutations: {
      ADD_ITEM(state, item) {
        const existing = state.items.find(i => i.id === item.id)
        existing ? existing.quantity++ : state.items.push({ ...item, quantity: 1 })
      },
      TOGGLE_SIDEBAR(state) {
        state.isSidebarOpen = !state.isSidebarOpen
      }
    },
    getters: {
      cartTotal: state => {
        return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
      }
    }
  }