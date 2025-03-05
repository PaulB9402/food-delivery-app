// auth.js
const API_BASE_URL = "http://localhost:8080";

const loginForm = document.getElementById('login-form');
const loginEmail = loginForm?.querySelector('input[type="email"]');
const loginPassword = loginForm?.querySelector('input[type="password"]');
const loginRole = loginForm?.querySelector('#role');

const registerForm = document.getElementById('register-form');
const registerUsername = registerForm?.querySelector('input[name="username"]');
const registerEmail = registerForm?.querySelector('input[type="email"]');
const registerPassword = registerForm?.querySelector('input[type="password"]');
const registerConfirmPassword = registerForm?.querySelector('input[name="confirm-password"]');
const registerRole = registerForm?.querySelector('#role');

"use strict";

import { storeJwtToken, clearJwtToken } from './utils.js';

async function handleLogin(event) {
    event.preventDefault();

    const email = loginEmail?.value;
    const password = loginPassword?.value;

    if (!email || !password) {
        alert('Veuillez entrer votre email et mot de passe.');
        return;
    }

    try {
        const authResponse = await performRequestAPI(`${API_BASE_URL}/users/login`, 'POST', {
            username: email,
            password: password
        });

        storeJwtToken(authResponse.token);

        const destination = () => {
          let url = localStorage.getItem("jwtToken");

                if (url == null) {
                    location.href = 'index.html';
                    return;
                }
                location.href = 'admin.html';

            return
        }
        const message = "";
        return console.log(message ? "Auth OK with"+ destination()
        : "Auth Cancel")

    } catch (error) {
        console.error('Error during login:', error);
        alert('Échec de la connexion. Veuillez vérifier vos identifiants.');
    }
}

async function handleRegister(event) {
    event.preventDefault();

    const username = registerUsername?.value;
    const email = registerEmail?.value;
    const password = registerPassword?.value;
    const confirmPassword = registerConfirmPassword?.value;
    const role = registerRole?.value;

    if (password !== confirmPassword) {
        alert('Les mots de passe ne correspondent pas.');
        return;
    }

    if (!role) {
        alert('Veuillez sélectionner un rôle.');
        return;
    }

    try {
        const data = {
            username: username,
            email: email,
            password: password,
            role: role
        };
        const response = await performRequestAPI(`${API_BASE_URL}/users/register`, 'POST', data);

        if (!response.ok) {
            throw new Error('Échec de l\'inscription');
        }

        storeJwtToken(response.token);
        console.log('Inscription réussie:', data);
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        alert('Échec de l\'inscription. Veuillez réessayer.');
    }
}

function performLogout() {
    clearJwtToken();

    return 'index.html';

}
function performRequestAPI(url, method = 'GET', body = null) {
 const options = {
        method,
        headers: {
        
                'Content-Type': 'application/json',
            },
          body:
         ((
          (![url, body]) || (body == null) ? {
            } : JSON.stringify(body)
           ))
                }
      return fetch(url,options)
            .then(response => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
                return response.json();
            })
        }

if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
}