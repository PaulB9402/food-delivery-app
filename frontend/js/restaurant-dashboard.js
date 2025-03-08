const API_BASE_URL = "http://localhost:8080";
const authToken = localStorage.getItem("authToken");
const userId = localStorage.getItem("userId");

let restaurantId = null;


async function loadOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });

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


async function viewOrderDetails(orderId) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });

        if (!response.ok) throw new Error("Erreur lors de la récupération des détails de la commande.");

        const order = await response.json();
        const orderDetails = document.getElementById("order-details");

        let itemsHtml = "";
        order.items.forEach(item => {
            itemsHtml += `
                <div class="mb-3">
                    <p><strong>${item.foodItem.name}</strong> (x${item.quantity}) - ${item.foodItem.price}€</p>
                </div>
            `;
        });

        orderDetails.innerHTML = `
            <p><strong>Client:</strong> ${order.customer.name}</p>
            <p><strong>Total:</strong> ${order.total}€</p>
            <h6>Articles commandés:</h6>
            ${itemsHtml}
        `;

        new bootstrap.Modal(document.getElementById("orderDetailsModal")).show();
    } catch (error) {
        console.error(error);
        alert("Impossible de charger les détails de la commande.");
    }
}


document.getElementById("accept-order").addEventListener("click", async () => {
    alert("Commande acceptée !");
});

document.getElementById("reject-order").addEventListener("click", async () => {
    alert("Commande refusée !");
});

document.getElementById("request-info").addEventListener("click", async () => {
    alert("Demande d'informations envoyée au client.");
});


async function loadCustomers() {
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });

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


document.getElementById("send-message-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const recipient = document.getElementById("message-recipient").value;
    const message = document.querySelector("#send-message-form textarea").value;

    try {
        const response = await fetch(`${API_BASE_URL}/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({ recipientId: recipient, message })
        });

        if (!response.ok) throw new Error("Erreur lors de l'envoi du message.");

        alert(`Message envoyé à ${recipient}: ${message}`);
    } catch (error) {
        console.error(error);
        alert("Impossible d'envoyer le message.");
    }
});

async function loadRestaurant() {
    try {
        const response = await fetch(`${API_BASE_URL}/restaurants/user/${userId}`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });

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

    try {
        const response = await fetch(`${API_BASE_URL}/food-items/search?restaurantId=${restaurantId}`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });

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


document.addEventListener("DOMContentLoaded", () => {
    loadRestaurant();
    loadOrders();
    loadCustomers();
});
