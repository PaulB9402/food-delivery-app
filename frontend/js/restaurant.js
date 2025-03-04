const restaurants = [
    { id: 1, name: "La Belle Pizza", cuisine: "Italienne", image: "../img/pizza.jpg", rating: 4.5, deliveryTime: "30-40 min", minOrder: "15€", priceRange: "€€", dishes: ["Pizza", "Pâtes", "Lasagnes"] },
    { id: 2, name: "Sushi Palace", cuisine: "Japonaise", image: "../img/sushi.jpg", rating: 4.7, deliveryTime: "25-35 min", minOrder: "20€", priceRange: "€€€", dishes: ["Sushi", "Ramen", "Tempura"] },
    { id: 3, name: "Burger House", cuisine: "Américaine", image: "../img/burger.jpg", rating: 4.3, deliveryTime: "20-30 min", minOrder: "10€", priceRange: "€", dishes: ["Burger", "Frites", "Hot Dog"] }
];

const urlParams = new URLSearchParams(window.location.search);
const searchTerm = urlParams.get('search');

const restaurantList = document.getElementById('restaurant-list');

let filteredRestaurants = restaurants;
if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();

    filteredRestaurants = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(lowerSearchTerm) ||
        restaurant.cuisine.toLowerCase().includes(lowerSearchTerm) ||
        restaurant.dishes.some(dish => dish.toLowerCase().includes(lowerSearchTerm))
    );

    document.getElementById('search-term').textContent = `Résultats pour : "${searchTerm}"`;
} else {
    document.getElementById('search-term').textContent = "Tous les restaurants";
}

if (filteredRestaurants.length > 0) {
    restaurantList.innerHTML = "";
    filteredRestaurants.forEach(restaurant => {
        const card = `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${restaurant.image}" class="card-img-top" alt="${restaurant.name}">
                    <div class="card-body">
                        <h5 class="card-title">${restaurant.name}</h5>
                        <p class="card-text">Cuisine : ${restaurant.cuisine}</p>
                        <p class="card-text">Plats : ${restaurant.dishes.join(", ")}</p>
                        <button class="btn btn-danger" onclick="viewRestaurant(${restaurant.id})">Voir le menu</button>
                    </div>
                </div>
            </div>
        `;
        restaurantList.innerHTML += card;
    });
} else {
    restaurantList.innerHTML = '<p class="text-muted">❌ Aucun restaurant trouvé.</p>';
}

let cart = [];

function viewRestaurant(id) {
    const restaurant = restaurants.find(r => r.id === id);

    if (restaurant) {
        document.getElementById('modal-restaurant-name').textContent = restaurant.name;
        document.getElementById('modal-restaurant-cuisine').textContent = restaurant.cuisine;

        const menuList = document.getElementById('modal-menu-list');
        menuList.innerHTML = "";
        restaurant.dishes.forEach(dish => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            listItem.innerHTML = `
                ${dish}
                <button class="btn btn-sm btn-success" onclick="addToCart('${dish}', '${restaurant.name}')">Ajouter</button>
            `;
            menuList.appendChild(listItem);
        });

        const menuModal = new bootstrap.Modal(document.getElementById('menuModal'));
        menuModal.show();
    }
}

function addToCart(dish, restaurantName) {
    cart.push({ dish, restaurantName });
    alert(`"${dish}" ajouté à la commande !`);
}

function viewCart() {
    const cartList = document.getElementById('cart-items');
    cartList.innerHTML = "";

    if (cart.length === 0) {
        cartList.innerHTML = '<p class="text-muted">Votre panier est vide.</p>';
    } else {
        cart.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            listItem.innerHTML = `
                ${item.dish} (${item.restaurantName})
                <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">Supprimer</button>
            `;
            cartList.appendChild(listItem);
        });
    }

    const total = cart.length * 10;
    document.getElementById('cart-total').textContent = `${total.toFixed(2)}€`;

    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    cartModal.show();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    viewCart();
}

function clearCart() {
    cart = [];
    viewCart();
}
