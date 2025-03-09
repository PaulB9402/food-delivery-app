const API_BASE_URL = "http://localhost:8080";

function loadRestaurants() {
    const authToken = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");

    // 1. Vérifier l'authentification ET les permissions
    if (!authToken || !userRole) {
        window.location.href = './auth/login.html';
        return;
    }

    // 2. Vérifier le rôle avant même de faire la requête
    if (userRole !== "ADMIN" && userRole !== "RESTAURANT" && userRole !== "DELIVERY" && userRole !== "CLIENT") {
        alert("Vous n'avez pas les permissions nécessaires");
        window.location.href = './home.html';
        return;
    }

    console.log("Chargement des restaurants...");

    fetch(`${API_BASE_URL}/restaurants`, {
        headers: {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        // 3. Gestion centralisée des erreurs
        if (response.status === 401 || response.status === 403) {
            logout();
            throw new Error("Session expirée ou accès refusé");
        }

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        return response.json();
    })
    .then(restaurants => {
        const restaurantList = document.getElementById("restaurant-list");
        restaurantList.innerHTML = "";

        // 4. Ajout d'une vérification de sécurité
        if (!Array.isArray(restaurants)) {
            throw new Error("Format de réponse inattendu");
        }

        restaurants.forEach(restaurant => {
            const card = `
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <img src="${restaurant.image}" class="card-img-top" alt="${restaurant.name}">
                        <div class="card-body">
                            <h5 class="card-title">${restaurant.name}</h5>
                            <p class="card-text">${restaurant.cuisine}</p>
                            <p class="text-muted">Livraison: ${restaurant.deliveryTime}</p>
                            <button class="btn btn-danger"
                                    onclick="viewRestaurant(${restaurant.id})"
                                    data-testid="restaurant-${restaurant.id}">
                                Voir le menu
                            </button>
                        </div>
                    </div>
                </div>
            `;
            restaurantList.innerHTML += card;
        });
    })
    .catch(error => {
        // 5. Gestion d'erreur améliorée
        console.error("Erreur critique:", error);

        if (error.message.includes("accès refusé")) {
            console.error("Détails du refus:", {
                token: localStorage.getItem('authToken'),
                role: localStorage.getItem('userRole')
            });
            alert("Accès refusé. Vérifiez vos permissions.");
            logout();
        } else {
            alert(`Erreur technique: ${error.message}`);
        }
    });
}

function logout() {
    // 6. Nettoyage complet
    localStorage.clear();
    document.cookie.split(";").forEach(cookie => {
        const [name] = cookie.trim().split("=");
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    window.location.href = './views/auth/login.html';
}

// Initialisation sécurisée
document.addEventListener('DOMContentLoaded', () => {
    try {
        loadRestaurants();
    } catch (error) {
        console.error("Erreur d'initialisation:", error);
        logout();
    }
});