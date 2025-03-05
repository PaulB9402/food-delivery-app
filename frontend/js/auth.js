const API_BASE_URL = "http://localhost:8080";

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

"use strict";

import { storeJwtToken, clearJwtToken } from './utils.js';

async function handleLogin(event) {
    event.preventDefault();

    const email = document.querySelector('#login-form input[type="email"]').value;
    const password = document.querySelector('#login-form input[type="password"]').value;
    const role = document.querySelector('#login-form #role').value;

    if (!email || !password) {
        alert('Veuillez entrer votre email et mot de passe.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: email,
                password: password,
                role: role,
            }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.message || 'Échec de la connexion';
          throw new Error(errorMessage);
        }

        const data = await response.json();
        const token = data.token;
        const userId = data.userId;


        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', role);
        localStorage.setItem('userId', userId);


        switch (role) {
            case 'CLIENT':
                window.location.href = '../home.html';
                break;
            case 'RESTAURANT':
                window.location.href = '../restaurant-dashboard.html';
                break;
            case 'ADMIN':
                window.location.href = '../admin.html';
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
    const username = document.querySelector('#register-form input[name="firstName"]').value +" "+ document.querySelector('#register-form input[name="lastName"]').value;
    const email = document.querySelector('#register-form input[type="email"]').value;
    const password = document.querySelector('#register-form input[type="password"]').value;
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
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                role: role,
            }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.message || "Échec de l'inscription";
          throw new Error(errorMessage);
        }

        storeJwtToken(response.token);
        console.log('Inscription réussie:', data);
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        document.getElementById('registration-error').textContent = error.message;
        document.getElementById('registration-error').style.display = 'block';
    }
}

if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    window.location.href = 'login.html';
}

