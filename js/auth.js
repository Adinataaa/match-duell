// Authentication functions
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Check if already logged in
    const isLoggedIn = localStorage.getItem('teacherLoggedIn');
    if (isLoggedIn && window.location.pathname.includes('login.html')) {
        goToDashboard();
    }
});

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.querySelector('.btn-login');
    
    // Show loading state
    const originalText = loginBtn.textContent;
    loginBtn.textContent = 'Memproses...';
    loginBtn.disabled = true;
    
    try {
        const result = await apiCall('/login', { username, password });
        
        if (result.success) {
            // Store login state
            localStorage.setItem('teacherLoggedIn', 'true');
            localStorage.setItem('teacherUsername', username);
            localStorage.setItem('authToken', result.token);
            
            // Show success message
            showNotification('Login berhasil!', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                goToDashboard();
            }, 1000);
            
        } else {
            showNotification('Username atau password salah!', 'error');
            loginBtn.textContent = originalText;
            loginBtn.disabled = false;
        }
        
    } catch (error) {
        showNotification('Terjadi kesalahan saat login', 'error');
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;
    }
}

function logout() {
    // Clear all stored data
    localStorage.removeItem('teacherLoggedIn');
    localStorage.removeItem('teacherUsername');
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentRoom');
    localStorage.removeItem('gameState');
    
    showNotification('Logout berhasil', 'success');
    setTimeout(() => {
        goToHome();
    }, 1000);
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add keyframes for animation
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Teacher name display
document.addEventListener('DOMContentLoaded', function() {
    const teacherNameElement = document.getElementById('teacherName');
    if (teacherNameElement) {
        const username = localStorage.getItem('teacherUsername') || 'Guru Matematika';
        teacherNameElement.textContent = username;
    }
});