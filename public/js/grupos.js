import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { db } from "./firebase-config.js";

document.getElementById("grupo-form").addEventListener("htmx:beforeRequest", async (event) => {
    event.preventDefault();
    const numero = event.target.querySelector("#numero").value;
    const nome = event.target.querySelector("#nome").value;
    const supte = event.target.querySelector("#supte").value;
    const ajudante = event.target.querySelector("#ajudante").value;
    const congregacaoId = event.target.querySelector("#congregacao").value;

    try {
        await addDoc(collection(db, "grupos"), { congregacaoId, numero, nome, supte, ajudante });
        document.getElementById("form-message").textContent = "Grupo salvo com sucesso!";
    } catch (error) {
        document.getElementById("form-message").textContent = "Erro ao salvar grupo: " + error.message;
    }
});
