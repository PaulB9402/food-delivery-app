const BASE_URL = "http://localhost:8080"; // Keep this here

function loadNavbar() {
    fetch('../navbar.html') // Adjust path if needed
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('navbar-container').innerHTML = data;
            setupEventListeners(); // Add event listeners after navbar is in DOM
        })
        .catch(error => console.error('Error loading navbar:', error));
}

function loadFooter() {
    fetch('../footer.html') // Adjust path if needed
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
}

function setupEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
        const searchForm = document.getElementById('searchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', function (event) {
                event.preventDefault();
                const searchTerm = this.querySelector('input[name="search"]').value;
                window.location.href = `restaurant.html?search=${encodeURIComponent(searchTerm)}`;
            });
        }

        const logoutLink = document.querySelector('a[href="#"][onclick="logout()"]');
        if (logoutLink) {
            logoutLink.addEventListener('click', function (event) {
                event.preventDefault();
                logout();
            });
        }
    });
}

function isLoggedIn() {
    return localStorage.getItem('authToken') !== null && localStorage.getItem('userId') !== null;
}

function requireAuth() {
    const currentPath = window.location.pathname;

    // Check if the current path is the login page
    if (currentPath.includes('login.html')) {
        return; // Do not redirect if already on the login page
    }

    if (!isLoggedIn()) {
        let redirectPath;
        if (currentPath.includes('/views/')) {
            redirectPath = 'auth/login.html';
        } else {
            redirectPath = 'views/auth/login.html';
        }
        window.location.href = redirectPath;
    }
}

// Load navbar and footer only when the page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    loadNavbar();
    loadFooter();
    requireAuth();
});


function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');

    let redirectPath;
    const currentPath = window.location.pathname;
    if (currentPath.includes("/views/auth/")) {
        redirectPath = 'login.html';
    } else if (currentPath.includes('/views/')) {
        redirectPath = 'auth/login.html';
    } else {
        redirectPath = 'views/auth/login.html';
    }
    window.location.href = redirectPath;
}

// Load navbar and footer only when the page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    loadNavbar();
    loadFooter();
    requireAuth();
});
