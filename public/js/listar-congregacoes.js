import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { db } from "./firebase-config.js";

async function listarCongregacoes() {
    const listaElement = document.getElementById("congregacoes-list");

    try {
        // Obter a coleção "congregacoes" do Firestore
        const querySnapshot = await getDocs(collection(db, "congregacoes"));

        // Limpar lista existente antes de preencher
        listaElement.innerHTML = "";

        // Adicionar cada documento à tabela
        let index = 1; // Contador para exibição de índice
        querySnapshot.forEach((doc) => {
            const congregacao = doc.data();
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${congregacao.numero}</td>
                <td>${congregacao.nome}</td>
                <td>${congregacao.circuito}</td>
                <td class="text-center"><a href="#" class="btn btn-outline-primary me-2">
                <i class="bi bi-pencil-square"> Editar</i></a><a href="#" class="btn btn-outline-danger">
                <i class="bi bi-trash2"></i> Excluir</a></td>
            `;

            listaElement.appendChild(row);
            index++;
        });

        if (index === 1) {
            // Nenhuma congregação encontrada
            listaElement.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center">Nenhuma congregação cadastrada.</td>
                </tr>
            `;
        }
    } catch (error) {
        console.error("Erro ao listar congregações:", error);
        listaElement.innerHTML = `
            <tr>
                <td colspan="3" class="text-center text-danger">Erro ao carregar as congregações.</td>
            </tr>
        `;
    }
}

// Chamar a função ao carregar a página
listarCongregacoes();
