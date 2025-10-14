const socket = io("https://connect-etec-server.onrender.com");
let usuarioAtual = localStorage.getItem("userId")

// Recebe mensagens anteriores do servidor
socket.on('previousMessages', messages => {
    if (messages.length >= 1) {
        for (message of messages) {
            renderMessage(message);
        };

        // Scroll para baixo após carregar mensagens anteriores
        setTimeout(() => {
            const chat = document.querySelector("#chat");
            chat.scrollTop = chat.scrollHeight;
        }, 100);
    }
});

// Recebe mensagens enviadas por outros usuários
socket.on('receivedMessage', message => {
    renderMessage(message);
});

//Função para criar gráficamente as mensagens
function renderMessage(message) {
    const chat = document.querySelector("#chat");

    // Proteção: se não tiver usuario, não renderiza
    if (!message.usuario || !message.usuario.username) {
        console.error("Mensagem incompleta:", message);
        return;
    }

    // Verifica se é mensagem do usuário atual
    const isMyMessage = message.userId === usuarioAtual;

    const divMensagem = document.createElement("div");
    divMensagem.setAttribute("class", "mensagem");

    if (isMyMessage) {
        divMensagem.setAttribute("class", "mensagem minhaMensagem");
    }

    const h2Autor = document.createElement("h2");
    h2Autor.textContent = message.usuario.username.toUpperCase();
    h2Autor.style.color = message.usuario.color;

    const pMensagem = document.createElement("p");
    pMensagem.textContent = message.content;

    const pData = document.createElement("p");
    pData.setAttribute("class", "data");
    pData.textContent = message.createdAt;

    divMensagem.appendChild(h2Autor);
    divMensagem.appendChild(pMensagem);
    divMensagem.appendChild(pData);

    if (message.userId === localStorage.getItem("userId")) {

    }
    chat.appendChild(divMensagem);

    // Scroll automático para baixo
    setTimeout(() => {
        chat.scrollTop = chat.scrollHeight;
    }, 0);
}
//Função para enviar mensagens
function sendMessage() {
    const userColor = localStorage.getItem("userColor");
    const username = localStorage.getItem("username");
    const content = String(document.querySelector("textarea").value.trim());

    if (usuarioAtual != "" && userColor != "" && username !== "" && content != "") {
        const message = {
            userId: usuarioAtual,
            content
        }

        document.querySelector("textarea").value = ""

        socket.emit('sendMessage', message);
    }
}