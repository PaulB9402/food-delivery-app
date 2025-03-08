import { requireAuth } from './auth.js';
document.addEventListener('DOMContentLoaded', requireAuth);
const API_BASE_URL = "http://localhost:8080";
const authToken = localStorage.getItem("authToken");
const userId = localStorage.getItem("userId");


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


async function loadUserProfile() {
    const headers = getAuthHeaders();
    if (!headers || !userId) return;

    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, { headers });

        if (!response.ok) throw new Error("Erreur lors de la récupération du profil.");

        const user = await response.json();
        displayUserProfile(user);
        loadOrderHistory();
        loadAddresses();
    } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
        alert("Impossible de charger votre profil.");
    }
}


function displayUserProfile(user) {
    document.querySelector('#profile-form input[name="name"]').value = user.name || "";
    document.querySelector('#profile-form input[name="email"]').value = user.email || "";
    document.querySelector('#profile-form input[name="phone"]').value = user.phone || "";
}


async function handleProfileUpdate(event) {
    event.preventDefault();

    const headers = getAuthHeaders();
    if (!headers) return;

    const updatedProfile = {
        name: document.querySelector('#profile-form input[name="name"]').value.trim(),
        email: document.querySelector('#profile-form input[name="email"]').value.trim(),
        phone: document.querySelector('#profile-form input[name="phone"]').value.trim()
    };

    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(updatedProfile)
        });

        if (!response.ok) throw new Error("Erreur lors de la mise à jour du profil.");

        alert("Profil mis à jour avec succès !");
        loadUserProfile();
    } catch (error) {
        console.error("Erreur lors de la mise à jour du profil:", error);
        alert("Impossible de mettre à jour votre profil.");
    }
}


async function loadOrderHistory() {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
        const response = await fetch(`${API_BASE_URL}/orders/customer/${userId}`, { headers });

        if (!response.ok) throw new Error("Erreur lors du chargement des commandes.");

        const orders = await response.json();
        displayOrderHistory(orders);
    } catch (error) {
        console.error("Erreur lors du chargement des commandes:", error);
        alert("Impossible de charger l'historique des commandes.");
    }
}


function displayOrderHistory(orders) {
    const orderHistoryContainer = document.getElementById("order-history");
    orderHistoryContainer.innerHTML = "";

    if (!orders.length) {
        orderHistoryContainer.innerHTML = "<p>Aucune commande trouvée.</p>";
        return;
    }

    orders.forEach(order => {
        const orderItem = `
            <div class="list-group-item">
                <h6>${order.restaurant.name} - ${order.total}€</h6>
                <p>${order.orderItems.map(item => `${item.quantity}x ${item.foodItem.name}`).join(", ")}</p>
                <small>Statut: <span class="badge ${order.status === "Livrée" ? "bg-success" : "bg-warning"}">${order.status}</span></small>
            </div>
        `;
        orderHistoryContainer.innerHTML += orderItem;
    });
}


async function loadAddresses() {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/addresses`, { headers });

        if (!response.ok) throw new Error("Erreur lors du chargement des adresses.");

        const addresses = await response.json();
        displayAddresses(addresses);
    } catch (error) {
        console.error("Erreur lors du chargement des adresses:", error);
        alert("Impossible de charger les adresses.");
    }
}


function displayAddresses(addresses) {
    const addressesContainer = document.querySelector("#addresses-container .list-group");
    addressesContainer.innerHTML = "";

    if (!addresses.length) {
        addressesContainer.innerHTML = "<p>Aucune adresse enregistrée.</p>";
        return;
    }

    addresses.forEach(address => {
        const addressItem = `
            <div class="list-group-item">
                ${address.street}, ${address.city}, ${address.zipCode}
                <button class="btn btn-sm btn-danger float-end" onclick="deleteAddress(${address.id})">Supprimer</button>
            </div>
        `;
        addressesContainer.innerHTML += addressItem;
    });
}


async function deleteAddress(addressId) {
    const headers = getAuthHeaders();
    if (!headers) return;

    if (!confirm("Voulez-vous vraiment supprimer cette adresse ?")) return;

    try {
        const response = await fetch(`${API_BASE_URL}/addresses/${addressId}`, {
            method: "DELETE",
            headers
        });

        if (!response.ok) throw new Error("Erreur lors de la suppression de l'adresse.");

        alert("Adresse supprimée avec succès !");
        loadAddresses();
    } catch (error) {
        console.error("Erreur lors de la suppression de l'adresse:", error);
        alert("Impossible de supprimer l'adresse.");
    }
}


document.addEventListener("DOMContentLoaded", loadUserProfile);
document.getElementById("profile-form").addEventListener("submit", handleProfileUpdate);
