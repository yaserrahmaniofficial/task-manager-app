const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDateInput");
const priorityInput = document.getElementById("priorityInput");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const filter = document.getElementById("filter");

// Load tasks from Local Storage on page load
document.addEventListener("DOMContentLoaded", loadTasks);

// Add a new task
addTaskButton.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = priorityInput.value;
  if (taskText !== "") {
    addTask(taskText, false, dueDate, priority);
    taskInput.value = "";
    dueDateInput.value = "";
    saveTasks();
  }
});

// Add task to the DOM
function addTask(taskText, isCompleted = false, dueDate = "", priority = "Low") {
  const taskItem = document.createElement("li");
  taskItem.className = "task";
  if (isCompleted) {
    taskItem.classList.add("completed");
  }

  taskItem.innerHTML = `
    <span>${taskText}</span>
    <span>${dueDate ? `Due: ${dueDate}` : ""}</span>
    <span>Priority: ${priority}</span>
    <div>
      <button class="completeBtn">${isCompleted ? "Undo" : "Complete"}</button>
      <button class="deleteBtn">Delete</button>
    </div>
  `;

  taskList.appendChild(taskItem);

  // Add event listeners for complete and delete buttons
  taskItem.querySelector(".completeBtn").addEventListener("click", toggleComplete);
  taskItem.querySelector(".deleteBtn").addEventListener("click", deleteTask);
}

// Toggle task completion
function toggleComplete(event) {
  const taskItem = event.target.closest(".task");
  taskItem.classList.toggle("completed");
  event.target.textContent = taskItem.classList.contains("completed") ? "Undo" : "Complete";
  saveTasks();
}

// Delete a task
function deleteTask(event) {
  const taskItem = event.target.closest(".task");
  taskItem.remove();
  saveTasks();
}

// Save tasks to Local Storage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll(".task").forEach((task) => {
    tasks.push({
      text: task.querySelector("span").textContent,
      dueDate: task.querySelector("span:nth-child(2)").textContent.replace("Due: ", ""),
      priority: task.querySelector("span:nth-child(3)").textContent.replace("Priority: ", ""),
      completed: task.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from Local Storage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => addTask(task.text, task.completed, task.dueDate, task.priority));
}

// Filter tasks
filter.addEventListener("change", () => {
  const filterValue = filter.value;
  const tasks = document.querySelectorAll(".task");

  tasks.forEach((task) => {
    const isCompleted = task.classList.contains("completed");
    const priority = task.querySelector("span:nth-child(3)").textContent.split(": ")[1];

    if (
      filterValue === "All" ||
      (filterValue === "Completed" && isCompleted) ||
      (filterValue === "Incomplete" && !isCompleted) ||
      (filterValue === priority)
    ) {
      task.style.display = "flex";
    } else {
      task.style.display = "none";
    }
  });
});