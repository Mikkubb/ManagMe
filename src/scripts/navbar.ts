import { checkAuth, decodeToken } from './auth';

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    const userInfo = document.getElementById('user-info') as HTMLSpanElement;
    const logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement;

    const token = localStorage.getItem('token');
    if (token) {
        const payload = decodeToken(token);
        userInfo.textContent = `Logged in as: ${payload.username}`;

        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            window.location.href = '../../index.html';
        });
    } else {
        window.location.href = '../../index.html';
    }
});
