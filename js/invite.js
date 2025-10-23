// Invite functionality
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

async function initializeRoom() {
    if (!roomData.created) {
        // Generate room code
        roomData.roomCode = 'MATH-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        roomData.roomId = 'room_' + Date.now();
        roomData.created = true;
        
        // Save to localStorage
        localStorage.setItem('currentRoom', JSON.stringify(roomData));
        
        showNotification('Room berhasil dibuat!', 'success');
    }
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
        showNotification('Kode room berhasil disalin!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = roomData.roomCode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Kode room berhasil disalin!', 'success');
    });
}

function copyInviteLink() {
    const inviteLink = `${window.location.origin}${window.location.pathname}?room=${roomData.roomCode}`;
    
    navigator.clipboard.writeText(inviteLink).then(() => {
        showNotification('Link invite berhasil disalin!', 'success');
    }).catch(() => {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = inviteLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Link invite berhasil disalin!', 'success');
    });
}

function shareWhatsApp() {
    const message = `Hai! Ayo duel matematika bersama! 🎯\n\nKode Room: ${roomData.roomCode}\nJoin di: ${window.location.origin}${window.location.pathname}?room=${roomData.roomCode}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function joinAsPlayer1() {
    roomData.players.player1 = true;
    localStorage.setItem('currentRoom', JSON.stringify(roomData));
    localStorage.setItem('playerRole', 'player1');
    updateRoomDisplay();
    showNotification('Bergabung sebagai Player 1!', 'success');
    
    // Auto redirect after 1 second
    setTimeout(() => {
        goToPlayer1();
    }, 1000);
}

function joinAsPlayer2() {
    roomData.players.player2 = true;
    localStorage.setItem('currentRoom', JSON.stringify(roomData));
    localStorage.setItem('playerRole', 'player2');
    updateRoomDisplay();
    showNotification('Bergabung sebagai Player 2!', 'success');
    
    // Auto redirect after 1 second
    setTimeout(() => {
        goToPlayer2();
    }, 1000);
}

function startDuel() {
    // Initialize game state if not exists
    const existingState = localStorage.getItem('gameState');
    if (!existingState) {
        const initialGameState = {
            currentQuestion: "5 + 3 = ?",
            currentAnswer: 8,
            scores: { player1: 0, player2: 0 },
            currentTurn: 'player2',
            gameActive: true
        };
        localStorage.setItem('gameState', JSON.stringify(initialGameState));
    }
    
    showNotification('Duel dimulai!', 'success');
    
    // Redirect to player 1 by default
    setTimeout(() => {
        goToPlayer1();
    }, 1500);
}

// Handle URL parameters for room joining
function handleUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const roomCode = urlParams.get('room');
    
    if (roomCode) {
        // In real app, this would validate room code with server
        roomData.roomCode = roomCode;
        roomData.created = true;
        updateRoomDisplay();
        showNotification(`Bergabung ke room: ${roomCode}`, 'success');
    }
}

// Initialize URL parameter handling
document.addEventListener('DOMContentLoaded', handleUrlParams);