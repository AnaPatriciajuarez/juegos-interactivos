        document.addEventListener("DOMContentLoaded", () => {
            const tablero = document.getElementById("tablero");
            const mensaje = document.getElementById("mensaje");
            const reiniciarButton = document.getElementById("reiniciar");
            const temporizadorDisplay = document.getElementById("time-left");
            const victoryModal = document.getElementById("victory-modal");
            const defeatModal = document.getElementById("defeat-modal");
            const closeVictoryModalButton = document.getElementById("close-victory-modal");
            const closeDefeatModalButton = document.getElementById("close-defeat-modal");
            const helpBtn = document.getElementById("help-btn");
            const helpModal = document.getElementById("help-modal");
            const helpModalOkBtn = document.getElementById("help-modal-ok-btn");
            const closeModal = document.querySelectorAll(".close-modal");

            let cartas = [];
            let cartasVolteadas = [];
            let emparejamientos = 0;
            let totalCartas = 8; // Número de pares
            let cartasSeleccionadas = 0;
            let tiempoRestante = 60; // 60 segundos para completar el juego
            let temporizadorInterval;
            let juegoActivo = false;

            // Función para generar el tablero de memorama
            function crearTablero() {
                tablero.innerHTML = "";
                
                // Generar un array de 8 pares de números
                const numeros = [];
                for (let i = 1; i <= totalCartas; i++) {
                    numeros.push(i, i); // Crear un par de números
                }

                // Mezclar las cartas
                cartas = numeros.sort(() => Math.random() - 0.5);

                // Crear las cartas y añadirlas al tablero
                cartas.forEach((numero, index) => {
                    const carta = document.createElement("div");
                    carta.classList.add("carta");
                    carta.dataset.numero = numero;
                    carta.addEventListener("click", voltearCarta);
                    
                    // Crear las dos caras de la carta
                    const frontal = document.createElement("div");
                    frontal.classList.add("cara", "frontal");
                    frontal.textContent = "?";
                    
                    const trasera = document.createElement("div");
                    trasera.classList.add("cara", "trasera");
                    trasera.textContent = numero;
                    
                    carta.appendChild(frontal);
                    carta.appendChild(trasera);
                    
                    tablero.appendChild(carta);
                });
            }

            // Función para voltear una carta
            function voltearCarta(event) {
                if (!juegoActivo) return;
                
                const carta = event.target.closest('.carta');

                // No hacer nada si la carta ya está volteada o ya ha sido emparejada
                if (carta.classList.contains("volteada") || carta.classList.contains("emparejada") || cartasSeleccionadas === 2) return;

                carta.classList.add("volteada");
                cartasVolteadas.push(carta);
                cartasSeleccionadas++;

                // Si se han volteado dos cartas, comprobar si son iguales
                if (cartasSeleccionadas === 2) {
                    setTimeout(comprobarCoincidencia, 1000);
                }
            }

            // Función para comprobar si las cartas volteadas coinciden
            function comprobarCoincidencia() {
                const [carta1, carta2] = cartasVolteadas;

                if (carta1.dataset.numero === carta2.dataset.numero) {
                    emparejamientos++;
                    mensaje.textContent = `¡Emparejaste! Pares encontrados: ${emparejamientos}/${totalCartas}`;
                    mensaje.style.color = "#00e676";
                    // Marcar como emparejadas
                    carta1.classList.add("emparejada");
                    carta2.classList.add("emparejada");
                    if (emparejamientos === totalCartas) {
                        mostrarVictoria();
                    }
                } else {
                    mensaje.textContent = "¡Inténtalo de nuevo!";
                    mensaje.style.color = "#FF4B2B";
                    // Voltear de nuevo las cartas
                    carta1.classList.remove("volteada");
                    carta2.classList.remove("volteada");
                }

                // Resetear variables
                cartasVolteadas = [];
                cartasSeleccionadas = 0;
            }

            // Función para mostrar el mensaje de victoria en un modal
            function mostrarVictoria() {
                juegoActivo = false;
                clearInterval(temporizadorInterval); // Detener el temporizador
                victoryModal.style.display = "flex";
            }

            // Función para mostrar el mensaje de derrota cuando se acaba el tiempo
            function mostrarDerrota() {
                juegoActivo = false;
                defeatModal.style.display = "flex";
            }

            // Función para reiniciar el juego
            function reiniciarJuego() {
                juegoActivo = true;
                emparejamientos = 0;
                mensaje.textContent = "";
                mensaje.style.color = "";
                temporizadorDisplay.textContent = "60"; // Resetear el temporizador
                tiempoRestante = 60; // Resetear el tiempo
                tablero.innerHTML = ""; // Limpiar el tablero
                crearTablero(); // Crear un nuevo tablero
                iniciarTemporizador(); // Iniciar un nuevo temporizador
            }

            // Función para iniciar el temporizador
            function iniciarTemporizador() {
                clearInterval(temporizadorInterval); // Limpiar cualquier temporizador existente
                
                temporizadorInterval = setInterval(() => {
                    tiempoRestante--;
                    temporizadorDisplay.textContent = tiempoRestante;

                    if (tiempoRestante <= 0) {
                        clearInterval(temporizadorInterval);
                        mostrarDerrota();
                    }
                }, 1000);
            }

            // Event listeners para los modales
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

            // Manejar el botón de reiniciar
            reiniciarButton.addEventListener("click", reiniciarJuego);

            // Manejar el botón de cerrar el modal de victoria
            closeVictoryModalButton.addEventListener("click", () => {
                victoryModal.style.display = "none";
                reiniciarJuego(); // Reiniciar el juego después de la victoria
            });

            // Manejar el botón de cerrar el modal de derrota
            closeDefeatModalButton.addEventListener("click", () => {
                defeatModal.style.display = "none";
                reiniciarJuego(); // Reiniciar el juego después de la derrota
            });

            // Iniciar el juego
            reiniciarJuego();
        });