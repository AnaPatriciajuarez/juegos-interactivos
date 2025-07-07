document.addEventListener("DOMContentLoaded", () => {
    const triviaContainer = document.getElementById("trivia-container");
    const nextButton = document.getElementById("next-button");
    const scoreDisplay = document.getElementById("score");
    const respuestaDisplay = document.getElementById("respuesta");
    const jugarNuevamenteButton = document.getElementById("jugar-nuevamente");
    const questionCount = document.getElementById("question-count");
    const helpBtn = document.getElementById("help-btn");
    const helpModal = document.getElementById("help-modal");
    const helpModalOkBtn = document.getElementById("help-modal-ok-btn");

    let currentQuestionIndex = 0;
    let score = 0;
    let preguntas = [];
    let answered = false;

    // Base de datos de preguntas en español
    const preguntasEspañol = [
        {
            pregunta: "¿Cuál es la capital de España?",
            respuesta_correcta: "Madrid",
            respuestas_incorrectas: ["Barcelona", "Sevilla", "Valencia"]
        },
        {
            pregunta: "¿Qué escritor escribió 'Cien años de soledad'?",
            respuesta_correcta: "Gabriel García Márquez",
            respuestas_incorrectas: ["Mario Vargas Llosa", "Pablo Neruda", "Julio Cortázar"]
        },
        {
            pregunta: "¿En qué año llegó el hombre a la luna?",
            respuesta_correcta: "1969",
            respuestas_incorrectas: ["1958", "1975", "1982"]
        },
        {
            pregunta: "¿Cuál es el río más largo del mundo?",
            respuesta_correcta: "Amazonas",
            respuestas_incorrectas: ["Nilo", "Misisipi", "Yangtsé"]
        },
        {
            pregunta: "¿Quién pintó 'La Guernica'?",
            respuesta_correcta: "Pablo Picasso",
            respuestas_incorrectas: ["Salvador Dalí", "Diego Velázquez", "Francisco de Goya"]
        },
        {
            pregunta: "¿Cuál es el hueso más largo del cuerpo humano?",
            respuesta_correcta: "Fémur",
            respuestas_incorrectas: ["Húmero", "Tibia", "Peroné"]
        },
        {
            pregunta: "¿En qué continente está Egipto?",
            respuesta_correcta: "África",
            respuestas_incorrectas: ["Asia", "Europa", "América"]
        },
        {
            pregunta: "¿Cuál es el planeta más grande del sistema solar?",
            respuesta_correcta: "Júpiter",
            respuestas_incorrectas: ["Saturno", "Tierra", "Neptuno"]
        },
        {
            pregunta: "¿Qué elemento químico tiene el símbolo 'Au'?",
            respuesta_correcta: "Oro",
            respuestas_incorrectas: ["Plata", "Plomo", "Arsénico"]
        },
        {
            pregunta: "¿Cuántos lados tiene un heptágono?",
            respuesta_correcta: "7",
            respuestas_incorrectas: ["5", "6", "8"]
        },
        {
            pregunta: "¿Quién compuso la 'Quinta Sinfonía'?",
            respuesta_correcta: "Ludwig van Beethoven",
            respuestas_incorrectas: ["Wolfgang Amadeus Mozart", "Johann Sebastian Bach", "Pyotr Ilyich Tchaikovsky"]
        },
        {
            pregunta: "¿Cuál es el océano más grande del mundo?",
            respuesta_correcta: "Pacífico",
            respuestas_incorrectas: ["Atlántico", "Índico", "Ártico"]
        },
        {
            pregunta: "¿Qué país tiene la forma de una bota?",
            respuesta_correcta: "Italia",
            respuestas_incorrectas: ["Francia", "España", "Grecia"]
        },
        {
            pregunta: "¿Cuál es el metal más caro del mundo?",
            respuesta_correcta: "Rodio",
            respuestas_incorrectas: ["Oro", "Platino", "Paladio"]
        },
        {
            pregunta: "¿En qué año comenzó la Segunda Guerra Mundial?",
            respuesta_correcta: "1939",
            respuestas_incorrectas: ["1914", "1941", "1945"]
        },
        {
            pregunta: "¿Quién pintó la Mona Lisa?",
            respuesta_correcta: "Leonardo da Vinci",
            respuestas_incorrectas: ["Pablo Picasso", "Salvador Dalí", "Vincent van Gogh"]
        },
        {
            pregunta: "¿Cuál es la moneda oficial de Japón?",
            respuesta_correcta: "Yen",
            respuestas_incorrectas: ["Won", "Baht", "Dólar"]
        },
        {
            pregunta: "¿Cuántos elementos químicos tiene la tabla periódica?",
            respuesta_correcta: "118",
            respuestas_incorrectas: ["108", "120", "116"]
        },
        {
            pregunta: "¿Quién fue el primer hombre en caminar sobre la luna?",
            respuesta_correcta: "Neil Armstrong",
            respuestas_incorrectas: ["Buzz Aldrin", "Yuri Gagarin", "Michael Collins"]
        },
        {
            pregunta: "¿En qué país se encuentra la Torre Eiffel?",
            respuesta_correcta: "Francia",
            respuestas_incorrectas: ["Italia", "España", "Alemania"]
        }
    ];

    // Función para inicializar el juego
    const iniciarJuego = () => {
        // Mezclar preguntas y seleccionar 10
        preguntas = [...preguntasEspañol].sort(() => Math.random() - 0.5).slice(0, 10);
        currentQuestionIndex = 0;
        score = 0;
        scoreDisplay.textContent = "Puntuación: 0";
        respuestaDisplay.textContent = "";
        nextButton.style.display = "none";
        actualizarContadorPreguntas();
        mostrarPregunta();
    };

    // Actualizar contador de preguntas
    const actualizarContadorPreguntas = () => {
        questionCount.textContent = `Pregunta ${currentQuestionIndex + 1} de ${preguntas.length}`;
    };

    // Mostrar pregunta actual
    const mostrarPregunta = () => {
        answered = false;
        const pregunta = preguntas[currentQuestionIndex];
        
        // Mezclar respuestas
        const todasRespuestas = [
            ...pregunta.respuestas_incorrectas, 
            pregunta.respuesta_correcta
        ].sort(() => Math.random() - 0.5);
        
        triviaContainer.innerHTML = `
            <h2>${pregunta.pregunta}</h2>
            <ul>
                ${todasRespuestas.map(respuesta => `
                    <li>
                        <button class="answer-btn">${respuesta}</button>
                    </li>
                `).join('')}
            </ul>
        `;

        // Agregar event listeners a los botones
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!answered) {
                    verificarRespuesta(e.target, pregunta.respuesta_correcta);
                    answered = true;
                }
            });
        });
    };

    // Verificar respuesta
    const verificarRespuesta = (botonSeleccionado, respuestaCorrecta) => {
        const botones = document.querySelectorAll('.answer-btn');
        
        botones.forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === respuestaCorrecta) {
                btn.classList.add('correct');
            } else if (btn === botonSeleccionado) {
                btn.classList.add('incorrect');
            }
        });

        if (botonSeleccionado.textContent === respuestaCorrecta) {
            score++;
            respuestaDisplay.textContent = "✅ ¡Respuesta Correcta!";
            respuestaDisplay.style.color = "#4CAF50";
        } else {
            respuestaDisplay.textContent = `❌ Respuesta incorrecta. La correcta es: ${respuestaCorrecta}`;
            respuestaDisplay.style.color = "#FF5722";
        }

        scoreDisplay.textContent = `Puntuación: ${score}`;
        nextButton.style.display = "inline-block";
    };

    // Siguiente pregunta
    const siguientePregunta = () => {
        currentQuestionIndex++;
        respuestaDisplay.textContent = "";
        respuestaDisplay.style.color = "";
        nextButton.style.display = "none";
        actualizarContadorPreguntas();

        if (currentQuestionIndex < preguntas.length) {
            mostrarPregunta();
        } else {
            mostrarResultadoFinal();
        }
    };

    // Mostrar resultado final
    const mostrarResultadoFinal = () => {
        const porcentaje = Math.round((score / preguntas.length) * 100);
        let mensaje = "";
        
        if (porcentaje >= 90) mensaje = "🏆 ¡Excelente! Eres un experto en trivia";
        else if (porcentaje >= 70) mensaje = "👍 ¡Muy bien! Buen conocimiento general";
        else if (porcentaje >= 50) mensaje = "😊 Bien hecho, pero puedes mejorar";
        else mensaje = "📚 Sigue aprendiendo, ¡la práctica hace al maestro!";

        triviaContainer.innerHTML = `
            <h2>¡Juego Terminado!</h2>
            <p class="final-score">Obtuviste ${score} de ${preguntas.length} puntos</p>
            <p>${porcentaje}% de respuestas correctas</p>
            <p>${mensaje}</p>
        `;
    };

    // Event listeners
    nextButton.addEventListener("click", siguientePregunta);
    jugarNuevamenteButton.addEventListener("click", iniciarJuego);
    helpBtn.addEventListener("click", () => {
        helpModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    helpModalOkBtn.addEventListener("click", () => {
        helpModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    window.addEventListener("click", (e) => {
        if (e.target === helpModal) {
            helpModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Inicializar juego
    iniciarJuego();
});