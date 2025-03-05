const API_BASE_URL = "http://localhost:8080";
const authToken = localStorage.getItem("authToken");
const userId = localStorage.getItem("userId");

async function loadOrders() {
    if (!authToken || !userId) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/orders?customerId=${userId}`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });

        if (!response.ok) {
          if (response.status === 401) {
                logout();
                return;
            }
            const errorData = await response.json();
            const errorMessage = errorData.message || "Erreur lors de la récupération des commandes.";
            throw new Error(errorMessage);
        }

        const orders = await response.json();
        displayOrders(orders);
    } catch (error) {
        console.error(error);
        alert("Impossible de charger les commandes. " + error.message);
    }
}

function displayOrders(orders) {
    const ongoingOrdersContainer = document.getElementById("ongoing-orders");
    const pastOrdersContainer = document.getElementById("past-orders");

    ongoingOrdersContainer.innerHTML = "";
    pastOrdersContainer.innerHTML = "";

    orders.forEach(order => {
      if (!order || !order.restaurant) {
          console.error("Invalid order data:", order);
          return;
      }
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

    if (ongoingOrdersContainer.innerHTML === "") {
        ongoingOrdersContainer.innerHTML = "<p>Aucune commande en cours.</p>";
    }
     if (pastOrdersContainer.innerHTML === "") {
        pastOrdersContainer.innerHTML = "<p>Aucune commande passée.</p>";
    }
}

async function viewOrderDetails(orderId) {
     if (!authToken) {
        window.location.href = 'login.html';
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });

        if (!response.ok) {
          if (response.status === 401) {
                logout();
                return;
            }
            const errorData = await response.json();
            const errorMessage = errorData.message || "Erreur lors de la récupération des détails de la commande.";
            throw new Error(errorMessage);
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
        alert("Impossible de charger les détails de la commande." + error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadOrders();
});