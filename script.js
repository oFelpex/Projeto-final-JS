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

    addTaskToDOM(taskId, addTask_value, taskListContainer, tasks, false);

    taskId++;
});

function addTaskToDOM(id, taskValue, container, taskMap, isChecked) {
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

    // Evento para editar a tarefa
    newTask.addEventListener('input', (event) => {
        const value = event.target.value;
        taskMap.set(Number(li.getAttribute("data-id")), value);
    });

    // Evento para excluir a tarefa
    span.addEventListener("click", function () {
        let originalId = li.getAttribute("data-id");
        tasks.delete(Number(originalId));
        finishedTasks.delete(Number(originalId));
        li.remove();
        console.log("tasks atualizadas", tasks);
    });

    // Evento para marcar como concluída ou desmarcar
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

    let originalLi = finishedTaskListContainer.querySelector(`li[data-id='${originalId}']`);
    if (originalLi) {
        finishedTaskListContainer.removeChild(originalLi);
    }
}

document.getElementById("formSearchTask").addEventListener("input", function (event) {
    const searchTerm = event.target.value.toLowerCase();
    searchTaskListContainer.innerHTML = '';
    searchFinishedTaskListContainer.innerHTML = '';

    tasks.forEach((value, key) => {
        if (value.includes(searchTerm)) {
            let taskLi = taskListContainer.querySelector(`li[data-id='${key}']`);
            if (taskLi) {
                let clonedLi = taskLi.cloneNode(true);
                addEventListenersToClonedTask(clonedLi);
                searchTaskListContainer.appendChild(clonedLi);

                if (searchTerm === '') {
                    clonedLi.remove();
                }
            }
        }
    });

    finishedTasks.forEach((value, key) => {
        if (value.includes(searchTerm)) {
            let taskLi = finishedTaskListContainer.querySelector(`li[data-id='${key}']`);
            if (taskLi) {
                let clonedLi = taskLi.cloneNode(true);
                addEventListenersToClonedTask(clonedLi);
                searchFinishedTaskListContainer.appendChild(clonedLi);

                if (searchTerm === '') {
                    clonedLi.remove();
                }
            }
        }
    });
});

function addEventListenersToClonedTask(clonedLi) {
    const newTask = clonedLi.querySelector('input');
    const span = clonedLi.querySelector('span');

    // Reaplicando eventos para edição e exclusão
    newTask.addEventListener('input', (event) => {
        const value = event.target.value;
        tasks.set(Number(clonedLi.getAttribute("data-id")), value);
    });

    span.addEventListener("click", function () {
        let originalId = clonedLi.getAttribute("data-id");
        tasks.delete(Number(originalId));
        finishedTasks.delete(Number(originalId));
        clonedLi.remove();
        console.log("tasks atualizadas", tasks);
    });

    clonedLi.addEventListener("click", function (element) {
        if (element.target.tagName === "LI") {
            if (clonedLi.id !== "checked") {
                markTaskAsFinished(clonedLi);
            } else {
                unmarkTaskAsFinished(clonedLi);
            }
        }
    });
}
