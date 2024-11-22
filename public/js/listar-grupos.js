import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { db } from "./firebase-config.js";

async function listarGrupos() {
    const listaElement = document.getElementById("grupos-list");

    try {
        // Obter a coleção "grupos" do Firestore
        const querySnapshot = await getDocs(collection(db, "grupos"));

        // Limpar lista existente antes de preencher
        listaElement.innerHTML = "";

        // Adicionar cada documento à tabela
        let index = 1; // Contador para exibição de índice
        querySnapshot.forEach((doc) => {
            const grupo = doc.data();
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${grupo.numero}</td>
                <td>${grupo.nome}</td>
                <td>${grupo.supte}</td>
                <td>${grupo.ajudante}</td>
                <td class="text-center"><a href="#" class="btn btn-outline-primary me-2">
                <i class="bi bi-pencil-square"> Editar</i></a><a href="#" class="btn btn-outline-danger">
                <i class="bi bi-trash2"></i> Excluir</a></td>
            `;

            listaElement.appendChild(row);
            index++;
        });

        if (index === 1) {
            // Nenhum grupo encontrado
            listaElement.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">Nenhuma grupo encontrado.</td>
                </tr>
            `;
        }
    } catch (error) {
        console.error("Erro ao listar grupos:", error);
        listaElement.innerHTML = `
            <tr>
                <td colspan="3" class="text-center text-danger">Erro ao carregar os grupos.</td>
            </tr>
        `;
    }
}

// Chamar a função ao carregar a página
listarGrupos();
