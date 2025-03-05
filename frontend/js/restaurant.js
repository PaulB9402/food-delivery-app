const API_BASE_URL = "http://localhost:8080";

let cart = [];
let currentRestaurantId = null;

const restaurantList = document.getElementById("restaurant-list");

const urlParams = new URLSearchParams(window.location.search);
const searchTerm = urlParams.get("search") || "";

async function fetchRestaurants() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/restaurants`);
          if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message || "Erreur lors de la récupération des restaurants";
            throw new Error(errorMessage);
          }
        const restaurants = await response.json();
        displayRestaurants(restaurants);
    } catch (error) {
        console.error("Erreur lors de la récupération des restaurants :", error);
        restaurantList.innerHTML = `<p class="text-danger">⚠️ Impossible de charger les restaurants. ${error.message}</p>`;
    }
}

function displayRestaurants(restaurants) {
    let filteredRestaurants = restaurants;

    if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        filteredRestaurants = restaurants.filter(restaurant =>
            restaurant.name.toLowerCase().includes(lowerSearchTerm) ||
            restaurant.cuisine.toLowerCase().includes(lowerSearchTerm) ||
            restaurant.foodItems.some(dish => dish.name.toLowerCase().includes(lowerSearchTerm))
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
                            <p class="card-text">Plats : ${restaurant.foodItems.map(item => item.name).join(", ")}</p>
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
        const response = await fetch(`${API_BASE_URL}/api/restaurants/${id}`);
        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message || "Erreur lors de la récupération du menu";
            throw new Error(errorMessage);
        }
        const restaurant = await response.json();

        document.getElementById("modal-restaurant-name").textContent = restaurant.name;
        document.getElementById("modal-restaurant-cuisine").textContent = restaurant.cuisine;

        const menuList = document.getElementById("modal-menu-list");
        menuList.innerHTML = "";
        restaurant.foodItems.forEach(dish => {
            const listItem = document.createElement("li");
            listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
            listItem.innerHTML = `
                ${dish.name} - ${dish.price}€
                <button class="btn btn-sm btn-success" onclick="addToCart(${dish.id},'${dish.name}', ${dish.price}, ${restaurant.id} )">Ajouter</button>
            `;
            menuList.appendChild(listItem);
        });

        currentRestaurantId = restaurant.id;
        const menuModal = new bootstrap.Modal(document.getElementById("menuModal"));
        menuModal.show();
    } catch (error) {
        console.error("Erreur lors de la récupération du menu :", error);
        alert("Erreur lors de la récupération du menu. " + error.message)
    }
}

function addToCart(dishId, dishName, price, restaurantId) {
    if (cart.length > 0 && currentRestaurantId !== restaurantId) {
        alert("Vous ne pouvez ajouter que des plats d'un seul restaurant à la fois. Veuillez vider votre panier ou finaliser votre commande actuelle.");
        return;
    }
    const existingItem = cart.find(item => item.dishId === dishId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ dishId, dishName, price, quantity: 1, restaurantId });
    }

    currentRestaurantId = restaurantId;
    alert(`"${dishName}" ajouté au panier !`);
    console.log(cart);
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
                ${item.dishName} (x${item.quantity}) - ${item.price}€
                <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">Supprimer</button>
            `;
            cartList.appendChild(listItem);
        });
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById("cart-total").textContent = `${total.toFixed(2)}€`;

    const cartModal = new bootstrap.Modal(document.getElementById("cartModal"));
    cartModal.show();
}

function removeFromCart(index) {
    cart.splice(index, 1);
     if (cart.length === 0) {
        currentRestaurantId = null;
    }
    viewCart();
}

function clearCart() {
    cart = [];
    currentRestaurantId = null;
    viewCart();
}

async function placeOrder() {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');

    if (!authToken || !userId) {
        alert("Vous devez être connecté pour passer une commande.");
        window.location.href = 'login.html';
        return;
    }
     if (cart.length === 0) {
        alert("Votre panier est vide.");
        return;
    }
    if (!currentRestaurantId) {
    alert("Erreur: Aucun restaurant sélectionné pour la commande.");
    return;
}

    try {
        const orderItems = cart.map(item => ({
            foodItemId: item.dishId,
            quantity: item.quantity
        }));

        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                customerId: parseInt(userId),
                restaurantId: currentRestaurantId,
                items: orderItems
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                logout();
                return;
            }
            const errorData = await response.json();
            const errorMessage = errorData.message ||  "Erreur lors de la création de la commande.";
            throw new Error(errorMessage);
        }

        const newOrder = await response.json();
        alert(`Commande passée avec succès! Numéro de commande: ${newOrder.id}`);
        clearCart();
        window.location.href = 'orders.html';


    } catch (error) {
        console.error('Error placing order:', error);
        alert('Failed to place order. ' + error.message);
    }
}

document.addEventListener("DOMContentLoaded", fetchRestaurants);