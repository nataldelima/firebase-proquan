import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { auth, db } from "/src/firebase/firebase-config.js";

// Exibe mensegens sobre operações de registro
function showMessage(message, type = 'error') {
    // Garante que o elemento de mensagem existe
    let messageElement = document.getElementById('form-message');

    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = 'form-message';
        messageElement.className = 'alert mt-3';
        document.getElementById('app').appendChild(messageElement);
    }

    // Configuração da mensagem
    messageElement.style.display = 'block';
    messageElement.className = `alert mt-3 ${type === 'error' ? 'alert-danger' : 'alert-success'}`;
    messageElement.textContent = message;

    // Auto-remover após 5 segundos
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}


// Adicione este listener para renovar o token antes de cada requisição HTMX
document.body.addEventListener('htmx:configRequest', async (event) => {
    const user = auth.currentUser;
    if (user) {
        try {
            // Força a renovação do token
            const token = await user.getIdToken(true);
            event.detail.headers['Authorization'] = `Bearer ${token}`;
        } catch (error) {
            console.error("Erro ao renovar token:", error);
            window.location.href = '/login.html';
        }
    }
});




// Listar as congregações
async function listarCongregacoes() {
    const listaElement = document.getElementById("congregacoes-list");

    // Verificação crítica antes de manipular o elemento
    if (!listaElement) {
        console.warn("Elemento 'congregacoes-list' não encontrado");
        return;
    }

    try {
        const querySnapshot = await getDocs(collection(db, "congregacoes"));
        listaElement.innerHTML = ""; // Só executa se o elemento existir

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
                    <button data-id="${doc.id}" class="btn btn-outline-primary me-2 btn-edit">
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
                    <td colspan="4" class="text-center">Nenhuma congregação cadastrada.</td>
                </tr>
            `;
        }
    } catch (error) {
        console.error("Erro ao listar congregações:", error);
        if (listaElement) { // Verificação adicional
            listaElement.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-danger">Erro ao carregar as congregações.</td>
                </tr>
            `;
        }
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



// Função para carregar dados da congregação no formulário de edição
async function loadCongregacaoData(id) {
    try {
        const docRef = doc(db, "congregacoes", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            // Adiciona pequeno delay para garantir renderização
            setTimeout(() => {
                // Função auxiliar com verificação
                const safeSetValue = (fieldId, value) => {
                    const field = document.getElementById(fieldId);
                    if (field) field.value = value || '';
                };

                // Preenche campos
                safeSetValue('numero', data.numero);
                safeSetValue('nome', data.nome);
                safeSetValue('endereco', data.endereco);
                safeSetValue('circuito', data.circuito);
                safeSetValue('supte_circuito', data.supteCircuito);
                safeSetValue('telefone_supte_circuito', data.telSupteCircuito);

                // Campo oculto
                let docIdField = document.getElementById('docId');
                if (!docIdField) {
                    docIdField = document.createElement('input');
                    docIdField.type = 'hidden';
                    docIdField.id = 'docId';
                    docIdField.name = 'docId';
                    document.getElementById('congregacao-form').prepend(docIdField);
                }
                docIdField.value = id;

                // Atualiza título
                const titleElement = document.getElementById('form-title');
                if (titleElement) titleElement.textContent = 'Editar Congregação';
            }, 50); // Delay de 50ms
        }
    } catch (error) {
        showMessage(`Erro ao carregar: ${error.message}`, 'error');
    }
}

// Listener para botões de edição
document.addEventListener('click', async (event) => {
    if (event.target.closest('.btn-edit')) {
        const button = event.target.closest('.btn-edit');
        const id = button.dataset.id;

        // Carrega o formulário primeiro
        await htmx.ajax('GET', '/templates/congregacoes/form.html', {
            target: '#app',
            swap: 'innerHTML'
        });

        // Aguarda 100ms para renderização completa
        await new Promise(resolve => setTimeout(resolve, 100));

        // Carrega os dados
        await loadCongregacaoData(id);
    }
});



// Deletar congregação
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




// Criar um registro
function initializeForm() {

    async function verificarAutenticacao() {
        const user = auth.currentUser;
        if (!user) {
            window.location.href = '/login.html';
            throw new Error("Usuário não autenticado");
        }
        return user;
    }

    const form = document.querySelector("#congregacao-form");
    if (form) {
        form.addEventListener("htmx:beforeRequest", async (event) => {
            event.preventDefault();

            try {
                await verificarAutenticacao();
                const formData = new FormData(event.target);
                const docId = formData.get('docId');
                const congregacaoData = {
                    numero: formData.get('numero'),
                    nome: formData.get('nome'),
                    endereco: formData.get('endereco'),
                    circuito: formData.get('circuito'),
                    supteCircuito: formData.get('supte_circuito'),
                    telSupteCircuito: formData.get('telefone_supte_circuito')
                };

                // Validação dos campos
                if (Object.values(congregacaoData).some(value => !value)) {
                    showMessage("Todos os campos são obrigatórios!", "error");
                    return;
                }

                if (docId) {
                    // Modo Edição: Atualiza documento existente
                    await updateDoc(doc(db, "congregacoes", docId), congregacaoData);
                    showMessage("Congregação atualizada com sucesso!", "success");
                } else {
                    // Modo Criação: Adiciona novo documento
                    await addDoc(collection(db, "congregacoes"), congregacaoData);
                    showMessage("Congregação salva com sucesso!", "success");
                }

                setTimeout(() => {
                    htmx.ajax('GET', '/templates/congregacoes/list.html', {
                        target: '#app',
                        headers: { 'Cache-Control': 'no-cache' } // Header adicionado
                    });
                }, 2000); // Timeout aumentado para 3 segundos

            } catch (error) {
                console.error("Erro ao salvar:", error);
                showMessage(`Erro ao salvar congregação: ${error.message}`, "error");
            }
        });
    }
}
let isInitialized = false;

function init() {
    const hasList = !!document.getElementById('congregacoes-list');
    const hasForm = !!document.getElementById('congregacao-form');

    if (!hasList && !hasForm) return;

    if (!isInitialized) {
        initializeForm();
        if (hasList) listarCongregacoes();

        // Força atualização do título
        const titleElement = document.getElementById('form-title');
        if (titleElement && document.getElementById('docId')) {
            titleElement.textContent = 'Editar Congregação';
        }

        isInitialized = true;
    }
}


// Modifique os listeners para prevenir duplicação
document.removeEventListener('DOMContentLoaded', init);
document.body.removeEventListener('htmx:afterSwap', init);

document.addEventListener('DOMContentLoaded', init);
document.body.addEventListener('htmx:afterSwap', init);

document.body.addEventListener('htmx:afterOnLoad', (event) => {
    if (event.detail.failed && event.detail.xhr.status === 401) {
        window.location.href = '/templates/congregacoes/list.html';
    }
});