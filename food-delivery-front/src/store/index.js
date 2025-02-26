import { createStore } from 'vuex';

const store = createStore({
  state: {
    // votre état initial
  },
  mutations: {
    // vos mutations
  },
  actions: {
    // vos actions
  },
  getters: {
    cartItemCount: (state) => {
      // votre getter
      return state.cart.length;
    },
  },
});

export default store;
