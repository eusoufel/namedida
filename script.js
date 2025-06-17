let orcamento = {};
let paredeIndex = 0;
let comodoIndex = 0;  // Novo contador para identificar cômodos únicos

function addParede(perguntaNova = true) {
    const paredesDiv = document.getElementById('paredes');
    const div = document.createElement('div');
    div.classList.add('input-group');
    div.innerHTML = `
        <label>Parede ${paredeIndex + 1}:</label>
        <input type="number" step="0.01" placeholder="Largura (m)" id="largura${paredeIndex}" required>
        <input type="number" step="0.01" placeholder="Altura (m)" id="altura${paredeIndex}" required>
        <div class="quantidade-controls">
            <button type="button" onclick="alterarQuantidade(${paredeIndex}, -1)">-</button>
            <span id="quantidade${paredeIndex}" class="quantidade">1</span>
            <button type="button" onclick="alterarQuantidade(${paredeIndex}, 1)">+</button>
        </div>
    `;
    paredesDiv.appendChild(div);
    paredeIndex++;

    if (perguntaNova) {
        const perguntaDiv = document.createElement('div');
        perguntaDiv.classList.add('input-group');
        perguntaDiv.innerHTML = `
            <button type="button" onclick="addParede()">Adicionar próxima parede?</button>
        `;
        paredesDiv.appendChild(perguntaDiv);
    }
}

function alterarQuantidade(index, delta) {
    const quantidadeSpan = document.getElementById(`quantidade${index}`);
    let quantidade = parseInt(quantidadeSpan.textContent);
    quantidade = Math.max(1, quantidade + delta); // Garante que a quantidade não seja menor que 1
    quantidadeSpan.textContent = quantidade;
}

function toggleTeto() {
    const tetoInputs = document.getElementById('tetoInputs');
    tetoInputs.classList.toggle('hidden');
}

function adicionarComodo() {
    const nome = document.getElementById('nome').value;
    const comodo = document.getElementById('comodo').value;
    let areaParedes = 0;

    for (let i = 0; i < paredeIndex; i++) {
        const largura = parseFloat(document.getElementById(`largura${i}`).value);
        const altura = parseFloat(document.getElementById(`altura${i}`).value);
        const quantidade = parseInt(document.getElementById(`quantidade${i}`).textContent);
        if (!isNaN(largura) && !isNaN(altura) && !isNaN(quantidade)) {
            const area = largura * altura * quantidade;
            areaParedes += area;
        }
    }

    let areaTeto = 0;
    if (document.getElementById('teto').checked) {
        const larguraTeto = parseFloat(document.getElementById('larguraTeto').value);
        const comprimentoTeto = parseFloat(document.getElementById('comprimentoTeto').value);
        if (!isNaN(larguraTeto) && !isNaN(comprimentoTeto)) {
            areaTeto = larguraTeto * comprimentoTeto;
        }
    }

    const comodoId = `${comodo}_${comodoIndex}`;
    orcamento[comodoId] = {
        nome: comodo,
        paredes: areaParedes,
        teto: areaTeto
    };
    comodoIndex++;

    document.getElementById('dadosCliente').classList.remove('hidden');
    paredeIndex = 0;
    document.getElementById('paredes').innerHTML = '';
    document.getElementById('orcamentoForm').reset();
    
    // Resetar a seção do teto
    document.getElementById('teto').checked = false;
    document.getElementById('tetoInputs').classList.add('hidden');

    const finalizarDiv = document.getElementById('finalizarProjeto');
    finalizarDiv.classList.remove('hidden');

    exibirResumo();
}

function removerComodo(comodoId) {
    delete orcamento[comodoId];
    exibirResumo();
}

function exibirResumo() {
    const resumo = document.getElementById('resumo');
    let html = '<h3>Resumo do Orçamento:</h3>';
    let totalGeral = 0;
    for (const comodoId in orcamento) {
        const comodo = orcamento[comodoId];
        const paredes = comodo.paredes.toFixed(2);
        const teto = comodo.teto.toFixed(2);
        const total = (parseFloat(paredes) + parseFloat(teto)).toFixed(2);
        totalGeral += parseFloat(total);
        html += `
            <div class="comodo-item">
                <div class="comodo-info">
                    <strong>Cômodo:</strong> ${comodo.nome}<br>
                    Área total das paredes: ${paredes} m²<br>
                    ${parseFloat(teto) > 0 ? `Área do teto: ${teto} m²<br>` : 'Sem teto para orçar.<br>'}
                    Área total do cômodo: ${total} m²
                </div>
                <button type="button" class="remover-comodo" onclick="removerComodo('${comodoId}')">
                    Remover
                </button>
            </div><br>`;
    }
    html += `<strong>Área total de todos os cômodos: ${totalGeral.toFixed(2)} m²</strong>`;
    resumo.innerHTML = html;
}

function enviarWhatsApp() {
    const nomeOrcamentista = document.getElementById('nome').value;
    const telefoneOrcamentista = document.getElementById('telefoneOrcamentista').value;
    const nomeCliente = document.getElementById('nomeCliente').value;
    const telefone = document.getElementById('telefoneCliente').value;
    exibirResumo();
    const resumo = document.getElementById('resumo').innerText;
    const mensagem = encodeURIComponent(`Orçamento elaborado por: ${nomeOrcamentista}\nTelefone do orçamentista: ${telefoneOrcamentista}\n\nPara: ${nomeCliente}\nTelefone do cliente: ${telefone}\n\n${resumo}`);
    const url = `https://wa.me/?text=${mensagem}`;
    window.open(url, '_blank');
}
