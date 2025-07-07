        // Base de datos de palabras por categoría
        const palabras = {
            paises: ["ESPAÑA", "FRANCIA", "ITALIA", "ALEMANIA", "JAPON", "BRASIL", "CANADA", "MEXICO", "CHINA", "INDIA"],
            frutas: ["MANZANA", "PLATANO", "NARANJA", "FRESA", "SANDIA", "UVA", "PERA", "MELON", "KIWI", "PINA"],
            peliculas: ["TITANIC", "AVATAR", "MATRIX", "TOYSTORY", "FROZEN", "JURASSIC", "HARRYPOTTER", "SPIDERMAN", "BATMAN", "SUPERMAN"],
            animales: ["ELEFANTE", "TIGRE", "LEON", "JIRAFA", "CEBRA", "OSO", "LOBO", "AGUILA", "DELFIN", "TIBURON"],
            deportes: ["FUTBOL", "BALONCESTO", "TENIS", "NATACION", "CICLISMO", "ATLETISMO", "VOLEIBOL", "BEISBOL", "AJEDREZ", "GOLF"]
        };
        
        // Variables del juego
        let palabraSecreta = "";
        let palabraAdivinada = [];
        let intentosRestantes = 6;
        let letrasIncorrectas = [];
        let categoriaSeleccionada = "paises";
        
        // Elementos DOM
        const palabraElement = document.getElementById('palabra');
        const intentosElement = document.getElementById('intentos');
        const mensajeElement = document.getElementById('mensaje');
        const letraInput = document.getElementById('letra');
        const intentarBtn = document.getElementById('intentar');
        const reiniciarBtn = document.getElementById('reiniciar');
        const categoriaSelect = document.getElementById('categoria');
        const victoryModal = document.getElementById('victory-modal');
        const defeatModal = document.getElementById('defeat-modal');
        const closeVictoryBtn = document.getElementById('close-victory-modal');
        const closeDefeatBtn = document.getElementById('close-defeat-modal');
        const palabraPerdidaElement = document.getElementById('palabra-perdida');
        const helpBtn = document.getElementById('help-btn');
        const helpModal = document.getElementById('help-modal');
        const helpModalOkBtn = document.getElementById('help-modal-ok-btn');
        const closeModal = document.querySelectorAll('.close-modal');
        
        // Elementos del dibujo del ahorcado
        const cabeza = document.querySelector('.cabeza');
        const cuerpo = document.querySelector('.cuerpo');
        const brazos = document.querySelector('.brazos');
        const piernas = document.querySelector('.piernas');
        
        // Inicializar el juego
        function iniciarJuego() {
            // Obtener categoría seleccionada
            categoriaSeleccionada = categoriaSelect.value;
            
            // Seleccionar palabra aleatoria de la categoría
            const listaPalabras = palabras[categoriaSeleccionada];
            palabraSecreta = listaPalabras[Math.floor(Math.random() * listaPalabras.length)];
            
            // Inicializar variables
            palabraAdivinada = Array(palabraSecreta.length).fill('_');
            intentosRestantes = 6;
            letrasIncorrectas = [];
            
            // Actualizar la interfaz
            actualizarPalabra();
            intentosElement.textContent = intentosRestantes;
            mensajeElement.textContent = "";
            mensajeElement.style.color = "";
            letraInput.value = "";
            letraInput.disabled = false;
            intentarBtn.disabled = false;
            reiniciarBtn.disabled = false;
            palabraElement.style.color = "#FF4081";
            
            // Reiniciar dibujo del ahorcado
            cabeza.style.display = 'none';
            cuerpo.style.display = 'none';
            brazos.style.display = 'none';
            piernas.style.display = 'none';
        }
        
        // Actualizar la palabra mostrada
        function actualizarPalabra() {
            palabraElement.textContent = palabraAdivinada.join(' ');
            
            // Comprobar si se ha ganado
            if (!palabraAdivinada.includes('_')) {
                mostrarVictoria();
            }
        }
        
        // Intentar una letra
        function intentarLetra() {
            const letra = letraInput.value.toUpperCase();
            
            // Validar entrada
            if (!letra || !/^[A-ZÑ]$/.test(letra)) {
                mensajeElement.textContent = "Por favor, ingresa una letra válida";
                mensajeElement.style.color = "#FF4B2B";
                return;
            }
            
            // Comprobar si la letra ya se intentó
            if (palabraAdivinada.includes(letra) || letrasIncorrectas.includes(letra)) {
                mensajeElement.textContent = `Ya has intentado la letra ${letra}`;
                mensajeElement.style.color = "#FF4B2B";
                return;
            }
            
            letraInput.value = "";
            
            // Comprobar si la letra está en la palabra
            if (palabraSecreta.includes(letra)) {
                mensajeElement.textContent = `¡Correcto! La letra ${letra} está en la palabra`;
                mensajeElement.style.color = "#00e676";
                
                // Actualizar la palabra adivinada
                for (let i = 0; i < palabraSecreta.length; i++) {
                    if (palabraSecreta[i] === letra) {
                        palabraAdivinada[i] = letra;
                    }
                }
                
                actualizarPalabra();
            } else {
                // Letra incorrecta
                mensajeElement.textContent = `Incorrecto. La letra ${letra} no está en la palabra`;
                mensajeElement.style.color = "#FF4B2B";
                intentosRestantes--;
                intentosElement.textContent = intentosRestantes;
                letrasIncorrectas.push(letra);
                
                // Actualizar dibujo del ahorcado
                actualizarDibujo();
                
                // Comprobar si se ha perdido
                if (intentosRestantes === 0) {
                    mostrarDerrota();
                }
            }
        }
        
        // Actualizar el dibujo del ahorcado
        function actualizarDibujo() {
            const errores = 6 - intentosRestantes;
            
            if (errores >= 1) cabeza.style.display = 'block';
            if (errores >= 2) cuerpo.style.display = 'block';
            if (errores >= 3) brazos.style.display = 'block';
            if (errores >= 4) piernas.style.display = 'block';
        }
        
        // Mostrar modal de victoria
        function mostrarVictoria() {
            victoryModal.style.display = 'flex';
            letraInput.disabled = true;
            intentarBtn.disabled = true;
        }
        
        // Mostrar modal de derrota
        function mostrarDerrota() {
            palabraPerdidaElement.textContent = palabraSecreta;
            palabraElement.textContent = palabraSecreta.split('').join(' ');
            palabraElement.style.color = "#FF4B2B";
            defeatModal.style.display = 'flex';
            letraInput.disabled = true;
            intentarBtn.disabled = true;
        }
        
        // Cerrar modales
        function cerrarModales() {
            victoryModal.style.display = 'none';
            defeatModal.style.display = 'none';
            iniciarJuego();
        }
        
        // Event listeners
        intentarBtn.addEventListener('click', intentarLetra);
        reiniciarBtn.addEventListener('click', iniciarJuego);
        closeVictoryBtn.addEventListener('click', cerrarModales);
        closeDefeatBtn.addEventListener('click', cerrarModales);
        categoriaSelect.addEventListener('change', iniciarJuego);
        
        // Permitir presionar Enter para intentar letra
        letraInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                intentarLetra();
            }
        });
        
        // Event listeners para el modal de ayuda
        helpBtn.addEventListener('click', () => {
            helpModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
        
        helpModalOkBtn.addEventListener('click', () => {
            helpModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        closeModal.forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
                document.body.style.overflow = 'auto';
            });
        });
        
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Iniciar el juego al cargar la página
        window.addEventListener('DOMContentLoaded', iniciarJuego);