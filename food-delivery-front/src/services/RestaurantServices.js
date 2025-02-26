import axios from 'axios'

const API_URL = ''

export default {
    async getAll() {
        return [
          {
            id: 1,
            name: 'Pasta Paradise',
            rating: 4.5,
            deliveryTime: '30 min',
          },
          {
            id: 2,
            name: 'Burger Town',
            rating: 4.7,
            deliveryTime: '25 min',
          }
        ]
  },

  async getById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Erreur lors de la récupération du restaurant ${id}:`, error)
      return null
    }
  }
}
