
    // Cadastro de usuário
    function validarcadastro(event) {
                event.preventDefault(); 

                const nome = document.getElementById('nome').value.trim();
                const email = document.getElementById('email').value.trim();
                const senha = document.getElementById('senha').value;
                const confisenha = document.getElementById('confisenha').value;
                const datanasc = document.getElementById('data').value;

                if (!nome || !email || !senha || !confisenha) {
                    alert("Preencha todos os campos");
                    return;
                }

                if (senha !== confisenha) {
                    alert("As senhas não coincidem");
                    return;
                }

                let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

                if (usuarios.some(u => u.email === email)) {
                    alert("Este email já está cadastrado!");
                    return;
                }

                const novoUsuario = {
                    nome,
                    email,
                    senha,
                    admin: false
                };

                 if (!validarIdade(datanasc)) {
      alert("Você deve ter 18 anos ou mais.");
      return;
    }

                usuarios.push(novoUsuario);
                localStorage.setItem('usuarios', JSON.stringify(usuarios));

                alert('Cadastro realizado com sucesso! Faça login para continuar.');
                window.location.href = 'index.html';
            }

            function validarIdade(datanasc) {
    const hoje = new Date();
    const nascimento = new Date(datanasc);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) idade--;
    return idade >= 18;
}

 function login(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);
    
    if (usuario) {
        localStorage.setItem('usuarioAtual', JSON.stringify(usuario));
        alert('Login realizado com sucesso!');
        window.location.href = 'index.html'; 
    } else {
        alert('Email ou senha incorretos!');
    }
}


    function mostrarLogin() {
        mostrarSecao('login');
    }

    function fazerLogout() {
        usuarioAtual = null;
        localStorage.removeItem('usuarioAtual');
        verificarUsuarioLogado(); 
        mostrarSecao('inicio');
    }



    function inicializarUsuarios() {
    const usuariosExistentes = JSON.parse(localStorage.getItem('usuarios')) || [];

    const adminExiste = usuariosExistentes.some(u => u.email === 'admin@cafe.com');

    if (!adminExiste) {
        usuariosExistentes.push({
            email: 'admin@cafe.com',
            senha: 'admin123',
            admin: true,
            nome: 'Administrador'
        });
        localStorage.setItem('usuarios', JSON.stringify(usuariosExistentes));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarUsuarios();  // essa linha é essencial!
    verificarUsuarioLogado();
    buscarPrevisaoTempo();
});


    const cardapio = {
        cafe: [
            { nome: 'Café Expresso', preco: 'R$ 5,00', descricao: 'Café puro e forte' },
            { nome: 'Cappuccino', preco: 'R$ 8,00', descricao: 'Café com leite e chocolate' },
            { nome: 'Latte', preco: 'R$ 7,00', descricao: 'Café com leite cremoso' }
        ],
        doces: [
            { nome: 'Bolo de Chocolate', preco: 'R$ 12,00', descricao: 'Bolo caseiro com cobertura' },
            { nome: 'Croissant', preco: 'R$ 8,00', descricao: 'Croissant folhado' }
        ],
        salgados: [
            { nome: 'Pão de Queijo', preco: 'R$ 5,00', descricao: 'Quentinho e macio' },
            { nome: 'Misto Quente', preco: 'R$ 10,00', descricao: 'Pão, queijo e presunto' }
        ]
    };

    let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    let usuarioAtual = JSON.parse(localStorage.getItem('usuarioAtual')) || null;

    
    const WEATHER_API_KEY = '304659949fc4969c16a51c505db60f80';
    const CIDADE = 'São Paulo,BR';

    // Inicialização
    document.addEventListener('DOMContentLoaded', () => {
        verificarUsuarioLogado();
        buscarPrevisaoTempo();
    });

    // Funções de navegação
    function mostrarSecao(id) {
        document.querySelectorAll('section').forEach(s => s.classList.add('escondido'));
        document.getElementById(id).classList.remove('escondido');
    }


function mostrarReservas() {
    if (!usuarioAtual) {
        alert('Por favor, faça login para realizar uma reserva');
        window.location.href = 'login.html'; // redireciona direto
        return;
    }
    mostrarSecao('fazer-reserva');
}


    function mostrarCardapio() {
        mostrarSecao('cardapio');
        filtrarCardapio('cafe');
    }

    // Autenticação
    function verificarUsuarioLogado() {
        const btnLogin = document.getElementById('btnLogin');

        if (usuarioAtual) {
            btnLogin.textContent = 'Sair';
            btnLogin.onclick = fazerLogout;

            if (usuarioAtual.admin) {
                mostrarPainelAdmin();
            }
        } else {
            btnLogin.textContent = 'Entrar';
            btnLogin.onclick = mostrarLogin;
        }
    }




    // Reservas
   function fazerReserva(event) {
    event.preventDefault();

    const reserva = {
        id: Date.now(),
        data: document.getElementById('data').value,
        hora: document.getElementById('hora').value,
        pessoas: document.getElementById('pessoas').value,
        localizacao: document.querySelector('input[name="localizacao"]:checked').value,
        usuario: usuarioAtual.email,
        nomeUsuario: usuarioAtual.nome,
        status: 'pendente',
        dataCriacao: new Date().toISOString()
    };

    reservas.push(reserva);
    localStorage.setItem('reservas', JSON.stringify(reservas));

    alert('Reserva realizada com sucesso! Aguarde a confirmação.');
    event.target.reset();
    mostrarSecao('inicio');
}


function mostrarCarrinho() {
    esconderTodasSecoes();
    document.getElementById('carrinho').classList.remove('escondido');
    carregarCarrinho();
}

function carregarCarrinho() {
    // AQUI ESTÁ A ALTERAÇÃO: Usando '.lista-carrinho' para selecionar pela classe
    const lista = document.querySelector('.lista-carrinho');
    lista.innerHTML = '';

    const usuarioAtual = JSON.parse(localStorage.getItem('usuarioAtual'));
    if (!usuarioAtual) {
        lista.innerHTML = '<p>Você precisa estar logado para ver suas reservas.</p>';
        return;
    }

    const todasReservas = JSON.parse(localStorage.getItem('reservas')) || [];
    const reservasUsuario = todasReservas.filter(reserva => reserva.usuario === usuarioAtual.email);

    if (reservasUsuario.length === 0) {
        lista.innerHTML = '<p>Você não possui reservas no momento.</p>';
        return;
    }

    reservasUsuario.forEach(reserva => {
        // Você estava criando um elemento 'lista-carrinho' aqui, mas o correto é um 'div'
        const div = document.createElement('div');
        div.classList.add('item-carrinho');

        div.innerHTML = `
            <p><strong>Data:</strong> ${reserva.data}</p>
            <p><strong>Hora:</strong> ${reserva.hora}</p>
            <p><strong>Pessoas:</strong> ${reserva.pessoas}</p>
            <p><strong>Localização:</strong> ${reserva.localizacao}</p>
            <button onclick="cancelarReserva(${reserva.id})" class="botao-principal">Cancelar</button>
        `;

        lista.appendChild(div);
    });
}



// Cancelar uma reserva
function cancelarReserva(id) {
    let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    reservas = reservas.filter(reserva => reserva.id !== id);
    localStorage.setItem('reservas', JSON.stringify(reservas));
    alert('Reserva cancelada.');
    carregarCarrinho();
}

// Função para esconder todas as seções (use se já tiver algo assim)
function esconderTodasSecoes() {
    document.querySelectorAll('main section').forEach(secao => {
        secao.classList.add('escondido');
    });
}

// Função para voltar para a página inicial
function voltarPagina() {
    esconderTodasSecoes();
    document.getElementById('inicio').classList.remove('escondido');
}


    // Previsão do tempo
    async function buscarPrevisaoTempo() {
        try {
            // Verificar se a chave da API está configurada
            if (WEATHER_API_KEY === '304659949fc4969c16a51c505db60f80') {
                
            }

            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${CIDADE}&appid=${WEATHER_API_KEY}&units=metric&lang=pt_br`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Verificar se os dados necessários existem
            if (!data || !data.main || !data.weather || !data.weather[0]) {
                throw new Error('Dados inválidos recebidos da API');
            }

            const previsaoHtml = `
                <div class="previsao-tempo">
                    <h3>Previsão do Tempo</h3>
                    <p>Temperatura: ${Math.round(data.main.temp)}°C</p>
                    <p>Condição: ${data.weather[0].description}</p>
                    <small>Importante para reservas externas</small>
                </div>
            `;
            
            const secaoReservas = document.querySelector('.secao-reservas');
            if (secaoReservas) {
                secaoReservas.insertAdjacentHTML('beforeend', previsaoHtml);
            }
        } catch (erro) {
            console.error('Erro ao buscar previsão do tempo:', erro.message);
            // Mostrar mensagem de erro amigável para o usuário
            const secaoReservas = document.querySelector('.secao-reservas');
            if (secaoReservas) {
                secaoReservas.insertAdjacentHTML('beforeend', `
                    <div class="previsao-tempo erro">
                        <h3>Previsão do Tempo</h3>
                        <p>Não foi possível carregar a previsão do tempo no momento.</p>
                    </div>
                `);
            }
        }
    }

    // Cardápio
    function filtrarCardapio(categoria) {
        const itensContainer = document.querySelector('.itens-cardapio');
        itensContainer.innerHTML = '';

        document.querySelectorAll('.categorias button').forEach(btn => {
            btn.classList.remove('ativo');
        });
        document.querySelector(`button[onclick="filtrarCardapio('${categoria}')"]`).classList.add('ativo');

        cardapio[categoria].forEach(item => {
            const itemHtml = `
                <div class="item-cardapio">
                    <h3>${item.nome}</h3>
                    <p>${item.descricao}</p>
                    <p class="preco">${item.preco}</p>
                </div>
            `;
            itensContainer.innerHTML += itemHtml;
        });
    }

    // Painel Administrativo
    function mostrarPainelAdmin() {
        if (!usuarioAtual?.admin) {
            alert('Acesso negado!');
            return;
        }
        mostrarSecao('admin');
        atualizarListaReservas();
    }

    function atualizarListaReservas() {
        const listaReservas = document.querySelector('.lista-reservas');
        listaReservas.innerHTML = '<h3>Gerenciamento de Reservas</h3>';

        const reservasOrdenadas = [...reservas].sort((a, b) => new Date(a.data) - new Date(b.data));

        reservasOrdenadas.forEach(reserva => {
            const reservaHtml = `
                <div class="reserva-item ${reserva.status}">
                    <p>Data: ${formatarData(reserva.data)} - Hora: ${reserva.hora}</p>
                    <p>Cliente: ${reserva.nomeUsuario} (${reserva.usuario})</p>
                    <p>Pessoas: ${reserva.pessoas} - Local: ${reserva.localizacao}</p>
                    <p>Status: ${reserva.status}</p>
                    ${reserva.status === 'pendente' ? `
                        <button onclick="gerenciarReserva(${reserva.id}, 'confirmar')" class="botao-confirmar">Confirmar</button>
                        <button onclick="gerenciarReserva(${reserva.id}, 'cancelar')" class="botao-cancelar">Cancelar</button>
                    ` : ''}
                </div>
            `;
            listaReservas.innerHTML += reservaHtml;
        });
    }

    function gerenciarReserva(id, acao) {
        const reserva = reservas.find(r => r.id === id);
        if (reserva) {
            reserva.status = acao === 'confirmar' ? 'confirmada' : 'cancelada';
            reserva.dataAtualizacao = new Date().toISOString();
            localStorage.setItem('reservas', JSON.stringify(reservas));
            atualizarListaReservas();
            alert(`Reserva ${acao === 'confirmar' ? 'confirmada' : 'cancelada'} com sucesso!`);
        }
    }

    function formatarData(data) {
        return new Date(data).toLocaleDateString('pt-BR');
    }

    // mostrar o perfil
function mostrarPerfil() {
    const usuarioAtual = JSON.parse(localStorage.getItem('usuarioAtual'));
    if (!usuarioAtual) {
        alert('Por favor, faça login primeiro');
        mostrarLogin(window.location.href = 'login.html');

        mostrarLogin();
        return;
    }

    document.querySelectorAll('section').forEach(s => s.classList.add('escondido'));
    document.getElementById('perfil').classList.remove('escondido');

    // Preencher o formulário com os dados atuais
    document.getElementById('nome').value = usuarioAtual.nome || '';
    document.getElementById('email').value = usuarioAtual.email || '';
    document.getElementById('telefone').value = usuarioAtual.telefone || '';
}

// atualizar perfil
function atualizarPerfil(event) {
    event.preventDefault();

    const usuarioAtual = JSON.parse(localStorage.getItem('usuarioAtual'));
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const senhaNova = document.getElementById('senhaNova').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    // Validação de senha nova
    if (senhaNova) {
        if (senhaNova !== confirmarSenha) {
            alert('As senhas não coincidem!');
            return;
        }
    }

    // Atualizaçãp dados do usuário
    const usuarioIndex = usuarios.findIndex(u => u.email === usuarioAtual.email);
    if (usuarioIndex !== -1) {
        usuarios[usuarioIndex] = {
            ...usuarios[usuarioIndex],
            nome,
            email,
            telefone,
            senha: senhaNova || usuarios[usuarioIndex].senha
        };

        // Atualizar localStorage
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        localStorage.setItem('usuarioAtual', JSON.stringify(usuarios[usuarioIndex]));

        alert('Perfil atualizado com sucesso!');
        mostrarInicio();
    }
}


// Função para mostrar a seção de recuperação de senha
function mostrarRecuperarSenha() {
    document.querySelectorAll('section').forEach(s => s.classList.add('escondido'));
    document.getElementById('recuperarSenha').classList.remove('escondido');
}

// Função para processar a recuperação de senha
function recuperarSenha(event) {
    event.preventDefault();
    
    const email = document.getElementById('emailRecuperar').value;
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    const usuario = usuarios.find(u => u.email === email);
    
    if (usuario) {
        // Gerar senha temporária
        const senhaTemporaria = Math.random().toString(36).slice(-8);
        
        // Atualizar senha do usuário
        usuario.senha = senhaTemporaria;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        
        // Em um ambiente real, enviaria e-mail com a senha temporária
        alert(`Nova senha gerada: ${senhaTemporaria}.`);
        
        mostrarLogin();
    } else {
        alert('E-mail não encontrado!');
    }
}

// Função para mostrar a política de privacidade
function mostrarPoliticaPrivacidade() {
    document.querySelectorAll('section').forEach(s => s.classList.add('escondido'));
    document.getElementById('politicaPrivacidade').classList.remove('escondido');
}

// Função para voltar à página anterior
function voltarPagina() {
    window.history.back();
}