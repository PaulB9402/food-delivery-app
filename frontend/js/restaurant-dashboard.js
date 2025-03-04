const orders = [
    {
        id: 1,
        customerName: "Jean Dupont",
        items: [
            { name: "Pizza Margherita", quantity: 2, price: 12.99 },
            { name: "Coca-Cola", quantity: 1, price: 2.50 },
        ],
        total: 28.48,
        status: "En attente",
    },
];

const customers = [
    { id: 1, name: "Jean Dupont" },
    { id: 2, name: "Marie Curie" },
];

function loadOrders() {
    const ordersList = document.getElementById('orders-list');
    ordersList.innerHTML = '';

    orders.forEach(order => {
        const card = `
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Commande #${order.id}</h5>
                        <p class="card-text">Client: ${order.customerName}</p>
                        <p class="card-text">Total: ${order.total}€</p>
                        <p class="card-text">Statut: ${order.status}</p>
                        <button class="btn btn-danger" onclick="viewOrderDetails(${order.id})">Voir les détails</button>
                    </div>
                </div>
            </div>
        `;
        ordersList.innerHTML += card;
    });
}

function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    const orderDetails = document.getElementById('order-details');

    let itemsHtml = '';
    order.items.forEach(item => {
        itemsHtml += `
            <div class="mb-3">
                <p><strong>${item.name}</strong> (x${item.quantity}) - ${item.price}€</p>
            </div>
        `;
    });

    orderDetails.innerHTML = `
        <p><strong>Client:</strong> ${order.customerName}</p>
        <p><strong>Total:</strong> ${order.total}€</p>
        <h6>Articles commandés:</h6>
        ${itemsHtml}
    `;

    new bootstrap.Modal(document.getElementById('orderDetailsModal')).show();
}

document.getElementById('accept-order').addEventListener('click', () => {
    alert('Commande acceptée !');
});

document.getElementById('reject-order').addEventListener('click', () => {
    alert('Commande refusée !');
});

document.getElementById('request-info').addEventListener('click', () => {
    alert('Demande d\'informations envoyée au client.');
});

document.getElementById('send-message-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const recipient = document.getElementById('message-recipient').value;
    const message = document.querySelector('#send-message-form textarea').value;

    alert(`Message envoyé à ${recipient}: ${message}`);
});

function loadCustomers() {
    const recipientSelect = document.getElementById('message-recipient');
    customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.id;
        option.textContent = customer.name;
        recipientSelect.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    loadCustomers();
});