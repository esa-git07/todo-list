const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const allBtn = document.getElementById("allBtn");
const activeBtn = document.getElementById("activeBtn");
const completedBtn = document.getElementById("completedBtn");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const remainingTasks = document.getElementById("remainingTasks");

let currentFilter = "all";
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

addTaskBtn.addEventListener("click", addTask);
allBtn.addEventListener("click", () => {
    currentFilter = "all";
    setActiveFilterButton();
    renderTasks();
});

activeBtn.addEventListener("click", () => {
    currentFilter = "active";
    setActiveFilterButton();
    renderTasks();
});

completedBtn.addEventListener("click", () => {
    currentFilter = "completed";
    setActiveFilterButton();
    renderTasks();
});

taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);

    renderTasks();

    taskInput.value = "";
}

function renderTasks() {
    localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
);
    taskList.innerHTML = "";
    const completedCount = tasks.filter(task => task.completed).length;

totalTasks.textContent = `Total: ${tasks.length}`;
completedTasks.textContent = `Completed: ${completedCount}`;
remainingTasks.textContent = `Remaining: ${tasks.length - completedCount}`;

   let filteredTasks = tasks;

if (currentFilter === "active") {
    filteredTasks = tasks.filter(task => !task.completed);
}

if (currentFilter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
}
if (filteredTasks.length === 0) {
    taskList.innerHTML = `
        <li class="empty-state">
            📝 No tasks found
        </li>
    `;
    return;
}

filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.innerHTML = `
            <div class="task-content">
                <input
                    type="checkbox"
                    class="complete-checkbox"
                    ${task.completed ? "checked" : ""}
                >

                <span class="task-text ${task.completed ? "completed" : ""}">
                    ${task.text}
                </span>
            </div>

            <div class="task-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        const checkbox = li.querySelector(".complete-checkbox");
        const editBtn = li.querySelector(".edit-btn");
        const deleteBtn = li.querySelector(".delete-btn");

        checkbox.addEventListener("change", () => {
            task.completed = !task.completed;
            renderTasks();
        });

        editBtn.addEventListener("click", () => {
            const updatedText = prompt(
                "Edit Task",
                task.text
            );

            if (updatedText && updatedText.trim() !== "") {
                task.text = updatedText.trim();
                renderTasks();
            }
        });

        deleteBtn.addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            renderTasks();
        });

        taskList.appendChild(li);
    });
    
}
    function setActiveFilterButton() {

    allBtn.classList.remove("active");
    activeBtn.classList.remove("active");
    completedBtn.classList.remove("active");

    if (currentFilter === "all") {
        allBtn.classList.add("active");
    }

    if (currentFilter === "active") {
        activeBtn.classList.add("active");
    }

    if (currentFilter === "completed") {
        completedBtn.classList.add("active");
    }
}
setActiveFilterButton();
renderTasks();