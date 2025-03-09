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
    if (!authToken || !userId) {
        console.warn("Utilisateur non authentifié !");
        window.location.href = '../auth/login.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/carts/user/${userId}`, {
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const data = await response.json();
            cart = data.items || [];
            localStorage.setItem('cart', JSON.stringify(cart)); // Enregistrer le panier dans le stockage local
            console.log("🟢 Panier chargé :", cart);
            document.dispatchEvent(new CustomEvent('cart-updated')); // Déclencher l'événement personnalisé
        } else {
            console.warn("⚠️ Impossible de charger le panier. Statut HTTP:", response.status);
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
                            <p class="text-muted">Livraison: ${restaurant.deliveryTime || 'Non spécifié'}</p>
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
            alert(`Erreur technique: ${error.message}`);
        }
    }

    fetchNext();
}

/** ============================
 * 📋 Voir le menu d'un restaurant
 * ============================ */
window.viewRestaurant = async function(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/food-items/search?restaurantId=${id}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) throw new Error("Erreur lors de la récupération du menu");
        const foodItems = await response.json();

        document.getElementById("modal-restaurant-name").textContent = `Menu du Restaurant ${id}`;
        const menuList = document.getElementById("modal-menu-list");
        menuList.innerHTML = foodItems.map(dish => `
            <li class="list-group-item">
                ${dish.name} - ${dish.price}€
                <button class="btn btn-sm btn-success" onclick="addToCart(${dish.id}, '${dish.name.replace(/'/g, "\\'")}', ${dish.price}, ${id})">
                    Ajouter
                </button>
            </li>
        `).join('');

        currentRestaurantId = id;
        const menuModal = new bootstrap.Modal(document.getElementById("menuModal"));
        menuModal.show();
    } catch (error) {
        console.error("Erreur lors de la récupération des plats:", error);
        alert("Impossible de charger les plats.");
    }
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
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            alert(`"${dishName}" ajouté au panier !`);
            currentRestaurantId = restaurantId;
            localStorage.setItem('currentRestaurantId', currentRestaurantId); // Enregistrer l'ID du restaurant dans le stockage local
            await fetchCart(); // 🔄 Mettre à jour le panier après ajout
        } else {
            alert("❌ Impossible d'ajouter au panier.");
        }
    } catch (error) {
        console.error("❌ Erreur lors de l'ajout au panier :", error);
    }
};

/** ============================
 * 🛒 Vider le panier via API
 * ============================ */
window.clearCart = async function() {
    cart = [];
    currentRestaurantId = null;
    localStorage.removeItem('cart'); // Supprimer le panier du stockage local
    localStorage.removeItem('currentRestaurantId'); // Supprimer l'ID du restaurant du stockage local
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

    // Afficher le modal du panier
    const cartModal = new bootstrap.Modal(document.getElementById("cartModal"));
    cartModal.show();
};

/** ============================
 * ⏳ Charger le panier et les restaurants au démarrage
 * ============================ */
document.addEventListener("DOMContentLoaded", async () => {
    await fetchCart(); // 🔄 Charger le panier depuis l'API
    fetchRestaurants(); // 🔄 Charger les restaurants
});