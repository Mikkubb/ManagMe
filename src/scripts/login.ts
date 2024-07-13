document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('form-login') as HTMLFormElement;

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const usernameInput = document.getElementById('login-username') as HTMLInputElement;
        const passwordInput = document.getElementById('login-password') as HTMLInputElement;

        const credentials = {
            username: usernameInput.value.trim(),
            password: passwordInput.value.trim()
        };

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('refreshToken', data.refreshToken);
                alert('Login successful!');
                // Przekierowanie na stronę add-project.html
                window.location.href = 'src/pages/add-project.html';
            } else {
                alert('Login failed: ' + response.statusText);
            }
        } catch (error) {
            console.error('Error:', error as Error);
            alert('Login failed: ' + (error as Error).message);
        }
    });
});
