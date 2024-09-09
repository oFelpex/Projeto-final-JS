let tasks = new Map();
let finishedTasks = new Map();
let taskId = 0;

const taskListContainer = document.getElementById("taskList-container");
const finishedTaskListContainer = document.getElementById("finishedTaskList-container");
const searchTaskListContainer = document.getElementById("searchTaskList-container");
const searchFinishedTaskListContainer = document.getElementById("searchFinishedTaskList-container");

document.getElementById("formAddTask").addEventListener("submit", function (event) {
    event.preventDefault();
    const addTask_input = document.getElementById("addTask");
    const addTask_value = addTask_input.value;
    tasks.set(taskId, addTask_value);
    addTask_input.value = '';
    addTaskToDOM(taskId, addTask_value, taskListContainer, tasks);
    taskId++;
});

function addTaskToDOM(id, taskValue, container, taskMap) {
    let isChecked = false;
    let li = document.createElement("li");
    li.id = id;
    li.setAttribute("data-id", id);

    let newTask = document.createElement("input");
    newTask.value = taskValue;
    newTask.classList.add("newTask");
    newTask.disabled = isChecked;

    li.appendChild(newTask);

    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);

    container.appendChild(li);

    //editar a tarefa
    newTask.addEventListener('input', (event) => {
        const value = event.target.value;
        taskMap.set(Number(li.getAttribute("data-id")), value);
    });

    //excluir a tarefa
    span.addEventListener("click", function () {
        let originalId = li.getAttribute("data-id");
        tasks.delete(Number(originalId));
        finishedTasks.delete(Number(originalId));
        li.remove();
        //remove da pesquisa
        searchTaskListContainer.querySelector(`li[data-id='${originalId}']`)?.remove();
        searchFinishedTaskListContainer.querySelector(`li[data-id='${originalId}']`)?.remove();
        console.log("tasks atualizadas", tasks);
    });

    //marcar como concluída ou não concluida
    li.addEventListener("click", function (element) {
        if (element.target.tagName === "LI") {
            if (!isChecked) {
                markTaskAsFinished(li);
                isChecked = true;
            } else {
                unmarkTaskAsFinished(li);
                isChecked = false;
            }
        }
    });
}

function markTaskAsFinished(li) {
    let originalId = li.getAttribute("data-id");
    let task = tasks.get(Number(originalId));
    finishedTasks.set(Number(originalId), task);
    tasks.delete(Number(originalId));

    let input = li.querySelector("input");
    input.classList.remove("newTask");
    input.classList.add("newTaskChecked");
    input.disabled = true;

    li.id = "checked";
    finishedTaskListContainer.appendChild(li);

    //verifica e atualiza na pesquisa
    let clonedLi = searchTaskListContainer.querySelector(`li[data-id='${originalId}']`);
    if (clonedLi) {
        let clonedInput = clonedLi.querySelector('input');
        clonedInput.classList.remove("newTask");
        clonedInput.classList.add("newTaskChecked");
        clonedInput.disabled = true;
        clonedLi.id = "checked";
        searchFinishedTaskListContainer.appendChild(clonedLi);
    }

    //remove da lista de tarefas não finalizadas
    let originalLi = taskListContainer.querySelector(`li[data-id='${originalId}']`);
    if (originalLi) {
        taskListContainer.removeChild(originalLi);
    }
}

function unmarkTaskAsFinished(li) {
    let originalId = li.getAttribute("data-id");
    let task = finishedTasks.get(Number(originalId));
    tasks.set(Number(originalId), task);
    finishedTasks.delete(Number(originalId));

    let input = li.querySelector("input");
    input.classList.remove("newTaskChecked");
    input.classList.add("newTask");
    input.disabled = false;

    li.id = originalId;
    taskListContainer.appendChild(li);

    //verifica e atualiza na pesquisa
    let clonedLi = searchFinishedTaskListContainer.querySelector(`li[data-id='${originalId}']`);
    if (clonedLi) {
        let clonedInput = clonedLi.querySelector('input');
        clonedInput.classList.remove("newTaskChecked");
        clonedInput.classList.add("newTask");
        clonedInput.disabled = false;
        clonedLi.id = originalId;
        searchTaskListContainer.appendChild(clonedLi);
    }

    //remove da lista de tarefas finalizadas
    let originalLi = finishedTaskListContainer.querySelector(`li[data-id='${originalId}']`);
    if (originalLi) {
        finishedTaskListContainer.removeChild(originalLi);
    }
}

document.getElementById("formSearchTask").addEventListener("submit", function (event) {
    event.preventDefault();
});
document.getElementById("inputSearch").addEventListener("input", function (event) {
    const searchTerm = event.target.value.toLowerCase();
    
    // Limpa a área de pesquisa
    searchTaskListContainer.innerHTML = '';
    searchFinishedTaskListContainer.innerHTML = '';

    // Filtra tarefas em andamento
    tasks.forEach((value, key) => {
        let taskLi = taskListContainer.querySelector(`li[data-id='${key}']`);
        if (taskLi) {
            if (value.toLowerCase().includes(searchTerm)) {
                taskLi.style.display = ""; // Mostra a tarefa
            } else {
                taskLi.style.display = "none"; // Oculta a tarefa
            }
        }
    });

    // Filtra tarefas concluídas
    finishedTasks.forEach((value, key) => {
        let finishedLi = finishedTaskListContainer.querySelector(`li[data-id='${key}']`);
        if (finishedLi) {
            if (value.toLowerCase().includes(searchTerm)) {
                finishedLi.style.display = ""; // Mostra a tarefa
            } else {
                finishedLi.style.display = "none"; // Oculta a tarefa
            }
        }
    });
});

