const API_BASE_URL = "http://localhost:8080";
const authToken = localStorage.getItem("authToken");
const userId = localStorage.getItem("userId");
const userRole = localStorage.getItem("userRole");

document.addEventListener('DOMContentLoaded', () => {
    const placeOrderBtn = document.getElementById('place-order-btn');
    placeOrderBtn.addEventListener('click', placeOrder);
});

/** ==========================
 *  Vérification du JWT
 *  ========================== */
if (!authToken || !userId) {
    window.location.href = '../auth/login.html';
}

/** ==========================
 *  CHARGER LES COMMANDES DU CLIENT
 *  ========================== */
async function loadOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/customer/${userId}`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });

        if (!response.ok) {
            if (response.status === 401) {
                logout();  // Redirection si non authentifié
                return;
            }
            throw new Error("Erreur lors de la récupération des commandes.");
        }

        const orders = await response.json();
        displayOrders(orders);
    } catch (error) {
        console.error(error);
        alert("Impossible de charger les commandes.");
    }
}

/** ==========================
 *  AFFICHER LES COMMANDES
 *  ========================== */
function displayOrders(orders) {
    const ongoingOrdersContainer = document.getElementById("ongoing-orders");
    const pastOrdersContainer = document.getElementById("past-orders");

    ongoingOrdersContainer.innerHTML = "";
    pastOrdersContainer.innerHTML = "";

    orders.forEach(order => {
        if (!order || !order.restaurant) {
            console.warn("Commande invalide détectée :", order);
            return;
        }

        const orderCard = `
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Commande #${order.id}</h5>
                        <p class="card-text">Restaurant: ${order.restaurant.name || "Non spécifié"}</p>
                        <p class="card-text">Total: ${order.total}€</p>
                        <p class="card-text">
                            Statut: <span class="badge ${order.status === 'Livrée' ? 'bg-success' : 'bg-warning'}">
                                ${order.status}
                            </span>
                        </p>
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

/** ==========================
 *  AFFICHER LES DÉTAILS D'UNE COMMANDE
 *  ========================== */
async function viewOrderDetails(orderId) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });

        if (!response.ok) {
            if (response.status === 401) {
                logout();
                return;
            }
            throw new Error("Erreur lors de la récupération des détails de la commande.");
        }

        const order = await response.json();
        displayOrderDetails(order);
    } catch (error) {
        console.error(error);
        alert("Impossible de charger les détails de la commande.");
    }
}

/** ==========================
 *  AFFICHAGE DES DÉTAILS D'UNE COMMANDE
 *  ========================== */
function displayOrderDetails(order) {
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
}

/** ==========================
 *  PASSER UNE COMMANDE
 *  ========================== */
window.placeOrder = async function() {
    console.log("placeOrder function called");

    if (!authToken || !userId || !userRole) {
        alert("🔑 Session invalide. Veuillez vous reconnecter.");
        window.location.href = '../auth/login.html';
        return;
    }

    if (userRole !== "CLIENT") {
        alert("🚫 Seuls les clients peuvent passer une commande !");
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart'));
    const currentRestaurantId = localStorage.getItem('currentRestaurantId');

    if (!cart || cart.length === 0) {
        alert("🛒 Votre panier est vide !");
        return;
    }

    if (!currentRestaurantId) {
        alert("❌ Aucun restaurant sélectionné !");
        return;
    }

    try {
        console.log("📦 Tentative de passage de commande...");

        const orderData = {
            customerId: parseInt(userId),
            restaurantId: parseInt(currentRestaurantId),
            orderItems: cart.map(item => ({
                foodItemId: item.foodItem.id,
                quantity: item.quantity
            }))
        };

        console.log("📦 Données de la commande envoyées :", JSON.stringify(orderData));

        const response = await fetch(`${API_BASE_URL}/orders/place`, {
            method: 'POST',
            headers: { 
                "Authorization": `Bearer ${authToken}`, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(orderData)
        });

        console.log("🔄 Réponse brute :", response);
        const responseData = await response.text();
        console.log("🔄 Réponse du serveur :", responseData);

        if (!response.ok) {
            if (response.status === 403) {
                console.error("Erreur 403: Accès refusé. Vérifiez vos permissions.");
            }
            throw new Error("Erreur lors de la commande");
        }

        alert("Commande passée avec succès !");
        localStorage.removeItem('cart'); // Vider le panier après la commande
        localStorage.removeItem('currentRestaurantId'); // Supprimer l'ID du restaurant après la commande
        window.location.href = 'orders.html'; // Redirection vers la page des commandes
    } catch (error) {
        console.error("❌ Erreur lors de la commande :", error);
        alert("Impossible de passer la commande.");
    }
}

/** ==========================
 *  INITIALISATION
 *  ========================== */
document.addEventListener("DOMContentLoaded", () => {
    loadOrders();
});