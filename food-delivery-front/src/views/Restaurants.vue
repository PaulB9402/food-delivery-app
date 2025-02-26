<template>
    <v-container>
      <h1 class="mb-8">Tous les restaurants</h1>

      <v-text-field
        v-model="searchQuery"
        label="Rechercher un restaurant..."
        outlined
        clearable
        @input="searchRestaurants"
        class="mb-6"
      ></v-text-field>

      <v-row>
        <v-col
          v-for="restaurant in filteredRestaurants"
          :key="restaurant.id"
          cols="12" sm="6" md="4"
        >
          <RestaurantCard :restaurant="restaurant" />
        </v-col>
      </v-row>

      <v-alert
        v-if="filteredRestaurants.length === 0"
        type="info"
        class="mt-6"
      >
        Aucun restaurant trouvé.
      </v-alert>
    </v-container>
  </template>

  <script>
  import RestaurantCard from '@/components/restaurants/RestaurantCard.vue'
  import RestaurantService from '@/services/RestaurantService'

  export default {
    components: { RestaurantCard },
    data: () => ({
      searchQuery: '',
      restaurants: []
    }),
    computed: {
      filteredRestaurants() {
        return this.restaurants.filter(restaurant =>
          restaurant.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }
    },
    async created() {
      this.restaurants = await RestaurantService.getAll()
    }
  }
  </script>

  <style scoped>
  .v-text-field {
    max-width: 500px;
    margin: 0 auto;
  }
  </style>