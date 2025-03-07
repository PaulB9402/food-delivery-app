const API_BASE_URL = "http://localhost:8080"; // URL de ton backend
const authToken = localStorage.getItem("authToken");
const deliveryPersonId = localStorage.getItem("userId");

// Charger les commandes disponibles pour la livraison
async function loadPendingOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/pending`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des commandes en attente.");
        }

        const orders = await response.json();
        displayOrders(orders, "pending-orders", "Accepter la livraison", acceptOrder);
    } catch (error) {
        console.error(error);
        alert("Impossible de charger les commandes en attente.");
    }
}

// Charger l'historique des livraisons du livreur
async function loadDeliveries() {
    try {
        const response = await fetch(`${API_BASE_URL}/deliveries/${deliveryPersonId}`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des livraisons.");
        }

        const deliveries = await response.json();
        displayOrders(deliveries, "delivered-orders", null, null);
    } catch (error) {
        console.error(error);
        alert("Impossible de charger l'historique des livraisons.");
    }
}

// Afficher les commandes dynamiquement
function displayOrders(orders, containerId, actionText, actionFunction) {
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
                    <p class="card-text"><strong>Client :</strong> ${order.customer.name}</p>
                    <p class="card-text"><strong>Adresse :</strong> ${order.customer.address}</p>
                    <p class="card-text"><strong>Total :</strong> ${order.total}€</p>
                    <p class="card-text"><strong>Statut :</strong> ${order.status}</p>
                    ${actionText ? `<button class="btn btn-primary" onclick="${actionFunction.name}(${order.id})">${actionText}</button>` : ""}
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

// Accepter une commande et l'assigner au livreur
async function acceptOrder(orderId) {
    try {
        const response = await fetch(`${API_BASE_URL}/deliveries`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({
                orderId: orderId,
                deliveryPersonId: deliveryPersonId
            })
        });

        if (!response.ok) {
            throw new Error("Erreur lors de l'acceptation de la commande.");
        }

        alert("Commande acceptée !");
        loadPendingOrders();
        loadDeliveries();
    } catch (error) {
        console.error(error);
        alert("Impossible d'accepter la commande.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadPendingOrders();
    loadDeliveries();
});
