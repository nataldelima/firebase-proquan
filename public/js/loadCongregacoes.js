import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { db } from "./firebase-config.js";




document.addEventListener("htmx:beforeRequest", async (event) => {
    if (event.target.id === "congregacao") {
        const congregacaoSelect = event.target;
        try {
            const querySnapshot = await getDocs(collection(db, "congregacoes"));
            congregacaoSelect.innerHTML = "";

            querySnapshot.forEach((doc) => {
                const option = document.createElement("option");
                option.value = doc.id;
                option.textContent = doc.data().nome;
                congregacaoSelect.appendChild(option);

                // Adicione esta linha para preencher o campo "congregacao" no formulário
                const congregacaoInput = document.getElementById("congregacao");
                if (congregacaoInput) {
                    congregacaoInput.value = doc.id;
                }
                // const option = document.createElement("option");
                // option.value = doc.id;
                // option.textContent = doc.data().nome;
                // congregacaoSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Erro ao carregar congregações:", error.message);
        }
    }
});
