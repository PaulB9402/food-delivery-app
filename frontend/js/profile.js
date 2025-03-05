const API_BASE_URL = "http://localhost:8080";
const authToken = localStorage.getItem('authToken');
const userId = localStorage.getItem('userId');

async function loadUserProfile() {
    if (!authToken || !userId) {
        window.location.href = 'auth/login.html'; // Redirect if not logged in and correct path
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) {
            if (response.status === 401) {
                logout();
                return;
            }
            const errorData = await response.json();
            const errorMessage = errorData.message || "Erreur lors de la récupération du profil.";
            throw new Error(errorMessage);
        }

        const user = await response.json();
        displayUserProfile(user);
        loadOrderHistory(); // Load order history after profile data
        loadAddresses(); // Load addresses

    } catch (error) {
        console.error('Error loading user profile:', error);
        alert('Failed to load user profile. ' + error.message);
    }
}

function displayUserProfile(user) {
    // Correctly set the values of the input fields using their names
    document.querySelector('#profile-form input[name="name"]').value = user.name || '';
    document.querySelector('#profile-form input[name="email"]').value = user.email || '';
    document.querySelector('#profile-form input[name="phone"]').value = user.phone || '';
}
async function handleProfileUpdate(event) {
    event.preventDefault();

    const updatedName = document.querySelector('#profile-form input[name="name"]').value; // Use name attribute
    const updatedEmail = document.querySelector('#profile-form input[name="email"]').value; // Use name attribute
    const updatedPhone = document.querySelector('#profile-form input[name="phone"]').value;   // Use name attribute

    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'PUT', //  Use PUT for updating
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                name: updatedName,
                email: updatedEmail,
                phone: updatedPhone
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                logout(); //clear everything
                return;
            }
            const errorData = await response.json(); //get message
            const errorMessage = errorData.message || "Erreur lors de la mise à jour du profil.";
            throw new Error(errorMessage);
        }

        alert('Profil mis à jour avec succès!');
        // Optionally, re-fetch the user data to reflect changes immediately.
        loadUserProfile();

    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile.' + error.message);
    }
}

async function loadOrderHistory() {
    if (!authToken || !userId) {
        window.location.href = 'auth/login.html';//correct path
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/orders?customerId=${userId}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) {
             if (response.status === 401) {
                logout(); //clear everything
                return;
            }
            const errorData = await response.json(); //get message
            const errorMessage = errorData.message ||  "Erreur lors du chargement de l'historique des commandes";
            throw new Error(errorMessage);
        }

        const orders = await response.json();
        displayOrderHistory(orders);

    } catch (error) {
        console.error('Error loading order history:', error);
        alert('Failed to load order history.' + error.message);
    }
}
function displayOrderHistory(orders) {
    const orderHistoryContainer = document.getElementById('order-history');
    orderHistoryContainer.innerHTML = ''; // Clear previous content

    if (orders.length === 0) {
        orderHistoryContainer.innerHTML = '<p>Aucune commande précédente.</p>';
        return;
    }

    const listGroup = document.createElement('div');
    listGroup.classList.add('list-group');

    orders.forEach(order => {
        // Handle missing restaurant information gracefully.
        const restaurantName = order.restaurant ? order.restaurant.name : 'Restaurant inconnu';

        const orderItem = document.createElement('a');
        orderItem.href = '#'; //  Add a link if you want to make it clickable (e.g., to view order details)
        orderItem.classList.add('list-group-item', 'list-group-item-action');
        orderItem.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1">${restaurantName} - ${order.total}€</h6>
                <small>${new Date(order.orderDate).toLocaleDateString()}</small>
            </div>
            <p class="mb-1">${order.orderItems.map(item => `${item.quantity}x ${item.foodItem.name}`).join(', ')}</p>
            <small class="text-muted">Statut: ${order.status}</small>
        `;
        listGroup.appendChild(orderItem);
    });

    orderHistoryContainer.appendChild(listGroup);
}



async function loadAddresses() {
     if (!authToken || !userId) {
        window.location.href = 'auth/login.html'; //correct path
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/addresses`, {  //  Endpoint for user addresses
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) {
             if (response.status === 401) {
                logout(); //clear everything
                return;
            }
            const errorData = await response.json(); //get message
            const errorMessage = errorData.message || "Erreur lors du chargement des adresses.";
            throw new Error(errorMessage);
        }

        const addresses = await response.json();
        displayAddresses(addresses);

    } catch (error) {
        console.error('Error loading addresses:', error);
        alert('Failed to load addresses. ' + error.message);
    }
}

function displayAddresses(addresses) {
    const addressesContainer = document.querySelector('#addresses-container .list-group'); // Corrected selector
     if (!addressesContainer) {
        console.error("Addresses container not found!");  // Debugging
        return; // Exit if container doesn't exist.
    }
    addressesContainer.innerHTML = ''; // Clear existing addresses

    if (addresses.length === 0) {
        addressesContainer.innerHTML = '<div class="list-group-item">Aucune adresse enregistrée.</div>';
        return;
    }

    addresses.forEach(address => {
        const addressItem = document.createElement('div');
        addressItem.classList.add('list-group-item');
        addressItem.innerHTML = `
            ${address.street}, ${address.city}, ${address.zipCode}
            <button class="btn btn-sm btn-danger float-end" onclick="deleteAddress(${address.id})">Supprimer</button>
        `;
        addressesContainer.appendChild(addressItem);
    });
}


async function deleteAddress(addressId) {
    if (!authToken) {
        window.location.href = 'login.html';
        return;
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer cette adresse?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/addresses/${addressId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!response.ok) {
            if (response.status === 401) {
                logout(); //clear everything
                return;
            }
            const errorData = await response.json(); //get message
            const errorMessage = errorData.message ||  "Erreur lors de la suppression de l'adresse.";
            throw new Error(errorMessage);
        }

        // Reload addresses after successful deletion
        loadAddresses();
        alert('Adresse supprimée avec succès.');

    } catch (error) {
        console.error('Error deleting address:', error);
        alert('Failed to delete address. ' + error.message);
    }
}

// Add event listener for the profile update form.  Make sure this matches your HTML.
document.getElementById('profile-form').addEventListener('submit', handleProfileUpdate);

// Load user data when the page loads
document.addEventListener('DOMContentLoaded', loadUserProfile);