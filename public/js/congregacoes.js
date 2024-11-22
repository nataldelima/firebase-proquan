import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { db } from "./firebase-config.js";


document.getElementById("congregacao-form").addEventListener("htmx:beforeRequest", async (event) => {
    event.preventDefault();

    // Obtenha os valores dos campos de entrada
    const numero = event.target.querySelector("#numero").value;
    const nome = event.target.querySelector("#nome").value;
    const endereco = event.target.querySelector("#endereco").value;
    const circuito = event.target.querySelector("#circuito").value;
    const supteCircuito = event.target.querySelector("#supte_circuito").value;
    const telSupteCircuito = event.target.querySelector("#telefone_supte_circuito").value;

    try {

        // Verifique se os campos estão preenchidos
        if (!numero || !nome || !endereco || !circuito || !supteCircuito || !telSupteCircuito) {
            document.getElementById("form-message").textContent = "Todos os campos são obrigatórios!";
            return; // Se os campos estiverem vazios, interrompe o processo
        }
        // Tenta adicionar o documento ao Firestore
        const docRef = await addDoc(collection(db, "congregacoes"), {
            numero,
            nome,
            endereco,
            circuito,
            supteCircuito,
            telSupteCircuito
        });

        alert("Congregação salva com sucesso! ID:", docRef.id);
        document.getElementById("form-message").textContent = "Congregação salva com sucesso!";

        // Limpa o formulário após a submissão
        event.target.reset();

    } catch (error) {
        alert("Erro ao salvar congregação:", error.message);
        document.getElementById("form-message").textContent = "Erro ao salvar congregação: " + error.message;
    }
});

