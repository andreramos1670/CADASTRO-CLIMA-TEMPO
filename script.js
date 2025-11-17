function limparCampos() {
    document.getElementById('logradouro').value = "";
    document.getElementById('bairro').value = "";
    document.getElementById('cidadeCep').value = "";
    document.getElementById('uf').value = "";
}

function buscarEndereco() {
    const cepInput = document.getElementById('cep');
    const cep = cepInput.value.replace(/\D/g, '');
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    
    limparCampos();

    if (cep.length !== 8) {
        alert("CEP inválido! Digite 8 números.");
        return;
    }

    fetch(url)
        .then(response => response.json())
        .then(dados => {
            if (dados.erro) {
                alert("CEP não encontrado na base de dados do ViaCEP.");
            } else {
                document.getElementById('logradouro').value = dados.logradouro;
                document.getElementById('bairro').value = dados.bairro;
                document.getElementById('cidadeCep').value = dados.localidade;
                document.getElementById('uf').value = dados.uf;
            }
        })
        .catch(error => {
            console.error('Erro na requisição da API:', error);
            alert("Ocorreu um erro ao consultar o CEP. Tente novamente mais tarde.");
        });
}


const form = document.getElementById("formCliente");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const cliente = {
        nome: nome.value,
        email: email.value,
        telefone: telefone.value,
        cep: cep.value,
        logradouro: logradouro.value,
        bairro: bairro.value,
        cidade: cidadeCep.value,
        estado: uf.value
    };

    localStorage.setItem("cliente", JSON.stringify(cliente));

    buscarClima(cliente.cidade);
});


function buscarClima(nomeCidade = null) {
    const cidade = nomeCidade || document.getElementById("cidadeClima").value;

    if (!cidade.trim()) {
        alert("Digite uma cidade!");
        return;
    }

    const loadingElement = document.getElementById("loading");
    loadingElement.style.display = "block";

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=113e086b43234d183feef7d344612aab&lang=pt_br`)
        .then((response) => response.json())
        .then((data) => {

            if (data.cod === "404") {
                alert("Cidade não encontrada!");
                loadingElement.style.display = "none";
                return;
            }

            const temperatura = (data.main.temp - 273.15).toFixed(2);
            const humidade = data.main.humidity;
            const descricao = data.weather[0].description;

            const tempElement = document.getElementById("temperatura");

            // Regras de cores
            if (temperatura < 15) {
                tempElement.style.color = "blue";
            } else if (temperatura >= 15 && temperatura <= 30) {
                tempElement.style.color = "green";
            } else {
                tempElement.style.color = "red";
            }

            tempElement.textContent = `Temperatura: ${temperatura}°C`;
            document.getElementById("descricao").textContent = `Descrição: ${descricao}`;
            document.getElementById("humidade").textContent = `Humidade: ${humidade}%`;

            loadingElement.style.display = "none";
        })
        .catch((error) => {
            console.log("Erro:", error);
            alert("Erro ao buscar dados. Tente novamente.");
            loadingElement.style.display = "none";
        });
}