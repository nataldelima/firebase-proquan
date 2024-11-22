import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { auth } from "./firebase-config.js";

// Função de login com email e senha
document.getElementById("login-form").addEventListener("htmx:beforeSend", async (event) => {
    event.preventDefault();
    const email = event.target.querySelector("#email").value;
    const password = event.target.querySelector("#password").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        document.getElementById("login-result").textContent = "";
        window.location.href = "dashboard.html";
    } catch (error) {
        document.getElementById("login-result").textContent = "Erro: " + error.message;
    }
});

// Configurar login com Google
document.getElementById("google-login-btn").addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();

    try {
        await signInWithPopup(auth, provider);
        window.location.href = "dashboard.html";
    } catch (error) {
        document.getElementById("login-result").textContent = "Erro ao autenticar com Google: " + error.message;
    }
});
