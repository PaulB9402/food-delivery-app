const API_BASE_URL = "http://localhost:8080";
const authToken = localStorage.getItem("authToken");

async function loadUsers() {
    if (!authToken) {
        window.location.href = '../auth/login.html';  // Redirect to login if no auth token
        return;
    }

    const response = await fetch(`${API_BASE_URL}/users`, {
        headers: { "Authorization": `Bearer ${authToken}` }
    });

    if (!response.ok) {
        console.error("Failed to load users:", await response.text());
        return;
    }

    const users = await response.json();
    const userTable = document.getElementById("user-table");

    users.forEach(user => {
        const row = `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td><button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Supprimer</button></td>
            </tr>
        `;
        userTable.innerHTML += row;
    });
}

async function loadRestaurants() {
    if (!authToken) {
        window.location.href = './login.html';  // Redirect to login if no auth token
        return;
    }

    const response = await fetch(`${API_BASE_URL}/restaurants`, {
        headers: { "Authorization": `Bearer ${authToken}` }
    });

    if (!response.ok) {
        console.error("Failed to load restaurants:", await response.text());
        return;
    }

    const restaurants = await response.json();
    const restaurantTable = document.getElementById("restaurant-table");

    restaurants.forEach(restaurant => {
        const row = `
            <tr>
                <td>${restaurant.id}</td>
                <td>${restaurant.name}</td>
                <td>${restaurant.address}</td>
                <td>${restaurant.phone}</td>
                <td><button class="btn btn-danger btn-sm" onclick="deleteRestaurant(${restaurant.id})">Supprimer</button></td>
            </tr>
        `;
        restaurantTable.innerHTML += row;
    });
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
