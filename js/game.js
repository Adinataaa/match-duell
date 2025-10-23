// Game logic for player pages - FIXED
let gameState = {
    currentQuestion: "5 + 3 = ?",
    currentAnswer: 8,
    scores: { player1: 0, player2: 0 },
    currentTurn: 'player1',
    gameActive: true,
    roomCode: ''
};

let currentPlayer = '';

function initializeGame(playerId) {
    currentPlayer = playerId;
    loadGameState();
    updateGameDisplay();
    
    // Start real-time updates simulation
    setInterval(simulateGameUpdates, 1000);
    
    console.log('Game initialized for:', playerId);
    console.log('Current game state:', gameState);
}

function loadGameState() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const parsedState = JSON.parse(savedState);
        gameState = { ...gameState, ...parsedState };
    }
}

function saveGameState() {
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

function updateGameDisplay() {
    // Update scores
    const scorePlayer1Element = document.getElementById('scorePlayer1');
    const scorePlayer2Element = document.getElementById('scorePlayer2');
    
    if (scorePlayer1Element) scorePlayer1Element.textContent = gameState.scores.player1;
    if (scorePlayer2Element) scorePlayer2Element.textContent = gameState.scores.player2;
    
    // Update question
    const questionElement = document.getElementById('currentQuestion');
    if (questionElement) questionElement.textContent = gameState.currentQuestion;
    
    // Update turn indicator and button state
    const turnIndicator = document.getElementById('turnIndicator');
    const submitBtn = document.getElementById('submitBtn');
    
    if (turnIndicator && submitBtn) {
        const isMyTurn = gameState.currentTurn === currentPlayer;
        
        if (isMyTurn) {
            turnIndicator.textContent = '🎯 GILIRAN ANDA!';
            turnIndicator.style.color = '#4ecdc4';
            submitBtn.disabled = false;
            submitBtn.textContent = '🚀 JAWAB!';
            submitBtn.style.background = '#4ecdc4';
        } else {
            const otherPlayer = currentPlayer === 'player1' ? 'Player 2' : 'Player 1';
            turnIndicator.textContent = `⏳ MENUNGGU ${otherPlayer}`;
            turnIndicator.style.color = '#ffe66d';
            submitBtn.disabled = true;
            submitBtn.textContent = '⏳ TUNGGU';
            submitBtn.style.background = '#636e72';
        }
    }
    
    // Update active player highlight
    const playerElements = document.querySelectorAll('.score-player');
    playerElements.forEach(element => {
        element.classList.remove('active');
    });
    
    if (gameState.currentTurn === 'player1') {
        document.querySelector('.score-player:nth-child(1)')?.classList.add('active');
    } else {
        document.querySelector('.score-player:nth-child(3)')?.classList.add('active');
    }
    
    // Check for winner
    if (!gameState.gameActive) {
        setTimeout(showWinner, 500);
    }
}

// Calculator functions
function appendToDisplay(value) {
    if (!gameState.gameActive || gameState.currentTurn !== currentPlayer) return;
    
    const display = document.getElementById('answerDisplay');
    display.value += value;
}

function clearDisplay() {
    const display = document.getElementById('answerDisplay');
    display.value = '';
}

function calculate() {
    if (!gameState.gameActive || gameState.currentTurn !== currentPlayer) return;
    
    const display = document.getElementById('answerDisplay');
    try {
        let expression = display.value.replace(/×/g, '*').replace(/÷/g, '/');
        display.value = eval(expression);
    } catch (error) {
        display.value = 'ERROR';
    }
}

function submitAnswer() {
    if (!gameState.gameActive || gameState.currentTurn !== currentPlayer) {
        showNotification('BUKAN GILIRAN ANDA!', 'error');
        return;
    }
    
    const display = document.getElementById('answerDisplay');
    const userAnswer = parseFloat(display.value);
    
    if (isNaN(userAnswer)) {
        showNotification('MASUKKAN JAWABAN!', 'error');
        return;
    }
    
    if (userAnswer === gameState.currentAnswer) {
        // Correct answer
        gameState.scores[currentPlayer] += 10;
        
        // Check for winner
        if (gameState.scores[currentPlayer] >= 100) {
            gameState.gameActive = false;
            showNotification('🎉 ANDA MENANG!', 'success');
            setTimeout(showWinner, 1000);
        } else {
            // Switch turn
            gameState.currentTurn = currentPlayer === 'player1' ? 'player2' : 'player1';
            showNotification('✅ BENAR! +10 POIN', 'success');
        }
        
    } else {
        // Wrong answer
        showNotification('❌ SALAH! COBA LAGI', 'error');
    }
    
    clearDisplay();
    saveGameState();
    updateGameDisplay();
}

function showWinner() {
    const winnerModal = document.getElementById('winnerModal');
    const winnerName = document.getElementById('winnerName');
    
    if (winnerModal && winnerName) {
        const winner = gameState.scores.player1 >= 100 ? 'PLAYER 1' : 'PLAYER 2';
        winnerName.textContent = winner;
        winnerModal.style.display = 'flex';
    }
}

function restartGame() {
    gameState = {
        currentQuestion: "5 + 3 = ?",
        currentAnswer: 8,
        scores: { player1: 0, player2: 0 },
        currentTurn: 'player1',
        gameActive: true,
        roomCode: gameState.roomCode
    };
    
    saveGameState();
    updateGameDisplay();
    
    const winnerModal = document.getElementById('winnerModal');
    if (winnerModal) {
        winnerModal.style.display = 'none';
    }
    
    showNotification('PERMAINAN DIMULAI ULANG!', 'success');
}

function exitGame() {
    if (confirm('KELUAR DARI PERMAINAN?')) {
        // Clear player role but keep room
        localStorage.removeItem('playerRole');
        window.location.href = 'invite.html';
    }
}

// Real-time updates simulation
function simulateGameUpdates() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const newState = JSON.parse(savedState);
        if (JSON.stringify(newState) !== JSON.stringify(gameState)) {
            gameState = newState;
            updateGameDisplay();
        }
    }
}

// Add notification function to game context
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4ecdc4' : type === 'error' ? '#ff6b6b' : '#ffe66d'};
        color: #2d3436;
        padding: 1rem 1.5rem;
        border: 3px solid #2d3436;
        border-radius: 0;
        box-shadow: 4px 4px 0px #2d3436;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideIn 0.3s ease;
        font-size: 0.7rem;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}
