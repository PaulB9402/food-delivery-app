import { requireAuth } from './auth.js';
document.addEventListener('DOMContentLoaded', requireAuth);

const API_BASE_URL = "http://localhost:8080";
const authToken = localStorage.getItem("authToken");
const userId = localStorage.getItem("userId");

let restaurantId = null;

/** ==========================
 *  AJOUTER LE JWT AUX REQUÊTES
 *  ========================== */
function getAuthHeaders() {
    if (!authToken) {
        alert("Votre session a expiré. Veuillez vous reconnecter.");
        window.location.href = "../auth/login.html";
        return null;
    }
    return {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json"
    };
}

/** ==========================
 *  CHARGER LE RESTAURANT
 *  ========================== */
async function loadRestaurant() {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
        const response = await fetch(`${API_BASE_URL}/restaurants/user/${userId}`, { headers });

        if (!response.ok) throw new Error("Erreur lors de la récupération du restaurant.");

        const restaurants = await response.json();

        if (restaurants.length === 0) {
            alert("Aucun restaurant associé à ce compte.");
            return;
        }

        restaurantId = restaurants[0].id;
        loadDishes(); // Charger les plats du restaurant
    } catch (error) {
        console.error("Erreur lors de la récupération du restaurant:", error);
        alert("Impossible de charger le restaurant.");
    }
}

/** ==========================
 *  CHARGER LES PLATS
 *  ========================== */
async function loadDishes() {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
        const response = await fetch(`${API_BASE_URL}/food-items/search?restaurantId=${restaurantId}`, { headers });

        if (!response.ok) throw new Error("Erreur lors de la récupération des plats.");

        const dishes = await response.json();
        displayDishes(dishes); // Afficher les plats
    } catch (error) {
        console.error("Erreur lors de la récupération des plats:", error);
        alert("Impossible de charger les plats.");
    }
}

/** ==========================
 *  AFFICHER LES PLATS
 *  ========================== */
function displayDishes(dishes) {
    const dishList = document.getElementById("dish-list");
    dishList.innerHTML = "";

    dishes.forEach(dish => {
        const dishCard = `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${dish.name}</h5>
                        <p class="card-text">${dish.description}</p>
                        <p class="card-text">Prix: ${dish.price}€</p>
                    </div>
                </div>
            </div>
        `;
        dishList.innerHTML += dishCard;
    });
}

/** ==========================
 *  CHARGER LES COMMANDES
 *  ========================== */
async function loadOrders() {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
        const response = await fetch(`${API_BASE_URL}/orders/restaurant/${restaurantId}`, { headers });

        if (!response.ok) throw new Error("Erreur lors de la récupération des commandes.");

        const orders = await response.json();
        const ordersList = document.getElementById("orders-list");
        ordersList.innerHTML = "";

        if (orders.length === 0) {
            ordersList.innerHTML = "<p class='text-muted'>Aucune commande disponible.</p>";
            return;
        }

        orders.forEach(order => {
            const customerName = order.customer?.name || "Client inconnu";
            const total = order.total || order.orderItems.reduce((acc, item) => acc + item.foodItem.price * item.quantity, 0);
            const status = order.status || "Statut inconnu";

            const card = `
                <div class="col-md-6 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Commande #${order.id}</h5>
                            <p class="card-text">Client: ${customerName}</p>
                            <p class="card-text">Total: ${total.toFixed(2)}€</p>
                            <p class="card-text">Statut: ${status}</p>
                            <button class="btn btn-danger" onclick="viewOrderDetails(${order.id})">Voir les détails</button>
                        </div>
                    </div>
                </div>
            `;
            ordersList.innerHTML += card;
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des commandes:", error);
        alert("Impossible de charger les commandes.");
    }
}


/** ==========================
 *  INITIALISATION
 *  ========================== */
document.addEventListener("DOMContentLoaded", () => {
    loadRestaurant();
    loadOrders();
});