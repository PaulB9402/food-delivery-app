// common.js
const BASE_URL = "http://localhost:8080"; // Keep this here

function loadNavbar() {
    fetch('navbar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            // Instead of directly manipulating the DOM, dispatch a custom event
            const navbarLoaded = new CustomEvent('navbarLoaded', { detail: data });
            document.dispatchEvent(navbarLoaded);
        })
        .catch(error => console.error('Error loading navbar:', error));
}

function loadFooter() {
    fetch('footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            // Dispatch a custom event for footerLoaded
            const footerLoaded = new CustomEvent('footerLoaded', { detail: data });
            document.dispatchEvent(footerLoaded);
        })
        .catch(error => console.error('Error loading footer:', error));
}

// Centralized event listener setup
function setupEventListeners() {
    document.addEventListener('navbarLoaded', (event) => {
        document.getElementById('navbar-container').innerHTML = event.detail;
        addNavbarEventListeners(); // Add event listeners *after* navbar is in DOM
    });

    document.addEventListener('footerLoaded', (event) => {
        document.getElementById('footer-container').innerHTML = event.detail;
    });
}
// Put addNavbarEventListeners here, inside common.js, to avoid repetition
function addNavbarEventListeners() {
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const searchTerm = this.querySelector('input[name="search"]').value;
            window.location.href = `restaurant.html?search=${encodeURIComponent(searchTerm)}`;
        });
    }

    const logoutLink = document.querySelector('a[href="#"][onclick="logout()"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault();
            logout();
        });
    }
}

function isLoggedIn() {
    return localStorage.getItem('authToken') !== null && localStorage.getItem('userId') !== null;
}

function requireAuth() { //Removed default path

    if (!isLoggedIn()) {
      let redirectPath;
      // Get the current path
      const currentPath = window.location.pathname;

      // Determine the correct redirect path based on current location
      if (currentPath.includes('/views/')) {
          redirectPath = 'auth/login.html'; // From views
      } else {
          redirectPath = 'views/auth/login.html'; // From root
      }
      window.location.href = redirectPath;
    }
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    // Determine the correct redirect path based on current location
      let redirectPath;
      const currentPath = window.location.pathname;
      if(currentPath.includes("/views/auth/")){
        redirectPath = 'login.html'; //already in auth
      }
      else if (currentPath.includes('/views/')) {
          redirectPath = 'auth/login.html'; // From views
      }
      else {
          redirectPath = 'views/auth/login.html'; // From root
      }
    window.location.href = redirectPath
}
// Call setupEventListeners *once* when the script loads
setupEventListeners();
// Load navbar and footer. These will dispatch events.
loadNavbar();
loadFooter();