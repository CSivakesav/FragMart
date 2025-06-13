// ...copy only the JS for login form logic...
// --- Login Page Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('loginError');
            // Demo: username = admin, password = admin
            if (username === 'admin' && password === 'admin') {
                errorDiv.style.display = 'none';
                window.location.href = 'home.html';
            } else {
                errorDiv.textContent = 'Invalid username or password.';
                errorDiv.style.display = 'block';
            }
        });
    }
});

