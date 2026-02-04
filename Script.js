const botoesAdd = document.querySelectorAll(".add");
const caixaPedido = document.querySelector(".caixa-pedido");
const subtotalTexto = document.querySelector(".subtotal");
const descontoTexto = document.querySelector(".desconto");
const totalTexto = document.querySelector(".total");
const inputCupom = document.querySelector(".cupom");
const btnCupom = document.querySelector(".btn-cupom");
const botaoFinalizar = document.querySelector(".finalizar");
const obsInput = document.querySelector(".obs");

let pedido = {};
let descontoPercentual = 0;

function formatar(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function atualizarPedido() {
    caixaPedido.innerHTML = "";
    let subtotal = 0;

    for (let nome in pedido) {
        const item = pedido[nome];
        subtotal += item.preco * item.qtd;

        const div = document.createElement("div");
        div.className = "item-pedido";
        div.innerHTML = `
            <span>${nome} (x${item.qtd})</span>
            <button class="remover">❌</button>
        `;

        div.querySelector(".remover").onclick = () => {
            item.qtd--;
            if (item.qtd === 0) delete pedido[nome];
            atualizarPedido();
        };

        caixaPedido.appendChild(div);
    }

    const valorDesconto = subtotal * descontoPercentual;
    const totalFinal = subtotal - valorDesconto;

    subtotalTexto.textContent = `Subtotal: ${formatar(subtotal)}`;
    descontoTexto.textContent = `Desconto: ${formatar(valorDesconto)}`;
    totalTexto.textContent = `TOTAL: ${formatar(totalFinal)}`;
}

/* ADICIONAR PRODUTO */
botoesAdd.forEach(botao => {
    botao.addEventListener("click", () => {
        const nome = botao.parentElement.querySelector("p").innerText;
        const preco = Number(botao.dataset.preco);

        if (!pedido[nome]) {
            pedido[nome] = { preco, qtd: 1 };
        } else {
            pedido[nome].qtd++;
        }

        atualizarPedido();
    });
});

/* CUPOM */
btnCupom.addEventListener("click", () => {
    if (inputCupom.value.trim() === "Julia02") {
        descontoPercentual = 0.10;
        alert("Cupom aplicado! 10% de desconto 🎉");
    } else {
        descontoPercentual = 0;
        alert("Cupom inválido ❌");
    }
    atualizarPedido();
});

/* FINALIZAR */
botaoFinalizar.addEventListener("click", () => {
    if (Object.keys(pedido).length === 0) {
        alert("Pedido vazio!");
        return;
    }
    abrirPagamento();
});

/* PAGAMENTO */
function abrirPagamento() {
    const tela = document.createElement("div");
    tela.className = "tela-pagamento";

    tela.innerHTML = `
        <div class="box">
            <h2>Pagamento & Endereço</h2>

            <label>Forma de pagamento</label>
            <select>
                <option>Pix</option>
                <option>Cartão</option>
                <option>Dinheiro</option>
            </select>

            <label>Endereço</label>
            <input placeholder="Rua, número, bairro">

            <label>Observações</label>
            <p>${obsInput.value || "Nenhuma"}</p>

            <button class="btn-confirmar">Confirmar Pedido</button>
            <button class="btn-cancelar">Cancelar</button>
        </div>
    `;

    tela.querySelector(".btn-confirmar").onclick = () => {
        tela.remove();
        abrirTelaFinal();
    };

    tela.querySelector(".btn-cancelar").onclick = () => {
        tela.remove();
    };

    document.body.appendChild(tela);
}

/* TELA FINAL */
function abrirTelaFinal() {
    const tela = document.createElement("div");
    tela.className = "tela-final";

    tela.innerHTML = `
        <div class="box-final">
            <h2>🎉 Pedido realizado!</h2>
            <p>Seu pedido foi enviado com sucesso.</p>
            <p>Em breve ele chegará até você 🍔</p>
            <button class="btn-novo">Voltar ao início</button>
        </div>
    `;

    tela.querySelector(".btn-novo").onclick = () => {
        limparTudo();
        tela.remove();
    };

    document.body.appendChild(tela);
}

/* LIMPAR */
function limparTudo() {
    pedido = {};
    descontoPercentual = 0;
    inputCupom.value = "";
    obsInput.value = "";
    atualizarPedido();
}
