        document.addEventListener('DOMContentLoaded', () => {
            // Variables del juego
            let gameState = {
                board: [],
                rows: 9,
                cols: 9,
                mines: 10,
                flags: 0,
                revealed: 0,
                gameOver: false,
                gameWon: false,
                firstClick: true,
                difficulty: 'beginner',
                history: []
            };

            // Elementos del DOM
            const gameBoard = document.getElementById('game-board');
            const minesCountElement = document.getElementById('mines-count');
            const flagsCountElement = document.getElementById('flags-count');
            const newGameBtn = document.getElementById('new-game-btn');
            const undoBtn = document.getElementById('undo-btn');
            const helpBtn = document.getElementById('help-btn');
            const difficultyBtns = document.querySelectorAll('.difficulty-btn');
            const messageModal = document.getElementById('message-modal');
            const modalTitle = document.getElementById('modal-title');
            const modalBody = document.getElementById('modal-body');
            const modalOkBtn = document.getElementById('modal-ok-btn');
            const modalNewGameBtn = document.getElementById('modal-new-game-btn');
            const helpModal = document.getElementById('help-modal');
            const helpModalOkBtn = document.getElementById('help-modal-ok-btn');
            const closeModals = document.querySelectorAll('.close-modal');

            // Inicializar el juego
            initGame();

            // Event listeners
            newGameBtn.addEventListener('click', initGame);
            undoBtn.addEventListener('click', undoMove);
            helpBtn.addEventListener('click', showHelp);
            modalOkBtn.addEventListener('click', closeMessageModal);
            modalNewGameBtn.addEventListener('click', () => {
                closeMessageModal();
                initGame();
            });
            helpModalOkBtn.addEventListener('click', closeHelpModal);
            
            // Cerrar modales al hacer clic en la X
            closeModals.forEach(btn => {
                btn.addEventListener('click', () => {
                    if (messageModal.style.display === 'flex') closeMessageModal();
                    if (helpModal.style.display === 'flex') closeHelpModal();
                });
            });
            
            // Cerrar modales al hacer clic fuera del contenido
            window.addEventListener('click', (event) => {
                if (event.target === messageModal) closeMessageModal();
                if (event.target === helpModal) closeHelpModal();
            });

            // Configurar dificultad
            difficultyBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    difficultyBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    gameState.difficulty = btn.dataset.difficulty;
                    setDifficulty();
                    initGame();
                });
            });

            // Funciones del juego
            function setDifficulty() {
                switch (gameState.difficulty) {
                    case 'beginner':
                        gameState.rows = 9;
                        gameState.cols = 9;
                        gameState.mines = 10;
                        break;
                    case 'intermediate':
                        gameState.rows = 16;
                        gameState.cols = 16;
                        gameState.mines = 40;
                        break;
                    case 'expert':
                        gameState.rows = 16;
                        gameState.cols = 30;
                        gameState.mines = 99;
                        break;
                }
                gameState.flags = 0;
                minesCountElement.textContent = gameState.mines;
                flagsCountElement.textContent = gameState.mines - gameState.flags;
            }

            function initGame() {
                // Reiniciar estado del juego
                gameState = {
                    board: [],
                    rows: gameState.rows,
                    cols: gameState.cols,
                    mines: gameState.mines,
                    flags: 0,
                    revealed: 0,
                    gameOver: false,
                    gameWon: false,
                    firstClick: true,
                    difficulty: gameState.difficulty,
                    history: []
                };

                // Actualizar contadores
                minesCountElement.textContent = gameState.mines;
                flagsCountElement.textContent = gameState.mines - gameState.flags;

                // Crear el tablero
                createBoard();

                // Actualizar la interfaz
                updateUI();
            }

            function createBoard() {
                // Inicializar el tablero vacío
                gameState.board = Array(gameState.rows).fill().map(() => 
                    Array(gameState.cols).fill().map(() => ({
                        isMine: false,
                        isRevealed: false,
                        isFlagged: false,
                        neighborMines: 0
                    }))
                );

                // Configurar el tamaño del tablero en CSS
                gameBoard.style.gridTemplateColumns = `repeat(${gameState.cols}, 1fr)`;
                gameBoard.style.gridTemplateRows = `repeat(${gameState.rows}, 1fr)`;
            }

            function placeMines(firstRow, firstCol) {
                let minesPlaced = 0;
                
                // Colocar minas aleatoriamente, evitando la primera casilla clickeada y sus vecinas
                while (minesPlaced < gameState.mines) {
                    const row = Math.floor(Math.random() * gameState.rows);
                    const col = Math.floor(Math.random() * gameState.cols);
                    
                    // Verificar que no sea la primera casilla ni sus vecinas
                    const isFirstClickArea = Math.abs(row - firstRow) <= 1 && Math.abs(col - firstCol) <= 1;
                    
                    if (!gameState.board[row][col].isMine && !isFirstClickArea) {
                        gameState.board[row][col].isMine = true;
                        minesPlaced++;
                        
                        // Actualizar conteo de minas vecinas para las casillas adyacentes
                        for (let r = Math.max(0, row - 1); r <= Math.min(gameState.rows - 1, row + 1); r++) {
                            for (let c = Math.max(0, col - 1); c <= Math.min(gameState.cols - 1, col + 1); c++) {
                                if (!(r === row && c === col)) {
                                    gameState.board[r][c].neighborMines++;
                                }
                            }
                        }
                    }
                }
            }

            function updateUI() {
                // Limpiar el tablero
                gameBoard.innerHTML = '';

                // Actualizar contadores
                minesCountElement.textContent = gameState.mines;
                flagsCountElement.textContent = gameState.mines - gameState.flags;

                // Actualizar botón de deshacer
                undoBtn.disabled = gameState.history.length === 0;

                // Crear las celdas del tablero
                for (let row = 0; row < gameState.rows; row++) {
                    for (let col = 0; col < gameState.cols; col++) {
                        const cell = document.createElement('div');
                        cell.className = 'cell';
                        cell.dataset.row = row;
                        cell.dataset.col = col;
                        
                        const cellData = gameState.board[row][col];
                        
                        if (cellData.isRevealed) {
                            cell.classList.add('revealed');
                            if (cellData.isMine) {
                                cell.classList.add('mine');
                                cell.textContent = '💣';
                            } else if (cellData.neighborMines > 0) {
                                cell.textContent = cellData.neighborMines;
                                cell.classList.add(`number-${cellData.neighborMines}`);
                            }
                        } else if (cellData.isFlagged) {
                            cell.classList.add('flagged');
                            cell.textContent = '🚩';
                        }
                        
                        // Event listeners
                        cell.addEventListener('click', () => handleCellClick(row, col));
                        cell.addEventListener('contextmenu', (e) => {
                            e.preventDefault();
                            handleRightClick(row, col);
                        });
                        
                        gameBoard.appendChild(cell);
                    }
                }
            }

            function handleCellClick(row, col) {
                // No hacer nada si el juego terminó o la casilla está marcada
                if (gameState.gameOver || gameState.gameWon || gameState.board[row][col].isFlagged) {
                    return;
                }
                
                // Guardar estado para deshacer
                saveGameState();
                
                // En el primer click, colocar las minas (para que nunca sea mina la primera casilla)
                if (gameState.firstClick) {
                    placeMines(row, col);
                    gameState.firstClick = false;
                }
                
                // Si es una mina, terminar el juego
                if (gameState.board[row][col].isMine) {
                    revealAllMines();
                    gameState.gameOver = true;
                    showGameOver();
                    return;
                }
                
                // Revelar la casilla
                revealCell(row, col);
                
                // Verificar si ganó
                checkWin();
                
                // Actualizar la interfaz
                updateUI();
            }

            function handleRightClick(row, col) {
                // No hacer nada si el juego terminó o la casilla está revelada
                if (gameState.gameOver || gameState.gameWon || gameState.board[row][col].isRevealed) {
                    return;
                }
                
                // Guardar estado para deshacer
                saveGameState();
                
                const cell = gameState.board[row][col];
                
                // Alternar bandera
                if (cell.isFlagged) {
                    cell.isFlagged = false;
                    gameState.flags--;
                } else if (gameState.flags < gameState.mines) {
                    cell.isFlagged = true;
                    gameState.flags++;
                }
                
                // Actualizar la interfaz
                updateUI();
            }

            function revealCell(row, col) {
                // Si la casilla está fuera de los límites, ya está revelada o tiene bandera, no hacer nada
                if (row < 0 || row >= gameState.rows || col < 0 || col >= gameState.cols || 
                    gameState.board[row][col].isRevealed || gameState.board[row][col].isFlagged) {
                    return;
                }
                
                // Revelar la casilla
                gameState.board[row][col].isRevealed = true;
                gameState.revealed++;
                
                // Si es una casilla vacía (sin minas adyacentes), revelar recursivamente las vecinas
                if (gameState.board[row][col].neighborMines === 0) {
                    for (let r = Math.max(0, row - 1); r <= Math.min(gameState.rows - 1, row + 1); r++) {
                        for (let c = Math.max(0, col - 1); c <= Math.min(gameState.cols - 1, col + 1); c++) {
                            if (!(r === row && c === col)) {
                                revealCell(r, c);
                            }
                        }
                    }
                }
            }

            function revealAllMines() {
                for (let row = 0; row < gameState.rows; row++) {
                    for (let col = 0; col < gameState.cols; col++) {
                        if (gameState.board[row][col].isMine) {
                            gameState.board[row][col].isRevealed = true;
                        }
                    }
                }
            }

            function checkWin() {
                // Verificar si todas las casillas sin minas han sido reveladas
                if (gameState.revealed === (gameState.rows * gameState.cols - gameState.mines)) {
                    gameState.gameWon = true;
                    showWin();
                }
            }

            function saveGameState() {
                // Guardar una copia profunda del estado actual del tablero
                const boardCopy = gameState.board.map(row => row.map(cell => ({ ...cell })));
                
                gameState.history.push({
                    board: boardCopy,
                    flags: gameState.flags,
                    revealed: gameState.revealed,
                    gameOver: gameState.gameOver,
                    gameWon: gameState.gameWon
                });
                
                // Limitar el historial a un tamaño razonable
                if (gameState.history.length > 10) {
                    gameState.history.shift();
                }
            }

            function undoMove() {
                if (gameState.history.length === 0) return;
                
                // Obtener el último estado guardado
                const lastState = gameState.history.pop();
                
                // Restaurar el estado del juego
                gameState.board = lastState.board;
                gameState.flags = lastState.flags;
                gameState.revealed = lastState.revealed;
                gameState.gameOver = lastState.gameOver;
                gameState.gameWon = lastState.gameWon;
                
                // Actualizar UI
                updateUI();
            }

            function showGameOver() {
                modalTitle.textContent = "¡Boom!";
                modalBody.textContent = "Has encontrado una mina. ¡Inténtalo de nuevo!";
                messageModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                updateUI();
            }

            function showWin() {
                modalTitle.textContent = "¡Felicidades!";
                modalBody.textContent = `¡Has ganado el juego en ${gameState.revealed} movimientos!`;
                messageModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                updateUI();
            }

            function showHelp() {
                helpModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }

            function closeMessageModal() {
                messageModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }

            function closeHelpModal() {
                helpModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });