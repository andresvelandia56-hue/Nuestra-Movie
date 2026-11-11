
/* ========================================
   NUESTRA HISTORIA
   REPRODUCTOR DE RECUERDOS
======================================== */

// DURACIÓN DE CADA FOTOGRAFÍA
// 5000 milisegundos = 5 segundos

const DURACION_FOTO = 5000;
// ========================================
// REPRODUCTOR DE MÚSICA
// ========================================

// Lista de canciones en orden de reproducción

const canciones = [
    "audio/cancion-01.mp3",
    "audio/cancion-02.mp3"
];

// Momento en que debe terminar la primera canción.
// Ejemplo: 5 minutos y 36 segundos = 336 segundos.

const FIN_CANCION_1 = 336;

// Crear el reproductor
const musica = new Audio();

// Índice de la canción actual
let indiceCancion = 0;

// Volumen de la música (entre 0 y 1)
musica.volume = 0.45;


// ========================================
// INICIAR LA PRIMERA CANCIÓN
// ========================================

function iniciarMusica() {

    indiceCancion = 0;

    musica.src = canciones[indiceCancion];

    musica.play().catch(function(error) {
        console.error("No se pudo iniciar la música:", error);
    });

}


// ========================================
// 1. CREAR LA LISTA DE RECUERDOS
// ========================================

const recuerdos = [];

// Fotografías 01 al 08
for (let i = 1; i <= 8; i++) {
    recuerdos.push({
        tipo: "foto",
        archivo: `recuerdo-${String(i).padStart(2, "0")}.jpg`
    });
}

// Video 08.1
recuerdos.push({
    tipo: "video",
    archivo: "recuerdo-08.1.mp4"
});

// Fotografías 09 al 16
for (let i = 9; i <= 16; i++) {
    recuerdos.push({
        tipo: "foto",
        archivo: `recuerdo-${String(i).padStart(2, "0")}.jpg`
    });
}

// Video 16.1
recuerdos.push({
    tipo: "video",
    archivo: "recuerdo-16.1.mp4"
});

// Fotografías 17 al 75
for (let i = 17; i <= 75; i++) {
    recuerdos.push({
        tipo: "foto",
        archivo: `recuerdo-${String(i).padStart(2, "0")}.jpg`
    });
}

// Videos 76 y 77
recuerdos.push({
    tipo: "video",
    archivo: "recuerdo-76.mp4"
});

recuerdos.push({
    tipo: "video",
    archivo: "recuerdo-77.mp4"
});

// Fotografías 78 al 83
for (let i = 78; i <= 83; i++) {
    recuerdos.push({
        tipo: "foto",
        archivo: `recuerdo-${String(i).padStart(2, "0")}.jpg`
    });
}


// OBTENER LA DURACIÓN REAL DE CADA RECUERDO
const recuerdosListos = Promise.all(
    recuerdos.map(function(recuerdo) {

        if (recuerdo.tipo === "foto") {
            recuerdo.duracion = DURACION_FOTO / 1000;
            return Promise.resolve();
        }

        return new Promise(function(resolve) {
            const lector = document.createElement("video");
            lector.preload = "metadata";

            lector.addEventListener("loadedmetadata", function() {
                recuerdo.duracion = lector.duration;

                console.log(
                    recuerdo.archivo,
                    "Duración:",
                    recuerdo.duracion,
                    "segundos"
                );

                lector.removeAttribute("src");
                lector.load();
                resolve();
            }, { once: true });

            lector.addEventListener("error", function() {
                console.error(
                    "No se pudo leer la duración de:",
                    recuerdo.archivo
                );
                resolve();
            }, { once: true });

            lector.src = `images/recuerdos/${recuerdo.archivo}`;
        });
    })
);



// ========================================
// 2. CONECTAR LOS ELEMENTOS HTML
// ========================================

const portada = document.querySelector(".hero");
const album = document.getElementById("album");
const contenedor = document.getElementById("memory-container");
const contador = document.getElementById("counter");
const barraProgreso = document.getElementById("progress-bar");

const botonReproducir = document.querySelector(".play-button");
const botonAnterior = document.getElementById("prev-button");
const botonSiguiente = document.getElementById("next-button");
const botonPausa = document.getElementById("pause-button");

// ========================================
// 3. VARIABLES DEL REPRODUCTOR
// ========================================

let indiceActual = 0;
let indiceEscenaActual = 0;
let temporizador = null;
let temporizadorFadeFinal = null;

// ESTADO DE REPRODUCCIÓN

let peliculaPausada = false;
let tiempoRestante = 0;
let momentoInicio = 0;
let accionPendiente = null;
let videoActual = null;

// PROGRAMAR UN AVANCE CON TIEMPO CONTROLADO

function programarAvance(duracion, accion) {

    clearTimeout(temporizador);

    tiempoRestante = duracion;
    accionPendiente = accion;
    momentoInicio = Date.now();

    if (!peliculaPausada) {

        temporizador = setTimeout(function() {

            temporizador = null;
            tiempoRestante = 0;
            accionPendiente = null;

            accion();

        }, duracion);

    }
}


// PAUSAR LA PELÍCULA

function pausarPelicula() {

    if (peliculaPausada) return;

    peliculaPausada = true;

    if (temporizador !== null) {

        clearTimeout(temporizador);
        temporizador = null;

        tiempoRestante = Math.max(
            0,
            tiempoRestante - (Date.now() - momentoInicio)
        );

    }

    musica.pause();

    if (videoActual) {
        videoActual.pause();
    }

}


// REANUDAR LA PELÍCULA

function reanudarPelicula() {

    if (!peliculaPausada) return;

    peliculaPausada = false;

    musica.play().catch(function(error) {
        console.error("No se pudo reanudar la música:", error);
    });

    if (videoActual) {
        videoActual.play().catch(function(error) {
            console.error("No se pudo reanudar el video:", error);
        });
    }

    if (accionPendiente) {

        momentoInicio = Date.now();

        temporizador = setTimeout(function() {

            temporizador = null;
            tiempoRestante = 0;

            const accion = accionPendiente;
            accionPendiente = null;

            accion();

        }, tiempoRestante);

    }

}

// MENSAJES ENTRE LOS RECUERDOS

const mensajes = {
    8: "Un día nos cruzamos, sin imaginar que nada de esto pudiera ocurrir. Un día como hoy todo comenzó, y no supimos en qué momento llegamos a esto.",

    17: "Un día me desperté agradeciéndole al universo por el ángel que cambió mi vida y me ayudó a recuperarla. Un día desperté y tú eres mi todo, mi vida, mi felicidad, mi lugar seguro.",

    78: "Hace un año te conocí, hoy estamos acá, y falta toda nuestra vida para tenernos."
};

let mensajeEnPantalla = false;


// CONSTRUIR LA LÍNEA DE TIEMPO COMPLETA

const DURACION_MENSAJE = 12;

let lineaTiempo = [];
let duracionTotal = 0;

recuerdosListos.then(function() {

    let tiempoAcumulado = 0;

    recuerdos.forEach(function(recuerdo, indice) {

        // Añadir fotografía o video
        lineaTiempo.push({
            tipo: "recuerdo",
            indiceRecuerdo: indice,
            inicio: tiempoAcumulado,
            fin: tiempoAcumulado + recuerdo.duracion,
            duracion: recuerdo.duracion
        });

        tiempoAcumulado += recuerdo.duracion;

        // Añadir mensaje si corresponde
        const mensaje = mensajes[indice + 1];

        if (mensaje) {

            lineaTiempo.push({
                tipo: "mensaje",
                texto: mensaje,
                inicio: tiempoAcumulado,
                fin: tiempoAcumulado + DURACION_MENSAJE,
                duracion: DURACION_MENSAJE
            });

            tiempoAcumulado += DURACION_MENSAJE;
        }

    });

    duracionTotal = tiempoAcumulado;

    console.log("LÍNEA DE TIEMPO CONSTRUIDA");
    console.log("Total de elementos:", lineaTiempo.length);
    console.log("Duración total:", duracionTotal, "segundos");
    console.log("Duración en minutos:", (duracionTotal / 60).toFixed(2));

});


// SINCRONIZAR LA MÚSICA CON EL TIEMPO DE LA PELÍCULA


 // SINCRONIZAR LA MÚSICA CON EL TIEMPO DE LA PELÍCULA

let solicitudMusica = 0;

function sincronizarMusica(tiempoGlobal) {

        // Cancelar cualquier fundido anterior al navegar
    if (temporizadorFadeFinal !== null) {
        clearInterval(temporizadorFadeFinal);
        temporizadorFadeFinal = null;
    }

    // Restaurar el volumen normal
    musica.volume = 0.45;

    const nuevaCancion = tiempoGlobal < FIN_CANCION_1 ? 0 : 1;

    const tiempoCancion = nuevaCancion === 0
        ? tiempoGlobal
        : tiempoGlobal - FIN_CANCION_1;

    // Identificar esta solicitud para evitar cargas antiguas
    solicitudMusica++;

    const solicitudActual = solicitudMusica;

    function posicionarMusica() {

        // Ignorar una solicitud anterior si hubo otro salto
        if (solicitudActual !== solicitudMusica) return;

        musica.currentTime = tiempoCancion;

        if (!peliculaPausada) {
            musica.play().catch(function(error) {
                console.error("Error al sincronizar la música:", error);
            });
        }
    }

    // Si necesitamos cambiar de canción
    if (indiceCancion !== nuevaCancion || !musica.src) {

        musica.pause();

        indiceCancion = nuevaCancion;
        musica.src = canciones[indiceCancion];

        musica.addEventListener(
            "loadedmetadata",
            posicionarMusica,
            { once: true }
        );

        musica.load();

    } else {

        // Si seguimos en la misma canción, solo cambiar su posición
        posicionarMusica();

    }
}


// CAMBIAR AUTOMÁTICAMENTE A LA SEGUNDA CANCIÓN

musica.addEventListener("timeupdate", function() {

    if (
        indiceCancion === 0 &&
        musica.currentTime >= FIN_CANCION_1
    ) {
        sincronizarMusica(FIN_CANCION_1);
    }

});


// ========================================
// 4. INICIAR LA PELÍCULA
// ========================================

botonReproducir.addEventListener("click", function(event) {

    event.preventDefault();

    portada.style.display = "none";
    album.style.display = "flex";

    peliculaPausada = false;

    // Esperar a que todos los videos tengan su duración
    recuerdosListos.then(function() {

        // Comenzar desde la primera escena
        mostrarEscena(0);

    });

});

// ========================================
// MOSTRAR MENSAJES ENTRE RECUERDOS
// ========================================

function mostrarMensaje(mensaje, siguienteIndice) {

    clearTimeout(temporizador);
    temporizador = null;
    videoActual = null;

    mensajeEnPantalla = true;

    contenedor.innerHTML = `
    <div class="end-message">

        <h2>Te encontré...</h2>

        <p>
            Y te estuve pidiendo a gritos. Me llenaste de amor,
            me tuviste paciencia, esperaste por mí y, a pesar
            de todo, te entregas toda cada día.
        </p>

        <p>
            Amo ser todas tus «primeras veces».
            Amo cada átomo de tu ser.
        </p>

        <p>
            Amo todo de ti y, porque te amo, te deseo.
        </p>

        <p>
            Un FELIZ CUMPLEAÑOS, de la forma más especial
            y desde el fondo de mi corazón.
        </p>

        <p>AV</p>

    </div>
`;

    programarAvance(12000, function() {

        mensajeEnPantalla = false;

        mostrarRecuerdo(siguienteIndice);

    });

}


// ========================================
// 5. MOSTRAR FOTOGRAFÍAS Y VIDEOS
// ========================================

function mostrarRecuerdo(indice) {

    // Cancelar cualquier temporizador anterior
    clearTimeout(temporizador);

    indiceActual = indice;

    const recuerdo = recuerdos[indice];

    // Actualizar contador
    contador.textContent =
        `${String(indice + 1).padStart(2, "0")} / ${recuerdos.length}`;
        barraProgreso.style.width =
    `${((indice + 1) / recuerdos.length) * 100}%`;

    // Limpiar el recuerdo anterior
    contenedor.innerHTML = "";


// SI ES UNA FOTOGRAFÍA
if (recuerdo.tipo === "foto") {

    const rutaImagen = `images/recuerdos/${recuerdo.archivo}`;

    // Crear el escenario de la fotografía
    const escenario = document.createElement("div");
    escenario.className = "photo-scene";

    // Fondo desenfocado
    const fondo = document.createElement("img");
    fondo.src = rutaImagen;
    fondo.className = "photo-background";
    fondo.alt = "";

    // Fotografía principal
    const imagen = document.createElement("img");
    imagen.src = rutaImagen;
    imagen.className = "photo-foreground";
    imagen.alt = `Recuerdo ${indice + 1}`;

    imagen.onerror = function() {
        console.error("No se pudo cargar:", recuerdo.archivo);
    };

    // Añadir ambas capas
    escenario.appendChild(fondo);
    escenario.appendChild(imagen);

    contenedor.appendChild(escenario);

    // Pasar automáticamente a la siguiente foto
videoActual = null;

programarAvance(
    DURACION_FOTO,
    siguienteRecuerdo
);

}


    // SI ES UN VIDEO
    else if (recuerdo.tipo === "video") {

        const video = document.createElement("video");

        video.src = `images/recuerdos/${recuerdo.archivo}`;

        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        video.preload = "auto";
        video.muted = true;

        video.addEventListener("ended", siguienteRecuerdo);
        // Registrar el video que está reproduciéndose
videoActual = video;

        video.addEventListener("error", function() {
            console.error("No se pudo cargar el video:", recuerdo.archivo);
        });

        contenedor.appendChild(video);

        // Intentar iniciar el video automáticamente
        if (!peliculaPausada) {

    video.play().catch(function(error) {

        console.warn(
            "El navegador necesita que pulses reproducir en el video.",
            error
        );

    });

}
   }

}

// ========================================
// 6. AVANZAR AL SIGUIENTE RECUERDO
// ========================================

function siguienteRecuerdo() {

    const recuerdoFinalizado = indiceActual + 1;

    // Comprobar si corresponde mostrar un mensaje
    if (mensajes[recuerdoFinalizado]) {

        mostrarMensaje(
            mensajes[recuerdoFinalizado],
            indiceActual + 1
        );

        return;
    }

    if (indiceActual < recuerdos.length - 1) {

        mostrarRecuerdo(indiceActual + 1);

    } else {

        mostrarFinal();

    }

}


// ========================================
// 7. REGRESAR AL RECUERDO ANTERIOR
// ========================================

function recuerdoAnterior() {

    if (indiceActual > 0) {

        mostrarRecuerdo(indiceActual - 1);

    }

}


// ========================================
// NUEVO REPRODUCTOR: MOSTRAR CUALQUIER ESCENA
// ========================================

function mostrarEscena(indiceEscena, ajustarMusica = true) {

    // Comprobar que la escena existe
    if (indiceEscena < 0 || indiceEscena >= lineaTiempo.length) {
        return;
    }

    // Cancelar el avance anterior
    clearTimeout(temporizador);
    temporizador = null;

    // Detener el video anterior, si existe
    if (videoActual) {
        videoActual.pause();
        videoActual = null;
    }

    // Registrar la escena actual
    indiceEscenaActual = indiceEscena;

    const escena = lineaTiempo[indiceEscena];

    // Sincronizar únicamente cuando hay navegación manual
if (ajustarMusica) {
    sincronizarMusica(escena.inicio);
}

    // Actualizar contador y barra de progreso
    contador.textContent =
        `${indiceEscena + 1} / ${lineaTiempo.length}`;

    barraProgreso.style.width =
        `${((indiceEscena + 1) / lineaTiempo.length) * 100}%`;

    // Limpiar la pantalla
    contenedor.innerHTML = "";

    // SI LA ESCENA ES UN MENSAJE
    if (escena.tipo === "mensaje") {

        mensajeEnPantalla = true;

        contenedor.innerHTML = `
            <div class="message-screen">
                <p>${escena.texto}</p>
            </div>
        `;

        programarAvance(
            escena.duracion * 1000,
            siguienteEscena
        );

        return;
    }

    // SI LA ESCENA ES UNA FOTOGRAFÍA O UN VIDEO
    mensajeEnPantalla = false;

    const recuerdo = recuerdos[escena.indiceRecuerdo];
    indiceActual = escena.indiceRecuerdo;

    // MOSTRAR FOTOGRAFÍA
    if (recuerdo.tipo === "foto") {

        const rutaImagen =
            `images/recuerdos/${recuerdo.archivo}`;

        const escenario = document.createElement("div");
        escenario.className = "photo-scene";

        const fondo = document.createElement("img");
        fondo.src = rutaImagen;
        fondo.className = "photo-background";
        fondo.alt = "";

        const imagen = document.createElement("img");
        imagen.src = rutaImagen;
        imagen.className = "photo-foreground";
        imagen.alt = `Recuerdo ${indiceActual + 1}`;

        imagen.onerror = function() {
            console.error("No se pudo cargar:", recuerdo.archivo);
        };

        escenario.appendChild(fondo);
        escenario.appendChild(imagen);

        contenedor.appendChild(escenario);

        videoActual = null;

        programarAvance(
            escena.duracion * 1000,
            siguienteEscena
        );

        return;
    }

    // MOSTRAR VIDEO
    if (recuerdo.tipo === "video") {

        const video = document.createElement("video");

        video.src = `images/recuerdos/${recuerdo.archivo}`;
        video.autoplay = false;
        video.playsInline = true;
        video.preload = "auto";
        video.muted = true;
        video.controls = false;

        video.addEventListener("ended", siguienteEscena);

        video.addEventListener("error", function() {
            console.error(
                "No se pudo cargar el video:",
                recuerdo.archivo
            );
        });

        videoActual = video;

        contenedor.appendChild(video);

        if (!peliculaPausada) {
            video.play().catch(function(error) {
                console.error("No se pudo iniciar el video:", error);
            });
        }
    }
}


// ========================================
// AVANZAR A LA SIGUIENTE ESCENA
// ========================================

function siguienteEscena() {

    if (indiceEscenaActual < lineaTiempo.length - 1) {
        mostrarEscena(indiceEscenaActual + 1, false);
    } else {
        mostrarFinal();
    }
}


// ========================================
// REGRESAR A LA ESCENA ANTERIOR
// ========================================

function escenaAnterior() {

    if (indiceEscenaActual > 0) {
        mostrarEscena(indiceEscenaActual - 1);
    }
}



// ========================================
// 8. FINAL DE LA PELÍCULA
// ========================================

function mostrarFinal() {

    clearTimeout(temporizador);
    temporizador = null;

    if (videoActual) {
        videoActual.pause();
        videoActual = null;
    }

    contador.textContent = `${recuerdos.length} / ${recuerdos.length}`;
    barraProgreso.style.width = "100%";

    contenedor.innerHTML = `
    <div class="end-message">

        <h2>Te encontré...</h2>

        <p>
            Y te estuve pidiendo a gritos. Me llenaste de amor,
            me tuviste paciencia, esperaste por mí y, a pesar
            de todo, te entregas toda cada día.
        </p>

        <p>
            Amo ser todas tus «primeras veces».
            Amo cada átomo de tu ser.
        </p>

        <p>
            Amo todo de ti y, porque te amo, te deseo.
        </p>

        <p>
            Un FELIZ CUMPLEAÑOS, de la forma más especial
            y desde el fondo de mi corazón.
        </p>

        <p>AV</p>

    </div>
`;

    // Mantener la música durante 12 segundos más
    const inicioFade = musica.currentTime + 8;
    const finFade = inicioFade + 4;

    // Fundido progresivo durante los últimos 4 segundos
    temporizadorFadeFinal = setInterval(function() {

        const progreso = Math.min(
            1,
            Math.max(
                0,
                (musica.currentTime - inicioFade) / (finFade - inicioFade)
            )
        );

        musica.volume = 0.45 * (1 - progreso);

        if (progreso >= 1) {
            clearInterval(temporizadorFadeFinal);
            temporizadorFadeFinal = null;
        }

    }, 50);

    // Terminar la película después de los 12 segundos
    programarAvance(12000, function() {

        if (temporizadorFadeFinal !== null) {
            clearInterval(temporizadorFadeFinal);
            temporizadorFadeFinal = null;
        }

        musica.pause();
        musica.currentTime = 0;
        musica.volume = 0.45;

    });
}


// ========================================
// 9. CONECTAR LOS BOTONES
// ========================================

botonAnterior.addEventListener("click", escenaAnterior);

botonSiguiente.addEventListener("click", function() {

    if (indiceEscenaActual < lineaTiempo.length - 1) {
        mostrarEscena(indiceEscenaActual + 1);
    } else {
        mostrarFinal();
    }

});


// CONECTAR EL BOTÓN DE PAUSA

botonPausa.addEventListener("click", function() {

    if (peliculaPausada) {

        reanudarPelicula();

        botonPausa.textContent = "❚❚";
        botonPausa.setAttribute("aria-label", "Pausar película");

    } else {

        pausarPelicula();

        botonPausa.textContent = "▶";
        botonPausa.setAttribute("aria-label", "Reanudar película");

    }

});



// ========================================
// 10. COMPROBAR LA SECUENCIA
// ========================================

console.log("Total de recuerdos:", recuerdos.length);
console.log("Reproductor preparado.");

// ========================================
// 9. INTRODUCCIÓN DE LA PELÍCULA
// ========================================

const pantallaIntro = document.getElementById("intro-screen");

window.addEventListener("load", function() {

    setTimeout(function() {
        pantallaIntro.classList.add("hide");
    }, 7000);

});
