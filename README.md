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

### API Documentation

### Guide of Endpoints and Code Examples for the Frontend

Here is a guide of the available endpoints in your backend application, along with code examples to call them from the frontend.

#### 1. **UserController**

##### Endpoints

- **Register a user**
  - **Method**: `POST`
  - **URL**: `/users/register`
  - **Description**: Registers a new user.
  - **Request Example**:
    ```json
    {
      "username": "john_doe",
      "email": "john@example.com",
      "password": "password123",
      "role": "CUSTOMER"
    }
    ```

- **Login a user**
  - **Method**: `POST`
  - **URL**: `/users/login`
  - **Description**: Logs in a user and returns a JWT token.
  - **Request Example**:
    ```json
    {
      "username": "john_doe",
      "password": "password123"
    }
    ```

##### Frontend Code Example

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

- **Create a restaurant**
  - **Method**: `POST`
  - **URL**: `/restaurants`
  - **Description**: Creates a new restaurant.
  - **Request Example**:
    ```json
    {
      "name": "La Belle Pizza",
      "address": "123 Rue de Paris",
      "phone": "0123456789",
      "deliveryConstraints": "None",
      "userId": 1
    }
    ```

- **Get restaurants by user**
  - **Method**: `GET`
  - **URL**: `/restaurants/user/{userId}`
  - **Description**: Retrieves the restaurants associated with a user.

##### Frontend Code Example

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

- **Create a menu**
  - **Method**: `POST`
  - **URL**: `/menus`
  - **Description**: Creates a new menu for a restaurant.
  - **Request Example**:
    ```json
    {
      "name": "Menu du Jour",
      "restaurantId": 1
    }
    ```

- **Add a food item to a menu**
  - **Method**: `POST`
  - **URL**: `/menus/{menuId}/add-food-item/{foodItemId}`
  - **Description**: Adds a food item to a menu.

- **Get menus by restaurant**
  - **Method**: `GET`
  - **URL**: `/menus/restaurant/{restaurantId}`
  - **Description**: Retrieves the menus associated with a restaurant.

##### Frontend Code Example

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

async function getMenusByRestaurant(restaurantId) {
    const response = await fetch(`${API_BASE_URL}/menus/restaurant/${restaurantId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    return response.json();
}
```

#### 4. **FoodItemController**

##### Endpoints

- **Create a food item**
  - **Method**: `POST`
  - **URL**: `/food-items`
  - **Description**: Creates a new food item.
  - **Request Example**:
    ```json
    {
      "name": "Pizza Margherita",
      "description": "Tomato, mozzarella, basil",
      "price": 12.99,
      "photos": "margherita1.jpg,margherita2.jpg",
      "restaurantId": 1
    }
    ```

- **Search food items**
  - **Method**: `GET`
  - **URL**: `/food-items/search`
  - **Description**: Searches for food items by name, description, or restaurant.

##### Frontend Code Example

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

- **Create an order**
  - **Method**: `POST`
  - **URL**: `/orders`
  - **Description**: Creates a new order.
  - **Request Example**:
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

- **Get orders by customer**
  - **Method**: `GET`
  - **URL**: `/orders/customer/{customerId}`
  - **Description**: Retrieves the orders placed by a customer.

- **Get orders by restaurant**
  - **Method**: `GET`
  - **URL**: `/orders/restaurant/{restaurantId}`
  - **Description**: Retrieves the orders associated with a restaurant.

- **Place an order**
  - **Method**: `POST`
  - **URL**: `/orders/place`
  - **Description**: Places an order from the user's cart.

- **Pay for an order**
  - **Method**: `POST`
  - **URL**: `/orders/pay`
  - **Description**: Processes the payment for an order.

##### Frontend Code Example

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

async function placeOrder() {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');

    if (!authToken || !userId) {
        alert("You must be logged in to place an order.");
        window.location.href = 'login.html'; // Redirect to login
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/orders/place`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ userId: parseInt(userId) })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error placing order.");
        }

        const newOrder = await response.json();
        alert(`Order placed successfully! Order number: ${newOrder.id}`);
        clearCart();  // Clear the cart after successful order.
        // Redirect to the orders page to show the new order.
        window.location.href = 'orders.html';

    } catch (error) {
        console.error('Error placing order:', error);
        alert('Failed to place order. ' + error.message);
    }
}

async function payOrder(orderId, paymentDetails) {
    const authToken = localStorage.getItem('authToken');

    try {
        const response = await fetch(`${API_BASE_URL}/orders/pay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ orderId, paymentDetails })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error processing payment.");
        }

        alert('Payment successful!');
        // Redirect to the orders page or show a success message
    } catch (error) {
        console.error('Error processing payment:', error);
        alert('Failed to process payment. ' + error.message);
    }
}
```

#### 6. **DeliveryController**

##### Endpoints

- **Assign a delivery**
  - **Method**: `POST`
  - **URL**: `/deliveries/assign`
  - **Description**: Assigns a delivery person to an order.
  - **Request Example**:
    ```json
    {
      "orderId": 1,
      "deliveryPersonId": 2
    }
    ```

- **Update delivery status**
  - **Method**: `POST`
  - **URL**: `/deliveries/update-status`
  - **Description**: Updates the status of a delivery.
  - **Request Example**:
    ```json
    {
      "deliveryId": 1,
      "status": "IN_PROGRESS"
    }
    ```

- **Get delivery by ID**
  - **Method**: `GET`
  - **URL**: `/deliveries/{id}`
  - **Description**: Retrieves a delivery by its ID.

##### Frontend Code Example

```javascript
async function assignDelivery(orderId, deliveryPersonId) {
    const response = await fetch(`${API_BASE_URL}/deliveries/assign`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ orderId, deliveryPersonId })
    });
    return response.json();
}

async function updateDeliveryStatus(deliveryId, status) {
    const response = await fetch(`${API_BASE_URL}/deliveries/update-status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ deliveryId, status })
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

#### 7. **ReviewController**

##### Endpoints

- **Create a review**
  - **Method**: `POST`
  - **URL**: `/reviews`
  - **Description**: Creates a new review.
  - **Request Example**:
    ```json
    {
      "customerId": 1,
      "restaurantId": 1,
      "deliveryId": 1,
      "foodItemId": 1,
      "rating": 5,
      "comment": "Great food!"
    }
    ```

- **Get reviews by restaurant**
  - **Method**: `GET`
  - **URL**: `/reviews/restaurant/{restaurantId}`
  - **Description**: Retrieves reviews for a restaurant.

- **Get reviews by delivery**
  - **Method**: `GET`
  - **URL**: `/reviews/delivery/{deliveryId}`
  - **Description**: Retrieves reviews for a delivery.

- **Get reviews by food item**
  - **Method**: `GET`
  - **URL**: `/reviews/food-item/{foodItemId}`
  - **Description**: Retrieves reviews for a food item.

##### Frontend Code Example

```javascript
async function createReview(review) {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(review)
    });
    return response.json();
}

async function getReviewsByRestaurant(restaurantId) {
    const response = await fetch(`${API_BASE_URL}/reviews/restaurant/${restaurantId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    return response.json();
}

async function getReviewsByDelivery(deliveryId) {
    const response = await fetch(`${API_BASE_URL}/reviews/delivery/${deliveryId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    return response.json();
}

async function getReviewsByFoodItem(foodItemId) {
    const response = await fetch(`${API_BASE_URL}/reviews/food-item/${foodItemId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    return response.json();
}
```

### Conclusion

This guide provides an overview of the main endpoints available in your backend application and examples of code to call them from the frontend. Make sure to adapt the URLs and data according to your specific needs.

API documentation is available at `http://localhost:8080/swagger-ui.html` once the application is running.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.