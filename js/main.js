// Proyecto de mejora tecnológica para YOUTOPIA creado por DIEGO VEGA

// Importa las funciones necesarias del SDK de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCnxXXXXX",
    authDomain: "ronda-inteligente.firebaseapp.com",
    projectId: "ronda-inteligente",
    storageBucket: "ronda-inteligente.appspot.com",
    messagingSenderId: "151154056379",
    appId: "1:151154056379:web:4d42738b837113c1e59d9e",
    measurementId: "G-HTBFR06GYK"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para obtener parámetros de la URL
function obtenerParametro(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Función para mostrar la fecha y hora actual
function mostrarFechaHora() {
    const fecha = new Date();
    document.getElementById("fecha").textContent = fecha.toLocaleDateString();
    document.getElementById("hora").textContent = fecha.toLocaleTimeString();
}

// Función para contar las visitas por zona y almacenarlas en localStorage
function contarVisitas() {
    const seccion = obtenerParametro("seccion");
    let visitas = localStorage.getItem(`visitas_${seccion}`) || 0;
    visitas++;
    localStorage.setItem(`visitas_${seccion}`, visitas);
    document.getElementById("visitas").textContent = visitas;
}

// Función para registrar un marcaje en Firestore
async function registrarRondaEnFirestore(seccion, fecha, hora) {
    try {
        const docRef = await addDoc(collection(db, "rondas"), {
            seccion: seccion,
            fecha: fecha,
            hora: hora
        });
        console.log("Marcaje registrado con ID: ", docRef.id);
    } catch (e) {
        console.error("Error al añadir el documento: ", e);
    }
}

// Función para registrar la ronda
async function registrarRonda() {
    const seccion = obtenerParametro("seccion");
    const fechaHora = new Date();
    const fecha = fechaHora.toLocaleDateString();
    const hora = fechaHora.toLocaleTimeString();
    const mensajeRonda = document.getElementById("mensaje-ronda");

    // Llama a la función para registrar en Firestore
    await registrarRondaEnFirestore(seccion, fecha, hora);

    // Actualiza el mensaje de ronda
    mensajeRonda.textContent = `Ronda realizada en ${seccion} a las ${hora} el ${fecha}`;
    mensajeRonda.style.display = "block";
}

// Función para inicializar la página
function inicializarPagina() {
    const seccion = obtenerParametro("seccion");
    document.getElementById("zona-nombre").textContent = `Zona: ${seccion}`; // Muestra el nombre de la zona
    mostrarFechaHora();
    contarVisitas();

    // Muestra el mensaje de ronda si ya existe un registro
    const mensajeRonda = document.getElementById("mensaje-ronda");
    const ultimaFecha = localStorage.getItem(`ultima_fecha_${seccion}`);
    const ultimaHora = localStorage.getItem(`ultima_hora_${seccion}`);
    if (ultimaFecha && ultimaHora) {
        mensajeRonda.textContent = `Ronda realizada en ${seccion} a las ${ultimaHora} el ${ultimaFecha}`;
        mensajeRonda.style.display = "block";
    }
}

// Llamada a la función de inicialización
window.onload = inicializarPagina;

// Exporta la función registrarRonda para que pueda ser utilizada por los botones en el HTML
window.registrarRonda = async function () {
    const seccion = obtenerParametro("seccion");
    const fechaHora = new Date();
    const fecha = fechaHora.toLocaleDateString();
    const hora = fechaHora.toLocaleTimeString();

    // Guarda la última fecha y hora en localStorage
    localStorage.setItem(`ultima_fecha_${seccion}`, fecha);
    localStorage.setItem(`ultima_hora_${seccion}`, hora);

    // Llama a la función para registrar en Firestore
    await registrarRondaEnFirestore(seccion, fecha, hora);

    // Actualiza el mensaje de ronda
    const mensajeRonda = document.getElementById("mensaje-ronda");
    mensajeRonda.textContent = `Ronda realizada en ${seccion} a las ${hora} el ${fecha}`;
    mensajeRonda.style.display = "block";
};
