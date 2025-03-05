const BASE_URL = "http://localhost:8080";


async function loadRestaurants() {
    const container = document.getElementById('restaurant-list');
    container.innerHTML = '';

    try {
        const response = await fetch(`${BASE_URL}/api/restaurants`);
        if (!response.ok) {
            throw new Error('Failed to fetch restaurants');
        }
        const restaurants = await response.json();

        restaurants.forEach(restaurant => {
            const card = `
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <img src="${restaurant.image}" class="card-img-top" alt="${restaurant.name}">
                        <div class="card-body">
                            <h5 class="card-title">${restaurant.name}</h5>
                            <div class="badge bg-warning text-dark">⭐ ${restaurant.rating}</div>
                            <p class="mt-2">Livraison: ${restaurant.deliveryTime}</p>
                            <button class="btn btn-danger" onclick="viewRestaurant(${restaurant.id})">Voir le menu</button>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des restaurants:', error);
        container.innerHTML = `<p class="text-danger">⚠️ Impossible de charger les restaurants. ${error.message}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', loadRestaurants);