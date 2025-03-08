const API_BASE_URL = "http://localhost:8080";
const authToken = localStorage.getItem("authToken");
const userId = localStorage.getItem("userId");

let restaurantId = null;


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


async function loadCustomers() {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
        const response = await fetch(`${API_BASE_URL}/users`, { headers });

        if (!response.ok) throw new Error("Erreur lors de la récupération des clients.");

        const customers = await response.json();
        const recipientSelect = document.getElementById("message-recipient");
        recipientSelect.innerHTML = "";

        customers.forEach(customer => {
            const option = document.createElement("option");
            option.value = customer.id;
            option.textContent = customer.name;
            recipientSelect.appendChild(option);
        });
    } catch (error) {
        console.error(error);
        alert("Impossible de charger les clients.");
    }
}


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
        loadDishes();
    } catch (error) {
        console.error(error);
        alert("Impossible de charger le restaurant.");
    }
}


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
                    <img src="${dish.imageUrl || 'default.jpg'}" class="card-img-top" alt="${dish.name}">
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


document.getElementById("add-dish-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!restaurantId) {
        alert("Erreur : ID du restaurant introuvable.");
        return;
    }

    const name = document.getElementById("dish-name").value;
    const description = document.getElementById("dish-description").value;
    const price = document.getElementById("dish-price").value;
    const imageFile = document.getElementById("dish-image").files[0];

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("restaurantId", restaurantId);
    if (imageFile) {
        formData.append("image", imageFile);
    }

    try {
        const response = await fetch(`${API_BASE_URL}/food-items`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${authToken}` },
            body: formData
        });

        if (!response.ok) throw new Error("Erreur lors de l'ajout du plat.");

        alert("Plat ajouté avec succès !");
        loadDishes();
    } catch (error) {
        console.error(error);
        alert("Impossible d'ajouter le plat.");
    }
});


document.addEventListener("DOMContentLoaded", () => {
    loadRestaurant();
    loadOrders();
    loadCustomers();
});
