// Navigation functions for all pages
function goToHome() {
    window.location.href = 'index.html';
}

function goToLogin() {
    window.location.href = 'login.html';
}

function goToDashboard() {
    window.location.href = 'dashboard.html';
}

function goToInvite() {
    window.location.href = 'invite.html';
}

function goToPlayer1() {
    window.location.href = 'player1.html';
}

function goToPlayer2() {
    window.location.href = 'player2.html';
}

function startAsPlayer() {
    // For demo, directly go to player selection
    goToInvite();
}

// Check if user is logged in (for protected pages)
function checkAuth() {
    const isLoggedIn = localStorage.getItem('teacherLoggedIn');
    if (!isLoggedIn && window.location.pathname.includes('dashboard.html')) {
        goToLogin();
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    // Add loading animation
    const container = document.querySelector('.container');
    if (container) {
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            container.style.opacity = '1';
        }, 100);
    }
});

// Utility function for API calls (simulated)
async function apiCall(endpoint, data = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock responses based on endpoint
    switch(endpoint) {
        case '/login':
            if (data.username === 'guru' && data.password === 'guru1234') {
                return { success: true, token: 'mock-jwt-token' };
            } else {
                return { success: false, error: 'Invalid credentials' };
            }
            
        case '/create-room':
            return { 
                success: true, 
                roomCode: 'MATH-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
                roomId: 'room_' + Date.now()
            };
            
        case '/join-room':
            return { success: true, playerId: data.playerType };
            
        default:
            return { success: true, data: {} };
    }
}