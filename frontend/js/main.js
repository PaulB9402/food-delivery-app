// main.js
const API_BASE_URL = "http://localhost:8080";
const authToken = localStorage.getItem("authToken");

function loadRestaurants() {
    if (!authToken) {
        window.location.href = './views/auth/login.html';  // Redirect to login if no auth token
        return;
    }

    console.log("Loading restaurants..."); // Debugging log
    fetch(`${API_BASE_URL}/restaurants`, {  // Use API_BASE_URL for consistency
        headers: { "Authorization": `Bearer ${authToken}` }
    })
        .then(response => response.json())
        .then(restaurants => {
            const restaurantList = document.getElementById("restaurant-list");
            restaurantList.innerHTML = "";
            restaurants.forEach(restaurant => {
                const card = `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100">
                            <img src="${restaurant.image}" class="card-img-top" alt="${restaurant.name}">
                            <div class="card-body">
                                <h5 class="card-title">${restaurant.name}</h5>
                                <p class="card-text">Cuisine : ${restaurant.cuisine}</p>
                                <a href="restaurant-details.html?name=${restaurant.name}" class="btn btn-danger">Voir le menu</a>
                            </div>
                        </div>
                    </div>
                `;
                restaurantList.innerHTML += card;
            });
        })
        .catch(error => console.error("Error loading restaurants:", error));
}
