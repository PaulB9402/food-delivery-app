const BASE_URL = "http://localhost:8080";

const loginForm = document.getElementById('login-form');
const loginEmail = loginForm.querySelector('input[type="email"]');
const loginPassword = loginForm.querySelector('input[type="password"]');
const loginRole = loginForm.querySelector('#role');


const registerForm = document.getElementById('register-form');
const registerUsername = registerForm.querySelector('input[name="username"]');
const registerEmail = registerForm.querySelector('input[type="email"]');
const registerPassword = registerForm.querySelector('input[type="password"]');
const registerConfirmPassword = registerForm.querySelector('input[name="confirm-password"]');
const registerRole = registerForm.querySelector('#role');


async function handleLogin(event) {
    event.preventDefault();

    const email = loginEmail.value;
    const password = loginPassword.value;
    const role = loginRole.value;

    if (!role) {
        alert('Veuillez sélectionner un rôle.');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/users/login`, {
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
            throw new Error('Échec de la connexion');
        }

        const data = await response.json();
        const token = data.token;

        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', role);

        switch (role) {
            case 'CLIENT':
                window.location.href = 'index.html';
                break;
            case 'RESTAURANT':
                window.location.href = 'restaurant-dashboard.html';
                break;
            case 'ADMIN':
                window.location.href = 'admin.html';
                break;
            default:
                window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        alert('Échec de la connexion. Veuillez vérifier vos identifiants.');
    }
}
async function handleRegister(event) {
    event.preventDefault();

    const username = registerUsername.value;
    const email = registerEmail.value;
    const password = registerPassword.value;
    const confirmPassword = registerConfirmPassword.value;
    const role = registerRole.value;

    if (password !== confirmPassword) {
        alert('Les mots de passe ne correspondent pas.');
        return;
    }

    if (!role) {
        alert('Veuillez sélectionner un rôle.');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/users/register`, {
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
            throw new Error('Échec de l\'inscription');
        }

        const data = await response.json();
        console.log('Inscription réussie:', data);

        window.location.href = 'login.html';
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        alert('Échec de l\'inscription. Veuillez réessayer.');
    }
}

if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
}