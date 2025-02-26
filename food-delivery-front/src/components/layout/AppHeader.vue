<template>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>
        <router-link to="/" class="white--text">FoodDelivery</router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn text @click="$router.push('/restaurants')">
        <v-icon left>mdi-magnify</v-icon>
         Explorer les restaurants
      </v-btn>

      <v-btn icon @click="toggleCart">
        <v-badge :content="cartItemCount" color="secondary">
          <v-icon>mdi-cart</v-icon>
        </v-badge>
      </v-btn>

      <AuthButtons />
    </v-app-bar>
  </template>

  <script>
  import { mapGetters } from 'vuex'
  import AuthButtons from '@/components/auth/AuthButtons.vue'

  export default {
    components: { AuthButtons },
    data: () => ({
      searchQuery: ''
    }),
    computed: {
      ...mapGetters('cart', ['cartItemCount'])
    },
    methods: {
      search() {
        this.$router.push({ path: '/search', query: { q: this.searchQuery } })
      },
      toggleCart() {
        this.$store.commit('cart/TOGGLE_SIDEBAR')
      }
    }
  }
  </script>