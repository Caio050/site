function validarcadastro() {
    const nome = document.getElementById("txtnome").value.trim();
    const sobrenome = document.getElementById("txtsobrenome").value.trim();
    const senha = document.getElementById("txtsenha").value.trim();
    const confisenha = document.getElementById("txtconfisenha").value.trim();
    const datanasc = document.getElementById("txtdata").value;
    const cep = document.getElementById("txtcep").value.trim();
    const email = document.getElementById("txtemail").value.trim();

    if (!nome || !sobrenome || !email || !senha || !confisenha || !datanasc || !cep) {
      alert("Preencha todos os campos.");
      return;
    }

    if (senha !== confisenha) {
      alert("Senhas são diferentes.");
      return;
    }

    if (!validarIdade(datanasc)) {
      alert("Você deve ter 18 anos ou mais.");
      return;
    }

    const usuario = {nome,email,senha};
    localStorage.setItem(email,JSON.stringify(usuario));

    alert('Usuário Cadastrado!');
    window.location.href = 'login.html';



    localStorage.setItem("cepCliente", cep);

    window.location.href = "index.html";
  }

  function validarIdade(datanasc) {
    const hoje = new Date();
    const nascimento = new Date(datanasc);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    return idade >= 18;
}

function login(){
  const email = document.getElementById('txtemail').value;
  const senha = document.getElementById('txtsenha').value;

  if (!email || !senha){
      alert('preencha os campos');
      return;
  }
  const usuariosalvo = localStorage.getItem(email);

  if(!usuariosalvo){
      alert('Usuario ou senha invalidos!');
      return;
  }

  const usuarioBase = JSON.parse(usuariosalvo);

  if (usuarioBase.senha== senha){
      alert('Usuario e senha corretos!');
      window.location.href = "index.html";
  } else {
      alert('Usuario ou senha invalidos')
  }


}
function buscarEndereco() {
    const cep = document.getElementById("txtcep").value.trim();

    // Valida se o campo tem 8 dígitos numéricos
    if (!/^[0-9]{8}$/.test(cep)) {
      alert("Digite um CEP válido com 8 números.");
      return;
    }

    // Faz a requisição para a API do ViaCEP
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(resposta => resposta.json())
      .then(dados => {
        if (dados.erro) {
          document.getElementById("resultado").innerText = "CEP não encontrado.";
        } else {
          document.getElementById("resultado").innerHTML = `
            <strong>Endereço encontrado:</strong><br>
            Rua: ${dados.logradouro}<br>
            Bairro: ${dados.bairro}<br>
            Cidade: ${dados.localidade} - ${dados.uf}
          `;
        }
    })
      .catch(erro => {
        console.error("Erro ao buscar o CEP:", erro);
        document.getElementById("resultado").innerText = "Erro na consulta.";
      });
    }

    function agendarMesa(mesa) {
      const mesas = document.querySelectorAll('.mesa');
      mesas.forEach(m => m.classList.remove('selecionada'));
      mesa.classList.add('selecionada');
  }

  function finalizarAgendamento() {
      const nome = document.getElementById('nomeCliente').value;
      const dataHora = document.getElementById('dataHora').value;
      const mesaSelecionada = document.querySelector('.mesa.selecionada');

      if (!mesaSelecionada || !nome || !dataHora) {
          alert('Por favor, preencha todos os campos!');
          return;
      }

      document.getElementById('agendarButton').disabled = true;
      document.querySelector('.feedback').style.display = 'block';
      document.querySelector('.mesa.selecionada').classList.add('indisponivel');
      alert(`Mesa agendada para ${nome} em ${dataHora}`);
  }