const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const filterButtons = document.querySelectorAll(".filter-btn");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let filtroAtual = "todas";

function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function renderizarTarefas() {
  taskList.innerHTML = "";

  let tarefasFiltradas = tarefas;

  if (filtroAtual === "pendentes") {
    tarefasFiltradas = tarefas.filter((tarefa) => !tarefa.concluida);
  } else if (filtroAtual === "concluidas") {
    tarefasFiltradas = tarefas.filter((tarefa) => tarefa.concluida);
  }

  if (tarefasFiltradas.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

  tarefasFiltradas.forEach((tarefa) => {
    const li = document.createElement("li");
    li.className = "task-item";

    li.innerHTML = `
      <div class="task-info">
        <span class="${tarefa.concluida ? "completed" : ""}">${tarefa.texto}</span>
      </div>
      <div class="task-actions">
       <button onclick="alternarStatus(${tarefa.id})">
  ✔
</button>
<button onclick="removerTarefa(${tarefa.id})">
  ✖
</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

function adicionarTarefa() {
  const texto = taskInput.value.trim();

  if (texto === "") {
    alert("Digite uma tarefa.");
    return;
  }

  const novaTarefa = {
    id: Date.now(),
    texto: texto,
    concluida: false
  };

  tarefas.push(novaTarefa);
  salvarTarefas();
  renderizarTarefas();
  taskInput.value = "";
  taskInput.focus();
}

function alternarStatus(id) {
  tarefas = tarefas.map((tarefa) => {
    if (tarefa.id === id) {
      return { ...tarefa, concluida: !tarefa.concluida };
    }
    return tarefa;
  });

  salvarTarefas();
  renderizarTarefas();
}

function removerTarefa(id) {
  tarefas = tarefas.filter((tarefa) => tarefa.id !== id);
  salvarTarefas();
  renderizarTarefas();
}

addBtn.addEventListener("click", adicionarTarefa);

taskInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    adicionarTarefa();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", function () {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
    filtroAtual = this.dataset.filter;
    renderizarTarefas();
  });
});

renderizarTarefas();