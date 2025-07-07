document.addEventListener('DOMContentLoaded', () => {
    // Variables del juego
    let gameState = {
        board: Array(4).fill().map(() => Array(4).fill(0)),
        score: 0,
        bestScore: localStorage.getItem('bestScore') || 0,
        gameOver: false,
        won: false,
        history: []
    };

    // Elementos del DOM
    const gameBoard = document.getElementById('game-board');
    const scoreElement = document.getElementById('score');
    const bestScoreElement = document.getElementById('best-score');
    const newGameBtn = document.getElementById('new-game-btn');
    const undoBtn = document.getElementById('undo-btn');
    const helpBtn = document.getElementById('help-btn');
    const messageModal = document.getElementById('message-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalOkBtn = document.getElementById('modal-ok-btn');
    const modalNewGameBtn = document.getElementById('modal-new-game-btn');
    const closeModal = document.querySelectorAll('.close-modal');
    const helpModal = document.getElementById('help-modal');
    const helpModalOkBtn = document.getElementById('help-modal-ok-btn');

    // Inicializar el juego
    initGame();

    // Event listeners
    newGameBtn.addEventListener('click', initGame);
    undoBtn.addEventListener('click', undoMove);
    helpBtn.addEventListener('click', () => {
        helpModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    modalOkBtn.addEventListener('click', () => messageModal.style.display = 'none');
    modalNewGameBtn.addEventListener('click', () => {
        messageModal.style.display = 'none';
        initGame();
    });
    helpModalOkBtn.addEventListener('click', () => {
        helpModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Cerrar modales al hacer clic en el botón de cerrar
    closeModal.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
            document.body.style.overflow = 'auto';
        });
    });

    // Cerrar modales al hacer clic fuera del contenido
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Control del teclado
    document.addEventListener('keydown', handleKeyPress);

    // Funciones del juego

    function initGame() {
        // Reiniciar estado del juego
        gameState = {
            board: Array(4).fill().map(() => Array(4).fill(0)),
            score: 0,
            bestScore: Math.max(gameState.bestScore, gameState.score),
            gameOver: false,
            won: false,
            history: []
        };

        // Guardar mejor puntuación
        localStorage.setItem('bestScore', gameState.bestScore);

        // Añadir 2 fichas iniciales
        addRandomTile();
        addRandomTile();

        // Actualizar la interfaz
        updateUI();
    }

    function updateUI() {
        // Limpiar el tablero
        gameBoard.innerHTML = '';

        // Actualizar puntuaciones
        scoreElement.textContent = gameState.score;
        bestScoreElement.textContent = gameState.bestScore;

        // Actualizar botón de deshacer
        undoBtn.disabled = gameState.history.length === 0;

        // Crear las celdas del tablero
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                
                const value = gameState.board[row][col];
                if (value !== 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${value}`;
                    tile.textContent = value;
                    cell.appendChild(tile);
                }
                
                gameBoard.appendChild(cell);
            }
        }
    }

    function addRandomTile() {
        // Encontrar celdas vacías
        const emptyCells = [];
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (gameState.board[row][col] === 0) {
                    emptyCells.push({ row, col });
                }
            }
        }

        // Si hay celdas vacías, añadir una ficha (90% 2, 10% 4)
        if (emptyCells.length > 0) {
            const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            gameState.board[row][col] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    function saveGameState() {
        // Guardar una copia del estado actual del juego
        const stateCopy = {
            board: gameState.board.map(row => [...row]),
            score: gameState.score,
            gameOver: gameState.gameOver,
            won: gameState.won
        };
        
        gameState.history.push(stateCopy);
        
        // Limitar el historial a un tamaño razonable
        if (gameState.history.length > 5) {
            gameState.history.shift();
        }
    }

    function moveTiles(direction) {
        // Guardar estado actual para deshacer
        saveGameState();

        let moved = false;
        const oldBoard = JSON.stringify(gameState.board);

        // Procesar el movimiento según la dirección
        switch (direction) {
            case 'up':
                moved = moveUp();
                break;
            case 'right':
                moved = moveRight();
                break;
            case 'down':
                moved = moveDown();
                break;
            case 'left':
                moved = moveLeft();
                break;
        }

        // Si hubo movimiento, añadir una nueva ficha y verificar estado del juego
        if (moved || JSON.stringify(gameState.board) !== oldBoard) {
            addRandomTile();
            checkGameStatus();
            updateUI();
        }
    }

    function moveUp() {
        let moved = false;
        for (let col = 0; col < 4; col++) {
            for (let row = 1; row < 4; row++) {
                if (gameState.board[row][col] !== 0) {
                    let currentRow = row;
                    while (currentRow > 0 && (
                        gameState.board[currentRow - 1][col] === 0 || 
                        gameState.board[currentRow - 1][col] === gameState.board[currentRow][col]
                    )) {
                        // Mover a celda vacía
                        if (gameState.board[currentRow - 1][col] === 0) {
                            gameState.board[currentRow - 1][col] = gameState.board[currentRow][col];
                            gameState.board[currentRow][col] = 0;
                            moved = true;
                        } 
                        // Combinar fichas iguales
                        else if (gameState.board[currentRow - 1][col] === gameState.board[currentRow][col]) {
                            gameState.board[currentRow - 1][col] *= 2;
                            gameState.score += gameState.board[currentRow - 1][col];
                            gameState.board[currentRow][col] = 0;
                            moved = true;
                            break; // Para no combinar múltiples veces en un movimiento
                        }
                        currentRow--;
                    }
                }
            }
        }
        return moved;
    }

    function moveRight() {
        let moved = false;
        for (let row = 0; row < 4; row++) {
            for (let col = 2; col >= 0; col--) {
                if (gameState.board[row][col] !== 0) {
                    let currentCol = col;
                    while (currentCol < 3 && (
                        gameState.board[row][currentCol + 1] === 0 || 
                        gameState.board[row][currentCol + 1] === gameState.board[row][currentCol]
                    )) {
                        // Mover a celda vacía
                        if (gameState.board[row][currentCol + 1] === 0) {
                            gameState.board[row][currentCol + 1] = gameState.board[row][currentCol];
                            gameState.board[row][currentCol] = 0;
                            moved = true;
                        } 
                        // Combinar fichas iguales
                        else if (gameState.board[row][currentCol + 1] === gameState.board[row][currentCol]) {
                            gameState.board[row][currentCol + 1] *= 2;
                            gameState.score += gameState.board[row][currentCol + 1];
                            gameState.board[row][currentCol] = 0;
                            moved = true;
                            break; // Para no combinar múltiples veces en un movimiento
                        }
                        currentCol++;
                    }
                }
            }
        }
        return moved;
    }

    function moveDown() {
        let moved = false;
        for (let col = 0; col < 4; col++) {
            for (let row = 2; row >= 0; row--) {
                if (gameState.board[row][col] !== 0) {
                    let currentRow = row;
                    while (currentRow < 3 && (
                        gameState.board[currentRow + 1][col] === 0 || 
                        gameState.board[currentRow + 1][col] === gameState.board[currentRow][col]
                    )) {
                        // Mover a celda vacía
                        if (gameState.board[currentRow + 1][col] === 0) {
                            gameState.board[currentRow + 1][col] = gameState.board[currentRow][col];
                            gameState.board[currentRow][col] = 0;
                            moved = true;
                        } 
                        // Combinar fichas iguales
                        else if (gameState.board[currentRow + 1][col] === gameState.board[currentRow][col]) {
                            gameState.board[currentRow + 1][col] *= 2;
                            gameState.score += gameState.board[currentRow + 1][col];
                            gameState.board[currentRow][col] = 0;
                            moved = true;
                            break; // Para no combinar múltiples veces en un movimiento
                        }
                        currentRow++;
                    }
                }
            }
        }
        return moved;
    }

    function moveLeft() {
        let moved = false;
        for (let row = 0; row < 4; row++) {
            for (let col = 1; col < 4; col++) {
                if (gameState.board[row][col] !== 0) {
                    let currentCol = col;
                    while (currentCol > 0 && (
                        gameState.board[row][currentCol - 1] === 0 || 
                        gameState.board[row][currentCol - 1] === gameState.board[row][currentCol]
                    )) {
                        // Mover a celda vacía
                        if (gameState.board[row][currentCol - 1] === 0) {
                            gameState.board[row][currentCol - 1] = gameState.board[row][currentCol];
                            gameState.board[row][currentCol] = 0;
                            moved = true;
                        } 
                        // Combinar fichas iguales
                        else if (gameState.board[row][currentCol - 1] === gameState.board[row][currentCol]) {
                            gameState.board[row][currentCol - 1] *= 2;
                            gameState.score += gameState.board[row][currentCol - 1];
                            gameState.board[row][currentCol] = 0;
                            moved = true;
                            break; // Para no combinar múltiples veces en un movimiento
                        }
                        currentCol--;
                    }
                }
            }
        }
        return moved;
    }

    function checkGameStatus() {
        // Verificar si se alcanzó el 2048
        if (!gameState.won) {
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    if (gameState.board[row][col] === 2048) {
                        gameState.won = true;
                        showWinMessage();
                        return;
                    }
                }
            }
        }

        // Verificar si el juego terminó (no hay movimientos posibles)
        if (!hasValidMoves()) {
            gameState.gameOver = true;
            showGameOverMessage();
        }
    }

    function hasValidMoves() {
        // Verificar si hay celdas vacías
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (gameState.board[row][col] === 0) {
                    return true;
                }
            }
        }

        // Verificar si hay movimientos posibles (fichas adyacentes iguales)
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const value = gameState.board[row][col];
                // Verificar derecha
                if (col < 3 && gameState.board[row][col + 1] === value) {
                    return true;
                }
                // Verificar abajo
                if (row < 3 && gameState.board[row + 1][col] === value) {
                    return true;
                }
            }
        }

        return false;
    }

    function showWinMessage() {
        modalTitle.textContent = "¡Felicidades!";
        modalBody.textContent = `¡Has alcanzado el 2048 con una puntuación de ${gameState.score}!`;
        messageModal.style.display = 'flex';
    }

    function showGameOverMessage() {
        modalTitle.textContent = "¡Juego Terminado!";
        modalBody.textContent = `No hay movimientos posibles. Puntuación final: ${gameState.score}`;
        messageModal.style.display = 'flex';
    }

    function undoMove() {
        if (gameState.history.length === 0) return;
        
        // Obtener el último estado guardado
        const lastState = gameState.history.pop();
        
        // Restaurar el estado del juego
        gameState.board = lastState.board;
        gameState.score = lastState.score;
        gameState.gameOver = lastState.gameOver;
        gameState.won = lastState.won;
        
        // Actualizar UI
        updateUI();
    }

    function handleKeyPress(e) {
        if (gameState.gameOver) return;

        switch (e.key) {
            case 'ArrowUp':
                moveTiles('up');
                break;
            case 'ArrowRight':
                moveTiles('right');
                break;
            case 'ArrowDown':
                moveTiles('down');
                break;
            case 'ArrowLeft':
                moveTiles('left');
                break;
        }
    }

    // También agregar soporte para touch (swipes)
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, false);

    document.addEventListener('touchend', (e) => {
        if (gameState.gameOver) return;

        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        
        // Determinar la dirección del swipe
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0) {
                moveTiles('right');
            } else {
                moveTiles('left');
            }
        } else {
            if (diffY > 0) {
                moveTiles('down');
            } else {
                moveTiles('up');
            }
        }
    }, false);
});