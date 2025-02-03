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
API documentation is available at `http://localhost:8080/swagger-ui.html` once the application is running.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.