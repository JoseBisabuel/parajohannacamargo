// ==================== CONFIGURACIÓN Y ESTADO ====================
// Fecha objetivo: 21 de Septiembre de 2026 a las 00:00:00
const TARGET_DATE = new Date("2026-09-21T00:00:00");

// Contraseña secreta que desbloquea el jardín a partir de la fecha objetivo
const SECRET_PASSWORD = "johannacamargo";

// Clave de almacenamiento local para recordar que ya se desbloqueó una vez
const UNLOCK_STORAGE_KEY = "jardinDesbloqueado";

// Enlace de WhatsApp al que se dirige la respuesta a la propuesta
const WHATSAPP_URL = "https://wa.me/573193034610";

// Mensajes aleatorios para la pantalla de espera
const WAITING_MESSAGES = [
    "Aún no es tiempo de tu detalle. 💛 No comas ansias.",
    "Aún no es tiempo de abrirlo. 😉 Algo hermoso se está cocinando aquí.",
    "Estaré disponible pronto. ¡Vuelve el 21 de septiembre!",
    "¡Paciencia! Tu sorpresa de flores amarillas se está sembrando... 🌻",
    "Un girasol está creciendo por cada día que falta. 🌼",
    "¿Buscando tu regalito? ¡Aún es muy temprano! Jeje. 💕",
    "Las cosas más bellas se hacen esperar. ¡Regresa el 21 de septiembre! 🌸",
    "Ese día se pintará de amarillo... ¡Falta poquito! ✨",
    "Aún no abre el capullo de tu detalle floral. 🌷 Estará listo a tiempo.",
    "Guarda este enlace secreto. El 21 de septiembre se desatará la magia. ✨",
    "Aunque la distancia nos separe, no hay un solo día que no piense en ti. 💛",
    "No importa cuántos kilómetros haya entre nosotros, mi cariño llega igual. 🌻",
    "La distancia es solo un número; tú siempre estás en mi mente. 💕",
    "Estés donde estés, una parte de mí siempre te acompaña. ✨",
    "Cerca o lejos, siempre serás mi persona favorita. 🌼",
    "Quiero que sepas que no hay un solo día en el que no piense en ti. 💛",
    "No importa cuántos kilómetros haya entre nosotros, mi cariño siempre encuentra la forma de llegar. 🌻",
    "Espero que este detalle llene tu día de luz y alegría. ✨",
    "Te mereces una sonrisa gigante... ¡te lo mereces todo! 💕",
];

// Obtener parámetros de la URL para personalizar el nombre
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Permitir bypass/prueba con el parámetro ?bypass=true o ?test=true
const isBypass = getQueryParam("bypass") === "true" || getQueryParam("test") === "true";

// ==================== ELEMENTOS DOM ====================
const waitingContainer = document.getElementById("waitingContainer");
const passwordContainer = document.getElementById("passwordContainer");
const gardenContainer = document.getElementById("gardenContainer");
const waitingMessage = document.getElementById("waitingMessage");
const starsContainer = document.getElementById("starsContainer");
const flowerBed = document.getElementById("flowerBed");
const cardWrapper = document.getElementById("cardWrapper");
const envelope = document.getElementById("envelope");
const letterModal = document.getElementById("letterModal");
const closeLetter = document.getElementById("closeLetter");
const audioBtn = document.getElementById("audioBtn");
const bgMusic = document.getElementById("bgMusic");
const audioIcon = document.getElementById("audioIcon");
const passwordForm = document.getElementById("passwordForm");
const passwordInput = document.getElementById("passwordInput");
const passwordError = document.getElementById("passwordError");
const proposalYes = document.getElementById("proposalYes");
const proposalNo = document.getElementById("proposalNo");
const noOverlay = document.getElementById("noOverlay");

// Crear estrellas de fondo en el cielo
function createStars() {
    const count = window.innerWidth < 600 ? 50 : 120;
    for (let i = 0; i < count; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty("--duration", `${Math.random() * 3 + 2}s`);
        star.style.setProperty("--opacity", `${Math.random() * 0.7 + 0.3}`);
        starsContainer.appendChild(star);
    }
}
createStars();

// ==================== LÓGICA DE CONTROL DE TIEMPO Y ACCESO ====================
function isUnlocked() {
    return localStorage.getItem(UNLOCK_STORAGE_KEY) === "true";
}

function showWaitingScreen() {
    waitingContainer.style.display = "flex";
    passwordContainer.style.display = "none";
    gardenContainer.style.display = "none";

    const randomMsg = WAITING_MESSAGES[Math.floor(Math.random() * WAITING_MESSAGES.length)];
    waitingMessage.innerHTML = `"${randomMsg}"`;

    updateCountdown();
    const interval = setInterval(() => {
        const activeDiff = TARGET_DATE - new Date();
        if (activeDiff <= 0) {
            clearInterval(interval);
            checkReleaseDate();
        } else {
            updateCountdown();
        }
    }, 1000);
}

function showPasswordScreen() {
    waitingContainer.style.display = "none";
    passwordContainer.style.display = "flex";
    gardenContainer.style.display = "none";
    passwordInput.value = "";
    passwordError.classList.remove("show");
    setTimeout(() => passwordInput.focus(), 300);
}

function showGarden() {
    waitingContainer.style.display = "none";
    passwordContainer.style.display = "none";
    gardenContainer.style.display = "block";
    startFlowerExperience();
}

function checkReleaseDate() {
    const now = new Date();
    const timeDiff = TARGET_DATE - now;

    if (timeDiff <= 0 || isBypass) {
        if (isUnlocked()) {
            showGarden();
        } else {
            showPasswordScreen();
        }
    } else {
        showWaitingScreen();
    }
}

function updateCountdown() {
    const now = new Date();
    const diff = TARGET_DATE - now;

    if (diff < 0) return;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = String(days).padStart(2, "0");
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

// Manejar el envío del formulario de contraseña
passwordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const normalized = passwordInput.value.trim().toLowerCase().replace(/\s+/g, "");

    if (normalized === SECRET_PASSWORD) {
        localStorage.setItem(UNLOCK_STORAGE_KEY, "true");
        showGarden();
    } else {
        passwordError.textContent = "Contraseña incorrecta, inténtalo de nuevo 💛";
        passwordError.classList.add("show");
        passwordInput.classList.add("shake");
        setTimeout(() => passwordInput.classList.remove("shake"), 500);
    }
});

// Ejecutar comprobación al cargar
checkReleaseDate();

// ==================== GENERACIÓN DE FLORES DIVERSAS ====================
// Plantillas SVG en cadena para los distintos tipos de flores amarillas
// 1. Girasol (Sunflower)
function getSunflowerSVG(colorPetal = "#facc15", colorCenter = "#713f12") {
    return `
    <svg class="flower-svg" viewBox="0 0 100 150" width="100%" height="100%">
        <!-- Tallo -->
        <path d="M50,80 Q55,115 50,150" fill="none" stroke="#16a34a" stroke-width="4" stroke-linecap="round"/>
        <!-- Hojas -->
        <path d="M52,110 Q70,100 65,90 Q54,100 52,110" fill="#15803d"/>
        <path d="M48,125 Q25,120 30,105 Q45,115 48,125" fill="#15803d"/>
        <!-- Pétalos (Girasol girado) -->
        <g transform="translate(50, 80)">
            ${Array.from({ length: 16 }).map((_, i) => {
                const angle = (360 / 16) * i;
                return `<path d="M0,0 C-8,-15 -10,-32 0,-40 C10,-32 8,-15 0,0" fill="${colorPetal}" transform="rotate(${angle})" stroke="#eab308" stroke-width="0.5"/>`;
            }).join('')}
            <!-- Centro del Girasol -->
            <circle cx="0" cy="0" r="14" fill="${colorCenter}" stroke="#451a03" stroke-width="1"/>
            <circle cx="0" cy="0" r="10" fill="none" stroke="#facc15" stroke-dasharray="2,2" stroke-width="1.5" opacity="0.6"/>
        </g>
    </svg>`;
}

// 2. Tulipán Amarillo
function getTulipSVG(colorTulip = "#fde047") {
    return `
    <svg class="flower-svg" viewBox="0 0 100 150" width="100%" height="100%">
        <!-- Tallo -->
        <path d="M50,75 Q47,115 50,150" fill="none" stroke="#16a34a" stroke-width="3" stroke-linecap="round"/>
        <!-- Hoja larga elegante -->
        <path d="M49,120 Q20,95 35,65 Q45,95 49,120" fill="#15803d"/>
        <!-- Flor Tulipán -->
        <g transform="translate(50, 75)">
            <!-- Pétalo trasero -->
            <path d="M-15,-25 C-25,5 25,5 15,-25 C5,-35 -5,-35 -15,-25" fill="#ca8a04"/>
            <!-- Pétalo lateral izquierdo -->
            <path d="M-18,-25 C-25,5 0,10 -2,-25 C-5,-35 -12,-35 -18,-25" fill="${colorTulip}"/>
            <!-- Pétalo lateral derecho -->
            <path d="M18,-25 C25,5 0,10 2,-25 C5,-35 12,-35 18,-25" fill="${colorTulip}"/>
            <!-- Pétalo central -->
            <path d="M-10,-28 C-12,5 12,5 10,-28 C5,-38 -5,-38 -10,-28" fill="#fef08a" stroke="#ca8a04" stroke-width="0.5"/>
        </g>
    </svg>`;
}

// 3. Margarita Amarilla (Daisy)
function getDaisySVG() {
    return `
    <svg class="flower-svg" viewBox="0 0 100 150" width="100%" height="100%">
        <!-- Tallo -->
        <path d="M50,80 Q48,115 50,150" fill="none" stroke="#16a34a" stroke-width="3.5" stroke-linecap="round"/>
        <!-- Hojas -->
        <path d="M51,115 Q68,110 60,100 Q53,108 51,115" fill="#15803d"/>
        <!-- Pétalos -->
        <g transform="translate(50, 80)">
            ${Array.from({ length: 12 }).map((_, i) => {
                const angle = (360 / 12) * i;
                return `<ellipse cx="0" cy="-22" rx="6" ry="18" fill="#fef08a" transform="rotate(${angle})" stroke="#eab308" stroke-width="0.5"/>`;
            }).join('')}
            <!-- Centro Naranja/Amarillo fuerte -->
            <circle cx="0" cy="0" r="10" fill="#f97316" stroke="#ea580c" stroke-width="0.5"/>
            <circle cx="0" cy="0" r="8" fill="#eab308"/>
        </g>
    </svg>`;
}

// 4. Rosa Amarilla
function getRoseSVG() {
    return `
    <svg class="flower-svg" viewBox="0 0 100 150" width="100%" height="100%">
        <!-- Tallo con espinas -->
        <path d="M50,75 Q53,115 50,150" fill="none" stroke="#16a34a" stroke-width="3.5" stroke-linecap="round"/>
        <!-- Espina -->
        <path d="M49,110 L42,107 L49,104 Z" fill="#16a34a"/>
        <path d="M51,125 L58,122 L51,119 Z" fill="#16a34a"/>
        <!-- Hojas -->
        <path d="M49,120 Q25,120 32,110 Q45,115 49,120" fill="#15803d"/>
        <path d="M51,100 Q75,95 68,85 Q55,92 51,100" fill="#15803d"/>
        <!-- Capullo de Rosa -->
        <g transform="translate(50, 75)">
            <!-- Pétalos externos -->
            <path d="M-22,-15 C-30,10 30,10 22,-15 C18,-30 -18,-30 -22,-15" fill="#ca8a04"/>
            <path d="M-18,-18 C-25,5 25,5 18,-18 C15,-30 -15,-30 -18,-18" fill="#eab308"/>
            <!-- Pétalos medios entrelazados -->
            <path d="M-12,-20 C-18,0 18,0 12,-20 C8,-28 -8,-28 -12,-20" fill="#facc15"/>
            <path d="M-10,-22 Q0,-8 10,-22 Q0,-32 -10,-22" fill="#fde047" stroke="#eab308" stroke-width="0.5"/>
            <!-- Corazón de la rosa -->
            <path d="M-5,-22 C-5,-15 5,-15 5,-22 C5,-26 -5,-26 -5,-22" fill="#fef08a"/>
            <!-- Pequeñas hojas cáliz abajo -->
            <path d="M-12,2 Q0,10 -15,12 Q-5,5 -12,2" fill="#15803d"/>
            <path d="M12,2 Q0,10 15,12 Q5,5 12,2" fill="#15803d"/>
            <path d="M-4,4 L0,14 L4,4 Z" fill="#15803d"/>
        </g>
    </svg>`;
}

// Iniciar la animación del jardín y los pétalos
function startFlowerExperience() {
    // Evitar duplicar flores si la función se llama más de una vez
    if (flowerBed.childElementCount > 0) return;

    // Generar jardín de flores de forma interactiva y progresiva
    const numFlowers = window.innerWidth < 600 ? 18 : 35;
    const flowerTypes = [getSunflowerSVG, getTulipSVG, getDaisySVG, getRoseSVG];

    // Generar flores espaciadas con distintas alturas y retrasos
    for (let i = 0; i < numFlowers; i++) {
        const flowerDiv = document.createElement("div");
        flowerDiv.className = "flower";

        // Distribución horizontal uniforme con un poco de ruido aleatorio
        const basePercent = (i / (numFlowers - 1)) * 100;
        const fuzzFactor = (Math.random() - 0.5) * (100 / numFlowers) * 0.8;
        const xPos = Math.max(2, Math.min(98, basePercent + fuzzFactor));

        // Altura (escala) y variabilidad visual
        const scale = Math.random() * 0.35 + 0.45; // Escala entre 0.45 y 0.8
        const heightOffset = Math.random() * 120; // Altura de desplazamiento en px

        // Rotaciones de crecimiento
        const initRotate = Math.random() * 30 - 15;
        const finalRotate = Math.random() * 14 - 7;

        // Retraso de animación aleatorio para que vayan naciendo escalonadamente
        const animDelay = Math.random() * 4.5; // Entre 0 y 4.5 segundos
        const swayDuration = Math.random() * 2 + 3; // Entre 3 y 5 segundos para balanceo

        flowerDiv.style.left = `${xPos}%`;
        flowerDiv.style.width = `130px`;
        flowerDiv.style.height = `190px`;
        flowerDiv.style.bottom = `${heightOffset - 15}px`;

        flowerDiv.style.setProperty("--scale", scale);
        flowerDiv.style.setProperty("--init-rotate", `${initRotate}deg`);
        flowerDiv.style.setProperty("--final-rotate", `${finalRotate}deg`);
        flowerDiv.style.animationDelay = `${animDelay}s`;
        flowerDiv.style.setProperty("--sway-duration", `${swayDuration}s`);

        // Seleccionar un tipo de flor aleatorio
        const randType = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];

        // Personalización de colores de pétalos ligeramente variables para realismo
        if (randType === getSunflowerSVG) {
            const petalsCol = ["#facc15", "#fde047", "#fef08a", "#ffd700"][Math.floor(Math.random() * 4)];
            flowerDiv.innerHTML = getSunflowerSVG(petalsCol);
        } else if (randType === getTulipSVG) {
            const tulipCol = ["#fde047", "#fef08a", "#ffd700", "#facc15"][Math.floor(Math.random() * 4)];
            flowerDiv.innerHTML = getTulipSVG(tulipCol);
        } else {
            flowerDiv.innerHTML = randType();
        }

        // Al completar la animación de crecimiento, activar balanceo (efecto de viento)
        setTimeout(() => {
            flowerDiv.classList.add("swaying");
        }, (animDelay + 3.5) * 1000);

        // Agregar interactividad al hacer clic en las flores
        flowerDiv.addEventListener("click", (e) => {
            createSparkles(e.clientX, e.clientY);
            // Efecto de rebote extra al hacer clic
            flowerDiv.style.transform = `scale(${scale * 1.25}) rotate(${finalRotate + 5}deg)`;
            setTimeout(() => {
                flowerDiv.style.transform = `scale(${scale}) rotate(${finalRotate}deg)`;
            }, 400);
        });

        flowerBed.appendChild(flowerDiv);
    }

    // Iniciar animación del lienzo de pétalos flotantes
    initPetalsCanvas();

    // Programar la aparición del sobre de carta central
    // Aparecerá mágicamente después de que la mayoría de las flores hayan florecido (aprox 5.5s)
    setTimeout(() => {
        cardWrapper.classList.add("reveal");
        createSparkles(window.innerWidth / 2, window.innerHeight / 2 - 50, 15);
    }, 5500);
}

// Función para emitir partículas mágicas doradas
function createSparkles(x, y, count = 6) {
    for (let i = 0; i < count; i++) {
        const spark = document.createElement("div");
        spark.className = "sparkle";
        const size = Math.random() * 10 + 5;
        spark.style.width = `${size}px`;
        spark.style.height = `${size}px`;
        spark.style.left = `${x - size / 2}px`;
        spark.style.top = `${y - size / 2}px`;

        // Ángulo y dirección de explosión aleatoria
        const mx = (Math.random() - 0.5) * 120;
        const my = (Math.random() - 0.5) * 120 - 40; // Tienden a subir
        spark.style.setProperty("--mx", `${mx}px`);
        spark.style.setProperty("--my", `${my}px`);

        document.body.appendChild(spark);

        // Remover después de terminar la animación
        setTimeout(() => {
            spark.remove();
        }, 1200);
    }
}

// ==================== CANVAS DE PÉTALOS EN MOVIMIENTO ====================
function initPetalsCanvas() {
    const canvas = document.getElementById("petalsCanvas");
    const ctx = canvas.getContext("2d");

    // Redimensionar canvas de forma responsiva
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const petals = [];
    const maxPetals = window.innerWidth < 600 ? 25 : 55;

    // Colores cálidos y amarillos para los pétalos flotantes
    const colors = [
        "rgba(254, 240, 138, 0.8)", // Amarillo claro
        "rgba(253, 224, 71, 0.75)",  // Amarillo medio
        "rgba(250, 204, 21, 0.7)",   // Amarillo intenso
        "rgba(234, 179, 8, 0.65)",   // Dorado/Mostaza
        "rgba(251, 191, 36, 0.7)"    // Naranja suave
    ];

    // Clase Pétalo
    class Petal {
        constructor() {
            this.reset();
            // Distribuir inicialmente a lo largo del alto para que no caigan todos juntos al inicio
            this.y = Math.random() * canvas.height;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -20;
            this.size = Math.random() * 10 + 6;
            this.speedY = Math.random() * 1.5 + 0.8;
            this.speedX = Math.random() * 1 - 0.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.angle = Math.random() * 360;
            this.spin = Math.random() * 2 - 1;
            this.opacity = Math.random() * 0.4 + 0.5;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.y / 30) * 0.3; // Oscilación natural con viento
            this.angle += this.spin;

            // Si sale del lienzo, reiniciar arriba
            if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.angle * Math.PI) / 180);
            ctx.beginPath();

            // Dibujar una forma estilizada de pétalo orgánico (curva de Bézier)
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
            ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);

            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.restore();
        }
    }

    // Inicializar array de pétalos
    for (let i = 0; i < maxPetals; i++) {
        petals.push(new Petal());
    }

    // Bucle de animación del Canvas
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        petals.forEach((petal) => {
            petal.update();
            petal.draw();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

// ==================== INTERACCIONES DE LA CARTA / SOBRE ====================
// Abrir sobre
envelope.addEventListener("click", (e) => {
    e.stopPropagation();
    createSparkles(window.innerWidth / 2, window.innerHeight / 2, 20);

    // Retraso muy leve para simular el impacto del clic
    setTimeout(() => {
        letterModal.classList.add("show");
    }, 250);
});

// Cerrar carta
closeLetter.addEventListener("click", () => {
    letterModal.classList.remove("show");
});

// Cerrar carta al hacer clic fuera del papel
letterModal.addEventListener("click", (e) => {
    if (e.target === letterModal) {
        letterModal.classList.remove("show");
    }
});

// ==================== PROPUESTA (¿QUIERES SER MI NOVIA?) ====================
proposalYes.addEventListener("click", () => {
    window.location.href = WHATSAPP_URL;
});

proposalNo.addEventListener("click", () => {
    noOverlay.classList.add("show");
    setTimeout(() => {
        window.location.href = WHATSAPP_URL;
    }, 3000);
});

// ==================== LÓGICA DE AUDIO DE FONDO ====================
let isPlaying = false;

function setAudioUI(playing) {
    isPlaying = playing;
    if (playing) {
        audioIcon.textContent = "🔇";
        audioBtn.title = "Silenciar Música";
        audioBtn.style.borderColor = "var(--primary-yellow)";
        audioBtn.style.boxShadow = "var(--gold-glow)";
    } else {
        audioIcon.textContent = "🎵";
        audioBtn.title = "Activar Música";
        audioBtn.style.borderColor = "rgba(255, 255, 255, 0.2)";
        audioBtn.style.boxShadow = "none";
    }
}

audioBtn.addEventListener("click", () => {
    if (isPlaying) {
        bgMusic.pause();
        setAudioUI(false);
    } else {
        bgMusic.play().then(() => setAudioUI(true)).catch(err => {
            console.log("Error al reproducir audio: ", err);
            alert("Haz clic en la pantalla antes de activar la música para permitir la reproducción.");
        });
    }
});

// Intentar reproducir la música automáticamente al abrir la página.
// Los navegadores bloquean el autoplay con sonido si el usuario no ha
// interactuado aún, así que si falla, la activamos en su primer clic o tecla.
function tryAutoplayMusic() {
    bgMusic.play().then(() => setAudioUI(true)).catch(() => {
        const resumeOnInteraction = () => {
            bgMusic.play().then(() => setAudioUI(true)).catch(() => {});
        };
        document.addEventListener("click", resumeOnInteraction, { once: true });
        document.addEventListener("keydown", resumeOnInteraction, { once: true });
    });
}
tryAutoplayMusic();
