const API_BASE_URL = "http://localhost:8080";
const authToken = localStorage.getItem("authToken");

document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    loadRestaurants();
});

// CHARGER TOUS LES UTILISATEURS
async function loadUsers() {
    if (!authToken) {
        console.warn("Utilisateur non authentifié !");
        window.location.href = '../auth/login.html';
        return;
    }

    console.log("Chargement des utilisateurs ID par ID...");

    let userId = 1; // On commence à l'ID 1
    let foundUsers = false; // Pour vérifier si on a trouvé au moins un utilisateur
    const userTable = document.getElementById("user-table");
    userTable.innerHTML = "";

    function fetchNextUser() {
        console.log(`Tentative de récupération de l'utilisateur ID: ${userId}`);
        console.log(`Token utilisé: ${authToken ? authToken.substring(0, 10) + '...' : 'Non défini'}`);
        
        fetch(`${API_BASE_URL}/users/${userId}`, {
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            console.log(`Réponse pour ID ${userId}: Status ${response.status}`);
            
            if (response.status === 403) {
                console.error(`ERREUR 403: Accès refusé pour l'utilisateur ID ${userId}`);
                // Essayez sans le token pour voir si c'est un problème d'authentification
                return fetch(`${API_BASE_URL}/users/${userId}`, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            }
            
            if (response.status === 404) {
                console.log(`Utilisateur ID ${userId} non trouvé. Fin du chargement.`);
                if (!foundUsers) {
                    userTable.innerHTML = "<tr><td colspan='6' class='text-muted'>Aucun utilisateur trouvé.</td></tr>";
                }
                return null;
            }
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            return response.json();
        })
        .then(user => {
            if (!user) return; // Arrêter si aucune donnée
    
            foundUsers = true; // On a trouvé au moins un utilisateur
            
            const row = `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.username || 'Non spécifié'}</td>
                    <td>${user.email || 'Non spécifié'}</td>
                    <td>${user.role || 'Non spécifié'}</td>
                    <td>Non disponible</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Supprimer</button>
                    </td>
                </tr>
            `;
            userTable.innerHTML += row;
    
            // Charger l'utilisateur suivant
            userId++;
            fetchNextUser();
        })
        .catch(error => {
            console.error(`Erreur détaillée: ${error.message}`);
        });
    }

    // Démarrer la boucle
    fetchNextUser();
}

// CHARGER TOUS LES RESTAURANTS
async function loadRestaurants() {
    if (!authToken) {
        console.warn("Utilisateur non authentifié !");
        window.location.href = '../auth/login.html';
        return;
    }

    console.log("Chargement des restaurants ID par ID...");

    let restaurantId = 1; // On commence à l'ID 1
    let foundRestaurants = false; // Pour vérifier si on a trouvé au moins un restaurant
    const restaurantTable = document.getElementById("restaurant-table");
    restaurantTable.innerHTML = "";

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
                    restaurantTable.innerHTML = "<tr><td colspan='5' class='text-muted'>Aucun restaurant trouvé.</td></tr>";
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
            
            const row = `
                <tr>
                    <td>${restaurant.id}</td>
                    <td>${restaurant.name || 'Non spécifié'}</td>
                    <td>${restaurant.address || 'Non spécifié'}</td>
                    <td>${restaurant.phone || 'Non spécifié'}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteRestaurant(${restaurant.id})">Supprimer</button>
                    </td>
                </tr>
            `;
            restaurantTable.innerHTML += row;

            // Charger le restaurant suivant
            restaurantId++;
            fetchNextRestaurant();
        })
        .catch(error => {
            console.error("Erreur lors du chargement des restaurants:", error);
        });
    }

    // Démarrer la boucle
    fetchNextRestaurant();
}