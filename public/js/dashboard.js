import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { auth } from "../../src/firebase/firebase-config.js";

// Proteger a página
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Se não estiver logado, redireciona para o login
        window.location.href = "/index.html";
    }
});

// Logout
const logoutButton = document.getElementById("logout-btn");
logoutButton.addEventListener("click", async () => {
    try {
        await signOut(auth);
        alert("Você saiu com sucesso!");
        window.location.href = "/index.html";
    } catch (error) {
        console.error("Erro ao sair:", error.message);
    }
});
