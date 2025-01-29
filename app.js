document.addEventListener("DOMContentLoaded", loadTasks);

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
    renderTasks(tasks, "taskList", false);
    renderTasks(completedTasks, "completedTaskList", true);
}

function renderTasks(taskArray, elementId, isCompleted) {
    document.getElementById(elementId).innerHTML = taskArray.map((task, index) => `
        <tr ${!isCompleted ? `draggable="true" ondragstart="dragTask(event, ${index})" ondragend="resetTask(event)" class="draggable"` : ''}>
            <td>${task.text}</td>
            <td>${task.added}</td>
            ${isCompleted ? `<td>${task.completed}</td>` : ''}
            <td>
                ${isCompleted ? `<button class="btn btn-danger btn-sm" onclick="deleteCompletedTask(${index})"><i class="bi bi-trash"></i></button>` : `
                <button class="btn btn-warning btn-sm" onclick="editTask(${index})"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-danger btn-sm" onclick="deleteTask(${index})"><i class="bi bi-trash"></i></button>
                <button class="btn btn-success btn-sm" onclick="completeTask(${index})"><i class="bi bi-check-circle"></i></button>`}
            </td>
        </tr>
    `).join('');
}

function dragTask(event, index) {
    event.dataTransfer.setData("text", index);

    // Obtener la fila arrastrada y agregarle la clase "dragging"
    setTimeout(() => {
        event.target.closest("tr").classList.add("dragging");
    }, 0);
}

function resetTask(event) {
    event.target.closest("tr").classList.remove("dragging");
}

function allowDrop(event) {
    event.preventDefault();
}

function highlightDropzone(event) {
    document.getElementById("dropzone").classList.add("dropzone");
}

function resetDropzone(event) {
    document.getElementById("dropzone").classList.remove("dropzone");
}

function dropTask(event) {
    event.preventDefault();
    let index = event.dataTransfer.getData("text");
    completeTask(index);
}

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    if (taskInput.value.trim()) {
        tasks.unshift({ text: taskInput.value, added: new Date().toLocaleString() });
        localStorage.setItem("tasks", JSON.stringify(tasks));
        taskInput.value = "";
        loadTasks();
    }
}

function completeTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
    let completedTask = tasks.splice(index, 1)[0];
    completedTask.completed = new Date().toLocaleString();
    completedTasks.unshift(completedTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
    loadTasks();
}

function deleteCompletedTask(index) {
    let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
    completedTasks.splice(index, 1);
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
    loadTasks();
}

function clearCompletedTasks() {
    localStorage.removeItem("completedTasks");
    loadTasks();
}

document.getElementById("taskInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

function editTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let newText = prompt("Editar tarea:", tasks[index].text);

    if (newText !== null && newText.trim() !== "") {
        tasks[index].text = newText;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        loadTasks(); // Recarga la lista de tareas
    }
}

function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.splice(index, 1); // Elimina la tarea en la posición index
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks(); // Recarga la lista de tareas
}

// Instalar pagina
let deferredPrompt;

window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredPrompt = event;

    let installButton = document.createElement("button");
    installButton.innerText = "Instalar Aplicación";
    installButton.classList.add("btn", "btn-success", "mt-3");
    installButton.onclick = () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(choice => {
            if (choice.outcome === "accepted") {
                console.log("Usuario instaló la aplicación");
            } else {
                console.log("Usuario canceló la instalación");
            }
            deferredPrompt = null;
        });
    };

    document.body.appendChild(installButton);
});

