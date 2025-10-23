// Invite functionality - FIXED
let roomData = {
    roomCode: '',
    roomId: '',
    players: { player1: false, player2: false },
    created: false
};

document.addEventListener('DOMContentLoaded', function() {
    initializeRoom();
    updateRoomDisplay();
    
    // Check for existing room
    const savedRoom = localStorage.getItem('currentRoom');
    if (savedRoom) {
        roomData = JSON.parse(savedRoom);
        updateRoomDisplay();
    }
});

function initializeRoom() {
    // Always create new room when page loads
    roomData.roomCode = 'MATH-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    roomData.roomId = 'room_' + Date.now();
    roomData.created = true;
    roomData.players = { player1: false, player2: false };
    
    // Save to localStorage
    localStorage.setItem('currentRoom', JSON.stringify(roomData));
    localStorage.removeItem('playerRole'); // Reset player role
    
    showNotification('ROOM BARU DIBUAT!', 'success');
    updateRoomDisplay();
}

function updateRoomDisplay() {
    const roomCodeElement = document.getElementById('roomCode');
    const playerCountElement = document.getElementById('playerCount');
    
    if (roomCodeElement) {
        roomCodeElement.textContent = roomData.roomCode;
    }
    
    if (playerCountElement) {
        const joinedPlayers = Object.values(roomData.players).filter(Boolean).length;
        playerCountElement.textContent = `${joinedPlayers}/2`;
    }
}

function copyRoomCode() {
    navigator.clipboard.writeText(roomData.roomCode).then(() => {
        showNotification('KODE ROOM DISALIN!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = roomData.roomCode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('KODE ROOM DISALIN!', 'success');
    });
}

function copyInviteLink() {
    const inviteLink = `${window.location.origin}${window.location.pathname}?room=${roomData.roomCode}`;
    
    navigator.clipboard.writeText(inviteLink).then(() => {
        showNotification('LINK INVITE DISALIN!', 'success');
    }).catch(() => {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = inviteLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('LINK INVITE DISALIN!', 'success');
    });
}

function shareWhatsApp() {
    const message = `🎮 AYO DUEL MATEMATIKA! 🎮\n\nKODE ROOM: ${roomData.roomCode}\nJOIN: ${window.location.origin}${window.location.pathname}?room=${roomData.roomCode}\n\n*Siapa yang jadi juara?* 🏆`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function joinAsPlayer1() {
    if (roomData.players.player1) {
        showNotification('PLAYER 1 SUDAH ADA!', 'error');
        return;
    }
    
    roomData.players.player1 = true;
    localStorage.setItem('currentRoom', JSON.stringify(roomData));
    localStorage.setItem('playerRole', 'player1');
    updateRoomDisplay();
    showNotification('JOIN SEBAGAI PLAYER 1!', 'success');
    
    // Initialize game state
    initializeGameState();
    
    // Auto redirect after 1 second
    setTimeout(() => {
        window.location.href = 'player1.html';
    }, 1000);
}

function joinAsPlayer2() {
    if (roomData.players.player2) {
        showNotification('PLAYER 2 SUDAH ADA!', 'error');
        return;
    }
    
    roomData.players.player2 = true;
    localStorage.setItem('currentRoom', JSON.stringify(roomData));
    localStorage.setItem('playerRole', 'player2');
    updateRoomDisplay();
    showNotification('JOIN SEBAGAI PLAYER 2!', 'success');
    
    // Initialize game state
    initializeGameState();
    
    // Auto redirect after 1 second
    setTimeout(() => {
        window.location.href = 'player2.html';
    }, 1000);
}

function initializeGameState() {
    const initialGameState = {
        currentQuestion: "5 + 3 = ?",
        currentAnswer: 8,
        scores: { player1: 0, player2: 0 },
        currentTurn: 'player1', // Player 1 starts
        gameActive: true,
        roomCode: roomData.roomCode
    };
    localStorage.setItem('gameState', JSON.stringify(initialGameState));
}

function startDuel() {
    // Check if at least one player has joined
    const joinedPlayers = Object.values(roomData.players).filter(Boolean).length;
    if (joinedPlayers === 0) {
        showNotification('PIlih peran dulu!', 'error');
        return;
    }
    
    // Initialize game state
    initializeGameState();
    
    showNotification('DUEL DIMULAI!', 'success');
    
    // Redirect based on player role
    const playerRole = localStorage.getItem('playerRole');
    setTimeout(() => {
        if (playerRole === 'player1') {
            window.location.href = 'player1.html';
        } else if (playerRole === 'player2') {
            window.location.href = 'player2.html';
        } else {
            // If no role selected, go to player1
            window.location.href = 'player1.html';
        }
    }, 1500);
}

// Handle URL parameters for room joining
function handleUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const roomCode = urlParams.get('room');
    
    if (roomCode) {
        // Join existing room
        roomData.roomCode = roomCode;
        roomData.created = true;
        updateRoomDisplay();
        showNotification(`JOIN ROOM: ${roomCode}`, 'success');
    }
}

// Initialize URL parameter handling
document.addEventListener('DOMContentLoaded', handleUrlParams);
