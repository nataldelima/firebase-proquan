import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { auth } from "/src/firebase/firebase-config.js";

// Proteger a página e exibir nome do usuário
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "/index.html";
    } else {
        const userElement = document.querySelector('.nav-link.dropdown-toggle b');
        if (userElement) {
            userElement.textContent = user.displayName || user.email.split('@')[0];
        }
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
