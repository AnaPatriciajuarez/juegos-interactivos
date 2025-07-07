        document.addEventListener("DOMContentLoaded", () => {
            const cells = document.querySelectorAll(".cell");
            const turnoElement = document.getElementById("turno");
            const turnoText = turnoElement.querySelector("span");
            const resultModal = document.getElementById("result-modal");
            const resultMessage = document.getElementById("result-message");
            const resultDetails = document.getElementById("result-details");
            const closeResultModalButton = document.getElementById("close-result-modal");
            const reiniciarButton = document.getElementById("reiniciar");
            const helpBtn = document.getElementById("help-btn");
            const helpModal = document.getElementById("help-modal");
            const helpModalOkBtn = document.getElementById("help-modal-ok-btn");
            const closeModal = document.querySelectorAll(".close-modal");

            let board = ["", "", "", "", "", "", "", "", ""];
            let currentPlayer = "X";
            let gameOver = false;
            let movesCount = 0;

            // Función para manejar el clic en una celda
            function handleClick(event) {
                const index = event.target.id;

                if (board[index] !== "" || gameOver) return;

                board[index] = currentPlayer;
                event.target.classList.add(currentPlayer.toLowerCase());
                movesCount++;
                
                const winner = checkWinner();
                if (winner) {
                    gameOver = true;
                    
                    if (winner.pattern) {
                        winner.pattern.forEach(index => {
                            cells[index].classList.add("winning-cell");
                        });
                        resultMessage.textContent = `¡Jugador ${winner.player} ha ganado!`;
                        resultDetails.textContent = "Felicidades por tu victoria";
                    } else {
                        resultMessage.textContent = "¡Es un empate!";
                        resultDetails.textContent = "Ningún jugador consiguió formar una línea";
                    }
                    
                    setTimeout(() => {
                        resultModal.style.display = "flex";
                    }, 1000);
                    return;
                }

                currentPlayer = currentPlayer === "X" ? "O" : "X";
                turnoText.textContent = `Jugador ${currentPlayer}`;
                turnoText.className = currentPlayer === "X" ? "turno-x" : "turno-o";
            }

            // Función para verificar si hay un ganador
            function checkWinner() {
                const winPatterns = [
                    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
                    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
                    [0, 4, 8], [2, 4, 6]             // Diagonales
                ];

                for (const pattern of winPatterns) {
                    const [a, b, c] = pattern;
                    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                        return { player: board[a], pattern: pattern };
                    }
                }

                if (movesCount === 9) {
                    return { player: null }; // Empate
                }

                return null;
            }

            // Función para reiniciar el juego
            function restartGame() {
                board = ["", "", "", "", "", "", "", "", ""];
                gameOver = false;
                movesCount = 0;
                currentPlayer = "X";
                turnoText.textContent = "Jugador X";
                turnoText.className = "turno-x";
                
                cells.forEach(cell => {
                    cell.className = "cell";
                });
                
                resultModal.style.display = "none";
                helpModal.style.display = "none";
            }

            // Asignar eventos
            cells.forEach(cell => {
                cell.addEventListener("click", handleClick);
            });

            reiniciarButton.addEventListener("click", restartGame);
            closeResultModalButton.addEventListener("click", restartGame);
            
            helpBtn.addEventListener("click", () => {
                helpModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
            
            helpModalOkBtn.addEventListener("click", () => {
                helpModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
            
            closeModal.forEach(btn => {
                btn.addEventListener("click", () => {
                    document.querySelectorAll('.modal').forEach(modal => {
                        modal.style.display = 'none';
                    });
                    document.body.style.overflow = 'auto';
                });
            });
            
            window.addEventListener("click", (e) => {
                if (e.target.classList.contains('modal')) {
                    e.target.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        });