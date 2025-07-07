document.addEventListener("DOMContentLoaded", () => {
    const mathContainer = document.getElementById("math-container");
    const nextButton = document.getElementById("next-math-button");
    const mathScoreDisplay = document.getElementById("math-score");
    const jugarNuevamenteButton = document.getElementById("jugar-nuevamente");
    const resultMessage = document.getElementById("result-message");
    const questionCount = document.getElementById("question-count");
    const helpBtn = document.getElementById("help-btn");
    const helpModal = document.getElementById("help-modal");
    const helpModalOkBtn = document.getElementById("help-modal-ok-btn");

    let score = 0;
    let currentQuestionIndex = 0;
    const totalQuestions = 5;
    let currentResult = 0;
    let answered = false;

    // Función para inicializar el juego
    const iniciarJuego = () => {
        score = 0;
        currentQuestionIndex = 0;
        mathScoreDisplay.textContent = "Puntuación: 0";
        resultMessage.textContent = "";
        nextButton.style.display = "none";
        actualizarContadorPreguntas();
        generarOperacionMatematica();
    };

    // Actualizar contador de preguntas
    const actualizarContadorPreguntas = () => {
        questionCount.textContent = `Pregunta ${currentQuestionIndex + 1} de ${totalQuestions}`;
    };

    // Función para generar una operación matemática aleatoria
    function generarOperacionMatematica() {
        answered = false;
        const operations = [
            { type: '+', name: 'suma' },
            { type: '-', name: 'resta' },
            { type: '*', name: 'multiplicación' },
            { type: '/', name: 'división' }
        ];
        
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let num1, num2;
        
        if (operation.type === '/') {
            // Para división, asegurar que sea exacta
            num2 = Math.floor(Math.random() * 9) + 1;
            const multiplier = Math.floor(Math.random() * 9) + 1;
            num1 = num2 * multiplier;
            currentResult = multiplier;
        } else {
            num1 = Math.floor(Math.random() * 20) + 1;
            num2 = Math.floor(Math.random() * 15) + 1;
            
            switch(operation.type) {
                case '+': currentResult = num1 + num2; break;
                case '-': 
                    if (num1 < num2) [num1, num2] = [num2, num1];
                    currentResult = num1 - num2; 
                    break;
                case '*': currentResult = num1 * num2; break;
            }
        }
        
        mathContainer.innerHTML = `
            <h2>Resuelve la operación: ${num1} ${operation.type} ${num2}</h2>
            <form id="math-form">
                <input type="number" id="respuesta-matematica" placeholder="Tu respuesta">
                <button type="button" id="validate-math">Validar</button>
            </form>
        `;
        
        // Validar la respuesta
        document.getElementById("validate-math").addEventListener("click", validarRespuesta);
        
        // Permitir presionar Enter para validar
        document.getElementById("respuesta-matematica").addEventListener("keyup", function(event) {
            if (event.key === "Enter") {
                validarRespuesta();
            }
        });
        
        // Ocultar mensaje de resultado
        resultMessage.textContent = "";
        nextButton.style.display = "none";
    }

    function validarRespuesta() {
        if (answered) return;
        
        const respuestaInput = document.getElementById("respuesta-matematica");
        const respuesta = parseFloat(respuestaInput.value);
        
        if (isNaN(respuesta)) {
            resultMessage.textContent = "Por favor, ingresa un número válido";
            resultMessage.style.color = "#FF4B2B";
            return;
        }
        
        if (Math.abs(respuesta - currentResult) < 0.01) {
            score++;
            mathScoreDisplay.textContent = `Puntuación: ${score}`;
            resultMessage.textContent = "¡Respuesta correcta!";
            resultMessage.style.color = "#00e676";
            resultMessage.classList.add("correct");
        } else {
            resultMessage.textContent = `Respuesta incorrecta. El resultado es ${currentResult}`;
            resultMessage.style.color = "#FF4B2B";
            resultMessage.classList.add("incorrect");
        }
        
        answered = true;
        document.getElementById("validate-math").disabled = true;
        nextButton.style.display = "inline-block";
        actualizarContadorPreguntas();
    }

    // Función para pasar a la siguiente pregunta
    function siguientePregunta() {
        resultMessage.textContent = "";
        resultMessage.classList.remove("correct", "incorrect");
        
        currentQuestionIndex++;
        actualizarContadorPreguntas();
        
        if (currentQuestionIndex < totalQuestions) {
            generarOperacionMatematica();
        } else {
            mostrarResultadoFinal();
        }
    }

    // Mostrar resultado final
    const mostrarResultadoFinal = () => {
        const porcentaje = Math.round((score / totalQuestions) * 100);
        let mensaje = "";
        
        if (porcentaje >= 90) mensaje = "🏆 ¡Excelente! Eres un genio de las matemáticas";
        else if (porcentaje >= 70) mensaje = "👍 ¡Muy bien! Buenas habilidades matemáticas";
        else if (porcentaje >= 50) mensaje = "😊 Bien hecho, pero puedes mejorar con práctica";
        else mensaje = "📚 Sigue practicando, ¡las matemáticas se dominan con ejercicio!";

        mathContainer.innerHTML = `
            <h2>¡Juego Terminado!</h2>
            <p class="final-score">Obtuviste ${score} de ${totalQuestions} puntos</p>
            <p>${porcentaje}% de respuestas correctas</p>
            <p>${mensaje}</p>
        `;
        
        nextButton.style.display = "none";
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