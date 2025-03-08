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
        console.error(error);
        alert("Impossible de charger le restaurant.");
    }
}

/** ==========================
 *  CHARGER LES COMMANDES
 *  ========================== */
async function loadOrders() {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
        const response = await fetch(`${API_BASE_URL}/orders`, { headers });

        if (!response.ok) throw new Error("Erreur lors de la récupération des commandes.");

        const orders = await response.json();
        const ordersList = document.getElementById("orders-list");
        ordersList.innerHTML = "";

        orders.forEach(order => {
            const card = `
                <div class="col-md-6 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Commande #${order.id}</h5>
                            <p class="card-text">Client: ${order.customer.name}</p>
                            <p class="card-text">Total: ${order.total}€</p>
                            <p class="card-text">Statut: ${order.status}</p>
                            <button class="btn btn-danger" onclick="viewOrderDetails(${order.id})">Voir les détails</button>
                        </div>
                    </div>
                </div>
            `;
            ordersList.innerHTML += card;
        });
    } catch (error) {
        console.error(error);
        alert("Impossible de charger les commandes.");
    }
}

/** ==========================
 *  CHARGER LES PLATS DU RESTAURANT
 *  ========================== */
async function loadDishes() {
    if (!restaurantId) return;
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
        const response = await fetch(`${API_BASE_URL}/food-items/search?restaurantId=${restaurantId}`, { headers });

        if (!response.ok) throw new Error("Erreur lors de la récupération des plats.");

        const dishes = await response.json();
        displayDishes(dishes);
    } catch (error) {
        console.error(error);
        alert("Impossible de charger le menu.");
    }
}

/** ==========================
 *  AFFICHER LES PLATS
 *  ========================== */
function displayDishes(dishes) {
    const dishList = document.getElementById("dish-list");
    dishList.innerHTML = "";

    if (dishes.length === 0) {
        dishList.innerHTML = "<p class='text-muted'>Aucun plat disponible.</p>";
        return;
    }

    dishes.forEach(dish => {
        const dishCard = `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <img src="${dish.photos ? dish.photos.split(',')[0] : 'default.jpg'}" class="card-img-top" alt="${dish.name}">
                    <div class="card-body">
                        <h5 class="card-title">${dish.name}</h5>
                        <p class="card-text">${dish.description}</p>
                        <p class="fw-bold">${dish.price}€</p>
                    </div>
                </div>
            </div>
        `;
        dishList.innerHTML += dishCard;
    });
}

/** ==========================
 *  AJOUTER UN PLAT
 *  ========================== */
document.getElementById("add-dish-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!restaurantId) {
        alert("Erreur : ID du restaurant introuvable.");
        return;
    }

    const name = document.getElementById("dish-name").value;
    const description = document.getElementById("dish-description").value;
    const price = parseFloat(document.getElementById("dish-price").value);
    const imageFile = document.getElementById("dish-image").files[0];

    if (!imageFile) {
        alert("Veuillez ajouter une image.");
        return;
    }

    // Convertir l'image en Base64
    const imageBase64 = await convertToBase64(imageFile);

    const foodItem = {
        name,
        description,
        price,
        photos: imageBase64,
        restaurantId
    };

    try {
        const response = await fetch(`${API_BASE_URL}/food-items`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(foodItem)
        });

        if (!response.ok) throw new Error("Erreur lors de l'ajout du plat.");

        alert("Plat ajouté avec succès !");
        loadDishes();
    } catch (error) {
        console.error(error);
        alert("Impossible d'ajouter le plat.");
    }
});

/** ==========================
 *  CONVERTIR UNE IMAGE EN BASE64
 *  ========================== */
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });
}

/** ==========================
 *  INITIALISATION
 *  ========================== */
document.addEventListener("DOMContentLoaded", () => {
    loadRestaurant();
    loadOrders();
});
