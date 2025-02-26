<template>
  <v-card hover @click="goToRestaurant">
    <v-img :src="restaurant.photos[0]" height="200"></v-img>

    <v-card-title>{{ restaurant.name }}</v-card-title>

    <v-card-subtitle>
      <v-chip small color="orange" class="mr-2">
        ⭐ {{ restaurant.rating }}
      </v-chip>
      🚴 {{ restaurant.deliveryTime }} min
    </v-card-subtitle>
  </v-card>
</template>

<script>
export default {
  props: {
    restaurant: {
      type: Object,
      required: true
    }
  },
  methods: {
    goToRestaurant() {
      this.$router.push(`/restaurant/${this.restaurant.id}`)
    }
  }
}
</script>