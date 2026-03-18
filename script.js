// get data
let lists = JSON.parse(localStorage.getItem("lists")) || [];

/* ========= DASHBOARD ========= */

function loadLists() {
    let container = document.getElementById("listContainer");
    if (!container) return;

    container.innerHTML = "";

    lists.forEach((list, index) => {
        let div = document.createElement("div");
        div.className = "list-item";

        // count completed tasks
        let completed = list.tasks.filter(t => t.completed).length;

        div.innerHTML = `
            <span>${list.name} (${completed}/${list.tasks.length})</span>
            <button class="delete-btn">X</button>
        `;

        // delete list
        div.querySelector("button").onclick = function (e) {
            e.stopPropagation();
            lists.splice(index, 1);
            saveData();
            loadLists();
        };

        // open tasks page
        div.onclick = function () {
            localStorage.setItem("currentList", index);
            window.location.href = "tasks.html";
        };

        container.appendChild(div);
    });
}

// create list
function createList() {
    let name = prompt("Enter list name:");
    if (!name) return;

    lists.push({
        name: name,
        tasks: []
    });

    saveData();
    loadLists();
}

/* ========= TASK PAGE ========= */

function goBack() {
    window.location.href = "index.html";
}

function loadTasks() {
    let index = localStorage.getItem("currentList");
    if (index === null) return;

    let list = lists[index];

    document.getElementById("listTitle").innerText = list.name;

    let ul = document.getElementById("taskList");
    ul.innerHTML = "";

    let completedCount = 0;

    list.tasks.forEach((task, i) => {
        let li = document.createElement("li");

        // checkbox
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        if (task.completed) completedCount++;

        checkbox.onchange = function () {
            task.completed = checkbox.checked;
            saveData();
            loadTasks();
        };

        // text
        let span = document.createElement("span");
        span.innerText = task.text;

        if (task.completed) {
            span.classList.add("completed");
        }

        // delete
        let del = document.createElement("button");
        del.innerText = "X";
        del.className = "delete-btn";

        del.onclick = function () {
            list.tasks.splice(i, 1);
            saveData();
            loadTasks();
        };

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(del);

        ul.appendChild(li);
    });

    // progress text
    let progress = document.getElementById("progressText");
    if (progress) {
        progress.innerText =
            completedCount + "/" + list.tasks.length + " completed";
    }
}

// add task
function addTask() {
    let input = document.getElementById("taskInput");
    let text = input.value.trim();

    if (text === "") return;

    let index = localStorage.getItem("currentList");

    lists[index].tasks.push({
        text: text,
        completed: false
    });

    input.value = "";
    saveData();
    loadTasks();
}

/* ========= COMMON ========= */

function saveData() {
    localStorage.setItem("lists", JSON.stringify(lists));
}

window.onload = function () {
    if (document.getElementById("listContainer")) {
        loadLists();
    }

    if (document.getElementById("taskList")) {
        loadTasks();
    }
};