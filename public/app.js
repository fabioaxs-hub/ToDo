/**
 * TaskFlow - Gerenciador de Tarefas Inteligente
 * Arquivo Principal JavaScript (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // ESTADO DA APLICAÇÃO (STATE)
  // ==========================================
  let tasks = [];
  let currentFilterStatus = 'all'; // 'all' | 'pending' | 'completed'
  let currentFilterCategory = 'all';
  let currentFilterPriority = 'all';
  let currentSearchQuery = '';
  let currentSortBy = 'created-desc';

  // Instância do Modal de Edição (Bootstrap)
  let editModalInstance = null;

  // ==========================================
  // ELEMENTOS DO DOM
  // ==========================================
  const taskForm = document.getElementById('taskForm');
  const taskTitleInput = document.getElementById('taskTitle');
  const taskCategorySelect = document.getElementById('taskCategory');
  const taskPrioritySelect = document.getElementById('taskPriority');
  const taskDescriptionInput = document.getElementById('taskDescription');
  const taskDueDateInput = document.getElementById('taskDueDate');

  const taskListContainer = document.getElementById('taskList');
  const emptyState = document.getElementById('emptyState');
  const emptyStateSubtitle = document.getElementById('emptyStateSubtitle');
  const visibleTasksCountBadge = document.getElementById('visibleTasksCount');

  // Métricas
  const statTotal = document.getElementById('statTotal');
  const statPending = document.getElementById('statPending');
  const statCompleted = document.getElementById('statCompleted');
  const statOverdue = document.getElementById('statOverdue');
  const progressBar = document.getElementById('progressBar');
  const progressPercentage = document.getElementById('progressPercentage');

  // Filtros & Pesquisa
  const searchInput = document.getElementById('searchInput');
  const btnClearSearch = document.getElementById('btnClearSearch');
  const filterStatusBtns = document.querySelectorAll('.filter-status-group .btn-filter');
  const filterCategorySelect = document.getElementById('filterCategory');
  const filterPrioritySelect = document.getElementById('filterPriority');
  const sortBySelect = document.getElementById('sortBy');

  // Modal Edição
  const editTaskForm = document.getElementById('editTaskForm');
  const editTaskIdInput = document.getElementById('editTaskId');
  const editTaskTitleInput = document.getElementById('editTaskTitle');
  const editTaskCategorySelect = document.getElementById('editTaskCategory');
  const editTaskPrioritySelect = document.getElementById('editTaskPriority');
  const editTaskDueDateInput = document.getElementById('editTaskDueDate');
  const editTaskDescriptionInput = document.getElementById('editTaskDescription');

  // Outros Controles
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const btnExportJson = document.getElementById('btnExportJson');
  const fileImportInput = document.getElementById('fileImportInput');
  const btnClearCompleted = document.getElementById('btnClearCompleted');
  const toastElement = document.getElementById('appToast');
  const toastMessage = document.getElementById('toastMessage');

  // Inicializar Toast do Bootstrap
  const bsToast = toastElement ? new bootstrap.Toast(toastElement, { delay: 3000 }) : null;

  // ==========================================
  // INICIALIZAÇÃO
  // ==========================================
  function init() {
    loadTheme();
    loadTasks();
    setupEventListeners();

    const editModalEl = document.getElementById('editTaskModal');
    if (editModalEl) {
      editModalInstance = new bootstrap.Modal(editModalEl);
    }

    render();
  }

  // ==========================================
  // PERSISTÊNCIA (LOCALSTORAGE)
  // ==========================================
  function loadTasks() {
    const saved = localStorage.getItem('taskflow_tasks');
    if (saved) {
      try {
        tasks = JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao carregar tarefas do localStorage', e);
        tasks = [];
      }
    } else {
      // Exemplo inicial de tarefas caso esteja completamente vazio pela 1ª vez
      tasks = [
        {
          id: generateId(),
          title: 'Bem-vindo ao TaskFlow! 👋',
          description: 'Esta é uma tarefa de exemplo. Clique na caixa de seleção para concluí-la ou use as ações para editar/excluir.',
          category: 'Trabalho',
          priority: 'alta',
          dueDate: new Date().toISOString().split('T')[0],
          completed: false,
          createdAt: new Date().toISOString()
        },
        {
          id: generateId(),
          title: 'Explorar o filtro por categorias e busca',
          description: 'Teste filtrar suas tarefas ou alternar entre o modo claro e escuro no cabeçalho.',
          category: 'Estudos',
          priority: 'media',
          dueDate: '',
          completed: true,
          createdAt: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      saveTasks();
    }
  }

  function saveTasks() {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
  }

  function generateId() {
    return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // ==========================================
  // GERENCIAMENTO DE TEMA (LIGHT/DARK)
  // ==========================================
  function loadTheme() {
    const savedTheme = localStorage.getItem('taskflow_theme') || 'dark';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
    updateThemeIcon(savedTheme);
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('taskflow_theme', newTheme);
    updateThemeIcon(newTheme);
    showNotification(`Tema alternado para modo ${newTheme === 'dark' ? 'escuro' : 'claro'}.`, 'info');
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-sun text-warning';
    } else {
      themeIcon.className = 'fa-solid fa-moon text-dark';
    }
  }

  // ==========================================
  // REGRAS E AÇÕES DE TAREFAS
  // ==========================================
  function addTask(title, category, priority, description, dueDate) {
    const newTask = {
      id: generateId(),
      title: title.trim(),
      category: category || 'Outros',
      priority: priority || 'media',
      description: description ? description.trim() : '',
      dueDate: dueDate || '',
      completed: false,
      createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);
    saveTasks();
    render();
    showNotification('Tarefa criada com sucesso!', 'success');
  }

  function toggleTaskComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      saveTasks();
      render();

      if (task.completed) {
        showNotification('Tarefa concluída! 🎉', 'success');
        // Soltar confete se a biblioteca estiver disponível
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 }
          });
        }
      } else {
        showNotification('Tarefa reaberta.', 'info');
      }
    }
  }

  function deleteTask(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      const deletedTitle = tasks[index].title;
      tasks.splice(index, 1);
      saveTasks();
      render();
      showNotification(`Tarefa "${deletedTitle.substring(0, 20)}..." removida.`, 'warning');
    }
  }

  function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    editTaskIdInput.value = task.id;
    editTaskTitleInput.value = task.title;
    editTaskCategorySelect.value = task.category;
    editTaskPrioritySelect.value = task.priority;
    editTaskDueDateInput.value = task.dueDate || '';
    editTaskDescriptionInput.value = task.description || '';

    if (editModalInstance) {
      editModalInstance.show();
    }
  }

  function updateTaskFromModal() {
    const id = editTaskIdInput.value;
    const task = tasks.find(t => t.id === id);

    if (task) {
      task.title = editTaskTitleInput.value.trim();
      task.category = editTaskCategorySelect.value;
      task.priority = editTaskPrioritySelect.value;
      task.dueDate = editTaskDueDateInput.value;
      task.description = editTaskDescriptionInput.value.trim();

      saveTasks();
      render();

      if (editModalInstance) {
        editModalInstance.hide();
      }
      showNotification('Tarefa atualizada com sucesso!', 'success');
    }
  }

  function clearCompletedTasks() {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount === 0) {
      showNotification('Não há tarefas concluídas para limpar.', 'info');
      return;
    }

    if (confirm(`Tem certeza que deseja remover ${completedCount} tarefa(s) concluída(s)?`)) {
      tasks = tasks.filter(t => !t.completed);
      saveTasks();
      render();
      showNotification(`${completedCount} tarefa(s) concluída(s) removida(s).`, 'success');
    }
  }

  // ==========================================
  // FILTRAGEM E ORDENAÇÃO
  // ==========================================
  function getFilteredAndSortedTasks() {
    return tasks.filter(task => {
      // Filtro de Status
      if (currentFilterStatus === 'pending' && task.completed) return false;
      if (currentFilterStatus === 'completed' && !task.completed) return false;

      // Filtro de Categoria
      if (currentFilterCategory !== 'all' && task.category !== currentFilterCategory) return false;

      // Filtro de Prioridade
      if (currentFilterPriority !== 'all' && task.priority !== currentFilterPriority) return false;

      // Filtro de Busca por Texto
      if (currentSearchQuery) {
        const query = currentSearchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(query);
        const matchDesc = task.description ? task.description.toLowerCase().includes(query) : false;
        if (!matchTitle && !matchDesc) return false;
      }

      return true;
    }).sort((a, b) => {
      // Ordenação
      if (currentSortBy === 'created-desc') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (currentSortBy === 'created-asc') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (currentSortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      if (currentSortBy === 'priority-desc') {
        const priorityMap = { alta: 3, media: 2, baixa: 1 };
        return priorityMap[b.priority] - priorityMap[a.priority];
      }
      if (currentSortBy === 'due-asc') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });
  }

  // ==========================================
  // RENDERIZAÇÃO NO DOM
  // ==========================================
  function render() {
    renderStats();
    renderTaskList();
  }

  function renderStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    // Verificar tarefas atrasadas
    const today = new Date().toISOString().split('T')[0];
    const overdue = tasks.filter(t => !t.completed && t.dueDate && t.dueDate < today).length;

    statTotal.textContent = total;
    statPending.textContent = pending;
    statCompleted.textContent = completed;
    statOverdue.textContent = overdue;

    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    progressBar.style.width = `${percent}%`;
    progressPercentage.textContent = `${percent}%`;
  }

  function renderTaskList() {
    const filteredTasks = getFilteredAndSortedTasks();
    visibleTasksCountBadge.textContent = filteredTasks.length;

    taskListContainer.innerHTML = '';

    if (filteredTasks.length === 0) {
      emptyState.classList.remove('d-none');
      if (tasks.length === 0) {
        emptyStateSubtitle.textContent = 'Sua lista está totalmente limpa! Adicione uma nova tarefa acima.';
      } else {
        emptyStateSubtitle.textContent = 'Nenhuma tarefa corresponde aos filtros selecionados. Tente ajustar os parâmetros de busca.';
      }
      return;
    }

    emptyState.classList.add('d-none');

    const today = new Date().toISOString().split('T')[0];

    filteredTasks.forEach(task => {
      const isOverdue = !task.completed && task.dueDate && task.dueDate < today;

      const card = document.createElement('div');
      card.className = `card task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'is-overdue' : ''} priority-${task.priority}`;
      card.setAttribute('data-id', task.id);

      // Formatador de data
      let formattedDate = '';
      if (task.dueDate) {
        const [year, month, day] = task.dueDate.split('-');
        formattedDate = `${day}/${month}/${year}`;
      }

      card.innerHTML = `
        <div class="card-body p-3 d-flex align-items-center justify-content-between gap-3 flex-wrap flex-md-nowrap">
          <div class="d-flex align-items-start gap-3 flex-grow-1 min-w-0">
            <!-- Custom Checkbox -->
            <div class="form-check custom-checkbox mt-1">
              <input class="form-check-input btn-toggle-complete" type="checkbox" id="check_${task.id}" ${task.completed ? 'checked' : ''}>
              <label class="form-check-label" for="check_${task.id}"></label>
            </div>

            <!-- Informações da Tarefa -->
            <div class="task-content flex-grow-1 min-w-0">
              <div class="d-flex align-items-center gap-2 flex-wrap mb-1">
                <h3 class="h6 mb-0 fw-semibold task-title text-break">${escapeHtml(task.title)}</h3>
                
                <!-- Badges -->
                <span class="badge badge-category">${escapeHtml(task.category)}</span>
                <span class="badge badge-priority badge-priority-${task.priority}">
                  ${task.priority === 'alta' ? 'Alta' : task.priority === 'media' ? 'Média' : 'Baixa'}
                </span>

                ${isOverdue ? '<span class="badge bg-danger-subtle text-danger border border-danger-subtle"><i class="fa-solid fa-triangle-exclamation me-1"></i>Atrasada</span>' : ''}
              </div>

              ${task.description ? `<p class="task-description text-muted small mb-1 text-break">${escapeHtml(task.description)}</p>` : ''}

              ${task.dueDate ? `
                <div class="task-date text-muted extra-small d-flex align-items-center gap-1 ${isOverdue ? 'text-danger fw-semibold' : ''}">
                  <i class="fa-regular fa-calendar"></i> Data limite: ${formattedDate}
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Ações -->
          <div class="d-flex align-items-center gap-2 task-actions ms-auto">
            <button class="btn btn-icon btn-edit" title="Editar Tarefa" data-id="${task.id}">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn btn-icon btn-delete text-danger" title="Excluir Tarefa" data-id="${task.id}">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;

      taskListContainer.appendChild(card);
    });
  }

  // Helper para prevenir XSS ao injetar texto no HTML
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ==========================================
  // NOTIFICAÇÕES (TOAST)
  // ==========================================
  function showNotification(message, type = 'info') {
    if (!bsToast || !toastMessage) return;

    let icon = '<i class="fa-solid fa-circle-info text-info"></i>';
    if (type === 'success') icon = '<i class="fa-solid fa-circle-check text-success"></i>';
    if (type === 'warning') icon = '<i class="fa-solid fa-triangle-exclamation text-warning"></i>';
    if (type === 'danger') icon = '<i class="fa-solid fa-circle-xmark text-danger"></i>';

    toastMessage.innerHTML = `${icon} <span>${message}</span>`;
    bsToast.show();
  }

  // ==========================================
  // EXPORTAR E IMPORTAR DADOS (JSON)
  // ==========================================
  function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `taskflow_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('Backup exportado com sucesso!', 'success');
  }

  function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const importedTasks = JSON.parse(e.target.result);
        if (Array.isArray(importedTasks)) {
          tasks = importedTasks;
          saveTasks();
          render();
          showNotification('Backup importado com sucesso!', 'success');
        } else {
          showNotification('Formato de arquivo inválido.', 'danger');
        }
      } catch (err) {
        showNotification('Erro ao ler o arquivo JSON.', 'danger');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  }

  // ==========================================
  // EVENT LISTENERS
  // ==========================================
  function setupEventListeners() {
    // Submit do formulário de criação
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      addTask(
        taskTitleInput.value,
        taskCategorySelect.value,
        taskPrioritySelect.value,
        taskDescriptionInput.value,
        taskDueDateInput.value
      );
      taskForm.reset();
      taskPrioritySelect.value = 'media';
      taskCategorySelect.value = 'Outros';
    });

    // Eventos na Lista de Tarefas (Event Delegation)
    taskListContainer.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('.btn-toggle-complete');
      const editBtn = e.target.closest('.btn-edit');
      const deleteBtn = e.target.closest('.btn-delete');
      const card = e.target.closest('.task-item');

      if (!card) return;
      const taskId = card.getAttribute('data-id');

      if (toggleBtn) {
        toggleTaskComplete(taskId);
      } else if (editBtn) {
        openEditModal(taskId);
      } else if (deleteBtn) {
        deleteTask(taskId);
      }
    });

    // Submit da edição de tarefa
    editTaskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      updateTaskFromModal();
    });

    // Filtros de Status (Botões All, Pending, Completed)
    filterStatusBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterStatusBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilterStatus = btn.getAttribute('data-filter');
        renderTaskList();
      });
    });

    // Filtro Categoria
    filterCategorySelect.addEventListener('change', (e) => {
      currentFilterCategory = e.target.value;
      renderTaskList();
    });

    // Filtro Prioridade
    filterPrioritySelect.addEventListener('change', (e) => {
      currentFilterPriority = e.target.value;
      renderTaskList();
    });

    // Ordenação
    sortBySelect.addEventListener('change', (e) => {
      currentSortBy = e.target.value;
      renderTaskList();
    });

    // Campo de Busca
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.trim();
      if (currentSearchQuery) {
        btnClearSearch.classList.remove('d-none');
      } else {
        btnClearSearch.classList.add('d-none');
      }
      renderTaskList();
    });

    // Limpar Busca
    btnClearSearch.addEventListener('click', () => {
      searchInput.value = '';
      currentSearchQuery = '';
      btnClearSearch.classList.add('d-none');
      renderTaskList();
    });

    // Tema Dark/Light
    themeToggleBtn.addEventListener('click', toggleTheme);

    // Exportar / Importar
    btnExportJson.addEventListener('click', (e) => {
      e.preventDefault();
      exportData();
    });

    fileImportInput.addEventListener('change', importData);

    // Limpar Concluídas
    btnClearCompleted.addEventListener('click', (e) => {
      e.preventDefault();
      clearCompletedTasks();
    });
  }

  // Inicializar aplicação
  init();
});
