const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const tasksLeft = document.getElementById('tasksLeft');
const clearCompletedButton = document.getElementById('clearCompleted');
const filterAll = document.getElementById('filterAll');
const filterActive = document.getElementById('filterActive');
const filterCompleted = document.getElementById('filterCompleted');
const emptyState = document.getElementById('emptyState');
const themeSwitch = document.getElementById('themeSwitch');
const toast = document.getElementById('toast');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function renderTasks(filter = 'all') {
  taskList.innerHTML = '';
  let filteredTasks = tasks;

  if (filter === 'active') filteredTasks = tasks.filter(t => !t.completed);
  if (filter === 'completed') filteredTasks = tasks.filter(t => t.completed);

  emptyState.style.display = filteredTasks.length === 0 ? 'block' : 'none';

  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = `task ${task.completed ? 'completed' : ''}`;
    li.innerHTML = `
      <span onclick="toggleTask(${index})">${task.text}</span>
      <button onclick="deleteTask(${index})">&times;</button>
    `;
    taskList.appendChild(li);
  });

  tasksLeft.textContent = `${tasks.filter(t => !t.completed).length} items left`;
}

function addTask() {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    saveTasks();
    renderTasks();
    taskInput.value = '';
    showToast('Task Added ✅');
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
  showToast('Task Deleted 🗑️');
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
  showToast('Completed Tasks Cleared 🚀');
}

// Filter Buttons
[filterAll, filterActive, filterCompleted].forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.footer .actions button').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    renderTasks(button.id.replace('filter', '').toLowerCase());
  });
});

// Theme Switcher
themeSwitch.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

// Load theme and tasks on startup
window.addEventListener('load', () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }
  renderTasks();
});

// Events
addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});
clearCompletedButton.addEventListener('click', clearCompleted);

// Drag and Drop
Sortable.create(taskList, {
  animation: 200,
  onEnd: function(evt) {
    const movedItem = tasks.splice(evt.oldIndex, 1)[0];
    tasks.splice(evt.newIndex, 0, movedItem);
    saveTasks();
    renderTasks(document.querySelector('.footer .actions button.active').id.replace('filter', '').toLowerCase());
  }
});
