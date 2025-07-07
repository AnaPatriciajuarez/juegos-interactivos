document.addEventListener('DOMContentLoaded', () => {
    // Tablero de ejemplo (0 = celda vacía)
    const ejemploTablero = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];

    // Estado del juego
    let tablero = [];
    let solucion = [];
    let celdasFijas = [];
    let nivelDificultad = 'facil';
    let pistasUsadas = 0;
    
    // Referencias a elementos DOM
    const tableroElement = document.getElementById('tablero');
    const mensajeElement = document.getElementById('mensaje');
    const btnValidar = document.getElementById('validar');
    const btnLimpiar = document.getElementById('limpiar');
    const btnPista = document.getElementById('pista');
    const btnNuevoJuego = document.getElementById('nuevo-juego');
    const btnFacil = document.getElementById('facil');
    const btnMedio = document.getElementById('medio');
    const btnDificil = document.getElementById('dificil');
    const btnAyuda = document.getElementById('ayuda-btn');
    const celdasVaciasElement = document.getElementById('celdas-vacias');
    const pistasUsadasElement = document.getElementById('pistas-usadas');
    const modalInstrucciones = document.getElementById('instrucciones-modal');
    const modalOkBtn = document.getElementById('modal-ok-btn');

    // Inicializar el juego
    inicializarJuego();

    // Event listeners
    btnValidar.addEventListener('click', validarTablero);
    btnLimpiar.addEventListener('click', limpiarCeldas);
    btnPista.addEventListener('click', darPista);
    btnNuevoJuego.addEventListener('click', inicializarJuego);
    btnAyuda.addEventListener('click', mostrarInstrucciones);
    modalOkBtn.addEventListener('click', cerrarInstrucciones);
    
    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target === modalInstrucciones) {
            cerrarInstrucciones();
        }
    });
    
    btnFacil.addEventListener('click', () => cambiarDificultad('facil'));
    btnMedio.addEventListener('click', () => cambiarDificultad('medio'));
    btnDificil.addEventListener('click', () => cambiarDificultad('dificil'));

    // Funciones del juego
    function inicializarJuego() {
        // Reiniciar contadores
        pistasUsadas = 0;
        pistasUsadasElement.textContent = pistasUsadas;
        
        // Reiniciar mensaje
        mensajeElement.textContent = '';
        mensajeElement.style.color = '#E0E0E0';
        
        // Generar un nuevo tablero con solución
        generarTablero();
        
        // Renderizar el tablero
        renderizarTablero();
        
        // Actualizar contador de celdas vacías
        actualizarCeldasVacias();
    }

    function generarTablero() {
        // Para simplificar, usaremos el tablero de ejemplo como solución
        solucion = JSON.parse(JSON.stringify(ejemploTablero));
        
        // Crear una copia para el tablero jugable
        tablero = JSON.parse(JSON.stringify(solucion));
        
        // Determinar cuántas celdas vaciar según la dificultad
        let celdasAEliminar;
        switch(nivelDificultad) {
            case 'facil':
                celdasAEliminar = 35;
                break;
            case 'medio':
                celdasAEliminar = 45;
                break;
            case 'dificil':
                celdasAEliminar = 55;
                break;
            default:
                celdasAEliminar = 40;
        }
        
        // Crear un array con todas las posiciones
        const todasPosiciones = [];
        for (let fila = 0; fila < 9; fila++) {
            for (let col = 0; col < 9; col++) {
                todasPosiciones.push({fila, col});
            }
        }
        
        // Aleatorizar las posiciones
        for (let i = todasPosiciones.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [todasPosiciones[i], todasPosiciones[j]] = [todasPosiciones[j], todasPosiciones[i]];
        }
        
        // Vaciar las celdas seleccionadas
        for (let i = 0; i < celdasAEliminar; i++) {
            const {fila, col} = todasPosiciones[i];
            tablero[fila][col] = 0;
        }
        
        // Identificar celdas fijas (no vacías)
        celdasFijas = [];
        for (let fila = 0; fila < 9; fila++) {
            for (let col = 0; col < 9; col++) {
                if (tablero[fila][col] !== 0) {
                    celdasFijas.push(`${fila}-${col}`);
                }
            }
        }
    }

    function renderizarTablero() {
        tableroElement.innerHTML = '';
        
        for (let fila = 0; fila < 9; fila++) {
            for (let col = 0; col < 9; col++) {
                const valor = tablero[fila][col];
                const celda = document.createElement('input');
                celda.type = 'text';
                celda.maxLength = 1;
                celda.className = 'cell';
                celda.dataset.fila = fila;
                celda.dataset.col = col;
                
                // Si es una celda fija, mostrar el valor y hacerla de solo lectura
                if (celdasFijas.includes(`${fila}-${col}`)) {
                    celda.value = valor;
                    celda.classList.add('fixed');
                    celda.readOnly = true;
                } else {
                    if (valor !== 0) {
                        celda.value = valor;
                    }
                    celda.addEventListener('input', manejarInputCelda);
                }
                
                tableroElement.appendChild(celda);
            }
        }
    }

    function manejarInputCelda(event) {
        const celda = event.target;
        const valor = celda.value;
        
        // Solo permitir números del 1 al 9
        if (valor !== '' && !/^[1-9]$/.test(valor)) {
            celda.value = '';
            return;
        }
        
        // Actualizar el estado del tablero
        const fila = parseInt(celda.dataset.fila);
        const col = parseInt(celda.dataset.col);
        tablero[fila][col] = valor === '' ? 0 : parseInt(valor);
        
        // Validar la celda actual
        validarCelda(fila, col);
        
        // Actualizar contador de celdas vacías
        actualizarCeldasVacias();
    }

    function validarCelda(fila, col) {
        const celda = document.querySelector(`.cell[data-fila="${fila}"][data-col="${col}"]`);
        const valor = tablero[fila][col];
        
        if (valor === 0) {
            celda.style.backgroundColor = 'rgba(70, 70, 90, 0.7)';
            return;
        }
        
        // Verificar si el valor es válido en su fila, columna y subcuadrícula
        const esValido = (
            esValidoEnFila(fila, col) &&
            esValidoEnColumna(fila, col) &&
            esValidoEnSubcuadricula(fila, col)
        );
        
        celda.style.backgroundColor = esValido ? 'rgba(70, 70, 90, 0.7)' : 'rgba(77, 26, 26, 0.7)';
    }

    function esValidoEnFila(fila, col) {
        const valor = tablero[fila][col];
        
        for (let c = 0; c < 9; c++) {
            if (c !== col && tablero[fila][c] === valor) {
                return false;
            }
        }
        
        return true;
    }

    function esValidoEnColumna(fila, col) {
        const valor = tablero[fila][col];
        
        for (let f = 0; f < 9; f++) {
            if (f !== fila && tablero[f][col] === valor) {
                return false;
            }
        }
        
        return true;
    }

    function esValidoEnSubcuadricula(fila, col) {
        const valor = tablero[fila][col];
        const inicioFila = Math.floor(fila / 3) * 3;
        const inicioCol = Math.floor(col / 3) * 3;
        
        for (let f = inicioFila; f < inicioFila + 3; f++) {
            for (let c = inicioCol; c < inicioCol + 3; c++) {
                if (f !== fila && c !== col && tablero[f][c] === valor) {
                    return false;
                }
            }
        }
        
        return true;
    }

    function validarTablero() {
        // Verificar si todas las celdas están llenas
        for (let fila = 0; fila < 9; fila++) {
            for (let col = 0; col < 9; col++) {
                if (tablero[fila][col] === 0) {
                    mensajeElement.textContent = '¡Aún faltan números por completar!';
                    mensajeElement.style.color = '#FF4081';
                    return;
                }
            }
        }
        
        // Verificar si el tablero es válido
        for (let fila = 0; fila < 9; fila++) {
            for (let col = 0; col < 9; col++) {
                if (!esValidoEnFila(fila, col) || 
                    !esValidoEnColumna(fila, col) || 
                    !esValidoEnSubcuadricula(fila, col)) {
                    mensajeElement.textContent = '¡Ups! Hay errores en la solución.';
                    mensajeElement.style.color = '#FF4081';
                    return;
                }
            }
        }
        
        // Si llegamos aquí, el tablero es válido
        mensajeElement.textContent = '¡Felicidades! Has resuelto el Sudoku correctamente.';
        mensajeElement.style.color = '#4CAF50';
    }

    function limpiarCeldas() {
        for (let fila = 0; fila < 9; fila++) {
            for (let col = 0; col < 9; col++) {
                if (!celdasFijas.includes(`${fila}-${col}`)) {
                    tablero[fila][col] = 0;
                    const celda = document.querySelector(`.cell[data-fila="${fila}"][data-col="${col}"]`);
                    if (celda) {
                        celda.value = '';
                        celda.style.backgroundColor = 'rgba(70, 70, 90, 0.7)';
                    }
                }
            }
        }
        mensajeElement.textContent = '';
        actualizarCeldasVacias();
    }

    function darPista() {
        // Encontrar celdas vacías
        const celdasVacias = [];
        for (let fila = 0; fila < 9; fila++) {
            for (let col = 0; col < 9; col++) {
                if (tablero[fila][col] === 0) {
                    celdasVacias.push({fila, col});
                }
            }
        }
        
        if (celdasVacias.length === 0) {
            mensajeElement.textContent = '¡El tablero ya está completo!';
            mensajeElement.style.color = '#FF4081';
            return;
        }
        
        // Seleccionar una celda vacía aleatoria
        const randomIndex = Math.floor(Math.random() * celdasVacias.length);
        const {fila, col} = celdasVacias[randomIndex];
        
        // Obtener el valor correcto de la solución
        const valorCorrecto = solucion[fila][col];
        
        // Actualizar el tablero y la celda
        tablero[fila][col] = valorCorrecto;
        const celda = document.querySelector(`.cell[data-fila="${fila}"][data-col="${col}"]`);
        celda.value = valorCorrecto;
        celda.style.backgroundColor = 'rgba(70, 70, 90, 0.7)';
        
        // Incrementar contador de pistas
        pistasUsadas++;
        pistasUsadasElement.textContent = pistasUsadas;
        
        // Mostrar mensaje
        mensajeElement.textContent = `Pista: Celda (${fila+1}, ${col+1}) = ${valorCorrecto}`;
        mensajeElement.style.color = '#4CAF50';
        
        // Actualizar contador de celdas vacías
        actualizarCeldasVacias();
    }

    function cambiarDificultad(nivel) {
        nivelDificultad = nivel;
        
        // Actualizar botones de dificultad
        btnFacil.classList.toggle('active', nivel === 'facil');
        btnMedio.classList.toggle('active', nivel === 'medio');
        btnDificil.classList.toggle('active', nivel === 'dificil');
        
        // Reiniciar el juego con la nueva dificultad
        inicializarJuego();
    }
    
    function actualizarCeldasVacias() {
        let vacias = 0;
        for (let fila = 0; fila < 9; fila++) {
            for (let col = 0; col < 9; col++) {
                if (tablero[fila][col] === 0) {
                    vacias++;
                }
            }
        }
        celdasVaciasElement.textContent = vacias;
    }
    
    function mostrarInstrucciones() {
        modalInstrucciones.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    function cerrarInstrucciones() {
        modalInstrucciones.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});