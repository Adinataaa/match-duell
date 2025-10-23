// Dashboard functionality
let gameState = {
    currentQuestion: "5 + 3 = ?",
    currentAnswer: 8,
    scores: { player1: 0, player2: 0 },
    currentTurn: 'player2',
    gameActive: true
};

document.addEventListener('DOMContentLoaded', function() {
    loadGameState();
    updateDashboard();
    
    // Initialize form values
    const scorePlayer1Input = document.getElementById('scorePlayer1');
    const scorePlayer2Input = document.getElementById('scorePlayer2');
    const playerTurnSelect = document.getElementById('playerTurn');
    
    if (scorePlayer1Input && scorePlayer2Input && playerTurnSelect) {
        scorePlayer1Input.value = gameState.scores.player1;
        scorePlayer2Input.value = gameState.scores.player2;
        playerTurnSelect.value = gameState.currentTurn;
    }
});

function loadGameState() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        gameState = JSON.parse(savedState);
    }
}

function saveGameState() {
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

function updateDashboard() {
    // Update question display
    const questionElement = document.getElementById('currentQuestion');
    const questionTeacherElement = document.getElementById('currentQuestionTeacher');
    
    if (questionElement) questionElement.textContent = gameState.currentQuestion;
    if (questionTeacherElement) questionTeacherElement.textContent = gameState.currentQuestion;
    
    // Update scores
    const scorePlayer1Input = document.getElementById('scorePlayer1');
    const scorePlayer2Input = document.getElementById('scorePlayer2');
    const statusPlayer1 = document.getElementById('statusPlayer1');
    const statusPlayer2 = document.getElementById('statusPlayer2');
    const turnPlayer1 = document.getElementById('turnPlayer1');
    const turnPlayer2 = document.getElementById('turnPlayer2');
    
    if (scorePlayer1Input) scorePlayer1Input.value = gameState.scores.player1;
    if (scorePlayer2Input) scorePlayer2Input.value = gameState.scores.player2;
    
    if (statusPlayer1) statusPlayer1.textContent = `${gameState.scores.player1} poin`;
    if (statusPlayer2) statusPlayer2.textContent = `${gameState.scores.player2} poin`;
    
    // Update turn indicators
    if (turnPlayer1) {
        turnPlayer1.textContent = gameState.currentTurn === 'player1' ? '🎯 Giliran' : '⏳ Menunggu';
        turnPlayer1.style.color = gameState.currentTurn === 'player1' ? '#2ecc71' : '#95a5a6';
    }
    
    if (turnPlayer2) {
        turnPlayer2.textContent = gameState.currentTurn === 'player2' ? '🎯 Giliran' : '⏳ Menunggu';
        turnPlayer2.style.color = gameState.currentTurn === 'player2' ? '#2ecc71' : '#95a5a6';
    }
    
    saveGameState();
}

function generateQuestion() {
    const questionType = document.getElementById('questionType').value;
    const difficulty = document.getElementById('difficulty').value;
    const customQuestion = document.getElementById('customQuestion').value.trim();
    
    // If custom question provided
    if (customQuestion) {
        try {
            let expression = customQuestion.replace(/×/g, '*').replace(/÷/g, '/');
            const answer = eval(expression);
            
            gameState.currentQuestion = customQuestion + " = ?";
            gameState.currentAnswer = answer;
            
            showNotification('Soal kustom berhasil dibuat!', 'success');
            
        } catch (error) {
            showNotification('Format soal kustom tidak valid!', 'error');
            return;
        }
    } else {
        // Generate random question
        const maxNumber = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 50 : 100;
        let num1 = Math.floor(Math.random() * maxNumber) + 1;
        let num2 = Math.floor(Math.random() * maxNumber) + 1;
        let operator, answer;
        
        switch(questionType) {
            case 'addition':
                operator = '+';
                answer = num1 + num2;
                break;
            case 'subtraction':
                if (num1 < num2) [num1, num2] = [num2, num1];
                operator = '-';
                answer = num1 - num2;
                break;
            case 'multiplication':
                if (difficulty === 'easy') {
                    num1 = Math.floor(Math.random() * 10) + 1;
                    num2 = Math.floor(Math.random() * 10) + 1;
                }
                operator = '×';
                answer = num1 * num2;
                break;
            case 'division':
                answer = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                num1 = answer * num2;
                operator = '÷';
                break;
            case 'mixed':
                const operators = ['+', '-', '×', '÷'];
                const randomOp = operators[Math.floor(Math.random() * operators.length)];
                operator = randomOp;
                
                switch(randomOp) {
                    case '+': answer = num1 + num2; break;
                    case '-': 
                        if (num1 < num2) [num1, num2] = [num2, num1];
                        answer = num1 - num2; 
                        break;
                    case '×': 
                        if (difficulty === 'easy') {
                            num1 = Math.floor(Math.random() * 10) + 1;
                            num2 = Math.floor(Math.random() * 10) + 1;
                        }
                        answer = num1 * num2; 
                        break;
                    case '÷': 
                        answer = Math.floor(Math.random() * 10) + 1;
                        num2 = Math.floor(Math.random() * 10) + 1;
                        num1 = answer * num2;
                        break;
                }
                break;
        }
        
        gameState.currentQuestion = `${num1} ${operator} ${num2} = ?`;
        gameState.currentAnswer = answer;
        
        showNotification('Soal baru berhasil dibuat!', 'success');
    }
    
    updateDashboard();
}

function resetScores() {
    if (confirm('Apakah Anda yakin ingin mereset semua skor?')) {
        gameState.scores.player1 = 0;
        gameState.scores.player2 = 0;
        gameState.gameActive = true;
        
        updateDashboard();
        showNotification('Skor berhasil direset!', 'success');
    }
}

function updateScore(player, value) {
    const score = parseInt(value) || 0;
    
    if (player === 'player1') {
        gameState.scores.player1 = score;
    } else {
        gameState.scores.player2 = score;
    }
    
    // Check for winner
    if (score >= 100) {
        gameState.gameActive = false;
        showNotification(`Player ${player === 'player1' ? '1' : '2'} mencapai 100 poin!`, 'warning');
    }
    
    updateDashboard();
}

function changePlayerTurn() {
    const playerTurnSelect = document.getElementById('playerTurn');
    gameState.currentTurn = playerTurnSelect.value;
    updateDashboard();
}

// Real-time updates simulation (for demo purposes)
function simulateGameUpdates() {
    setInterval(() => {
        // In real app, this would come from WebSocket or API
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            const newState = JSON.parse(savedState);
            if (JSON.stringify(newState) !== JSON.stringify(gameState)) {
                gameState = newState;
                updateDashboard();
            }
        }
    }, 2000);
}

// Start simulation
document.addEventListener('DOMContentLoaded', simulateGameUpdates);