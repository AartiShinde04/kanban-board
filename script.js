/* =========================================
   KANBAN BOARD JAVASCRIPT
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const addTaskBtn = document.getElementById("addTaskBtn");
const taskModal = document.getElementById("taskModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelTaskBtn = document.getElementById("cancelTaskBtn");

const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskPriority = document.getElementById("taskPriority");
const taskDueDate = document.getElementById("taskDueDate");

const todoTasks = document.getElementById("todoTasks");
const progressTasks = document.getElementById("progressTasks");
const doneTasks = document.getElementById("doneTasks");

const todoCount = document.getElementById("todoCount");
const progressCount = document.getElementById("progressCount");
const doneCount = document.getElementById("doneCount");

const themeBtn = document.getElementById("themeBtn");

const modalTitle = document.getElementById("modalTitle");
const createTaskBtn = document.getElementById("createTaskBtn");

const searchInput = document.getElementById("searchInput");
const priorityFilter = document.getElementById("priorityFilter");
const statusFilter = document.getElementById("statusFilter");
const clearFilters = document.getElementById("clearFilters");


/* =========================================
   DASHBOARD ELEMENTS
========================================= */

const totalTaskStat = document.getElementById("totalTaskStat");
const todoStat = document.getElementById("todoStat");
const progressStat = document.getElementById("progressStat");
const doneStat = document.getElementById("doneStat");
const overdueStat = document.getElementById("overdueStat");

const completionPercentage =
    document.getElementById("completionPercentage");

const completionProgress =
    document.getElementById("completionProgress");


/* =========================================
   TASK DATA
========================================= */

let tasks =
    JSON.parse(
        localStorage.getItem("kanbanTasks")
    ) || [];


let editingTaskId = null;


/* =========================================
   SAVE TASKS
========================================= */

function saveTasks() {

    localStorage.setItem(
        "kanbanTasks",
        JSON.stringify(tasks)
    );

}


/* =========================================
   OPEN MODAL
========================================= */

function openModal() {

    taskModal.style.display = "flex";

}


/* =========================================
   CLOSE MODAL
========================================= */

function closeModal() {

    taskModal.style.display = "none";

    taskForm.reset();

    editingTaskId = null;

    modalTitle.textContent = "Add New Task";

    createTaskBtn.textContent = "Create Task";

}


/* =========================================
   ADD TASK BUTTON
========================================= */

addTaskBtn.addEventListener(
    "click",
    () => {

        editingTaskId = null;

        modalTitle.textContent =
            "Add New Task";

        createTaskBtn.textContent =
            "Create Task";

        taskForm.reset();

        openModal();

    }
);


/* =========================================
   CLOSE MODAL BUTTONS
========================================= */

closeModalBtn.addEventListener(
    "click",
    closeModal
);


cancelTaskBtn.addEventListener(
    "click",
    closeModal
);


/* =========================================
   CLOSE MODAL OUTSIDE CLICK
========================================= */

taskModal.addEventListener(
    "click",
    (event) => {

        if (
            event.target === taskModal
        ) {

            closeModal();

        }

    }
);


/* =========================================
   CREATE / EDIT TASK
========================================= */

taskForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const title =
            taskTitle.value.trim();


        const description =
            taskDescription.value.trim();


        const priority =
            taskPriority.value;


        const dueDate =
            taskDueDate.value;


        if (!title) {

            alert(
                "Please enter a task title."
            );

            return;

        }


        /* =====================================
           EDIT EXISTING TASK
        ===================================== */

        if (
            editingTaskId !== null
        ) {

            const task =
                tasks.find(
                    task =>
                        task.id ===
                        editingTaskId
                );


            if (task) {

                task.title =
                    title;

                task.description =
                    description;

                task.priority =
                    priority;

                task.dueDate =
                    dueDate;

            }

        }


        /* =====================================
           CREATE NEW TASK
        ===================================== */

        else {

            const newTask = {

                id:
                    Date.now(),

                title:
                    title,

                description:
                    description,

                priority:
                    priority,

                dueDate:
                    dueDate,

                status:
                    "todo"

            };


            tasks.push(
                newTask
            );

        }


        saveTasks();

        closeModal();

        renderTasks();

    }
);


/* =========================================
   RENDER TASKS
========================================= */

function renderTasks() {

    todoTasks.innerHTML = "";

    progressTasks.innerHTML = "";

    doneTasks.innerHTML = "";


    tasks.forEach(
        task => {

            const card =
                createTaskCard(
                    task
                );


            if (
                task.status ===
                "todo"
            ) {

                todoTasks.appendChild(
                    card
                );

            }


            else if (
                task.status ===
                "progress"
            ) {

                progressTasks.appendChild(
                    card
                );

            }


            else if (
                task.status ===
                "done"
            ) {

                doneTasks.appendChild(
                    card
                );

            }

        }
    );


    updateCounts();

    updateDashboardStats();

    setupDragAndDrop();

    setEqualColumnHeights();

}


/* =========================================
   CREATE TASK CARD
========================================= */

function createTaskCard(task) {

    const card =
        document.createElement(
            "div"
        );


    card.classList.add(
        "task-card"
    );


    card.setAttribute(
        "draggable",
        "true"
    );


    card.dataset.id =
        task.id;


    /* =====================================
       TITLE
    ===================================== */

    const title =
        document.createElement(
            "h3"
        );


    title.textContent =
        task.title;


    /* =====================================
       DESCRIPTION
    ===================================== */

    const description =
        document.createElement(
            "p"
        );


    description.textContent =
        task.description ||
        "No description";


    /* =====================================
       PRIORITY
    ===================================== */

    const priority =
        document.createElement(
            "span"
        );


    priority.textContent =
        task.priority;


    /* =====================================
       DUE DATE
    ===================================== */

    const dueDate =
        document.createElement(
            "p"
        );


    dueDate.classList.add(
        "due-date"
    );


    if (
        task.dueDate
    ) {

        dueDate.textContent =
            "Due: " +
            formatDate(
                task.dueDate
            );

    }

    else {

        dueDate.textContent =
            "No due date";

    }


    /* =====================================
       DUE STATUS
    ===================================== */

    const dueStatus =
        document.createElement(
            "p"
        );


    dueStatus.classList.add(
        "due-status"
    );


    const status =
        getDueStatus(
            task
        );


    dueStatus.textContent =
        status.text;


    dueStatus.classList.add(
        status.className
    );


    /* =====================================
       ACTIONS
    ===================================== */

    const actions =
        document.createElement(
            "div"
        );


    actions.classList.add(
        "task-actions"
    );


    const editButton =
        document.createElement(
            "button"
        );


    editButton.textContent =
        "Edit";


    editButton.classList.add(
        "edit-btn"
    );


    const deleteButton =
        document.createElement(
            "button"
        );


    deleteButton.textContent =
        "Delete";


    deleteButton.classList.add(
        "delete-btn"
    );


    /* =====================================
       EDIT BUTTON
    ===================================== */

    editButton.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            editTask(
                task.id
            );

        }
    );


    /* =====================================
       DELETE BUTTON
    ===================================== */

    deleteButton.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            deleteTask(
                task.id
            );

        }
    );


    /* =====================================
       APPEND ELEMENTS
    ===================================== */

    actions.appendChild(
        editButton
    );


    actions.appendChild(
        deleteButton
    );


    card.appendChild(
        title
    );


    card.appendChild(
        description
    );


    card.appendChild(
        priority
    );


    card.appendChild(
        dueDate
    );


    card.appendChild(
        dueStatus
    );


    card.appendChild(
        actions
    );


    return card;

}


/* =========================================
   DUE STATUS
========================================= */

function getDueStatus(task) {

    /* COMPLETED */

    if (
        task.status ===
        "done"
    ) {

        return {

            text:
                "✓ Completed",

            className:
                "completed"

        };

    }


    /* NO DATE */

    if (
        !task.dueDate
    ) {

        return {

            text:
                "No due date",

            className:
                "no-date"

        };

    }


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const dueDate =
        new Date(
            task.dueDate +
            "T00:00:00"
        );


    dueDate.setHours(
        0,
        0,
        0,
        0
    );


    const difference =
        dueDate -
        today;


    const daysRemaining =
        Math.ceil(
            difference /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    /* OVERDUE */

    if (
        daysRemaining < 0
    ) {

        const days =
            Math.abs(
                daysRemaining
            );


        return {

            text:
                "⚠ Overdue by " +
                days +
                (
                    days === 1
                        ? " day"
                        : " days"
                ),

            className:
                "overdue"

        };

    }


    /* TODAY */

    if (
        daysRemaining === 0
    ) {

        return {

            text:
                "⚠ Due Today",

            className:
                "due-today"

        };

    }


    /* DUE SOON */

    if (
        daysRemaining <= 2
    ) {

        return {

            text:
                "● Due Soon",

            className:
                "due-soon"

        };

    }


    /* ON TRACK */

    return {

        text:
            "✓ On Track",

        className:
            "on-track"

    };

}


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(
    dateString
) {

    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {

            day:
                "2-digit",

            month:
                "short",

            year:
                "numeric"

        }
    );

}


/* =========================================
   UPDATE COLUMN COUNTS
========================================= */

function updateCounts() {

    const todo =
        tasks.filter(
            task =>
                task.status ===
                "todo"
        ).length;


    const progress =
        tasks.filter(
            task =>
                task.status ===
                "progress"
        ).length;


    const done =
        tasks.filter(
            task =>
                task.status ===
                "done"
        ).length;


    todoCount.textContent =
        todo;


    progressCount.textContent =
        progress;


    doneCount.textContent =
        done;

}


/* =========================================
   DASHBOARD STATISTICS
========================================= */

function updateDashboardStats() {

    const total =
        tasks.length;


    const todo =
        tasks.filter(
            task =>
                task.status ===
                "todo"
        ).length;


    const progress =
        tasks.filter(
            task =>
                task.status ===
                "progress"
        ).length;


    const done =
        tasks.filter(
            task =>
                task.status ===
                "done"
        ).length;


    /* =====================================
       OVERDUE
    ===================================== */

    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const overdue =
        tasks.filter(
            task => {

                if (
                    !task.dueDate ||
                    task.status ===
                    "done"
                ) {

                    return false;

                }


                const dueDate =
                    new Date(
                        task.dueDate +
                        "T00:00:00"
                    );


                dueDate.setHours(
                    0,
                    0,
                    0,
                    0
                );


                return (
                    dueDate <
                    today
                );

            }
        ).length;


    /* =====================================
       COMPLETION PERCENTAGE
    ===================================== */

    const percentage =
        total === 0
            ? 0
            : Math.round(
                (
                    done /
                    total
                ) * 100
            );


    /* =====================================
       UPDATE DASHBOARD
    ===================================== */

    if (
        totalTaskStat
    ) {

        totalTaskStat.textContent =
            total;

    }


    if (
        todoStat
    ) {

        todoStat.textContent =
            todo;

    }


    if (
        progressStat
    ) {

        progressStat.textContent =
            progress;

    }


    if (
        doneStat
    ) {

        doneStat.textContent =
            done;

    }


    if (
        overdueStat
    ) {

        overdueStat.textContent =
            overdue;

    }


    if (
        completionPercentage
    ) {

        completionPercentage.textContent =
            percentage +
            "%";

    }


    if (
        completionProgress
    ) {

        completionProgress.style.width =
            percentage +
            "%";

    }

}


/* =========================================
   EDIT TASK
========================================= */

function editTask(
    id
) {

    const task =
        tasks.find(
            task =>
                task.id ===
                id
        );


    if (!task) {

        return;

    }


    editingTaskId =
        id;


    taskTitle.value =
        task.title;


    taskDescription.value =
        task.description ||
        "";


    taskPriority.value =
        task.priority;


    taskDueDate.value =
        task.dueDate ||
        "";


    modalTitle.textContent =
        "Edit Task";


    createTaskBtn.textContent =
        "Update Task";


    openModal();

}


/* =========================================
   DELETE TASK
========================================= */

function deleteTask(
    id
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmed) {

        return;

    }


    tasks =
        tasks.filter(
            task =>
                task.id !==
                id
        );


    saveTasks();

    renderTasks();

}


/* =========================================
   DRAG AND DROP
========================================= */

function setupDragAndDrop() {

    const cards =
        document.querySelectorAll(
            ".task-card"
        );


    const containers =
        document.querySelectorAll(
            ".task-container"
        );


    /* =====================================
       CARD DRAG EVENTS
    ===================================== */

    cards.forEach(
        card => {

            card.setAttribute(
                "draggable",
                "true"
            );


            card.addEventListener(
                "dragstart",
                (event) => {

                    const taskId =
                        card.dataset.id;


                    console.log(
                        "Drag started:",
                        taskId
                    );


                    card.classList.add(
                        "dragging"
                    );


                    if (
                        event.dataTransfer
                    ) {

                        event.dataTransfer.setData(
                            "text/plain",
                            taskId
                        );


                        event.dataTransfer.effectAllowed =
                            "move";

                    }

                }
            );


            card.addEventListener(
                "dragend",
                () => {

                    console.log(
                        "Drag ended"
                    );


                    card.classList.remove(
                        "dragging"
                    );


                    containers.forEach(
                        container => {

                            container.classList.remove(
                                "drag-over"
                            );

                        }
                    );

                }
            );

        }
    );


    /* =====================================
       COLUMN EVENTS
    ===================================== */

    containers.forEach(
        container => {

            /*
                Prevent duplicate listeners.

                The task cards are recreated every
                time the board renders, but the
                containers themselves remain.
            */

            if (
                container.dataset.dragReady ===
                "true"
            ) {

                return;

            }


            container.dataset.dragReady =
                "true";


            /* ================================
               DRAG ENTER
            ================================= */

            container.addEventListener(
                "dragenter",
                (event) => {

                    event.preventDefault();

                    container.classList.add(
                        "drag-over"
                    );

                }
            );


            /* ================================
               DRAG OVER
            ================================= */

            container.addEventListener(
                "dragover",
                (event) => {

                    event.preventDefault();


                    if (
                        event.dataTransfer
                    ) {

                        event.dataTransfer.dropEffect =
                            "move";

                    }


                    container.classList.add(
                        "drag-over"
                    );

                }
            );


            /* ================================
               DRAG LEAVE
            ================================= */

            container.addEventListener(
                "dragleave",
                (event) => {

                    if (
                        !container.contains(
                            event.relatedTarget
                        )
                    ) {

                        container.classList.remove(
                            "drag-over"
                        );

                    }

                }
            );


            /* ================================
               DROP
            ================================= */

            container.addEventListener(
                "drop",
                (event) => {

                    event.preventDefault();

                    event.stopPropagation();


                    container.classList.remove(
                        "drag-over"
                    );


                    /* =========================
                       GET TASK ID
                    ========================= */

                    const storedId =
                        event.dataTransfer
                            ? event.dataTransfer.getData(
                                "text/plain"
                            )
                            : "";


                    const taskId =
                        Number(
                            storedId
                        );


                    console.log(
                        "Task dropped:",
                        taskId
                    );


                    if (
                        !storedId ||
                        Number.isNaN(taskId)
                    ) {

                        console.log(
                            "No valid task ID found"
                        );

                        return;

                    }


                    /* =========================
                       GET NEW STATUS
                    ========================= */

                    const newStatus =
                        container.dataset.status;


                    console.log(
                        "New status:",
                        newStatus
                    );


                    if (
                        !newStatus
                    ) {

                        return;

                    }


                    /* =========================
                       FIND TASK
                    ========================= */

                    const task =
                        tasks.find(
                            task =>
                                Number(task.id) ===
                                taskId
                        );


                    if (!task) {

                        console.log(
                            "Task not found"
                        );

                        return;

                    }


                    /* =========================
                       UPDATE STATUS
                    ========================= */

                    task.status =
                        newStatus;


                    console.log(
                        "Task updated:",
                        task
                    );


                    /* =========================
                       SAVE
                    ========================= */

                    saveTasks();


                    /* =========================
                       UPDATE BOARD
                    ========================= */

                    renderTasks();

                }
            );

        }
    );

}


/* =========================================
   EQUAL COLUMN HEIGHTS
========================================= */

function setEqualColumnHeights() {

    const columns =
        document.querySelectorAll(
            ".column"
        );


    if (
        columns.length === 0
    ) {

        return;

    }


    /*
        First reset the height so the browser
        can calculate the new natural height.
    */

    columns.forEach(
        column => {

            column.style.height =
                "auto";

        }
    );


    /*
        Wait for the browser to calculate
        the new sizes.
    */

    requestAnimationFrame(
        () => {

            let maxHeight =
                0;


            columns.forEach(
                column => {

                    const height =
                        column.offsetHeight;


                    if (
                        height >
                        maxHeight
                    ) {

                        maxHeight =
                            height;

                    }

                }
            );


            columns.forEach(
                column => {

                    column.style.height =
                        maxHeight +
                        "px";

                }
            );

        }
    );

}


/* =========================================
   SEARCH & FILTER
========================================= */

function filterTasks() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedPriority =
        priorityFilter.value;


    const selectedStatus =
        statusFilter.value;


    const filteredTasks =
        tasks.filter(
            task => {

                const title =
                    (
                        task.title ||
                        ""
                    )
                    .toLowerCase();


                const description =
                    (
                        task.description ||
                        ""
                    )
                    .toLowerCase();


                const matchesSearch =
                    title.includes(
                        searchText
                    ) ||
                    description.includes(
                        searchText
                    );


                const matchesPriority =
                    selectedPriority ===
                    "all" ||
                    task.priority ===
                    selectedPriority;


                const matchesStatus =
                    selectedStatus ===
                    "all" ||
                    task.status ===
                    selectedStatus;


                return (
                    matchesSearch &&
                    matchesPriority &&
                    matchesStatus
                );

            }
        );


    renderFilteredTasks(
        filteredTasks
    );

}


/* =========================================
   RENDER FILTERED TASKS
========================================= */

function renderFilteredTasks(
    filteredTasks
) {

    todoTasks.innerHTML =
        "";


    progressTasks.innerHTML =
        "";


    doneTasks.innerHTML =
        "";


    filteredTasks.forEach(
        task => {

            const card =
                createTaskCard(
                    task
                );


            if (
                task.status ===
                "todo"
            ) {

                todoTasks.appendChild(
                    card
                );

            }


            else if (
                task.status ===
                "progress"
            ) {

                progressTasks.appendChild(
                    card
                );

            }


            else if (
                task.status ===
                "done"
            ) {

                doneTasks.appendChild(
                    card
                );

            }

        }
    );


    updateFilteredCounts(
        filteredTasks
    );


    setupDragAndDrop();

    setEqualColumnHeights();

}


/* =========================================
   FILTERED COUNTS
========================================= */

function updateFilteredCounts(
    filteredTasks
) {

    todoCount.textContent =
        filteredTasks.filter(
            task =>
                task.status ===
                "todo"
        ).length;


    progressCount.textContent =
        filteredTasks.filter(
            task =>
                task.status ===
                "progress"
        ).length;


    doneCount.textContent =
        filteredTasks.filter(
            task =>
                task.status ===
                "done"
        ).length;

}


/* =========================================
   SEARCH EVENTS
========================================= */

searchInput.addEventListener(
    "input",
    filterTasks
);


priorityFilter.addEventListener(
    "change",
    filterTasks
);


statusFilter.addEventListener(
    "change",
    filterTasks
);


/* =========================================
   CLEAR FILTERS
========================================= */

clearFilters.addEventListener(
    "click",
    () => {

        searchInput.value =
            "";


        priorityFilter.value =
            "all";


        statusFilter.value =
            "all";


        renderTasks();

    }
);


/* =========================================
   DARK MODE
========================================= */

function updateThemeIcon() {

    if (
        document.body.classList.contains(
            "dark-mode"
        )
    ) {

        themeBtn.textContent =
            "☀️";


        themeBtn.title =
            "Switch to light mode";

    }

    else {

        themeBtn.textContent =
            "🌙";


        themeBtn.title =
            "Switch to dark mode";

    }

}


/* =========================================
   THEME BUTTON
========================================= */

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark-mode"
        );


        const isDark =
            document.body.classList.contains(
                "dark-mode"
            );


        localStorage.setItem(
            "kanbanTheme",
            isDark
                ? "dark"
                : "light"
        );


        updateThemeIcon();


    }
);


/* =========================================
   LOAD SAVED THEME
========================================= */

const savedTheme =
    localStorage.getItem(
        "kanbanTheme"
    );


if (
    savedTheme ===
    "dark"
) {

    document.body.classList.add(
        "dark-mode"
    );

}


updateThemeIcon();


/* =========================================
   INITIAL RENDER
========================================= */

renderTasks();


/* =========================================
   UPDATE COLUMN HEIGHT ON WINDOW RESIZE
========================================= */

window.addEventListener(
    "resize",
    () => {

        setEqualColumnHeights();

    }
);