const API_BASE_URL = "http://localhost:8080";

let cart = [];

const restaurantList = document.getElementById("restaurant-list");

const urlParams = new URLSearchParams(window.location.search);
const searchTerm = urlParams.get("search") || "";

async function fetchRestaurants() {
    try {
        const response = await fetch(`${API_BASE_URL}/restaurants`);
        const restaurants = await response.json();
        displayRestaurants(restaurants);
    } catch (error) {
        console.error("Erreur lors de la récupération des restaurants :", error);
        restaurantList.innerHTML = `<p class="text-danger">⚠️ Impossible de charger les restaurants.</p>`;
    }
}

function displayRestaurants(restaurants) {
    let filteredRestaurants = restaurants;

    if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        filteredRestaurants = restaurants.filter(restaurant =>
            restaurant.name.toLowerCase().includes(lowerSearchTerm) ||
            restaurant.cuisine.toLowerCase().includes(lowerSearchTerm) ||
            restaurant.dishes.some(dish => dish.toLowerCase().includes(lowerSearchTerm))
        );
        document.getElementById("search-term").textContent = `Résultats pour : "${searchTerm}"`;
    } else {
        document.getElementById("search-term").textContent = "Tous les restaurants";
    }

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
                            <button class="btn btn-danger" onclick="viewRestaurant(${restaurant.id})">Voir le menu</button>
                        </div>
                    </div>
                </div>
            `;
            restaurantList.innerHTML += card;
        });
    } else {
        restaurantList.innerHTML = '<p class="text-muted">❌ Aucun restaurant trouvé.</p>';
    }
}

async function viewRestaurant(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/restaurants/${id}`);
        const restaurant = await response.json();

        document.getElementById("modal-restaurant-name").textContent = restaurant.name;
        document.getElementById("modal-restaurant-cuisine").textContent = restaurant.cuisine;

        const menuList = document.getElementById("modal-menu-list");
        menuList.innerHTML = "";
        restaurant.dishes.forEach(dish => {
            const listItem = document.createElement("li");
            listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
            listItem.innerHTML = `
                ${dish.name} - ${dish.price}€
                <button class="btn btn-sm btn-success" onclick="addToCart('${dish.name}', '${restaurant.name}', ${dish.price})">Ajouter</button>
            `;
            menuList.appendChild(listItem);
        });

        const menuModal = new bootstrap.Modal(document.getElementById("menuModal"));
        menuModal.show();
    } catch (error) {
        console.error("Erreur lors de la récupération du menu :", error);
    }
}

function addToCart(dish, restaurantName, price) {
    cart.push({ dish, restaurantName, price });
    alert(`"${dish}" ajouté au panier !`);
}

function viewCart() {
    const cartList = document.getElementById("cart-items");
    cartList.innerHTML = "";

    if (cart.length === 0) {
        cartList.innerHTML = '<p class="text-muted">Votre panier est vide.</p>';
    } else {
        cart.forEach((item, index) => {
            const listItem = document.createElement("li");
            listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
            listItem.innerHTML = `
                ${item.dish} (${item.restaurantName}) - ${item.price}€
                <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">Supprimer</button>
            `;
            cartList.appendChild(listItem);
        });
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById("cart-total").textContent = `${total.toFixed(2)}€`;

    const cartModal = new bootstrap.Modal(document.getElementById("cartModal"));
    cartModal.show();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    viewCart();
}

function clearCart() {
    cart = [];
    viewCart();
}

document.addEventListener("DOMContentLoaded", fetchRestaurants);
