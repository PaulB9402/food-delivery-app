const API_BASE_URL = "http://localhost:8080";
const authToken = localStorage.getItem('authToken');
const userId = localStorage.getItem('userId');
const userRole = localStorage.getItem('userRole');

const restaurantList = document.getElementById("restaurant-list");
const urlParams = new URLSearchParams(window.location.search);
const restaurantId = urlParams.get("id");

let cart = [];
let currentRestaurantId = null;

/** ============================
 * 🛒 Récupérer le panier depuis l'API
 * ============================ */
async function fetchCart() {
    if (!authToken || !userId) return;

    try {
        const response = await fetch(`${API_BASE_URL}/carts/user/${userId}`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });

        if (response.ok) {
            const data = await response.json();
            cart = data.items || [];
            console.log("🟢 Panier chargé :", cart);
        } else {
            console.warn("⚠️ Impossible de charger le panier.");
        }
    } catch (error) {
        console.error("❌ Erreur lors du chargement du panier :", error);
    }
}

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

            const card = `
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <img src="${restaurant.image || 'default.jpg'}" class="card-img-top" alt="${restaurant.name}">
                        <div class="card-body">
                            <h5 class="card-title">${restaurant.name}</h5>
                            <p class="card-text">${restaurant.cuisine || 'Type inconnu'}</p>
                            <button class="btn btn-danger" onclick="viewRestaurant(${restaurant.id})">Voir le menu</button>
                        </div>
                    </div>
                </div>
            `;
            restaurantList.innerHTML += card;

            id++;
            fetchNext();
        } catch (error) {
            console.error("Erreur lors du chargement des restaurants:", error);
        }
    }

    fetchNext();
}

/** ============================
 * 🛒 Ajouter au panier via API
 * ============================ */
window.addToCart = async function(dishId, dishName, price, restaurantId) {
    if (!authToken || !userId) return;

    try {
        const response = await fetch(`${API_BASE_URL}/carts/user/${userId}/add-item/${dishId}?quantity=1`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            alert(`"${dishName}" ajouté au panier !`);
            await fetchCart(); // 🔄 Mettre à jour le panier après ajout
        } else {
            alert("❌ Impossible d'ajouter au panier.");
        }
    } catch (error) {
        console.error("❌ Erreur lors de l'ajout au panier :", error);
    }
};

/** ============================
 * 🛒 Passer la commande via API
 * ============================ */
window.placeOrder = async function() {
    if (!authToken || !userId || !userRole) {
        alert("🔑 Session invalide. Veuillez vous reconnecter.");
        window.location.href = '../auth/login.html';
        return;
    }

    if (userRole !== "CUSTOMER") {
        alert("🚫 Seuls les clients peuvent passer une commande !");
        return;
    }

    if (cart.length === 0) {
        alert("🛒 Votre panier est vide !");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/orders/place?userId=${userId}`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const newOrder = await response.json();
            alert(`✅ Commande réussie ! Numéro de commande : ${newOrder.id}`);
            clearCart();
            window.location.href = 'orders.html';
        } else {
            throw new Error("Erreur lors du passage de la commande.");
        }
    } catch (error) {
        console.error("❌ Erreur lors de la commande :", error);
        alert(`Échec de la commande : ${error.message}`);
    }
};

/** ============================
 * 🛒 Vider le panier via API
 * ============================ */
window.clearCart = async function() {
    cart = [];
    currentRestaurantId = null;
    viewCart();
};

/** ============================
 * 🔄 Afficher le panier
 * ============================ */
window.viewCart = function() {
    const cartList = document.getElementById("cart-items");
    cartList.innerHTML = cart.length === 0
        ? "<p class='text-muted'>Panier vide</p>"
        : cart.map(item => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${item.foodItem.name} (x${item.quantity}) - ${item.foodItem.price}€
            </li>
        `).join('');

    const total = cart.reduce((sum, item) => sum + item.foodItem.price * item.quantity, 0);
    document.getElementById("cart-total").textContent = `${total.toFixed(2)}€`;
};

/** ============================
 * ⏳ Charger le panier et les restaurants au démarrage
 * ============================ */
document.addEventListener("DOMContentLoaded", async () => {
    await fetchCart(); // 🔄 Charger le panier depuis l'API
    fetchRestaurants(); // 🔄 Charger les restaurants
});
