// DOM elements
const boxes = document.querySelectorAll('.box');
const resetButton = document.getElementById('reset-btn');
const currentPlayerDisplay = document.querySelector('.player-symbol');
const gameMessage = document.getElementById('game-message');
const xScoreDisplay = document.getElementById('x-score');
const oScoreDisplay = document.getElementById('o-score');
const drawScoreDisplay = document.getElementById('draw-score');

// Game state
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let isGameActive = true;

// Score tracking
let scores = {
    x: 0,
    o: 0,
    draws: 0
};

// Winning combinations
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

/**
 * Initialize the game
 */
function initGame() {
    updateScoreDisplay();
    updateCurrentPlayerDisplay();
    
    // Load scores from localStorage if available
    const savedScores = localStorage.getItem('ticTacToeScores');
    if (savedScores) {
        scores = JSON.parse(savedScores);
        updateScoreDisplay();
    }
}

/**
 * Handle box click events
 * @param {number} index - The index of the clicked box
 */
function handleBoxClick(index) {
    // Prevent action if box is occupied or game is inactive
    if (gameState[index] !== '' || !isGameActive) {
        return;
    }

    // Update game state and UI
    gameState[index] = currentPlayer;
    boxes[index].textContent = currentPlayer;
    boxes[index].classList.add(currentPlayer.toLowerCase());
    boxes[index].disabled = true;

    // Add click animation
    boxes[index].style.transform = 'scale(0.95)';
    setTimeout(() => {
        boxes[index].style.transform = '';
    }, 150);

    // Check for game end
    checkResult();
}

/**
 * Check game result (win, draw, or continue)
 */
function checkResult() {
    let roundWon = false;
    let winningCombination = null;

    // Check for winning combinations
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
            continue;
        }
        if (gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            winningCombination = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        handleWin(winningCombination);
        return;
    }

    // Check for draw
    if (!gameState.includes('')) {
        handleDraw();
        return;
    }

    // Continue game - switch player
    switchPlayer();
}

/**
 * Handle game win
 * @param {Array} winningCombination - Array of winning box indices
 */
function handleWin(winningCombination) {
    isGameActive = false;
    
    // Highlight winning combination
    winningCombination.forEach(index => {
        boxes[index].classList.add('winning');
    });
    
    // Update score
    if (currentPlayer === 'X') {
        scores.x++;
    } else {
        scores.o++;
    }
    
    // Display win message
    showMessage(`🎉 Player ${currentPlayer} Wins! 🎉`, 'win');
    
    // Disable all boxes
    boxes.forEach(box => box.disabled = true);
    
    // Update displays
    updateScoreDisplay();
    saveScores();
}

/**
 * Handle game draw
 */
function handleDraw() {
    isGameActive = false;
    scores.draws++;
    
    showMessage("🤝 It's a Draw! 🤝", 'draw');
    
    // Disable all boxes
    boxes.forEach(box => box.disabled = true);
    
    // Update displays
    updateScoreDisplay();
    saveScores();
}

/**
 * Switch to the next player
 */
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateCurrentPlayerDisplay();
}

/**
 * Show game message
 * @param {string} message - Message to display
 * @param {string} type - Message type (win, draw)
 */
function showMessage(message, type = '') {
    gameMessage.textContent = message;
    gameMessage.className = `game-message show ${type}`;
    
    // Auto-hide message after 3 seconds
    setTimeout(() => {
        gameMessage.classList.remove('show');
    }, 3000);
}

/**
 * Update current player display
 */
function updateCurrentPlayerDisplay() {
    currentPlayerDisplay.textContent = currentPlayer;
    currentPlayerDisplay.style.color = currentPlayer === 'X' ? '#ef4444' : '#3b82f6';
}

/**
 * Update score display
 */
function updateScoreDisplay() {
    xScoreDisplay.textContent = scores.x;
    oScoreDisplay.textContent = scores.o;
    drawScoreDisplay.textContent = scores.draws;
}

/**
 * Save scores to localStorage
 */
function saveScores() {
    localStorage.setItem('ticTacToeScores', JSON.stringify(scores));
}

/**
 * Reset current game
 */
function resetGame() {
    // Reset game state
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;

    // Reset UI
    boxes.forEach((box) => {
        box.textContent = '';
        box.disabled = false;
        box.className = 'box'; // Remove all additional classes
    });

    // Hide message
    gameMessage.classList.remove('show');
    
    // Update display
    updateCurrentPlayerDisplay();
    
    // Add reset animation
    boxes.forEach((box, index) => {
        setTimeout(() => {
            box.style.transform = 'scale(0.8)';
            setTimeout(() => {
                box.style.transform = '';
            }, 100);
        }, index * 50);
    });
}

/**
 * Add keyboard support for accessibility
 */
function handleKeyPress(event, index) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleBoxClick(index);
    }
}

// Event listeners
boxes.forEach((box, index) => {
    box.addEventListener('click', () => handleBoxClick(index));
    box.addEventListener('keypress', (event) => handleKeyPress(event, index));
});

resetButton.addEventListener('click', resetGame);

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);

// Initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
