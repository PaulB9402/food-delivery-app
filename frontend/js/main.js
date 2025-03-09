const API_BASE_URL = "http://localhost:8080";

function loadRestaurants() {
    const authToken = localStorage.getItem("authToken");


    // 1️⃣ Vérifier l'authentification
    if (!authToken) {
        console.warn("Utilisateur non authentifié !");
        window.location.href = '../auth/login.html';
        return;
    }

    console.log("Chargement des restaurants ID par ID...");

    let restaurantId = 1; // On commence à l'ID 1
    let foundRestaurants = false; // Pour vérifier si on a trouvé au moins un restaurant

    function fetchNextRestaurant() {
        fetch(`${API_BASE_URL}/restaurants/${restaurantId}`, {
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if (response.status === 404) {
                console.log(`Restaurant ID ${restaurantId} non trouvé. Fin du chargement.`);
                if (!foundRestaurants) {
                    document.getElementById("restaurant-list").innerHTML = "<p class='text-muted'>Aucun restaurant trouvé.</p>";
                }
                return; // Arrêter la boucle
            }
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(restaurant => {
            if (!restaurant) return; // Arrêter si aucune donnée

            foundRestaurants = true; // On a trouvé au moins un restaurant
            const restaurantList = document.getElementById("restaurant-list");

            const card = `
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <img src="${restaurant.image || 'default.jpg'}" class="card-img-top" alt="${restaurant.name}">
                        <div class="card-body">
                            <h5 class="card-title">${restaurant.name}</h5>
                            <p class="card-text">${restaurant.cuisine || 'Type inconnu'}</p>
                            <p class="text-muted">Livraison: ${restaurant.deliveryTime || 'Non spécifié'}</p>
                            <button class="btn btn-danger"
                                    onclick="viewRestaurant(${restaurant.id})">
                                Voir le menu
                            </button>
                        </div>
                    </div>
                </div>
            `;
            restaurantList.innerHTML += card;

            // Charger le restaurant suivant
            restaurantId++;
            fetchNextRestaurant();
        })
        .catch(error => {
            console.error("Erreur lors du chargement des restaurants:", error);
            alert(`Erreur technique: ${error.message}`);
        });
    }

    // Démarrer la boucle
    fetchNextRestaurant();
}

// Fonction pour afficher un restaurant spécifique
function viewRestaurant(restaurantId) {
    console.log(`Redirection vers le restaurant ${restaurantId}`);
    window.location.href = `restaurant-menu.html?id=${restaurantId}`;
}

// Fonction de déconnexion sécurisée
function logout() {
    localStorage.clear();
    document.cookie.split(";").forEach(cookie => {
        const [name] = cookie.trim().split("=");
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    window.location.href = '../auth/login.html';
}

// 🔄 Charger les restaurants au démarrage
document.addEventListener('DOMContentLoaded', () => {
    try {
        loadRestaurants();
    } catch (error) {
        console.error("Erreur d'initialisation:", error);
        logout();
    }
});
