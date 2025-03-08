import { requireAuth } from './auth.js';
document.addEventListener('DOMContentLoaded', requireAuth);

const API_BASE_URL = "http://localhost:8080";

let cart = [];
let currentRestaurantId = null;

const restaurantList = document.getElementById("restaurant-list");

const urlParams = new URLSearchParams(window.location.search);
const searchTerm = urlParams.get("search") || "";
const restaurantId = urlParams.get("id");

async function fetchRestaurants() {
    const authToken = localStorage.getItem('authToken');

  try {
    const response = await fetch(`${API_BASE_URL}/restaurants`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.message || "Erreur lors de la récupération des restaurants";
      throw new Error(errorMessage);
    }
    const restaurants = await response.json();
    if (restaurantId) {
      displayRestaurant(restaurants);
    }
    else{
        displayRestaurants(restaurants);

    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des restaurants :",
      error
    );
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
                            <button class="btn btn-danger" data-restaurant-id="${restaurant.id}">Voir le menu</button>
                        </div>
                    </div>
                </div>
            `;
            restaurantList.innerHTML += card;
        });

        document.querySelectorAll('.btn-danger[data-restaurant-id]').forEach(button => {
            button.addEventListener('click', () => {
                const restaurantId = button.getAttribute('data-restaurant-id');
                viewRestaurant(restaurantId);
            });
        });
    } else {
        restaurantList.innerHTML = '<p class="text-muted">❌ Aucun restaurant trouvé.</p>';
    }
}
async function viewRestaurant(id) {
    const authToken = localStorage.getItem('authToken'); // Récupérer le token JWT

    try {
        // Faire la requête API avec le token d'authentification
        const response = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
            headers: {
                'Authorization': `Bearer ${authToken}` // Ajouter le token dans les en-têtes
            }
        });

        // Vérifier si la réponse est OK
        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message || "Erreur lors de la récupération du menu";
            throw new Error(errorMessage);
        }

        // Récupérer les données du restaurant
        const restaurant = await response.json();

        // Afficher le nom et le type de cuisine du restaurant dans la modale
        document.getElementById("modal-restaurant-name").textContent = restaurant.name;
        document.getElementById("modal-restaurant-cuisine").textContent = restaurant.cuisine;

        // Afficher les plats du restaurant dans la modale
        const menuList = document.getElementById("modal-menu-list");
        menuList.innerHTML = ""; // Vider la liste actuelle

        restaurant.foodItems.forEach(dish => {
            const listItem = document.createElement("li");
            listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
            listItem.innerHTML = `
                ${dish.name} - ${dish.price}€
                <button class="btn btn-sm btn-success" onclick="addToCart(${dish.id}, '${dish.name}', ${dish.price}, ${restaurant.id})">Ajouter</button>
            `;
            menuList.appendChild(listItem);
        });

        // Mettre à jour l'ID du restaurant actuel
        currentRestaurantId = restaurant.id;

        // Ouvrir la modale
        const menuModal = new bootstrap.Modal(document.getElementById("menuModal"));
        menuModal.show();
    } catch (error) {
        console.error("Erreur lors de la récupération du menu :", error);
        alert("Erreur lors de la récupération du menu. " + error.message);
    }
}

function addToCart(dishId, dishName, price, restaurantId) {
     // Check if the cart is empty or if the new item is from the same restaurant
    if (cart.length > 0 && currentRestaurantId !== restaurantId) {
        alert("Vous ne pouvez ajouter que des plats d'un seul restaurant à la fois. Veuillez vider votre panier ou finaliser votre commande actuelle.");
        return;
    }
    // Find the item in the cart
    const existingItem = cart.find(item => item.dishId === dishId);

    if (existingItem) {
        // If the item exists, increase the quantity
        existingItem.quantity++;
    } else {
        // If the item doesn't exist, add it to the cart
        cart.push({ dishId, dishName, price, quantity: 1, restaurantId });
    }

    currentRestaurantId = restaurantId; // Ensure currentRestaurantId is updated
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
        currentRestaurantId = null; // Reset restaurant ID if cart is empty
    }
    viewCart();
}

function clearCart() {
    cart = [];
    currentRestaurantId = null; // Reset restaurant ID
    viewCart();
}

async function placeOrder() {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');

    if (!authToken || !userId) {
        alert("Vous devez être connecté pour passer une commande.");
        window.location.href = 'login.html'; // Redirect to login
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

        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                customerId: parseInt(userId), // Ensure userId is a number
                restaurantId: currentRestaurantId, // Use the stored restaurant ID
                items: orderItems
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                logout(); //clear everything
                return;
            }
            const errorData = await response.json(); //get message
            const errorMessage = errorData.message ||  "Erreur lors de la création de la commande.";
            throw new Error(errorMessage);
        }

        const newOrder = await response.json();
        alert(`Commande passée avec succès! Numéro de commande: ${newOrder.id}`);
        clearCart();  // Clear the cart after successful order.
        //  Redirect to the orders page to show the new order.
        window.location.href = 'orders.html';


    } catch (error) {
        console.error('Error placing order:', error);
        alert('Failed to place order. ' + error.message);
    }
}
document.addEventListener("DOMContentLoaded", fetchRestaurants);