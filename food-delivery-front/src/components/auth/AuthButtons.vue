<template>
    <div>
      <v-btn
        v-if="!isAuthenticated"
        text
        @click="goToLogin"
      >
        Connexion
      </v-btn>

      <v-btn
        v-if="!isAuthenticated"
        text
        @click="goToRegister"
      >
        Inscription
      </v-btn>

      <v-menu v-else offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            <v-icon left>mdi-account</v-icon>
            {{ user.name }}
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="logout">
            <v-list-item-title>Déconnexion</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </template>

  <script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    computed: {
      ...mapGetters('auth', ['isAuthenticated', 'user'])
    },
    methods: {
      ...mapActions('auth', ['logout']),
      goToLogin() {
        this.$router.push('/auth/login')
      },
      goToRegister() {
        this.$router.push('/auth/register')
      }
    }
  }
  </script>