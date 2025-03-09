const API_BASE_URL = "http://localhost:8080";
const authToken = localStorage.getItem('authToken');
const restaurantList = document.getElementById("restaurant-list");
const urlParams = new URLSearchParams(window.location.search);
const restaurantId = urlParams.get("id");

let cart = [];
let currentRestaurantId = null;


// Fonctions globales
window.viewRestaurant = async function(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/food-items/search?restaurantId=${id}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) throw new Error("Erreur lors de la récupération du menu");
        const foodItems = await response.json();

        document.getElementById("modal-restaurant-name").textContent = `Menu du Restaurant ${id}`;
        const menuList = document.getElementById("modal-menu-list");
        menuList.innerHTML = "";

        foodItems.forEach(dish => {
            const listItem = document.createElement("li");
            listItem.classList.add("list-group-item");
            listItem.innerHTML = `
                ${dish.name} - ${dish.price}€
                <button class="btn btn-sm btn-success" onclick="addToCart(${dish.id}, '${dish.name.replace(/'/g, "\\'")}', ${dish.price}, ${id})">
                    Ajouter
                </button>
            `;
            menuList.appendChild(listItem);
        });

        currentRestaurantId = id;
        new bootstrap.Modal(document.getElementById("menuModal")).show();
    } catch (error) {
        console.error("Erreur menu :", error);
        alert("Erreur lors de la récupération du menu.");
    }
};

window.addToCart = function(dishId, dishName, price, restaurantId) {
    if (cart.length > 0 && currentRestaurantId !== restaurantId) {
        alert("Commande unique par restaurant !");
        return;
    }

    const existingItem = cart.find(item => item.dishId === dishId);
    if (existingItem) existingItem.quantity++;
    else cart.push({ dishId, dishName, price, quantity: 1, restaurantId });

    currentRestaurantId = restaurantId;
    alert(`"${dishName}" ajouté !`);
};

window.viewCart = function() {
    const cartList = document.getElementById("cart-items");
    cartList.innerHTML = cart.length === 0
        ? "<p class='text-muted'>Panier vide</p>"
        : cart.map((item, index) => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${item.dishName} (x${item.quantity}) - ${item.price}€
                <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">Supprimer</button>
            </li>
        `).join('');

    document.getElementById("cart-total").textContent =
        `${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}€`;

    new bootstrap.Modal(document.getElementById("cartModal")).show();
};

window.clearCart = function() {
    cart = [];
    currentRestaurantId = null;
    viewCart();
};

window.placeOrder = async function() {
    if (!authToken || !currentRestaurantId || cart.length === 0) {
        alert("Panier vide ou non connecté !");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                customerId: parseInt(localStorage.getItem('userId')),
                restaurantId: currentRestaurantId,
                items: cart.map(item => ({
                    foodItemId: item.dishId,
                    quantity: item.quantity
                }))
            })
        });

        if (!response.ok) throw new Error("Erreur commande");
        alert("Commande réussie !");
        clearCart();
    } catch (error) {
        console.error("Erreur commande :", error);
        alert("Échec de la commande");
    }
};

// Fonctions auxiliaires
function removeFromCart(index) {
    cart.splice(index, 1);
    viewCart();
}

// Chargement initial
document.addEventListener("DOMContentLoaded", fetchRestaurants);

async function fetchRestaurants() {
}

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

// ⏳ Charger les restaurants au démarrage
document.addEventListener("DOMContentLoaded", fetchRestaurants);