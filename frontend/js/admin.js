const API_BASE_URL = "http://localhost:8080";
const authToken = localStorage.getItem("authToken");

async function loadUsers() {
    if (!authToken) {
        console.warn("Utilisateur non authentifié !");
        window.location.href = '../auth/login.html';  // Redirect to login if no auth token
        return;
    }

    let id = 1;
    let foundUsers = false;
    const userTable = document.getElementById("user-table");

    async function fetchNext() {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${id}`, {
                headers: { "Authorization": `Bearer ${authToken}` }
            });

            if (response.status === 404) {
                console.log(`Fin du chargement des utilisateurs.`);
                if (!foundUsers) {
                    userTable.innerHTML = `<tr><td colspan="6" class="text-center text-muted">❌ Aucun utilisateur trouvé.</td></tr>`;
                }
                return;
            }

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const user = await response.json();
            foundUsers = true;

            const row = `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.username || 'Non spécifié'}</td>
                    <td>${user.email || 'Non spécifié'}</td>
                    <td>${user.role || 'Non spécifié'}</td>
                    <td>${user.phone || 'Non spécifié'}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Supprimer</button>
                    </td>
                </tr>
            `;
            userTable.innerHTML += row;

            id++;
            fetchNext();  // Charger l'utilisateur suivant
        } catch (error) {
            console.error("Erreur lors du chargement des utilisateurs:", error);
            alert(`Erreur technique: ${error.message}`);
        }
    }

    fetchNext();  // Démarrer le chargement des utilisateurs
}

async function loadRestaurants() {
    if (!authToken) {
        console.warn("Utilisateur non authentifié !");
        window.location.href = '../auth/login.html';  // Redirect to login if no auth token
        return;
    }

    let id = 1;
    let foundRestaurants = false;
    const restaurantTable = document.getElementById("restaurant-table");

    async function fetchNext() {
        try {
            const response = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
                headers: { "Authorization": `Bearer ${authToken}` }
            });

            if (response.status === 404) {
                console.log(`Fin du chargement des restaurants.`);
                if (!foundRestaurants) {
                    restaurantTable.innerHTML = `<tr><td colspan="5" class="text-center text-muted">❌ Aucun restaurant trouvé.</td></tr>`;
                }
                return;
            }

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const restaurant = await response.json();
            foundRestaurants = true;

            const row = `
                <tr>
                    <td>${restaurant.id}</td>
                    <td>${restaurant.name}</td>
                    <td>${restaurant.address || 'Non spécifié'}</td>
                    <td>${restaurant.phone || 'Non spécifié'}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteRestaurant(${restaurant.id})">Supprimer</button>
                    </td>
                </tr>
            `;
            restaurantTable.innerHTML += row;

            id++;
            fetchNext();  // Charger le restaurant suivant
        } catch (error) {
            console.error("Erreur lors du chargement des restaurants:", error);
            alert(`Erreur technique: ${error.message}`);
        }
    }

    fetchNext();  // Démarrer le chargement des restaurants
}


async function deleteUser(userId) {
    if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
        await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        location.reload();
    }
}

async function deleteRestaurant(restaurantId) {
    if (confirm("Voulez-vous vraiment supprimer ce restaurant ?")) {
        await fetch(`${API_BASE_URL}/restaurants/${restaurantId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        location.reload();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (!authToken) {
        window.location.href = './login.html';  // Redirect to login if no auth token
    } else {
        loadUsers();
        loadRestaurants();
    }
});
