const API_BASE_URL = "http://localhost:8080";
const authToken = localStorage.getItem("authToken");
const userId = localStorage.getItem("userId");

async function loadOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/orders?customerId=${userId}`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des commandes.");
        }

        const orders = await response.json();
        displayOrders(orders);
    } catch (error) {
        console.error(error);
        alert("Impossible de charger les commandes.");
    }
}

function displayOrders(orders) {
    const ongoingOrdersContainer = document.getElementById("ongoing-orders");
    const pastOrdersContainer = document.getElementById("past-orders");

    ongoingOrdersContainer.innerHTML = "";
    pastOrdersContainer.innerHTML = "";

    orders.forEach(order => {
        const orderCard = `
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Commande #${order.id}</h5>
                        <p class="card-text">Restaurant: ${order.restaurant.name}</p>
                        <p class="card-text">Total: ${order.total}€</p>
                        <p class="card-text">Statut: <span class="badge ${order.status === 'Livrée' ? 'bg-success' : 'bg-warning'}">${order.status}</span></p>
                        <button class="btn btn-primary" onclick="viewOrderDetails(${order.id})">Voir les détails</button>
                    </div>
                </div>
            </div>
        `;

        if (order.status === "Livrée") {
            pastOrdersContainer.innerHTML += orderCard;
        } else {
            ongoingOrdersContainer.innerHTML += orderCard;
        }
    });
}

async function viewOrderDetails(orderId) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des détails de la commande.");
        }

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
            <p><strong>Restaurant:</strong> ${order.restaurant.name}</p>
            <p><strong>Total:</strong> ${order.total}€</p>
            <p><strong>Statut:</strong> ${order.status}</p>
            <h6>Articles commandés:</h6>
            ${itemsHtml}
        `;

        new bootstrap.Modal(document.getElementById("orderDetailsModal")).show();
    } catch (error) {
        console.error(error);
        alert("Impossible de charger les détails de la commande.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadOrders();
});
