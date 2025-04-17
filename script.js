
function validarcadastro()
{

    let usuario = document.getElementById('txtnome').value.trim();
    
    let sobrenome = document.getElementById('txtsobrenome').value.trim();

    let senha = document.getElementById('txtsenha').value.trim();
    let confisenha = document.getElementById('txtconfisenha').value.trim();
    let datanasc = document.getElementById('txtdata').value;

    if (usuario == "Caio" && sobrenome =="Meira" && senha =="123" && confisenha== senha){
        window.location.href = "index.html";
    }

    if (usuario ==""){
        alert("Por favor, preencher usuario");
        return;

    } else if (sobrenome == ""){
        alert("Por favor, preencher o sobrenome");
        return;
    } else if (senha == ""){
        alert("Por favor , preencha a senha");
        return;

    } else if (confisenha == ""){
        alert("Por fazer, confirmar senha");
        return;
    }
    if (!validarIdade(datanasc)) {

        alert("Você deve ser maior de idade para se cadastrar.");

        return;

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
    

}
function buscarClima(cep) {
    const widget = document.getElementById("clima");
    const apiKey = "SUA_API_KEY_AQUI"; // Coloque sua chave da OpenWeatherMap aqui

    if (!cep || cep.length !== 8) {
      widget.innerText = "CEP inválido.";
      return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(res => res.json())
      .then(dados => {
        if (dados.erro) {
          widget.innerText = "CEP não encontrado.";
          return;
        }

        const cidade = dados.localidade;
        const estado = dados.uf;

        return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade},${estado},BR&appid=${apiKey}&lang=pt_br&units=metric`);
      })
      .then(res => res.json())
      .then(clima => {
        if (!clima || clima.cod !== 200) {
          widget.innerText = "Clima não disponível.";
          return;
        }

        widget.innerHTML = `
           ${clima.name}/${clima.sys.country}<br>
           ${Math.round(clima.main.temp)}°C<br>
           ${clima.weather[0].description}
        `;
      })
      .catch(() => {
        widget.innerText = "Erro ao obter clima.";
      });
  }

  // Executa quando a página carrega
  window.onload = () => {
    const cep = localStorage.getItem("cepCliente");
    if (cep) {
      buscarClima(cep);
    } else {
      document.getElementById("clima").innerText = "Informe o CEP no cadastro.";
    }
  }






