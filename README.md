# Food Delivery App

## Overview
The backend of the Food Delivery App is built using Spring Boot and Gradle. It provides RESTful APIs for managing food orders, users, and restaurants.

## Prerequisites
- Java 11 or higher
- Gradle 6.8 or higher
- Spring Boot 2.5 or higher

## Getting Started

### Clone the Repository
```bash
git clone https://github.com/yourusername/food-delivery-app.git
cd food-delivery-app/backend
```

### Build the Project
To build the project, run the following command:
```bash
cd deliveryApp
./gradlew build
```

### Run the Application
To run the application, use the following command:
```bash
./gradlew bootRun
```

The application will start on `http://localhost:8080`.

## Side Note
Project backend security has been deactivated ! See gradlew.bat and seek a commented line to re-enable it.

## Project Structure
- `src/main/java`: Contains the Java source files.
- `src/main/resources`: Contains the application configuration files.
- `build.gradle`: The Gradle build file.

## Configuration
The application can be configured using the `application.properties` file located in the `src/main/resources` directory.

## API Documentation

### Guide des Endpoints et Exemples de Code pour le Frontend

Voici un guide des endpoints disponibles dans votre application backend, ainsi que des exemples de code pour les appeler depuis le frontend.

#### 1. **UserController**

##### Endpoints

- **Enregistrement d'un utilisateur**
  - **Méthode** : `POST`
  - **URL** : `/users/register`
  - **Description** : Enregistre un nouvel utilisateur.
  - **Exemple de requête** :
    ```json
    {
      "username": "john_doe",
      "email": "john@example.com",
      "password": "password123",
      "role": "CUSTOMER"
    }
    ```

- **Connexion d'un utilisateur**
  - **Méthode** : `POST`
  - **URL** : `/users/login`
  - **Description** : Connecte un utilisateur et retourne un token JWT.
  - **Exemple de requête** :
    ```json
    {
      "username": "john_doe",
      "password": "password123"
    }
    ```

##### Exemple de Code Frontend

```javascript
async function registerUser(user) {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    return response.json();
}

async function loginUser(user) {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    return data;
}
```

#### 2. **RestaurantController**

##### Endpoints

- **Créer un restaurant**
  - **Méthode** : `POST`
  - **URL** : `/restaurants`
  - **Description** : Crée un nouveau restaurant.
  - **Exemple de requête** :
    ```json
    {
      "name": "La Belle Pizza",
      "address": "123 Rue de Paris",
      "phone": "0123456789",
      "deliveryConstraints": "None",
      "userId": 1
    }
    ```

- **Obtenir les restaurants par utilisateur**
  - **Méthode** : `GET`
  - **URL** : `/restaurants/user/{userId}`
  - **Description** : Récupère les restaurants associés à un utilisateur.

##### Exemple de Code Frontend

```javascript
async function createRestaurant(restaurant) {
    const response = await fetch(`${API_BASE_URL}/restaurants`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(restaurant)
    });
    return response.json();
}

async function getRestaurantsByUser(userId) {
    const response = await fetch(`${API_BASE_URL}/restaurants/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    return response.json();
}
```

#### 3. **MenuController**

##### Endpoints

- **Créer un menu**
  - **Méthode** : `POST`
  - **URL** : `/menus`
  - **Description** : Crée un nouveau menu pour un restaurant.
  - **Exemple de requête** :
    ```json
    {
      "name": "Menu du Jour",
      "restaurantId": 1
    }
    ```

- **Ajouter un item de nourriture à un menu**
  - **Méthode** : `POST`
  - **URL** : `/menus/{menuId}/add-food-item/{foodItemId}`
  - **Description** : Ajoute un item de nourriture à un menu.

##### Exemple de Code Frontend

```javascript
async function createMenu(menu) {
    const response = await fetch(`${API_BASE_URL}/menus`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(menu)
    });
    return response.json();
}

async function addFoodItemToMenu(menuId, foodItemId) {
    const response = await fetch(`${API_BASE_URL}/menus/${menuId}/add-food-item/${foodItemId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    return response.json();
}
```

#### 4. **FoodItemController**

##### Endpoints

- **Créer un item de nourriture**
  - **Méthode** : `POST`
  - **URL** : `/food-items`
  - **Description** : Crée un nouvel item de nourriture.
  - **Exemple de requête** :
    ```json
    {
      "name": "Pizza Margherita",
      "description": "Tomate, mozzarella, basilic",
      "price": 12.99,
      "photos": "margherita1.jpg,margherita2.jpg",
      "restaurantId": 1
    }
    ```

- **Rechercher des items de nourriture**
  - **Méthode** : `GET`
  - **URL** : `/food-items/search`
  - **Description** : Recherche des items de nourriture par nom, description ou restaurant.

##### Exemple de Code Frontend

```javascript
async function createFoodItem(foodItem) {
    const response = await fetch(`${API_BASE_URL}/food-items`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(foodItem)
    });
    return response.json();
}

async function searchFoodItems(query) {
    const response = await fetch(`${API_BASE_URL}/food-items/search?name=${query.name}&description=${query.description}&restaurantId=${query.restaurantId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    return response.json();
}
```

#### 5. **OrderController**

##### Endpoints

- **Créer une commande**
  - **Méthode** : `POST`
  - **URL** : `/orders`
  - **Description** : Crée une nouvelle commande.
  - **Exemple de requête** :
    ```json
    {
      "customerId": 1,
      "restaurantId": 1,
      "orderItems": [
        {
          "foodItemId": 1,
          "quantity": 2,
          "customization": "Extra cheese"
        }
      ]
    }
    ```

- **Obtenir les commandes par client**
  - **Méthode** : `GET`
  - **URL** : `/orders/customer/{customerId}`
  - **Description** : Récupère les commandes passées par un client.

##### Exemple de Code Frontend

```javascript
async function createOrder(order) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(order)
    });
    return response.json();
}

async function getOrdersByCustomer(customerId) {
    const response = await fetch(`${API_BASE_URL}/orders/customer/${customerId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    return response.json();
}
```

#### 6. **DeliveryController**

##### Endpoints

- **Créer une livraison**
  - **Méthode** : `POST`
  - **URL** : `/deliveries`
  - **Description** : Crée une nouvelle livraison.
  - **Exemple de requête** :
    ```json
    {
      "orderId": 1,
      "deliveryPersonId": 2,
      "status": "PENDING"
    }
    ```

- **Obtenir une livraison par ID**
  - **Méthode** : `GET`
  - **URL** : `/deliveries/{id}`
  - **Description** : Récupère une livraison par son ID.

##### Exemple de Code Frontend

```javascript
async function createDelivery(delivery) {
    const response = await fetch(`${API_BASE_URL}/deliveries`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(delivery)
    });
    return response.json();
}

async function getDeliveryById(deliveryId) {
    const response = await fetch(`${API_BASE_URL}/deliveries/${deliveryId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    return response.json();
}
```

### Conclusion

Ce guide fournit un aperçu des principaux endpoints disponibles dans votre application backend et des exemples de code pour les appeler depuis le frontend. Assurez-vous d'adapter les URLs et les données en fonction de vos besoins spécifiques.

API documentation is available at `http://localhost:8080/swagger-ui.html` once the application is running.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.