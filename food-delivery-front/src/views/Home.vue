<template>
  <v-container>
    <h1 class="mb-8">Restaurants populaires</h1>

    <v-row>
      <v-col
        v-for="restaurant in restaurants"
        :key="restaurant.id"
        cols="12" sm="6" md="4"
      >
        <RestaurantCard :restaurant="restaurant" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import RestaurantCard from '@/components/restaurants/RestaurantCard.vue'
import RestaurantService from '@/services/RestaurantServices'

export default {
  components: { RestaurantCard },
  data: () => ({
    restaurants: []
  }),
  async created() {
    this.restaurants = await RestaurantService.getFeatured()
  }
}
</script>