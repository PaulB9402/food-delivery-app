const API_BASE_URL = "http://localhost:8080";

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

"use strict";

function requireAuth() {
    const authToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    if (!authToken || !userRole || !userId) {
        window.location.href = '../auth/login.html';
    }
}

async function handleLogin(event) {
    event.preventDefault();

    const email = document.querySelector('#login-form input[name="email"]').value;
    const password = document.querySelector('#login-form input[name="password"]').value;
    const role = document.querySelector('#login-form #role').value;

    if (!email || !password) {
        alert('Veuillez entrer votre email et mot de passe.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: email, password, role }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || 'Échec de la connexion';
            throw new Error(errorMessage);
        }

        const data = await response.json();

        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userRole', role);
        localStorage.setItem('userId', data.userId);

        switch (role) {
            case 'CLIENT':
                window.location.href = '../home.html';
                break;
            case 'RESTAURANT':
                window.location.href = '../restaurant-dashboard.html';
                break;
            case 'ADMIN':
                window.location.href = '../admin/admin.html';
                break;
            case 'DELIVERY':
                window.location.href = '../delivery-dashboard.html';
                break;
            default:
                window.location.href = '../home.html';
        }
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        document.getElementById('login-error').textContent = error.message;
        document.getElementById('login-error').style.display = 'block';
    }
}

async function handleRegister(event) {
    event.preventDefault();

    const username = document.querySelector('#register-form input[name="username"]').value;
    const email = document.querySelector('#register-form input[name="email"]').value;
    const password = document.querySelector('#register-form input[name="password"]').value;
    const confirmPassword = document.querySelector('#register-form input[name="confirmPassword"]').value;
    const role = document.querySelector('#register-form #role').value;

    if (password !== confirmPassword) {
        alert('Les mots de passe ne correspondent pas.');
        return;
    }

    if (!role) {
        alert('Veuillez sélectionner un rôle.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, role }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Échec de l'inscription");
        }

        console.log('Inscription réussie');
        window.location.href = 'login.html';
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        document.getElementById('registration-error').textContent = error.message;
        document.getElementById('registration-error').style.display = 'block';
    }
}

function logout() {
    // Supprimer les éléments du localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');

    // Rediriger vers la page de connexion
    window.location.href = '../auth/login.html';
}

if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
}

export { requireAuth, logout };