// Game logic for player pages
let gameState = {
    currentQuestion: "5 + 3 = ?",
    currentAnswer: 8,
    scores: { player1: 0, player2: 0 },
    currentTurn: 'player2',
    gameActive: true
};

let currentPlayer = '';

function initializeGame(playerId) {
    currentPlayer = playerId;
    loadGameState();
    updateGameDisplay();
    
    // Start real-time updates simulation
    simulateGameUpdates();
}

function loadGameState() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        gameState = JSON.parse(savedState);
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
            turnIndicator.textContent = '🎯 Giliran Anda! Jawab soal sekarang!';
            turnIndicator.style.color = '#2ecc71';
            submitBtn.disabled = false;
            submitBtn.textContent = '✅ JAWAB';
            submitBtn.style.background = '#2ecc71';
        } else {
            const otherPlayer = currentPlayer === 'player1' ? 'Player 2' : 'Player 1';
            turnIndicator.textContent = `⏳ Menunggu giliran ${otherPlayer}...`;
            turnIndicator.style.color = '#f39c12';
            submitBtn.disabled = true;
            submitBtn.textContent = '⏳ Tunggu Giliran';
            submitBtn.style.background = '#95a5a6';
        }
    }
    
    // Update active player highlight
    const player1Element = document.querySelector('.score-player:nth-child(1)');
    const player2Element = document.querySelector('.score-player:nth-child(3)');
    
    if (player1Element && player2Element) {
        player1Element.classList.toggle('active', gameState.currentTurn === 'player1');
        player2Element.classList.toggle('active', gameState.currentTurn === 'player2');
    }
    
    // Check for winner
    if (!gameState.gameActive) {
        showWinner();
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
        display.value = 'Error';
    }
}

function submitAnswer() {
    if (!gameState.gameActive || gameState.currentTurn !== currentPlayer) return;
    
    const display = document.getElementById('answerDisplay');
    const userAnswer = parseFloat(display.value);
    
    if (isNaN(userAnswer)) {
        showNotification('Masukkan jawaban yang valid!', 'error');
        return;
    }
    
    if (userAnswer === gameState.currentAnswer) {
        // Correct answer
        gameState.scores[currentPlayer] += 10;
        
        // Check for winner
        if (gameState.scores[currentPlayer] >= 100) {
            gameState.gameActive = false;
            showWinner();
        } else {
            // Switch turn
            gameState.currentTurn = currentPlayer === 'player1' ? 'player2' : 'player1';
            showNotification('Jawaban benar! +10 poin 🎉', 'success');
        }
        
    } else {
        // Wrong answer
        showNotification('Jawaban salah! Coba lagi ❌', 'error');
    }
    
    clearDisplay();
    saveGameState();
    updateGameDisplay();
}

function showWinner() {
    const winnerModal = document.getElementById('winnerModal');
    const winnerName = document.getElementById('winnerName');
    
    if (winnerModal && winnerName) {
        const winner = gameState.scores.player1 >= 100 ? 'Player 1' : 'Player 2';
        winnerName.textContent = winner;
        winnerModal.style.display = 'flex';
    }
}

function restartGame() {
    gameState = {
        currentQuestion: "5 + 3 = ?",
        currentAnswer: 8,
        scores: { player1: 0, player2: 0 },
        currentTurn: 'player2',
        gameActive: true
    };
    
    saveGameState();
    updateGameDisplay();
    
    const winnerModal = document.getElementById('winnerModal');
    if (winnerModal) {
        winnerModal.style.display = 'none';
    }
    
    showNotification('Permainan dimulai ulang!', 'success');
}

function exitGame() {
    if (confirm('Apakah Anda yakin ingin keluar dari permainan?')) {
        goToHome();
    }
}

// Real-time updates simulation
function simulateGameUpdates() {
    setInterval(() => {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            const newState = JSON.parse(savedState);
            if (JSON.stringify(newState) !== JSON.stringify(gameState)) {
                gameState = newState;
                updateGameDisplay();
            }
        }
    }, 1000);
}

// Add notification function to game context
function showNotification(message, type = 'info') {
    // Similar to auth.js notification function
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
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}