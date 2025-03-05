// utils.js

export function storeJwtToken(token) {
    localStorage.setItem('jwtToken', token);
}

export function clearJwtToken() {
    localStorage.removeItem('jwtToken');
}
export function getJwtToken() {
    return localStorage.getItem('jwtToken');
}