const BASE_URL = "http://localhost:8080";

const profileForm = document.getElementById('restaurant-profile-form');
const restaurantName = document.getElementById('restaurant-name');
const restaurantAddress = document.getElementById('restaurant-address');
const restaurantPhone = document.getElementById('restaurant-phone');
const restaurantEmail = document.getElementById('restaurant-email');
const restaurantDescription = document.getElementById('restaurant-description');

async function loadRestaurantProfile() {
    const restaurantId = localStorage.getItem('restaurantId');

    if (!restaurantId) {
        alert('Restaurant non connecté.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });

        if (!response.ok) {
            throw new Error('Échec du chargement du profil');
        }

        const data = await response.json();
        populateProfileForm(data);
    } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
        alert('Impossible de charger les informations du restaurant.');
    }
}

function populateProfileForm(restaurant) {
    restaurantName.value = restaurant.name;
    restaurantAddress.value = restaurant.address;
    restaurantPhone.value = restaurant.phone;
    restaurantEmail.value = restaurant.email;
    restaurantDescription.value = restaurant.description;
}

async function updateRestaurantProfile(event) {
    event.preventDefault();

    const restaurantId = localStorage.getItem('restaurantId');

    const updatedProfile = {
        name: restaurantName.value,
        address: restaurantAddress.value,
        phone: restaurantPhone.value,
        email: restaurantEmail.value,
        description: restaurantDescription.value,
    };

    try {
        const response = await fetch(`${BASE_URL}/restaurants/${restaurantId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: JSON.stringify(updatedProfile),
        });

        if (!response.ok) {
            throw new Error('Échec de la mise à jour du profil');
        }

        alert('Profil mis à jour avec succès !');
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        alert('Échec de la mise à jour du profil.');
    }
}

if (profileForm) {
    profileForm.addEventListener('submit', updateRestaurantProfile);
}

document.addEventListener('DOMContentLoaded', loadRestaurantProfile);