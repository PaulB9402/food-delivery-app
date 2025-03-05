function loadNavbar() {
    fetch('../navbar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('navbar-container').innerHTML = data;
            addNavbarEventListeners();

        })
        .catch(error => console.error('Error loading navbar:', error));
}

function loadFooter() {
    fetch('footer.html')
        .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
          return response.text()
        })
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
}

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
        logoutLink.addEventListener('click', logout);
        }
}

document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
    loadFooter();
});