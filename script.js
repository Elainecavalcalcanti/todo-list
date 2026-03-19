let lista = JSON.parse(localStorage.getItem("tarefas")) || [];

document.getElementById("btnAdicionar").addEventListener("click", adicionarTarefa);
document.getElementById("busca").addEventListener("input", buscarTarefa);

function adicionarTarefa() {
  const campoTitulo = document.getElementById("titulo");
  const campoDescricao = document.getElementById("description");
  const prioridadeSelecionada = document.querySelector('input[name="prioridade"]:checked');

  if (!campoTitulo.value || !campoDescricao.value || !prioridadeSelecionada) {
    alert("Preencha todos os campos!");
    return;
  }

  let tarefa = {
    titulo: campoTitulo.value,
    descricao: campoDescricao.value,
    prioridade: prioridadeSelecionada.value,
    status: "Pendente"
  };

  lista.push(tarefa);
  salvar();
  limparCampos();
  renderizar();
}


function renderizar(listaExibida = lista) {
  let container = document.getElementById("tarefas");
  container.innerHTML = "";

  if (listaExibida.length === 0) {
    container.innerHTML = "<p style='color: white; grid-column: 1/-1; text-align: center;'>Nenhuma tarefa encontrada.</p>";
    return;
  }

  listaExibida.forEach((tarefa, index) => {
    let card = document.createElement("div");
    card.classList.add("card");
    
    card.classList.add(tarefa.prioridade.toLowerCase().replace("é", "e"));

    if (tarefa.status === "Concluída") {
      card.classList.add("concluida");
    }

    
    card.innerHTML = `
      <div>
        <h3>${tarefa.titulo}</h3>
        <p>${tarefa.descricao}</p>
        <small>Prioridade: ${tarefa.prioridade}</small>
      </div>

      <div class="acoes">
        <button class="btn-concluir" onclick="concluir(${index})" title="${tarefa.status === 'Concluída' ? 'Desmarcar' : 'Concluir'}">
          <i class="fas fa-check"></i>
        </button>
        <button class="btn-editar" onclick="editar(${index})" title="Editar">
          <i class="fas fa-pen"></i>
        </button>
        <button class="btn-excluir" onclick="excluir(${index})" title="Excluir">
          <i class="fas fa-trash-can"></i>
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

function concluir(index) {
  lista[index].status = lista[index].status === "Concluída" ? "Pendente" : "Concluída";
  salvar();
  renderizar();
}

function excluir(index) {
  if(confirm("Deseja realmente excluir esta tarefa?")) {
    lista.splice(index, 1);
    salvar();
    renderizar();
  }
}

function editar(index) {
  let novoTitulo = prompt("Editar título:", lista[index].titulo);
  let novaDesc = prompt("Editar descrição:", lista[index].descricao);

  if (novoTitulo && novaDesc) {
    lista[index].titulo = novoTitulo;
    lista[index].descricao = novaDesc;
    salvar();
    renderizar();
  }
}

function buscarTarefa() {
  let termo = document.getElementById("busca").value.toLowerCase();
  let filtradas = lista.filter(t => 
    t.titulo.toLowerCase().includes(termo) || 
    t.descricao.toLowerCase().includes(termo)
  );
  renderizar(filtradas);
}

function salvar() {
  localStorage.setItem("tarefas", JSON.stringify(lista));
}

function limparCampos() {
  document.getElementById("titulo").value = "";
  document.getElementById("description").value = "";
  let radio = document.querySelector('input[name="prioridade"]:checked');
  if(radio) radio.checked = false;
}

renderizar();