const BASE_URL = "http://localhost:8080";
const authToken = localStorage.getItem("authToken");
const userId = localStorage.getItem("userId"); // Récupération de l'ID utilisateur
let restaurantId = null; // Variable pour stocker l'ID du restaurant

/** ==========================
 *  CHARGER L'ID DU RESTAURANT
 *  ========================== */
async function getRestaurantId() {
    try {
        const response = await fetch(`${BASE_URL}/restaurants/user/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authToken}`
            }
        });

        if (!response.ok) throw new Error("Erreur lors de la récupération du restaurant.");

        const restaurants = await response.json();
        if (restaurants.length === 0) throw new Error("Aucun restaurant trouvé.");

        restaurantId = restaurants[0].id; // Prend le premier restaurant associé au compte
        loadRestaurantProfile(); // Une fois qu'on a l'ID, on charge le profil
    } catch (error) {
        console.error("Erreur lors de la récupération du restaurant:", error);
        alert("Impossible de récupérer les informations du restaurant.");
    }
}

/** ==========================
 *  CHARGER LE PROFIL DU RESTAURANT
 *  ========================== */
async function loadRestaurantProfile() {
    if (!restaurantId) {
        alert("Aucun restaurant associé à ce compte.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authToken}`
            }
        });

        if (!response.ok) throw new Error("Échec du chargement du profil.");

        const data = await response.json();
        populateProfileForm(data);
    } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
        alert("Impossible de charger les informations du restaurant.");
    }
}

/** ==========================
 *  AFFICHER LES DONNÉES DANS LE FORMULAIRE
 *  ========================== */
function populateProfileForm(restaurant) {
    document.getElementById("restaurant-name").value = restaurant.name;
    document.getElementById("restaurant-address").value = restaurant.address;
    document.getElementById("restaurant-phone").value = restaurant.phone;
    document.getElementById("restaurant-email").value = restaurant.email;
    document.getElementById("restaurant-description").value = restaurant.description || "";
}

/** ==========================
 *  METTRE À JOUR LE PROFIL DU RESTAURANT
 *  ========================== */
async function updateRestaurantProfile(event) {
    event.preventDefault();

    if (!restaurantId) {
        alert("Erreur : ID du restaurant introuvable.");
        return;
    }

    const updatedProfile = {
        name: document.getElementById("restaurant-name").value,
        address: document.getElementById("restaurant-address").value,
        phone: document.getElementById("restaurant-phone").value,
        email: document.getElementById("restaurant-email").value,
        description: document.getElementById("restaurant-description").value,
    };

    try {
        const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(updatedProfile)
        });

        if (!response.ok) throw new Error("Échec de la mise à jour du profil.");

        alert("Profil mis à jour avec succès !");
    } catch (error) {
        console.error("Erreur lors de la mise à jour du profil:", error);
        alert("Échec de la mise à jour du profil.");
    }
}

/** ==========================
 *  LANCER LA RÉCUPÉRATION DU PROFIL AU CHARGEMENT
 *  ========================== */
document.addEventListener("DOMContentLoaded", () => {
    if (!authToken || !userId) {
        alert("Vous devez être connecté pour accéder à cette page.");
        window.location.href = "login.html";
    } else {
        getRestaurantId();
    }
});

document.getElementById("restaurant-profile-form").addEventListener("submit", updateRestaurantProfile);
