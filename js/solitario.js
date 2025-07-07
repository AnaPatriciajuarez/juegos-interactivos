document.addEventListener('DOMContentLoaded', () => {
    // Variables del juego
    let gameState = {
        stock: [],
        tableau: [[], [], [], [], [], [], [], [], [], []], // 10 columnas para Spider
        foundations: [],
        moves: 0,
        score: 0,
        selectedCard: null,
        selectedColumn: null,
        selectedCardIndex: null,
        gameWon: false,
        difficulty: 1, // 1 = fácil (1 palo), 2 = medio (2 palos), 4 = difícil (4 palos)
        history: [], // Para la función de deshacer
        hint: null // Para la función de pista
    };

    // Elementos del DOM
    const stockPile = document.getElementById('stock-pile');
    const tableauElement = document.getElementById('tableau');
    const movesCountElement = document.getElementById('moves-count');
    const scoreElement = document.getElementById('score');
    const gameStatusElement = document.getElementById('game-status');
    const newGameBtn = document.getElementById('new-game-btn');
    const undoBtn = document.getElementById('undo-btn');
    const hintBtn = document.getElementById('hint-btn');
    const helpBtn = document.getElementById('help-btn');
    const messageModal = document.getElementById('message-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalOkBtn = document.getElementById('modal-ok-btn');
    const closeModal = document.querySelectorAll('.close-modal');
    const helpModal = document.getElementById('help-modal');
    const helpModalOkBtn = document.getElementById('help-modal-ok-btn');

    // Inicializar el juego
    initGame();

    // Event listeners
    newGameBtn.addEventListener('click', initGame);
    undoBtn.addEventListener('click', undoMove);
    hintBtn.addEventListener('click', showHint);
    helpBtn.addEventListener('click', () => {
        helpModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    stockPile.addEventListener('click', dealCards);
    modalOkBtn.addEventListener('click', () => messageModal.style.display = 'none');
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

    // Funciones del juego

    function showMessage(title, message) {
        modalTitle.textContent = title;
        modalBody.innerHTML = `<p>${message}</p>`;
        messageModal.style.display = 'flex';
    }

    function initGame() {
        // Reiniciar estado del juego
        gameState = {
            stock: [],
            tableau: [[], [], [], [], [], [], [], [], [], []],
            foundations: [],
            moves: 0,
            score: 0,
            selectedCard: null,
            selectedColumn: null,
            selectedCardIndex: null,
            gameWon: false,
            difficulty: 1,
            history: [],
            hint: null
        };

        // Crear y barajar el mazo
        createDeck();
        shuffleDeck();

        // Repartir cartas iniciales
        dealInitialCards();

        // Actualizar la interfaz
        updateUI();

        // Actualizar estado del juego
        gameStatusElement.textContent = "Juego en progreso";
    }

    function createDeck() {
        const suits = ['♥', '♦', '♠', '♣'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        // Para Spider, necesitamos 8 mazos (2 por palo en dificultad 4 palos)
        let deck = [];
        
        // Crear mazos según la dificultad
        const suitsToUse = suits.slice(0, gameState.difficulty);
        
        for (let i = 0; i < 8 / gameState.difficulty; i++) {
            for (const suit of suitsToUse) {
                for (const value of values) {
                    deck.push({
                        suit,
                        value,
                        color: (suit === '♥' || suit === '♦') ? 'red' : 'black',
                        faceUp: false
                    });
                }
            }
        }
        
        gameState.stock = deck;
    }

    function shuffleDeck() {
        // Algoritmo de Fisher-Yates para barajar
        for (let i = gameState.stock.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [gameState.stock[i], gameState.stock[j]] = [gameState.stock[j], gameState.stock[i]];
        }
    }

    function dealInitialCards() {
        // En Spider, se reparten 54 cartas boca abajo (6 en las primeras 4 columnas, 5 en las otras 6)
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 6; j++) {
                if (gameState.stock.length > 0) {
                    const card = gameState.stock.pop();
                    gameState.tableau[i].push(card);
                }
            }
        }
        
        for (let i = 4; i < 10; i++) {
            for (let j = 0; j < 5; j++) {
                if (gameState.stock.length > 0) {
                    const card = gameState.stock.pop();
                    gameState.tableau[i].push(card);
                }
            }
        }
        
        // Voltear la última carta de cada columna
        for (let i = 0; i < 10; i++) {
            if (gameState.tableau[i].length > 0) {
                gameState.tableau[i][gameState.tableau[i].length - 1].faceUp = true;
            }
        }
        
        // Guardar estado inicial en el historial
        saveGameState();
    }

    function dealCards() {
        // En Spider, se reparten 10 cartas (una por columna) cuando se hace clic en el mazo
        if (gameState.stock.length === 0) {
            showMessage("Mazo Vacío", "No quedan cartas en el mazo para repartir.");
            return;
        }
        
        // Verificar que todas las columnas tengan al menos una carta
        for (let i = 0; i < 10; i++) {
            if (gameState.tableau[i].length === 0) {
                showMessage("Movimiento Inválido", "No puedes robar cartas cuando hay columnas vacías. Mueve una carta a la columna vacía primero.");
                return;
            }
        }
        
        // Guardar estado actual para deshacer
        saveGameState();
        
        // Repartir una carta a cada columna
        for (let i = 0; i < 10; i++) {
            if (gameState.stock.length > 0) {
                const card = gameState.stock.pop();
                card.faceUp = true;
                gameState.tableau[i].push(card);
            }
        }
        
        gameState.moves++;
        updateUI();
        checkForCompletedSequences();
    }

    function updateUI() {
        // Limpiar el tableau
        tableauElement.innerHTML = '';
        
        // Actualizar contadores
        movesCountElement.textContent = gameState.moves;
        scoreElement.textContent = gameState.score;
        
        // Actualizar el mazo
        if (gameState.stock.length > 0) {
            stockPile.style.display = 'block';
        } else {
            stockPile.style.display = 'none';
        }
        
        // Actualizar botón de deshacer
        undoBtn.disabled = gameState.history.length === 0;
        
        // Crear las columnas del tableau
        for (let col = 0; col < 10; col++) {
            const columnElement = document.createElement('div');
            columnElement.className = 'column';
            columnElement.dataset.columnIndex = col;
            
            // Añadir espacio para columna vacía (para drag and drop)
            const emptySpot = document.createElement('div');
            emptySpot.className = 'empty-column-spot';
            emptySpot.dataset.columnIndex = col;
            columnElement.appendChild(emptySpot);
            
            // Añadir listener para columna vacía
            emptySpot.addEventListener('click', () => handleEmptyColumnClick(col));
            
            // Añadir cartas a la columna
            const cards = gameState.tableau[col];
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                const cardElement = createCardElement(card, col, i);
                
                // Resaltar si es parte de una pista
                if (gameState.hint && gameState.hint.card === card && gameState.hint.fromColumn === col) {
                    cardElement.classList.add('hint');
                }
                
                columnElement.appendChild(cardElement);
            }
            
            tableauElement.appendChild(columnElement);
        }
    }

    function createCardElement(card, columnIndex, cardIndex) {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.color} ${card.faceUp ? 'face-up' : 'face-down'}`;
        cardElement.dataset.columnIndex = columnIndex;
        cardElement.dataset.cardIndex = cardIndex;
        cardElement.dataset.suit = card.suit;
        cardElement.dataset.value = card.value;
        
        if (card.faceUp) {
            const topValue = document.createElement('div');
            topValue.className = 'card-value top';
            topValue.textContent = card.value;
            cardElement.appendChild(topValue);
            
            const suit = document.createElement('div');
            suit.className = 'card-suit';
            suit.textContent = card.suit;
            cardElement.appendChild(suit);
            
            const bottomValue = document.createElement('div');
            bottomValue.className = 'card-value bottom';
            bottomValue.textContent = card.value;
            cardElement.appendChild(bottomValue);
        }
        
        // Añadir event listeners para drag and drop
        if (card.faceUp) {
            cardElement.draggable = true;
            cardElement.addEventListener('dragstart', handleDragStart);
            cardElement.addEventListener('click', () => handleCardClick(card, columnIndex, cardIndex));
        }
        
        return cardElement;
    }

    function handleDragStart(e) {
        const columnIndex = parseInt(e.target.dataset.columnIndex);
        const cardIndex = parseInt(e.target.dataset.cardIndex);
        
        // Seleccionar la carta y todas las cartas boca arriba debajo de ella
        const column = gameState.tableau[columnIndex];
        let cardsToMove = [];
        
        for (let i = cardIndex; i < column.length; i++) {
            if (column[i].faceUp) {
                cardsToMove.push(column[i]);
            } else {
                break; // No podemos mover cartas boca abajo
            }
        }
        
        // Verificar si el movimiento es válido (todas las cartas deben estar en secuencia descendente y del mismo palo)
        if (!isValidSequence(cardsToMove)) {
            e.preventDefault();
            return;
        }
        
        gameState.selectedCard = cardsToMove[0];
        gameState.selectedColumn = columnIndex;
        gameState.selectedCardIndex = cardIndex;
        
        // Establecer datos para el drag and drop
        e.dataTransfer.setData('text/plain', JSON.stringify({
            fromColumn: columnIndex,
            fromIndex: cardIndex,
            cards: cardsToMove
        }));
        
        // Añadir clase de selección
        e.target.classList.add('selected');
    }

    function handleCardClick(card, columnIndex, cardIndex) {
        // Verificar si hay una carta seleccionada
        if (gameState.selectedCard) {
            // Intentar mover la carta seleccionada a esta posición
            const toColumn = gameState.tableau[columnIndex];
            const targetCard = toColumn.length > 0 ? toColumn[toColumn.length - 1] : null;
            
            // Obtener todas las cartas seleccionadas (desde la seleccionada hasta la última boca arriba)
            const fromColumn = gameState.tableau[gameState.selectedColumn];
            const selectedCards = fromColumn.slice(gameState.selectedCardIndex);
            
            if (isValidMove(selectedCards[0], targetCard) && isValidSequence(selectedCards)) {
                // Guardar estado actual para deshacer
                saveGameState();
                
                moveCards(
                    gameState.selectedColumn, 
                    gameState.selectedCardIndex,
                    columnIndex
                );
            } else {
                // Si el movimiento no es válido, deseleccionar
                clearSelection();
            }
        } else {
            // Seleccionar esta carta si está boca arriba
            if (card.faceUp) {
                gameState.selectedCard = card;
                gameState.selectedColumn = columnIndex;
                gameState.selectedCardIndex = cardIndex;
                
                // Resaltar la carta seleccionada y todas las cartas boca arriba debajo de ella
                const column = gameState.tableau[columnIndex];
                for (let i = cardIndex; i < column.length; i++) {
                    if (column[i].faceUp) {
                        const cardElements = document.querySelectorAll(`.card[data-column-index="${columnIndex}"][data-card-index="${i}"]`);
                        cardElements.forEach(el => el.classList.add('selected'));
                    } else {
                        break;
                    }
                }
            }
        }
    }

    function handleEmptyColumnClick(columnIndex) {
        if (gameState.selectedCard) {
            // Obtener todas las cartas seleccionadas
            const fromColumn = gameState.tableau[gameState.selectedColumn];
            const selectedCards = fromColumn.slice(gameState.selectedCardIndex);
            
            // Verificar que todas las cartas seleccionadas estén en secuencia válida
            if (isValidSequence(selectedCards)) {
                // Guardar estado actual para deshacer
                saveGameState();
                
                moveCards(
                    gameState.selectedColumn, 
                    gameState.selectedCardIndex,
                    columnIndex
                );
            } else {
                clearSelection();
                showMessage("Movimiento Inválido", "Solo puedes mover secuencias completas del mismo palo en orden descendente.");
            }
        }
    }

    function isValidSequence(cards) {
        if (cards.length === 0) return false;
        
        // Verificar que las cartas estén en secuencia descendente y del mismo palo
        for (let i = 0; i < cards.length - 1; i++) {
            const current = cards[i];
            const next = cards[i + 1];
            
            // Convertir valores de cartas a números para comparación
            const currentValue = cardValueToNumber(current.value);
            const nextValue = cardValueToNumber(next.value);
            
            if (currentValue !== nextValue + 1 || current.suit !== next.suit) {
                return false;
            }
        }
        
        return true;
    }

    function cardValueToNumber(value) {
        const values = {
            'A': 1,
            '2': 2,
            '3': 3,
            '4': 4,
            '5': 5,
            '6': 6,
            '7': 7,
            '8': 8,
            '9': 9,
            '10': 10,
            'J': 11,
            'Q': 12,
            'K': 13
        };
        
        return values[value];
    }

    function isValidMove(card, targetCard) {
        // Si no hay carta objetivo (columna vacía), cualquier carta puede moverse allí
        if (!targetCard) return true;
        
        // Convertir valores a números
        const cardValue = cardValueToNumber(card.value);
        const targetValue = cardValueToNumber(targetCard.value);
        
        // En Spider, la carta que se mueve debe ser una menos que la carta objetivo
        return cardValue === targetValue - 1;
    }

    function moveCards(fromColumnIndex, fromCardIndex, toColumnIndex) {
        const fromColumn = gameState.tableau[fromColumnIndex];
        const toColumn = gameState.tableau[toColumnIndex];
        
        // Mover las cartas
        const cardsToMove = fromColumn.splice(fromCardIndex);
        toColumn.push(...cardsToMove);
        
        // Voltear la última carta de la columna de origen si queda alguna
        if (fromColumn.length > 0 && !fromColumn[fromColumn.length - 1].faceUp) {
            fromColumn[fromColumn.length - 1].faceUp = true;
        }
        
        gameState.moves++;
        clearSelection();
        updateUI();
        
        // Verificar si se completó alguna secuencia
        checkForCompletedSequences();
    }

    function checkForCompletedSequences() {
        // En Spider, una secuencia completa es del As al Rey del mismo palo
        for (let col = 0; col < 10; col++) {
            const column = gameState.tableau[col];
            if (column.length < 13) continue;
            
            // Buscar secuencias completas desde el final
            for (let i = column.length - 13; i >= 0; i--) {
                const sequence = column.slice(i, i + 13);
                
                // Verificar si es una secuencia válida del K al A del mismo palo
                if (isCompleteSequence(sequence)) {
                    // Guardar estado actual para deshacer
                    saveGameState();
                    
                    // Eliminar la secuencia del tableau
                    gameState.tableau[col].splice(i, 13);
                    
                    // Añadir a las fundaciones (aunque en Spider no se muestran)
                    gameState.foundations.push(...sequence);
                    
                    // Añadir puntos
                    gameState.score += 100;
                    
                    // Voltear la última carta de la columna si queda alguna
                    if (gameState.tableau[col].length > 0 && !gameState.tableau[col][gameState.tableau[col].length - 1].faceUp) {
                        gameState.tableau[col][gameState.tableau[col].length - 1].faceUp = true;
                    }
                    
                    // Actualizar UI
                    updateUI();
                    
                    // Verificar si el juego ha terminado
                    checkGameWin();
                    
                    // Salir del bucle para esta columna
                    break;
                }
            }
        }
    }

    function isCompleteSequence(sequence) {
        if (sequence.length !== 13) return false;
        
        const suit = sequence[0].suit;
        const expectedValues = ['K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2', 'A'];
        
        for (let i = 0; i < 13; i++) {
            if (sequence[i].value !== expectedValues[i] || sequence[i].suit !== suit) {
                return false;
            }
        }
        
        return true;
    }

    function checkGameWin() {
        // El juego se gana cuando todas las secuencias (8 en total) han sido completadas
        const totalCardsInFoundations = gameState.foundations.length;
        const expectedCards = 8 * 13; // 8 secuencias de 13 cartas cada una
        
        if (totalCardsInFoundations === expectedCards) {
            gameState.gameWon = true;
            gameStatusElement.textContent = "¡Ganaste!";
            
            // Calcular puntuación final
            const finalScore = gameState.score + Math.floor(10000 / gameState.moves);
            gameState.score = finalScore;
            scoreElement.textContent = finalScore;
            
            showMessage("¡Felicidades!", `¡Has ganado el juego con una puntuación de ${finalScore} en ${gameState.moves} movimientos!`);
        }
    }

    function clearSelection() {
        gameState.selectedCard = null;
        gameState.selectedColumn = null;
        gameState.selectedCardIndex = null;
        
        // Eliminar clase de selección de todas las cartas
        document.querySelectorAll('.card.selected').forEach(card => {
            card.classList.remove('selected');
        });
    }

    function saveGameState() {
        // Guardar una copia profunda del estado actual del juego
        const stateCopy = {
            stock: JSON.parse(JSON.stringify(gameState.stock)),
            tableau: JSON.parse(JSON.stringify(gameState.tableau)),
            foundations: JSON.parse(JSON.stringify(gameState.foundations)),
            moves: gameState.moves,
            score: gameState.score,
            gameWon: gameState.gameWon
        };
        
        gameState.history.push(stateCopy);
        
        // Limitar el historial a un tamaño razonable
        if (gameState.history.length > 20) {
            gameState.history.shift();
        }
    }

    function undoMove() {
        if (gameState.history.length === 0) return;
        
        // Obtener el último estado guardado
        const lastState = gameState.history.pop();
        
        // Restaurar el estado del juego
        gameState.stock = lastState.stock;
        gameState.tableau = lastState.tableau;
        gameState.foundations = lastState.foundations;
        gameState.moves = lastState.moves;
        gameState.score = lastState.score;
        gameState.gameWon = lastState.gameWon;
        
        // Limpiar selección
        clearSelection();
        
        // Actualizar UI
        updateUI();
    }

    function showHint() {
        // Limpiar pista anterior
        gameState.hint = null;
        updateUI();
        
        // Buscar posibles movimientos
        for (let fromCol = 0; fromCol < 10; fromCol++) {
            const fromColumn = gameState.tableau[fromCol];
            if (fromColumn.length === 0) continue;
            
            // Buscar desde la última carta hacia arriba
            for (let cardIdx = fromColumn.length - 1; cardIdx >= 0; cardIdx--) {
                const card = fromColumn[cardIdx];
                if (!card.faceUp) break;
                
                // Obtener todas las cartas boca arriba desde esta posición
                const cardsToMove = fromColumn.slice(cardIdx);
                
                // Verificar si es una secuencia válida
                if (!isValidSequence(cardsToMove)) continue;
                
                // Buscar una columna de destino válida
                for (let toCol = 0; toCol < 10; toCol++) {
                    if (fromCol === toCol) continue;
                    
                    const toColumn = gameState.tableau[toCol];
                    const targetCard = toColumn.length > 0 ? toColumn[toColumn.length - 1] : null;
                    
                    if (isValidMove(cardsToMove[0], targetCard)) {
                        // Encontrar una pista válida
                        gameState.hint = {
                            card: card,
                            fromColumn: fromCol,
                            fromIndex: cardIdx,
                            toColumn: toCol,
                            toIndex: toColumn.length > 0 ? toColumn.length - 1 : null
                        };
                        
                        updateUI();
                        return;
                    }
                }
            }
        }
        
        // Si no se encontraron movimientos válidos
        showMessage("Sin Pistas", "No hay movimientos válidos disponibles. Intenta repartir más cartas.");
    }

    // Configurar drag and drop para las columnas
    tableauElement.addEventListener('dragover', e => {
        e.preventDefault();
    });

    tableauElement.addEventListener('drop', e => {
        e.preventDefault();
        
        // Obtener datos de la carta arrastrada
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const fromColumn = data.fromColumn;
        const fromIndex = data.fromIndex;
        const cards = data.cards;
        
        // Obtener columna de destino
        let toColumn;
        if (e.target.classList.contains('empty-column-spot')) {
            toColumn = parseInt(e.target.dataset.columnIndex);
        } else if (e.target.classList.contains('card')) {
            toColumn = parseInt(e.target.dataset.columnIndex);
        } else {
            return;
        }
        
        // Verificar si el movimiento es válido
        const targetColumn = gameState.tableau[toColumn];
        const targetCard = targetColumn.length > 0 ? targetColumn[targetColumn.length - 1] : null;
        
        if (isValidMove(cards[0], targetCard) && isValidSequence(cards)) {
            // Guardar estado actual para deshacer
            saveGameState();
            
            moveCards(fromColumn, fromIndex, toColumn);
        }
    });
});