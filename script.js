let tasks = new Map();
let finishedTasks = new Map();
let newTask;
let taskId = 0;
const TaskListContainer = document.getElementById("taskList-container");
const finishedTaskListContainer = document.getElementById("finishedTaskList-container");

document.getElementById("formAddTask").addEventListener("submit", function (event) {
    event.preventDefault();

    const addTask_input = document.getElementById("addTask");
    const addTask_value = addTask_input.value;

    tasks.set(taskId, addTask_value);
    addTask_input.value = '';
    console.log("tasks ativas", tasks);

    let li = document.createElement("li");
    
    newTask = document.createElement("input");
    newTask.value = addTask_value;
    
    li.id = taskId;
    li.setAttribute("data-id", taskId);
    
    let idNumber = document.createElement("p");

    idNumber.innerHTML = String(li.getAttribute("data-id")) + " - ";
    idNumber.classList.add("idNumber");
    idNumber.id = taskId + "_ID";

    console.log(idNumber);

    li.appendChild(idNumber);
    TaskListContainer.appendChild(li);
    
    newTask.classList.add("newTask");
    li.appendChild(newTask);

    //criar o x
    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);

    const taskUpdate = document.querySelector(".newTask");
    taskUpdate.addEventListener('input', (event) => {
        const value = event.target.value;
        tasks.set(Number(event.target.id), value);
        console.log("tasks ativas", tasks);
    });
    
    console.log("task id ", taskId);
    taskId++;
});

TaskListContainer.addEventListener("click", function (element) {
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


            console.log("tasks finalizadas", finishedTasks);
            console.log("tasks ativas", tasks);

        }
    } else if (element.target.tagName === "SPAN") {
        let originalId = element.target.parentElement.getAttribute("data-id");
        tasks.delete(Number(originalId));
        finishedTasks.delete(Number(originalId));

        element.target.parentElement.remove();

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
        
        console.log("tasks finalizadas", finishedTasks);
        console.log("tasks ativas", tasks);
        console.log()
        
        let li = element.target;
        TaskListContainer.appendChild(li);
    }
});

