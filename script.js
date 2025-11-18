function limparCampos() {
    document.getElementById('logradouro').value = "";
    document.getElementById('bairro').value = "";
    document.getElementById('cidadeCep').value = "";
    document.getElementById('uf').value = "";
}

function buscarEndereco() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
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
                alert("CEP não encontrado!");
            } else {
                document.getElementById('logradouro').value = dados.logradouro;
                document.getElementById('bairro').value = dados.bairro;
                document.getElementById('cidadeCep').value = dados.localidade;
                document.getElementById('uf').value = dados.uf;
            }
        })
        .catch(error => {
            console.error("Erro ao consultar CEP:", error);
            alert("Erro ao buscar o CEP.");
        });
}


document.getElementById("formCliente").addEventListener("submit", (e) => {
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

    if (cliente.cidade && cliente.cidade.trim() !== "") {
        buscarClima(cliente.cidade);
    } else {
        alert("O CEP não foi preenchido corretamente, portanto não há cidade para buscar o clima.");
    }
});


function buscarClima(nomeCidade = null) {
    
    const cidade = nomeCidade; 

    if (!cidade || !cidade.trim()) {
        alert("Cidade não informada ou inválida!");
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
            const UTC = data.timezone;

            
            let descricao = "Descrição não disponível";
            if (data.weather && data.weather.length > 0) {
                descricao = data.weather[0].description;
            }

            
            const offsetCidadeMS = data.timezone * 1000;
            const horaLocalMS = Date.now() + offsetCidadeMS;
            const horaLocal = new Date(horaLocalMS); 

            const formatadorDeHora = new Intl.DateTimeFormat('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                timeZone: 'UTC' 
            });

            const tempElement = document.getElementById("temperatura");

            
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
            
          
            document.getElementById("horaLocal").textContent = `Hora local: ${formatadorDeHora.format(horaLocal)}`;

            loadingElement.style.display = "none";
        })
        .catch((error) => {
            console.error("Erro na consulta do clima:", error);
            alert("Erro ao buscar dados. Tente novamente.");
            document.getElementById("loading").style.display = "none";
        });
}