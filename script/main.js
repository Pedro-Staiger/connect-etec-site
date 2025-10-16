//Declaração das varíaveis de status (erro, carregando..etc)
const divStatus = document.querySelector("#div-status");
const label = document.querySelector("#label");
const loader = document.querySelector("#div-status img");

//Função que altera o formulário (login ou cadastro)
function formSwitch(formAtual) {
    const inputs = document.querySelectorAll("input");
    for (input of inputs) {
        input.value = null;
    }

    divStatus.style.display = "none";
    label.textContent = "";
    label.style.color = "var(--txt-color3)";
    loader.style.display = "none";
    const formLogin = document.querySelector("#div-login");
    const formCadastro = document.querySelector("#div-cadastro");

    if (formAtual === "login") {
        formLogin.style.animation = "fade-out 0.1s ease-out forwards";

        setTimeout(() => {
            formLogin.style.display = "none";
            formCadastro.style.display = "flex";
            formCadastro.style.animation = "fade-in 0.15s ease-out forwards";
        }, 150);
    } else if (formAtual === "cadastro") {
        formCadastro.style.animation = "fade-out 0.1s ease-out forwards";

        setTimeout(() => {
            formCadastro.style.display = "none";
            formLogin.style.display = "flex";
            formLogin.style.animation = "fade-in 0.15s ease-out forwards";
        }, 150);
    }
}

//Função que altera a visibilidade do input da senha ("ver senha")
function passwordVisibility(formAtual, botao) {
    let inputSenha = null;
    if (formAtual === "login") {
        inputSenha = document.querySelector("#input-password-login");
    } else if (formAtual === "cadastro") {
        inputSenha = document.querySelector("#input-password-register");
    }

    senha = String(inputSenha.value);

    if (inputSenha.getAttribute("type") === "password") {
        inputSenha.setAttribute("type", "text");
        botao.setAttribute("src", "pictures/eye.png");
    } else {
        inputSenha.setAttribute("type", "password");
        botao.setAttribute("src", "pictures/hidden.png");
    }

    inputSenha.value = senha;
}

//Função que valida login do usuário (manda requisição pro servidor)
function login() {
    const email = String(document.querySelector("#input-email-login").value);
    const password = String(document.querySelector("#input-password-login").value);

    if (email != "" && password != "") {
        if (email.includes("@")) {
            divStatus.style.display = "flex";
            label.style.color = "var(--txt-color3)";
            label.textContent = "Carregando...";
            loader.style.display = "flex";
            fetch("https://connect-etec-server.onrender.com/api/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json' // avisar que o corpo é JSON
                },
                body: JSON.stringify({ email, password })
            }).then(response => {
                if (!response.ok) {
                    label.textContent = "Erro ao realizar login, dados incorretos ou inexistentes";
                    label.style.color = "var(--label-red)";
                    loader.style.display = "none";
                    throw new Error('Erro na requisição: ' + response.status);
                }
                return response.json(); // aqui transforma a resposta em JSON
            })
                .then(data => {
                    label.textContent = "Login efetuado com sucesso";
                    label.style.color = "var(--label-green)";
                    loader.style.display = "none";
                    localStorage.setItem("userId", data.id);
                    localStorage.setItem("username", data.username);
                    localStorage.setItem("email", data.email);
                    localStorage.setItem("userColor", data.color);
                    setTimeout(() => {
                        window.location = "/pages/chat/index.html";
                    }, 2000);
                })
                .catch(error => {
                    label.textContent = "Erro ao realizar login, dados incorretos ou inexistentes";
                    label.style.color = "var(--label-red)";
                    loader.style.display = "none";
                    console.error('Erro:', error);
                });
        } else {
            divStatus.style.display = "flex";
            label.style.color = "var(--label-red)";
            label.textContent = "Insira um e-mail válido";
        }
    } else {
        divStatus.style.display = "flex";
        label.style.color = "var(--label-red)";
        label.textContent = "Preencha os campos corretamente";
    }


}

//Função que cadastra um usuário (manda requisição pro servidor)
function cadastro() {
    const username = String(document.querySelector("#input-username").value);
    const email = String(document.querySelector("#input-email-register").value);
    const color = String(document.querySelector("#input-color").value);
    const password = String(document.querySelector("#input-password-register").value);
    const accessCode = String(document.querySelector("#input-accessCode").value);

    if (username != "" && email != "" && color !== "" && password !== "" && accessCode != "") {
        if (username.length <= 25 && email.length <= 50 && password.length <= 50) {
            if (email.includes("@")) {
                const usuario = { username, email, color, password, accessCode };
                divStatus.style.display = "flex";
                label.style.color = "var(--txt-color3)";
                label.textContent = "Carregando...";
                loader.style.display = "flex";
                fetch("https://connect-etec-server.onrender.com/api/userCreate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(usuario),
                })
                    .then((response) => {
                        if (!response.ok) {
                            label.textContent = "Erro ao criar usuário, tente novamente";
                            label.style.color = "var(--label-red)";
                            loader.style.display = "none";
                            // Se o status da resposta não for 200–299, lança erro
                            throw new Error("Erro na requisição: " + response.status);
                        }
                        return response.json(); // Se for JSON no corpo da resposta
                    })
                    .then((data) => {
                        // Sucesso: pode usar os dados retornados
                        label.textContent = "Usuário criado com sucesso";
                        label.style.color = "var(--label-green)";
                        loader.style.display = "none";
                        setTimeout(() => {
                            divStatus.style.display = "none";
                            label.textContent = "";
                            label.style.color = "var(--txt-color3)";
                            formSwitch("cadastro");
                        }, 2000);
                    })
                    .catch((error) => {
                        // Erro na requisição
                        console.error("Detalhes do erro:", error);
                        label.textContent = "Erro ao criar usuário, tente novamente mais tarde";
                        label.style.color = "red";
                        loader.style.display = "none";
                    });
            } else {
                divStatus.style.display = "flex";
                label.style.color = "var(--label-red)";
                label.textContent = "Insira um e-mail válido";
            }
        } else {
            divStatus.style.display = "flex";
            label.style.color = "var(--label-red)";
            label.textContent = "Você ultrapassou o limite de caracteres";
        }
    } else {
        divStatus.style.display = "flex";
        label.style.color = "var(--label-red)";
        label.textContent = "Preencha os campos corretamente";
    }
}

//Adição da função de confirmação do formulário pelos inputs
for (input of document.querySelectorAll("#div-login div input")) {
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            login();
        }
    });
}

for (input of document.querySelectorAll("#div-cadastro div input")) {
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            cadastro();
        }
    });
}
