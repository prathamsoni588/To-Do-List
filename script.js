// Get HTML elements
const todoForm = document.getElementById("todoForm");
const taskInput = document.getElementById("taskInput");
const startTime = document.getElementById("startTime");
const endTime = document.getElementById("endTime");

const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const remainingTasks = document.getElementById("remainingTasks");

const clearCompleted = document.getElementById("clearCompleted");
const currentDate = document.getElementById("currentDate");


// ==========================================
// LOAD SAVED TASKS
// ==========================================

let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];


// ==========================================
// SAVE TASKS
// ==========================================

function saveTasks() {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
}


// ==========================================
// CONVERT 24-HOUR TIME TO AM/PM
// ==========================================

function formatTime(time) {

    let parts = time.split(":");

    let hour = parseInt(parts[0]);
    let minute = parts[1];

    let ampm = hour >= 12 ? "PM" : "AM";

    if (hour === 0) {
        hour = 12;
    } else if (hour > 12) {
        hour = hour - 12;
    }

    return hour + ":" + minute + " " + ampm;
}


// ==========================================
// ADD TASK
// ==========================================

todoForm.addEventListener("submit", function(event) {

    // IMPORTANT: Stop the form from refreshing the page
    event.preventDefault();

    let taskName = taskInput.value.trim();
    let start = startTime.value;
    let end = endTime.value;

    // Check task name
    if (taskName === "") {
        alert("Please enter a task.");
        taskInput.focus();
        return;
    }

    // Check time
    if (start === "" || end === "") {
        alert("Please select start and end time.");
        return;
    }

    // Convert time to numbers for proper comparison
    let startMinutes =
        parseInt(start.split(":")[0]) * 60 +
        parseInt(start.split(":")[1]);

    let endMinutes =
        parseInt(end.split(":")[0]) * 60 +
        parseInt(end.split(":")[1]);

    // End time must be after start time
    if (endMinutes <= startMinutes) {
        alert("End time must be after start time.");
        return;
    }

    // Create new task
    let newTask = {
        id: Date.now(),
        text: taskName,
        startTime: start,
        endTime: end,
        completed: false
    };

    // Add task to array
    tasks.push(newTask);

    // Save task
    saveTasks();

    // Show tasks
    displayTasks();

    // Clear input fields
    taskInput.value = "";
    startTime.value = "";
    endTime.value = "";

    // Put cursor back into task box
    taskInput.focus();
});


// ==========================================
// DISPLAY TASKS
// ==========================================

function displayTasks() {

    // Clear old list
    taskList.innerHTML = "";

    // Empty message
    if (tasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    // Create each task
    tasks.forEach(function(task) {

        let li = document.createElement("li");
        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }


        // Checkbox
        let checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function() {

            task.completed = checkbox.checked;

            saveTasks();
            displayTasks();
        });


        // Task name
        let taskText = document.createElement("span");

        taskText.className = "task-text";
        taskText.textContent = task.text;


        // Time
        let timeSlot = document.createElement("div");

        timeSlot.className = "time-slot";

        timeSlot.textContent =
            "⏰ " +
            formatTime(task.startTime) +
            " → " +
            formatTime(task.endTime);


        // Delete button
        let deleteButton = document.createElement("button");

        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {

            tasks = tasks.filter(function(item) {
                return item.id !== task.id;
            });

            saveTasks();
            displayTasks();
        });


        // Put everything together
        li.appendChild(checkbox);
        li.appendChild(taskText);
        li.appendChild(timeSlot);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });


    // Update numbers
    updateStatistics();
}


// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStatistics() {

    let total = tasks.length;

    let completed = tasks.filter(function(task) {
        return task.completed === true;
    }).length;

    let remaining = total - completed;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    remainingTasks.textContent = remaining;
}


// ==========================================
// CLEAR COMPLETED TASKS
// ==========================================

clearCompleted.addEventListener("click", function() {

    tasks = tasks.filter(function(task) {
        return task.completed === false;
    });

    saveTasks();

    displayTasks();
});


// ==========================================
// SHOW DATE
// ==========================================

let today = new Date();

currentDate.textContent = today.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
});


// ==========================================
// START APP
// ==========================================

displayTasks();