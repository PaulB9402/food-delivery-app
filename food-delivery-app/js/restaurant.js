// src/js/restaurant.js

const restaurants = [
    { id: 1, name: "La Belle Pizza", cuisine: "Italienne", image: "../img/pizza.jpg", rating: 4.5, deliveryTime: "30-40 min", minOrder: "15€", priceRange: "€€", dishes: ["Pizza", "Pâtes", "Lasagnes"] },
    { id: 2, name: "Sushi Palace", cuisine: "Japonaise", image: "../img/sushi.jpg", rating: 4.7, deliveryTime: "25-35 min", minOrder: "20€", priceRange: "€€€", dishes: ["Sushi", "Ramen", "Tempura"] },
    { id: 3, name: "Burger House", cuisine: "Américaine", image: "../img/burger.jpg", rating: 4.3, deliveryTime: "20-30 min", minOrder: "10€", priceRange: "€", dishes: ["Burger", "Frites", "Hot Dog"] }
];

// Récupération du terme de recherche depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const searchTerm = urlParams.get('search');

// Sélection de l'élément HTML où afficher les résultats
const restaurantList = document.getElementById('restaurant-list');

// Vérification si un terme de recherche est présent
let filteredRestaurants = restaurants;
if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();

    filteredRestaurants = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(lowerSearchTerm) ||
        restaurant.cuisine.toLowerCase().includes(lowerSearchTerm) ||
        restaurant.dishes.some(dish => dish.toLowerCase().includes(lowerSearchTerm))
    );

    document.getElementById('search-term').textContent = `Résultats pour : "${searchTerm}"`;
} else {
    document.getElementById('search-term').textContent = "Tous les restaurants";
}

// Affichage des restaurants filtrés
if (filteredRestaurants.length > 0) {
    restaurantList.innerHTML = "";
    filteredRestaurants.forEach(restaurant => {
        const card = `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${restaurant.image}" class="card-img-top" alt="${restaurant.name}">
                    <div class="card-body">
                        <h5 class="card-title">${restaurant.name}</h5>
                        <p class="card-text">Cuisine : ${restaurant.cuisine}</p>
                        <p class="card-text">Plats : ${restaurant.dishes.join(", ")}</p>
                        <a href="restaurant-details.html?name=${restaurant.name}" class="btn btn-danger">Voir le menu</a>
                    </div>
                </div>
            </div>
        `;
        restaurantList.innerHTML += card;
    });
} else {
    restaurantList.innerHTML = '<p class="text-muted">❌ Aucun restaurant trouvé.</p>';
}
