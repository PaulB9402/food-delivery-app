function loadRestaurants() {
    const container = document.getElementById('restaurant-list');

    restaurants.forEach(restaurant => {
        const card = `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="./img/${restaurant.image}" class="card-img-top">
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
}