import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { db } from "./firebase-config.js";

// Função auxiliar para exibir mensagens
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

// Inicializa o formulário quando o documento carregar
document.addEventListener('DOMContentLoaded', initializeForm);

// Adiciona um listener para quando o HTMX carregar novo conteúdo
document.body.addEventListener('htmx:afterOnLoad', function () {
    initializeForm();
});