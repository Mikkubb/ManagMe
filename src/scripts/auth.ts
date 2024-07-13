export function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../../index.html';
    }
}

export function decodeToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
}
