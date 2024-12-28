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
                <i class="bi bi-pencil-square"> Editar</i></a>
                <button onclick="deletarCongregacao('${doc.id}')" class="btn btn-outline-danger">
                <i class="bi bi-trash2"></i> Excluir</button></td>
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



//Deletar congregação
async function deletarCongregacao(id) {
    try {
        await deleteDoc(doc(db, "congregacoes", id));
        alert("Congregação excluída com sucesso!");
        // Atualize a lista de congregações após a exclusão
        listarCongregacoes();
    } catch (error) {
        alert("Erro ao excluir congregação:", error.message);
    }
}



// Inicializa a listagem quando o documento carregar
document.addEventListener('DOMContentLoaded', listarCongregacoes);

// Adiciona um listener para quando o HTMX carregar novo conteúdo
document.body.addEventListener('htmx:afterOnLoad', function (event) {
    // Verifica se o conteúdo carregado contém a lista de congregações
    if (event.detail.elt.querySelector('#congregacoes-list')) {
        listarCongregacoes();
    }
});

// Chamar a função ao carregar a página
listarCongregacoes();


// Exporta as funções para uso global se necessário
window.listarCongregacoes = listarCongregacoes;
window.deletarCongregacao = deletarCongregacao;



