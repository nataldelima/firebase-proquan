import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { db } from "./firebase-config.js";

async function listarCongregacoes() {
    const selectElement = document.getElementById("congregacao");

    try {
        // Obter a coleção "congregacoes" do Firestore
        const querySnapshot = await getDocs(collection(db, "congregacoes"));

        // Limpar as opções existentes antes de preencher
        selectElement.innerHTML = "";

        // Adicionar uma opção padrão
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Selecione uma Congregação";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);

        // Adicionar cada documento como uma opção no select
        querySnapshot.forEach((doc) => {
            const congregacao = doc.data();
            const option = document.createElement("option");

            option.value = doc.id; // ID único do documento no Firestore
            option.textContent = `${congregacao.numero} - ${congregacao.nome}`;
            selectElement.appendChild(option);
        });

        if (querySnapshot.empty) {
            // Caso não haja congregações cadastradas
            const emptyOption = document.createElement("option");
            emptyOption.value = "";
            emptyOption.textContent = "Nenhuma congregação encontrada";
            emptyOption.disabled = true;
            selectElement.appendChild(emptyOption);
        }
    } catch (error) {
        console.error("Erro ao listar congregações:", error);

        // Adicionar uma mensagem de erro como uma opção
        const errorOption = document.createElement("option");
        errorOption.value = "";
        errorOption.textContent = "Erro ao carregar as congregações";
        errorOption.disabled = true;
        selectElement.appendChild(errorOption);
    }
}

// Chamar a função ao carregar a página
listarCongregacoes();
