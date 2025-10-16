let usuarioAtual = localStorage.getItem("userId");

//Verificação básica do login
if (usuarioAtual === null) {
    const main = document.querySelector("main")

    document.querySelector("#chat").style.display = "none";
    document.querySelector("#txt-field").style.display = "none";

    const container = document.createElement("div");
    container.setAttribute("class", "container");
    const title = document.createElement("h2");
    title.textContent = "Erro: Seu login não foi validado";
    const link = document.createElement("a");
    link.textContent = "Voltar para a página inicial";
    link.setAttribute("href", "../../index.html");

    container.appendChild(title);
    container.appendChild(link);

    const footer = document.querySelector("footer");
    // Insere ANTES do footer
    main.insertBefore(container, footer);
    main.style.justifyContent = "space-between";

    setTimeout(() => {
        window.location = "../../index.html";
    },30000)
} else {
    const socket = io("https://connect-etec-server.onrender.com");

    // Recebe mensagens anteriores do servidor
    socket.on('previousMessages', messages => {
        if (messages.length >= 1) {
            for (message of messages) {
                renderMessage(message, false);
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
        renderMessage(message, true);
    });

    //Função para criar gráficamente as mensagens
    function renderMessage(message, animation) {
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

        chat.appendChild(divMensagem);

        if (animation == true) {
            divMensagem.style.animation = "fade-in 0.4s ease-out forwards";
        }

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

            document.querySelector("textarea").value = "";

            socket.emit('sendMessage', message);
        }
    }

    //Adição da função de envio de mensagem pela tecla enter
    document.querySelector("textarea").addEventListener('keydown', (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault(); // Evita quebra de linha
            sendMessage();
        }
    });
}

