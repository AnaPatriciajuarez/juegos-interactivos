// Base de datos de historias
const stories = {
    1: {
        title: "El Bosque Encantado",
        scenes: {
            1: {
                text: "Te encuentras en un bosque denso y misterioso. La luz del sol apenas se filtra a través de las copas de los árboles. Escuchas un susurro a tu izquierda y ves un destello de luz a tu derecha. ¿Qué decides hacer?",
                options: [
                    { text: "Seguir el susurro", nextScene: 2 },
                    { text: "Ir hacia la luz", nextScene: 3 }
                ]
            },
            2: {
                text: "Al seguir el susurro, encuentras un pequeño duende que parece perdido. Te pide ayuda para encontrar su camino a casa. ¿Cómo respondes?",
                options: [
                    { text: "Ayudar al duende", nextScene: 4 },
                    { text: "Ignorarlo y continuar tu camino", nextScene: 5 }
                ]
            },
            3: {
                text: "La luz te lleva a un claro donde encuentras un antiguo santuario. En el centro hay un objeto brillante. ¿Qué haces?",
                options: [
                    { text: "Tomar el objeto", nextScene: 6 },
                    { text: "Dejarlo y explorar el santuario", nextScene: 7 }
                ]
            },
            4: {
                text: "El duende, agradecido, te guía a través de un camino secreto. Llegas a un puente sobre un río turbulento. El duende te advierte que solo los puros de corazón pueden cruzarlo. ¿Intentas cruzar?",
                options: [
                    { text: "Cruzar el puente", nextScene: "good" },
                    { text: "Buscar otra ruta", nextScene: "bad" }
                ]
            },
            5: {
                text: "Al ignorar al duende, te adentras más en el bosque. Pronto te das cuenta de que estás dando vueltas en el mismo lugar. Los árboles parecen moverse y cerrar el camino. ¿Qué haces?",
                options: [
                    { text: "Intentar trepar a un árbol para orientarte", nextScene: "bad" },
                    { text: "Dejarte guiar por tu intuición", nextScene: "good" }
                ]
            },
            6: {
                text: "Al tomar el objeto, una luz cegadora te envuelve. Cuando recuperas la vista, te encuentras en una dimensión paralela. Las criaturas del bosque te rodean con miradas hostiles. ¿Cómo reaccionas?",
                options: [
                    { text: "Ofrecer el objeto de vuelta", nextScene: "good" },
                    { text: "Intentar huir con el objeto", nextScene: "bad" }
                ]
            },
            7: {
                text: "Al explorar el santuario, descubres inscripciones antiguas que parecen mostrar un mapa. También notas una puerta oculta. ¿Qué investigas primero?",
                options: [
                    { text: "Las inscripciones del mapa", nextScene: "good" },
                    { text: "La puerta oculta", nextScene: "bad" }
                ]
            }
        },
        finals: {
            good: {
                title: "¡Has escapado del bosque!",
                description: "Después de muchas decisiones difíciles, logras encontrar la salida del bosque encantado. La luz del sol te recibe cálidamente y sientes que has aprendido valiosas lecciones sobre confianza e intuición.",
                explanation: "Tu disposición a ayudar a otros y tu respeto por las fuerzas del bosque te permitieron ganar aliados y encontrar el camino correcto. Cada acto de bondad fue recompensado con guía y protección en momentos cruciales."
            },
            bad: {
                title: "Atrapado para siempre",
                description: "A pesar de tus esfuerzos, las decisiones que tomaste te llevaron a perderte en el laberinto viviente del bosque. Los árboles cierran todos los caminos de salida y las sombras se vuelven más densas a tu alrededor.",
                explanation: "La desconfianza y la prisa por escapar te impidieron ver las señales importantes. Ignorar a quienes podían ayudarte y tomar objetos sin permiso activó las protecciones mágicas del bosque, sellando tu destino."
            }
        }
    },
    2: {
        title: "La Misión Espacial",
        scenes: {
            1: {
                text: "Como capitán de la nave estelar 'Nebula One', recibes una señal de socorro desde un planeta desconocido. Al acercarte, detectas anomalías gravitacionales. ¿Cómo procedes?",
                options: [
                    { text: "Investigar la señal de socorro", nextScene: 2 },
                    { text: "Reportar a la base y pedir instrucciones", nextScene: 3 }
                ]
            },
            2: {
                text: "Al descender al planeta, tu nave sufre daños por la gravedad irregular. Logras aterrizar pero con sistemas críticos dañados. ¿Cuál es tu prioridad?",
                options: [
                    { text: "Reparar los sistemas de comunicación", nextScene: 4 },
                    { text: "Buscar la fuente de la señal de socorro", nextScene: 5 }
                ]
            },
            3: {
                text: "Mientras esperas respuesta, detectas una flota desconocida acercándose a tu posición. Parecen hostiles. ¿Qué haces?",
                options: [
                    { text: "Preparar las defensas y evadir", nextScene: 6 },
                    { text: "Intentar establecer comunicación pacífica", nextScene: 7 }
                ]
            },
            4: {
                text: "Logras reparar las comunicaciones justo cuando detectas formas de vida acercándose a tu nave. ¿Intentas contactarlas?",
                options: [
                    { text: "Transmitir un mensaje de paz", nextScene: "good" },
                    { text: "Preparar armas como precaución", nextScene: "bad" }
                ]
            },
            5: {
                text: "Encuentras una nave estrellada con sobrevivientes. Te piden refugio, pero notas que parecen enfermos. ¿Los llevas a bordo?",
                options: [
                    { text: "Aceptar con precauciones de cuarentena", nextScene: "good" },
                    { text: "Negarse por el riesgo de contagio", nextScene: "bad" }
                ]
            },
            6: {
                text: "Al preparar las defensas, provocas que la flota abra fuego. Tu nave sufre daños severos. ¿Qué estrategia usas?",
                options: [
                    { text: "Lanzar señuelos y huir al hiperespacio", nextScene: "good" },
                    { text: "Contraatacar con todas las armas", nextScene: "bad" }
                ]
            },
            7: {
                text: "Estableces comunicación y descubres que son exploradores pacíficos. Te ofrecen ayuda para reparar tu nave. ¿Aceptas?",
                options: [
                    { text: "Aceptar su ayuda con gratitud", nextScene: "good" },
                    { text: "Desconfiar y rechazar su oferta", nextScene: "bad" }
                ]
            }
        },
        finals: {
            good: {
                title: "Misión cumplida",
                description: "Gracias a tus decisiones sabias y diplomáticas, no solo completaste tu misión sino que estableciste una nueva alianza interestelar. Tu tripulación regresa a casa como héroes.",
                explanation: "Tu equilibrio entre precaución y apertura te permitió navegar situaciones peligrosas sin escalar conflictos. Al priorizar la comunicación y la cooperación, ganaste aliados valiosos que te ayudaron en momentos críticos."
            },
            bad: {
                title: "Misión fallida",
                description: "Una serie de decisiones desafortunadas llevaron a la pérdida de tu nave y el aislamiento en el espacio profundo. La última transmisión indica que la tripulación está en peligro crítico.",
                explanation: "La excesiva desconfianza y las respuestas agresivas crearon conflictos donde había oportunidades para la paz. Al subestimar a otros y priorizar la fuerza sobre la diplomacia, sellaste un destino desastroso para la misión."
            }
        }
    },
    3: {
        title: "El Misterio del Castillo",
        scenes: {
            1: {
                text: "Recibes una carta misteriosa invitándote al Castillo Blackwood para resolver un secreto familiar. Al llegar, el mayordomo te recibe con noticias inquietantes. ¿Qué haces primero?",
                options: [
                    { text: "Revisar la biblioteca del castillo", nextScene: 2 },
                    { text: "Explorar las habitaciones familiares", nextScene: 3 }
                ]
            },
            2: {
                text: "En la biblioteca, encuentras un diario oculto que menciona una maldición familiar. También notas que alguien ha estado revisando recientemente estos documentos. ¿Cómo procedes?",
                options: [
                    { text: "Investigar quién accedió al diario", nextScene: 4 },
                    { text: "Buscar más información sobre la maldición", nextScene: 5 }
                ]
            },
            3: {
                text: "Mientras exploras las habitaciones, escuchas un ruido en el pasillo. Al salir, ves una figura encapuchada desaparecer tras una puerta secreta. ¿Qué haces?",
                options: [
                    { text: "Seguir a la figura por la puerta secreta", nextScene: 6 },
                    { text: "Buscar ayuda con otros invitados", nextScene: 7 }
                ]
            },
            4: {
                text: "Descubres que el mayordomo ha estado investigando la maldición. Te confiesa que teme por su vida. ¿Cómo reaccionas?",
                options: [
                    { text: "Ofrecerle protección a cambio de información", nextScene: "good" },
                    { text: "Confrontarlo como posible sospechoso", nextScene: "bad" }
                ]
            },
            5: {
                text: "Encuentras un ritual para romper la maldición, pero requiere un sacrificio personal. ¿Lo intentas?",
                options: [
                    { text: "Realizar el ritual con precaución", nextScene: "good" },
                    { text: "Buscar una alternativa sin riesgos", nextScene: "bad" }
                ]
            },
            6: {
                text: "Al seguir a la figura, descubres una cámara oculta con reliquias familiares. La figura resulta ser un heredero perdido. ¿Qué haces?",
                options: [
                    { text: "Escuchar su historia", nextScene: "good" },
                    { text: "Alertar a los demás sobre su presencia", nextScene: "bad" }
                ]
            },
            7: {
                text: "Al buscar ayuda, descubres que los otros invitados tienen sus propias agendas ocultas. Uno de ellos te ofrece una alianza. ¿Aceptas?",
                options: [
                    { text: "Aceptar la alianza con cautela", nextScene: "good" },
                    { text: "Rechazar y actuar solo", nextScene: "bad" }
                ]
            }
        },
        finals: {
            good: {
                title: "Misterio resuelto",
                description: "Lograste desentrañar los secretos del castillo, romper la maldición ancestral y reconciliar a los herederos. El castillo recupera su esplendor y tú eres aclamado como un héroe.",
                explanation: "Tu combinación de valentía, compasión y perspicacia te permitió navegar las complejidades familiares. Al escuchar a otros y buscar soluciones inclusivas, resolviste conflictos que parecían irreconciliables."
            },
            bad: {
                title: "Atrapado en el pasado",
                description: "Tus acciones desencadenaron la maldición ancestral, atrapando a todos en el castillo en un bucle temporal. Las sombras del pasado ahora gobiernan los pasillos para siempre.",
                explanation: "La desconfianza y las decisiones precipitadas te impidieron ver las verdaderas intenciones de otros. Al actuar sin considerar las consecuencias completas, activaste las mismas fuerzas que intentabas evitar."
            }
        }
    }
};

// Variables del juego
let currentStory = null;
let currentScene = null;
let sceneHistory = [];
let decisionPath = [];

// Elementos DOM
const storySelectionScreen = document.getElementById('story-selection');
const gameScreen = document.getElementById('game-screen');
const finalScreen = document.getElementById('final-screen');
const sceneContent = document.getElementById('scene-content');
const optionsContainer = document.getElementById('options-container');
const progressBar = document.getElementById('progress-bar');
const sceneCounter = document.getElementById('scene-counter');
const finalTitle = document.getElementById('final-title');
const finalDescription = document.getElementById('final-description');
const finalExplanation = document.getElementById('final-explanation');
const restartBtn = document.getElementById('restart-btn');
const helpBtn = document.getElementById('help-btn');
const helpModal = document.getElementById('help-modal');
const helpModalOkBtn = document.getElementById('help-modal-ok-btn');
const closeModal = document.querySelectorAll('.close-modal');

// Inicializar el juego
function initGame() {
    // Mostrar selección de historias
    showScreen(storySelectionScreen);
    
    // Configurar listeners para las tarjetas de historia
    document.querySelectorAll('.story-card').forEach(card => {
        card.addEventListener('click', () => {
            const storyId = card.getAttribute('data-story');
            startStory(storyId);
        });
    });
    
    // Configurar botón de reinicio
    restartBtn.addEventListener('click', () => {
        showScreen(storySelectionScreen);
    });
    
    // Configurar modal de ayuda
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
}

// Comenzar una historia
function startStory(storyId) {
    currentStory = stories[storyId];
    currentScene = 1;
    sceneHistory = [1];
    decisionPath = [];
    
    showScene();
    showScreen(gameScreen);
}

// Mostrar una escena
function showScene() {
    const scene = currentStory.scenes[currentScene];
    
    // Actualizar contenido de la escena
    sceneContent.innerHTML = `<div class="scene-text">${scene.text}</div>`;
    
    // Actualizar opciones
    optionsContainer.innerHTML = '';
    scene.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option.text;
        button.addEventListener('click', () => {
            decisionPath.push({
                scene: currentScene,
                option: index
            });
            
            // Guardar la escena actual en el historial
            sceneHistory.push(currentScene);
            
            // Avanzar a la siguiente escena
            currentScene = option.nextScene;
            
            if (typeof currentScene === 'string') {
                showFinal(currentScene);
            } else {
                showScene();
                updateProgress();
            }
        });
        optionsContainer.appendChild(button);
    });
    
    // Actualizar progreso
    updateProgress();
}

// Actualizar barra de progreso
function updateProgress() {
    const sceneKeys = Object.keys(currentStory.scenes);
    const currentIndex = sceneKeys.indexOf(currentScene.toString());
    const progressPercentage = (currentIndex / (sceneKeys.length - 1)) * 100;
    
    progressBar.style.width = `${progressPercentage}%`;
    sceneCounter.textContent = `Escena ${currentIndex + 1} de ${sceneKeys.length}`;
}

// Mostrar pantalla de final
function showFinal(finalType) {
    const final = currentStory.finals[finalType];
    
    // Configurar elementos de final
    finalTitle.textContent = final.title;
    finalTitle.className = `final-title ${finalType}-final`;
    finalDescription.textContent = final.description;
    finalExplanation.textContent = final.explanation;
    
    showScreen(finalScreen);
}

// Cambiar pantalla visible
function showScreen(screen) {
    // Ocultar todas las pantallas
    storySelectionScreen.style.display = 'none';
    gameScreen.style.display = 'none';
    finalScreen.style.display = 'none';
    
    // Mostrar la pantalla solicitada
    screen.style.display = 'block';
}

// Iniciar el juego cuando se cargue la página
window.addEventListener('DOMContentLoaded', initGame);