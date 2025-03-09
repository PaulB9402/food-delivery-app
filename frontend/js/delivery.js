import { requireAuth } from './auth.js';
document.addEventListener('DOMContentLoaded', requireAuth);

const API_BASE_URL = "http://localhost:8080";
const authToken = localStorage.getItem("authToken");
const deliveryPersonId = localStorage.getItem("userId");

// 🟢 Fonction générique pour les appels API
async function apiCall(endpoint, method = "GET", data = null) {
    const headers = {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json"
    };

    const options = {
        method,
        headers,
        body: data ? JSON.stringify(data) : null
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur API ${response.status}: ${errorText}`);
    }

    return response.json();
}

// 🔄 Charger les commandes en attente
async function loadPendingOrders() {
    try {
        const orders = await apiCall("/orders/pending");
        displayOrders(orders, "pending-orders", "Accepter la livraison", acceptOrder);
    } catch (error) {
        console.error(error);
        alert("Impossible de charger les commandes en attente.");
    }
}

// 🔄 Charger l'historique des livraisons du livreur
async function loadDeliveries() {
    try {
        const deliveries = await apiCall(`/deliveries/person/${deliveryPersonId}`);
        displayOrders(deliveries, "delivered-orders");
    } catch (error) {
        console.error(error);
        alert("Impossible de charger l'historique des livraisons.");
    }
}

// 🔄 Afficher les commandes dynamiquement avec addEventListener
function displayOrders(orders, containerId, actionText = null, actionFunction = null) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    if (orders.length === 0) {
        container.innerHTML = "<p class='text-muted'>Aucune commande disponible.</p>";
        return;
    }

    orders.forEach(order => {
        const card = document.createElement("div");
        card.classList.add("col-md-4", "mb-4");

        card.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Commande #${order.id}</h5>
                    <p class="card-text"><strong>Client :</strong> ${order.customer?.name || "Inconnu"}</p>
                    <p class="card-text"><strong>Adresse :</strong> ${order.customer?.address || "Inconnue"}</p>
                    <p class="card-text"><strong>Total :</strong> ${order.total || "0.00"}€</p>
                    <p class="card-text"><strong>Statut :</strong> ${order.status || "Inconnu"}</p>
                    ${actionText ? `<button class="btn btn-primary action-btn" data-id="${order.id}">${actionText}</button>` : ""}
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    if (actionFunction) {
        document.querySelectorAll('.action-btn').forEach(button => {
            button.addEventListener('click', () => actionFunction(button.getAttribute('data-id')));
        });
    }
}

// 🔄 Accepter une commande et l'assigner au livreur
async function acceptOrder(orderId) {
    try {
        const response = await apiCall(`/deliveries/assign?orderId=${orderId}&deliveryPersonId=${deliveryPersonId}`, "POST");
        alert("Commande acceptée !");
        loadPendingOrders();
        loadDeliveries();
    } catch (error) {
        console.error(error);
        alert("Impossible d'accepter la commande.");
    }
}

// 🔄 Charger les données au démarrage
document.addEventListener("DOMContentLoaded", () => {
    loadPendingOrders();
    loadDeliveries();
});
