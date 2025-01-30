import { addDoc, collection, deleteDoc, doc, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { db } from "/src/firebase/firebase-config.js";

// ==============================================
// Módulo: Helpers
// ==============================================
function showMessage(message, type = 'error') {
    // Procura primeiro o elemento de mensagem dentro do container do app
    const appContainer = document.getElementById("app");
    let messageElement = appContainer?.querySelector("#form-message");

    // Se não encontrar o elemento, tenta criar um novo
    if (!messageElement && appContainer) {
        messageElement = document.createElement("div");
        messageElement.id = "form-message";
        messageElement.className = "alert mt-3";

        // Procura o formulário dentro do container do app
        const form = appContainer.querySelector("#congregacao-form");
        if (form) {
            form.parentNode.insertBefore(messageElement, form.nextSibling);
        } else {
            // Se não encontrar o form, adiciona ao final do container
            appContainer.appendChild(messageElement);
        }
    }

    // Só tenta definir a mensagem se o elemento existir
    if (messageElement) {
        messageElement.className = `alert mt-3 ${type === 'error' ? 'alert-danger' : 'alert-success'}`;
        messageElement.textContent = message;

        // Remove a mensagem após 5 segundos
        setTimeout(() => {
            if (messageElement && messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 5000);
    }
}


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
    <td class="text-center">
        <button class="btn btn-outline-primary me-2">
            <i class="bi bi-pencil-square"></i> Editar
        </button>
        <button data-id="${doc.id}" class="btn btn-outline-danger btn-delete">
            <i class="bi bi-trash2"></i> Excluir
        </button>
    </td>
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



// Deletar congregação

// congregacoes.js

document.addEventListener('click', async (event) => {
    if (event.target.closest('.btn-delete')) {
        const button = event.target.closest('.btn-delete');
        const id = button.dataset.id;

        if (confirm("Confirma a exclusão?")) {
            try {
                await deleteDoc(doc(db, "congregacoes", id));
                showMessage("Congregação excluída com sucesso!", "success");
                await listarCongregacoes(); // Atualiza a lista após exclusão
            } catch (error) {
                showMessage(`Erro: ${error.message}`, "error");
            }
        }
    }
});




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






// Função para inicializar o formulário
function initializeForm() {
    const form = document.querySelector("#congregacao-form");
    if (form) {
        form.addEventListener("htmx:beforeRequest", async (event) => {
            // Só previne o evento padrão se for uma submissão do formulário
            if (event.detail.elt.id === "congregacao-form") {
                event.preventDefault();
                console.log('HTMX Event', event);

                try {
                    // Obtenha os valores dos campos de entrada
                    const numero = event.target.querySelector("#numero")?.value || "";
                    const nome = event.target.querySelector("#nome")?.value || "";
                    const endereco = event.target.querySelector("#endereco")?.value || "";
                    const circuito = event.target.querySelector("#circuito")?.value || "";
                    const supteCircuito = event.target.querySelector("#supte_circuito")?.value || "";
                    const telSupteCircuito = event.target.querySelector("#telefone_supte_circuito")?.value || "";

                    // Verifique se os campos estão preenchidos
                    if (!numero || !nome || !endereco || !circuito || !supteCircuito || !telSupteCircuito) {
                        showMessage("Todos os campos são obrigatórios!", "error");
                        return;
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

                    showMessage("Congregação salva com sucesso!", "success");

                    // Aguarda um momento antes de redirecionar
                    setTimeout(() => {
                        // Redireciona para a lista após salvar
                        htmx.ajax('GET', '/templates/congregacoes/list.html', { target: '#app' });
                    }, 1500);

                } catch (error) {
                    console.error("Erro ao salvar:", error);
                    showMessage(`Erro ao salvar congregação: ${error.message}`, "error");
                }
            }
        });
    }
}

let isInitialized = false;

function init() {
    if (!isInitialized) {
        initializeForm();
        listarCongregacoes();
        isInitialized = true;
    }
}

document.addEventListener('DOMContentLoaded', init);
document.body.addEventListener('htmx:afterSwap', init);