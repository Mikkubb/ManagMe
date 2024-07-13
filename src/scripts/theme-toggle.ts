const themeToggleBtn = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const navbar = document.getElementById('navbar');

const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    if (navbar) navbar.classList.add('dark-theme');
} else if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
    if (navbar) navbar.classList.add('light-theme');
} else {
    if (prefersDarkScheme.matches) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
    }
    if (navbar) {
        navbar.classList.add(document.body.classList.contains('dark-theme') ? 'dark-theme' : 'light-theme');
    }
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
            if (navbar) {
                navbar.classList.remove('dark-theme');
                navbar.classList.add('light-theme');
            }
        } else {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
            if (navbar) {
                navbar.classList.remove('light-theme');
                navbar.classList.add('dark-theme');
            }
        }
    });
} else {
    console.error('Theme toggle button not found!');
}
