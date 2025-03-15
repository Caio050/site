

function cadastro(){

    var textousuario;
    textousuario =document.getElementById('txtNome').value;
    var textosobrenome =document.getElementById('txtSobrenome').value;
    var textoEmail =document.getElementById('txtEmail').value;
    
    var textosenha =document.getElementById('txtSenha').value;
    var textoConfirmar =document.getElementById('txtConfirmarsenha').value;
    



    if (textousuario == "")
    { 
        alert ("Preencha seu usuario");
    }
     else if (textosobrenome == "")
    {
        alert("Preencha o campo do sobrenome ");
    }
    else if (textoEmail == "")
    {
        alert ("Preencha o campo do email");
    } 
    else if (textosenha == "")
    {
        alert ("Preencha o campo da senha");
    }
    else if  (textoConfirmar == "")
    {
        alert ("Confirme sua senha");
    }


    else if (textousuario == "Caio" && textosenha == "123")
    {
        window.location.href = 'tela.html';
    }
    else {
        alert ("invalido");
    }





        }

