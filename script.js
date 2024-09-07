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

    let li = document.createElement("li");
    
    let newTask = document.createElement("input");
    newTask.value = addTask_value;

    li.id = taskId;
    li.setAttribute("data-id", taskId);
    
    let idNumber = document.createElement("p");
    idNumber.innerHTML = String(li.getAttribute("data-id")) + " - ";
    idNumber.classList.add("idNumber");
    idNumber.id = taskId + "_ID";

    li.appendChild(idNumber);
    taskListContainer.appendChild(li);
    
    newTask.classList.add("newTask");
    li.appendChild(newTask);

    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);

    const taskUpdate = newTask;
    taskUpdate.addEventListener('input', (event) => {
        const value = event.target.value;
        tasks.set(Number(event.target.parentElement.getAttribute("data-id")), value);
    });
    
    taskId++;
});

taskListContainer.addEventListener("click", function (element) {
    if (element.target.tagName === "LI") {
        const selectInputOfTask = element.target.querySelector('input');
        if (element.target.id !== "checked") {
            let originalId = element.target.getAttribute("data-id");
            let task = tasks.get(Number(originalId));
            finishedTasks.set(Number(originalId), task);
            tasks.delete(Number(originalId));

            let idNumber = document.getElementById(String(originalId) + "_ID");
            idNumber.classList.remove("idNumber");
            idNumber.classList.add("idNumberChecked");

            element.target.id = "checked";
            selectInputOfTask.classList = "newTaskChecked";
            selectInputOfTask.disabled = true;

            let li = element.target;
            finishedTaskListContainer.appendChild(li);

        }
    } else if (element.target.tagName === "SPAN") {
        let originalId = element.target.parentElement.getAttribute("data-id");
        tasks.delete(Number(originalId));
        finishedTasks.delete(Number(originalId));
        
        element.target.parentElement.remove();
        
        taskId--;
        
        let temporaryMap = new Map();
        let index = 0;
        
        taskListContainer.querySelectorAll('li').forEach(li => {
            let currentId = Number(li.getAttribute("data-id"));
            let taskValue = tasks.get(currentId);
    
            if (taskValue !== undefined) {
                temporaryMap.set(index, taskValue);
                li.setAttribute("data-id", index);
                li.id = index;
    
                let idNumber = li.querySelector("p");
                idNumber.innerHTML = `${index} - `;
                idNumber.id = `${index}_ID`;
    
                index++;
            }
        });
    
        tasks = temporaryMap;

        console.log("tasks finalizadas", finishedTasks);
        console.log("tasks ativas", tasks);
    }
});

finishedTaskListContainer.addEventListener("click", function (element) {
    const selectInputOfTask = element.target.querySelector('input');
    if (element.target.id === "checked") {
        let originalId = element.target.getAttribute("data-id");
        let task = finishedTasks.get(Number(originalId));

        let idNumber = document.getElementById(String(originalId) + "_ID");
        idNumber.classList.remove("idNumberChecked");
        idNumber.classList.add("idNumber");

        tasks.set(Number(originalId), task);
        finishedTasks.delete(Number(originalId));

        element.target.id = originalId;
        selectInputOfTask.classList = "newTask";
        selectInputOfTask.disabled = false;

        let li = element.target;
        taskListContainer.appendChild(li);
    }
});

document.getElementById("formSearchTask").addEventListener("submit", function (event) {
        event.preventDefault();
    });
document.getElementById("formSearchTask").addEventListener("input", function (event) {

    const searchTerm = event.target.value.toLowerCase();

    // Limpar a lista de tarefas visível
    searchTaskListContainer.innerHTML = '';
    searchFinishedTaskListContainer.innerHTML = '';

    console.log(searchTerm);
    // Filtrar e exibir as tarefas que correspondem ao termo de pesquisa
    tasks.forEach((value, key) => {
        if (value.toLowerCase().includes(searchTerm)) {
            let idNumber = document.createElement("p");
            idNumber.classList.add("idNumber");
            idNumber.id = taskId + "_ID";
            
            let newTask = document.createElement("input");
            newTask.value = value;
            
            let li = document.createElement("li");
            li.id = key;
            li.setAttribute("data-id", key);

            idNumber.innerHTML = String(li.getAttribute("data-id")) + " - ";
            li.appendChild(idNumber);

            newTask.classList.add("newTask");
            li.appendChild(newTask);

            searchTaskListContainer.appendChild(li);

        } 
        //RESOLVER ESSA PENDÊNCIA URGENTE
        else if(searchTerm === '') {
            searchTaskListContainer.innerHTML = '';
        }
    });
    finishedTasks.forEach((value, key) => {
        if (value.toLowerCase().includes(searchTerm)) {
            let idNumber = document.createElement("p");
            idNumber.classList.add("idNumberChecked");
            idNumber.id = taskId + "_ID";
            
            let newTask = document.createElement("input");
            newTask.value = value;
            
            let li = document.createElement("li");
            li.id = "checked";
            li.setAttribute("data-id", key);

            idNumber.innerHTML = String(li.getAttribute("data-id")) + " - ";
            li.appendChild(idNumber);

            newTask.classList.remove("newTask");
            newTask.classList.add("newTaskChecked");
            li.appendChild(newTask);

            searchTaskListContainer.appendChild(li);

        }
    });
});
