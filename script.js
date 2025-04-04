
function validarcadastro()
{

    let usuario = document.getElementById('txtnome').value.trim();
    
    let sobrenome = document.getElementById('txtsobrenome').value.trim();

    let senha = document.getElementById('txtsenha').value.trim();
    let confisenha = document.getElementById('txtconfisenha').value.trim();
    let datanasc = document.getElementById('txtdata').value;

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




