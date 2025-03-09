import { requireAuth } from './auth.js';
document.addEventListener('DOMContentLoaded', requireAuth);

const API_BASE_URL = "http://localhost:8080";
const authToken = localStorage.getItem('authToken');
const restaurantList = document.getElementById("restaurant-list");
const urlParams = new URLSearchParams(window.location.search);
const restaurantId = urlParams.get("id");

let cart = [];
let currentRestaurantId = null;

/** ============================
 * 🏪 Charger TOUS les restaurants ID par ID
 * ============================ */
async function fetchRestaurants() {
    if (!authToken) {
        console.warn("Utilisateur non authentifié !");
        window.location.href = '../auth/login.html';
        return;
    }

    let id = 1;
    let foundRestaurants = false;

    async function fetchNext() {
        try {
            const response = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
                headers: { "Authorization": `Bearer ${authToken}` }
            });

            if (response.status === 404) {
                console.log(`Fin du chargement des restaurants.`);
                if (!foundRestaurants) {
                    restaurantList.innerHTML = `<p class="text-muted">❌ Aucun restaurant trouvé.</p>`;
                }
                return;
            }

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const restaurant = await response.json();
            foundRestaurants = true;

            displayRestaurantCard(restaurant);
            id++;
            fetchNext(); // Charger le suivant
        } catch (error) {
            console.error("Erreur chargement restaurants:", error);
        }
    }

    fetchNext();
}

/** ============================
 * 📌 Afficher UN restaurant sous forme de carte
 * ============================ */
function displayRestaurantCard(restaurant) {
    const card = `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                <img src="${restaurant.image || 'default.jpg'}" class="card-img-top" alt="${restaurant.name}">
                <div class="card-body">
                    <h5 class="card-title">${restaurant.name}</h5>
                    <p class="card-text">Cuisine : ${restaurant.cuisine || 'Inconnue'}</p>
                    <button class="btn btn-danger" onclick="viewRestaurant(${restaurant.id})">
                        Voir le menu
                    </button>
                </div>
            </div>
        </div>
    `;
    restaurantList.innerHTML += card;
}

/** ============================
 * 🍽️ Afficher le MENU d'un restaurant
 * ============================ */
async function viewRestaurant(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération du menu");
        }

        const restaurant = await response.json();

        document.getElementById("modal-restaurant-name").textContent = restaurant.name;
        document.getElementById("modal-restaurant-cuisine").textContent = restaurant.cuisine || "Non précisé";

        const menuList = document.getElementById("modal-menu-list");
        menuList.innerHTML = "";

        if (!restaurant.foodItems || restaurant.foodItems.length === 0) {
            menuList.innerHTML = "<p class='text-muted'>Aucun plat disponible.</p>";
        } else {
            restaurant.foodItems.forEach(dish => {
                const listItem = document.createElement("li");
                listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
                listItem.innerHTML = `
                    ${dish.name} - ${dish.price}€
                    <button class="btn btn-sm btn-success" onclick="addToCart(${dish.id}, '${dish.name}', ${dish.price}, ${restaurant.id})">Ajouter</button>
                `;
                menuList.appendChild(listItem);
            });
        }

        currentRestaurantId = restaurant.id;
        const menuModal = new bootstrap.Modal(document.getElementById("menuModal"));
        menuModal.show();
    } catch (error) {
        console.error("Erreur menu :", error);
        alert("Impossible de charger le menu.");
    }
}

/** ============================
 * 🛒 Ajouter un plat au panier
 * ============================ */
function addToCart(dishId, dishName, price, restaurantId) {
    if (cart.length > 0 && currentRestaurantId !== restaurantId) {
        alert("Vous ne pouvez commander que dans un seul restaurant à la fois.");
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
}

/** ============================
 * 🏷️ Afficher le panier
 * ============================ */
function viewCart() {
    const cartList = document.getElementById("cart-items");
    cartList.innerHTML = "";

    if (cart.length === 0) {
        cartList.innerHTML = "<p class='text-muted'>Votre panier est vide.</p>";
        return;
    }

    cart.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        listItem.innerHTML = `
            ${item.dishName} (x${item.quantity}) - ${item.price}€
            <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">Supprimer</button>
        `;
        cartList.appendChild(listItem);
    });

    document.getElementById("cart-total").textContent = `${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}€`;

    const cartModal = new bootstrap.Modal(document.getElementById("cartModal"));
    cartModal.show();
}

/** ============================
 * ✅ Passer la commande
 * ============================ */
async function placeOrder() {
    if (!authToken || !currentRestaurantId || cart.length === 0) {
        alert("Votre panier est vide ou vous n'êtes pas connecté.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: { "Authorization": `Bearer ${authToken}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                customerId: parseInt(localStorage.getItem('userId')),
                restaurantId: currentRestaurantId,
                items: cart.map(item => ({ foodItemId: item.dishId, quantity: item.quantity }))
            })
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la commande");
        }

        alert("Commande passée avec succès !");
        cart = [];
        currentRestaurantId = null;
        viewCart();
    } catch (error) {
        console.error("Erreur commande :", error);
        alert("Impossible de passer la commande.");
    }
}

// ⏳ Charger les restaurants au démarrage
document.addEventListener("DOMContentLoaded", fetchRestaurants);