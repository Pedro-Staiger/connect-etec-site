const socket = io("https://connect-etec-server.onrender.com");

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

    const divMensagem = document.createElement("div");
    divMensagem.setAttribute("class", "mensagem");

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

    chat.appendChild(divMensagem);

    // Scroll automático para baixo
    setTimeout(() => {
        chat.scrollTop = chat.scrollHeight;
    }, 0);
}
//Função para enviar mensagens
function sendMessage() {
    const userId = localStorage.getItem("userId");
    const userColor = localStorage.getItem("userColor");
    const username = localStorage.getItem("username");
    content = String(document.querySelector("textarea").value.trim());

    if (userId != "" && userColor != "" && username !== "" && content != "") {
        const message = {
            userId,
            content
        }

        document.querySelector("textarea").value = ""

        socket.emit('sendMessage', message);
    }
}