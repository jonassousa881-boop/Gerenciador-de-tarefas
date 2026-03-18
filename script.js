const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const filterButtons = document.querySelectorAll(".filter-btn");

let tarefas = JSON.parse(localStorage.getItem("taskflow_tarefas")) || [];
let filtroAtual = "todas";

function salvarTarefas() {
  localStorage.setItem("taskflow_tarefas", JSON.stringify(tarefas));
}

function atualizarTela() {
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
    li.className = `task-item ${tarefa.concluida ? "completed" : ""}`;

    li.innerHTML = `
      <div class="task-content">
        <span class="task-text">${tarefa.texto}</span>
      </div>
      <div class="task-actions">
        <button class="btn-check" onclick="alternarConclusao(${tarefa.id})">
          ${tarefa.concluida ? "Desfazer" : "Concluir"}
        </button>
        <button class="btn-delete" onclick="excluirTarefa(${tarefa.id})">
          Excluir
        </button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

function adicionarTarefa() {
  const texto = taskInput.value.trim();

  if (!texto) {
    alert("Digite uma tarefa.");
    return;
  }

  const novaTarefa = {
    id: Date.now(),
    texto,
    concluida: false
  };

  tarefas.push(novaTarefa);
  taskInput.value = "";
  salvarTarefas();
  atualizarTela();
}

function alternarConclusao(id) {
  tarefas = tarefas.map((tarefa) =>
    tarefa.id === id
      ? { ...tarefa, concluida: !tarefa.concluida }
      : tarefa
  );

  salvarTarefas();
  atualizarTela();
}

function excluirTarefa(id) {
  tarefas = tarefas.filter((tarefa) => tarefa.id !== id);
  salvarTarefas();
  atualizarTela();
}

addBtn.addEventListener("click", adicionarTarefa);

taskInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    adicionarTarefa();
  }
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    filtroAtual = btn.dataset.filter;
    atualizarTela();
  });
});

atualizarTela();