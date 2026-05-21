// Pomodoro Timer State
let timerInterval = null;
let isRunning = false;
let currentMode = "focus"; // "focus" or "break"
let timeLeft = 25 * 60; // 25 minutes in seconds

// Sound Generator using Web Audio API
function playAlarmSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // Play a sequence of 3 friendly beeps
    const times = [0, 0.2, 0.4];
    times.forEach(delay => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(660, audioCtx.currentTime + delay); // E5 note
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + delay + 0.15);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + delay);
      osc.stop(audioCtx.currentTime + delay + 0.15);
    });
  } catch (error) {
    console.warn("Audio Context not supported or allowed yet.", error);
  }
}

// DOM Elements
const timerDisplay = document.getElementById("timer-display");
const quickTimerDisplay = document.getElementById("quick-timer-display");
const timerStatusText = document.getElementById("timer-status-text");
const quickModeIndicator = document.querySelector(".mode-indicator");

const btnStartPause = document.getElementById("btn-timer-start-pause");
const btnReset = document.getElementById("btn-timer-reset");
const btnFocusMode = document.getElementById("btn-focus-mode");
const btnBreakMode = document.getElementById("btn-break-mode");

// Timer Functions
function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  if (timerDisplay) timerDisplay.textContent = formattedTime;
  if (quickTimerDisplay) quickTimerDisplay.textContent = formattedTime;
  
  // Update Tab Title
  const modeLabel = currentMode === "focus" ? "Foco" : "Pausa";
  document.title = `[${formattedTime}] ${modeLabel} | OrganizaEstudo`;
}

function setMode(mode) {
  currentMode = mode;
  if (mode === "focus") {
    timeLeft = 25 * 60;
    btnFocusMode.classList.add("active");
    btnBreakMode.classList.remove("active");
    if (timerStatusText) timerStatusText.textContent = "Hora de focar! Desconecte o celular.";
    if (quickModeIndicator) {
      quickModeIndicator.textContent = "Foco Ativo";
      quickModeIndicator.style.background = "var(--primary)";
    }
  } else {
    timeLeft = 5 * 60;
    btnFocusMode.classList.remove("active");
    btnBreakMode.classList.add("active");
    if (timerStatusText) timerStatusText.textContent = "Descanse! Beba uma água.";
    if (quickModeIndicator) {
      quickModeIndicator.textContent = "Pausa Ativa";
      quickModeIndicator.style.background = "var(--secondary)";
    }
  }
  
  // If running, pause
  if (isRunning) {
    pauseTimer();
  }
  updateTimerDisplay();
}

function startTimer() {
  isRunning = true;
  btnStartPause.textContent = "Pausar";
  btnStartPause.classList.add("button-secondary");
  btnStartPause.classList.remove("button-primary");
  
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerDisplay();
    } else {
      // Finished
      playAlarmSound();
      pauseTimer();
      alert(currentMode === "focus" ? "Bloco de foco concluído! Faça uma pausa." : "Sua pausa acabou! Hora de voltar ao foco.");
      
      // Auto toggle mode
      setMode(currentMode === "focus" ? "break" : "focus");
    }
  }, 1000);
}

function pauseTimer() {
  isRunning = false;
  clearInterval(timerInterval);
  btnStartPause.textContent = "Iniciar";
  btnStartPause.classList.add("button-primary");
  btnStartPause.classList.remove("button-secondary");
}

function resetTimer() {
  pauseTimer();
  setMode(currentMode);
}

// Timer Listeners
if (btnFocusMode) btnFocusMode.addEventListener("click", () => setMode("focus"));
if (btnBreakMode) btnBreakMode.addEventListener("click", () => setMode("break"));

if (btnStartPause) {
  btnStartPause.addEventListener("click", () => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });
}

if (btnReset) btnReset.addEventListener("click", resetTimer);

// --- Task List (To-Do) State ---
let tasks = [
  { id: 1, title: "Estudar para a prova de Endereçamento IP de Redes", subject: "Redes de Computadores", priority: "Alta", completed: false },
  { id: 2, title: "Fazer relatório de Sistemas Operacionais", subject: "Sistemas Operacionais", priority: "Média", completed: false },
  { id: 3, title: "Resolver lista de exercícios de Álgebra", subject: "Matemática", priority: "Baixa", completed: true }
];

// Load from localStorage if present
if (localStorage.getItem("organizaestudo_tasks")) {
  try {
    tasks = JSON.parse(localStorage.getItem("organizaestudo_tasks"));
  } catch (e) {
    console.error("Error parsing tasks from localStorage", e);
  }
}

const todoForm = document.getElementById("todo-form");
const todoTitleInput = document.getElementById("todo-title");
const todoSubjectSelect = document.getElementById("todo-subject");
const todoPrioritySelect = document.getElementById("todo-priority");
const todoListElement = document.getElementById("todo-list-element");
const todoStats = document.getElementById("todo-stats");

function saveTasks() {
  localStorage.setItem("organizaestudo_tasks", JSON.stringify(tasks));
}

function renderTasks() {
  if (!todoListElement) return;
  
  todoListElement.innerHTML = "";
  
  if (tasks.length === 0) {
    todoListElement.innerHTML = `<li class="todo-placeholder">Nenhuma tarefa cadastrada. Adicione uma no formulário ao lado!</li>`;
    if (todoStats) todoStats.textContent = "0 concluintes / 0 totais";
    return;
  }
  
  const completedCount = tasks.filter(t => t.completed).length;
  if (todoStats) {
    todoStats.textContent = `${completedCount} concluídas / ${tasks.length} total`;
  }
  
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `todo-item priority-${task.priority.toLowerCase()} ${task.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
      <div class="todo-checkbox-wrapper">
        <input type="checkbox" id="task-chk-${task.id}" class="todo-checkbox" ${task.completed ? 'checked' : ''} />
        <label for="task-chk-${task.id}" class="todo-item-title-wrapper">
          <span class="todo-item-title">${escapeHTML(task.title)}</span>
          <span class="todo-item-tag">${escapeHTML(task.subject)}</span>
        </label>
      </div>
      <div class="todo-actions-wrapper">
        <span class="priority-badge ${task.priority.toLowerCase()}">${task.priority}</span>
        <button class="todo-delete-btn" aria-label="Excluir tarefa" data-id="${task.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    `;
    
    // Checkbox toggle listener
    const chk = li.querySelector(".todo-checkbox");
    chk.addEventListener("change", () => {
      task.completed = chk.checked;
      saveTasks();
      renderTasks();
    });
    
    // Delete listener
    const delBtn = li.querySelector(".todo-delete-btn");
    delBtn.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });
    
    todoListElement.appendChild(li);
  });
}

// Escape helper to prevent XSS
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// Add task form listener
if (todoForm) {
  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = todoTitleInput.value.trim();
    const subject = todoSubjectSelect.value;
    const priority = todoPrioritySelect.value;
    
    if (!title) return;
    
    const newTask = {
      id: Date.now(),
      title,
      subject,
      priority,
      completed: false
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    
    // Reset Form
    todoTitleInput.value = "";
    todoTitleInput.focus();
  });
}

// Initial Calls
updateTimerDisplay();
renderTasks();

// --- Gerador de Cronograma Inteligente ---
const scheduleForm = document.getElementById("schedule-form");
const scheduleHoursSelect = document.getElementById("schedule-hours");
const examDateInput = document.getElementById("exam-date");
const scheduleTableContainer = document.getElementById("schedule-table-container");
const scheduleSummaryBadge = document.getElementById("schedule-summary-badge");

if (scheduleForm) {
  scheduleForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Get chosen difficulties
    const checkedBoxes = document.querySelectorAll('input[name="difficulty"]:checked');
    const difficulties = Array.from(checkedBoxes).map(cb => cb.value);
    
    if (difficulties.length === 0) {
      alert("Por favor, selecione pelo menos uma disciplina de dificuldade!");
      return;
    }
    
    const dailyHours = parseInt(scheduleHoursSelect.value, 10);
    const examDateVal = examDateInput.value;
    
    if (!examDateVal) {
      alert("Por favor, selecione uma data de exame!");
      return;
    }
    
    // Parse exam date
    const today = new Date();
    const examDate = new Date(examDateVal);
    const timeDiff = examDate.getTime() - today.getTime();
    const daysRemaining = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
    
    // Update badge
    scheduleSummaryBadge.textContent = `${daysRemaining} dias até a prova`;
    
    // Generate schedule grid (Mon - Fri)
    const daysOfWeek = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira"];
    
    // Determine study structure based on daily hours
    let scheduleHTML = `
      <table class="schedule-table">
        <thead>
          <tr>
            <th>Dia</th>
            <th>Horário / Bloco</th>
            <th>Atividade / Matéria</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    daysOfWeek.forEach((day, index) => {
      // Rotate difficulties
      const primarySubject = difficulties[index % difficulties.length];
      const secondarySubject = difficulties[(index + 1) % difficulties.length] || primarySubject;
      
      if (dailyHours === 1) {
        scheduleHTML += `
          <tr>
            <td rowspan="3" class="bold">${day}</td>
            <td>14:00 - 14:25</td>
            <td>Estudo: <strong>${escapeHTML(primarySubject)}</strong></td>
            <td><span class="schedule-block-tag study">Estudo</span></td>
          </tr>
          <tr>
            <td>14:25 - 14:30</td>
            <td>Pausa relaxante</td>
            <td><span class="schedule-block-tag break">Pausa</span></td>
          </tr>
          <tr>
            <td>14:30 - 14:55</td>
            <td>Revisão / Exercícios: <strong>${escapeHTML(primarySubject)}</strong></td>
            <td><span class="schedule-block-tag review">Revisão</span></td>
          </tr>
        `;
      } else if (dailyHours === 2) {
        scheduleHTML += `
          <tr>
            <td rowspan="5" class="bold">${day}</td>
            <td>14:00 - 14:25</td>
            <td>Estudo Focado: <strong>${escapeHTML(primarySubject)}</strong></td>
            <td><span class="schedule-block-tag study">Estudo</span></td>
          </tr>
          <tr>
            <td>14:25 - 14:30</td>
            <td>Pausa curta</td>
            <td><span class="schedule-block-tag break">Pausa</span></td>
          </tr>
          <tr>
            <td>14:30 - 14:55</td>
            <td>Estudo Focado: <strong>${escapeHTML(secondarySubject)}</strong></td>
            <td><span class="schedule-block-tag study">Estudo</span></td>
          </tr>
          <tr>
            <td>14:55 - 15:00</td>
            <td>Pausa curta</td>
            <td><span class="schedule-block-tag break">Pausa</span></td>
          </tr>
          <tr>
            <td>15:00 - 15:30</td>
            <td>Revisão Geral e Resumos</td>
            <td><span class="schedule-block-tag review">Revisão</span></td>
          </tr>
        `;
      } else if (dailyHours === 3) {
        scheduleHTML += `
          <tr>
            <td rowspan="7" class="bold">${day}</td>
            <td>14:00 - 14:25</td>
            <td>Teoria: <strong>${escapeHTML(primarySubject)}</strong></td>
            <td><span class="schedule-block-tag study">Estudo</span></td>
          </tr>
          <tr>
            <td>14:25 - 14:30</td>
            <td>Pausa rápida</td>
            <td><span class="schedule-block-tag break">Pausa</span></td>
          </tr>
          <tr>
            <td>14:30 - 14:55</td>
            <td>Teoria: <strong>${escapeHTML(secondarySubject)}</strong></td>
            <td><span class="schedule-block-tag study">Estudo</span></td>
          </tr>
          <tr>
            <td>14:55 - 15:00</td>
            <td>Pausa rápida</td>
            <td><span class="schedule-block-tag break">Pausa</span></td>
          </tr>
          <tr>
            <td>15:00 - 15:25</td>
            <td>Simulado prático de redes</td>
            <td><span class="schedule-block-tag study">Estudo</span></td>
          </tr>
          <tr>
            <td>15:25 - 15:30</td>
            <td>Pausa rápida</td>
            <td><span class="schedule-block-tag break">Pausa</span></td>
          </tr>
          <tr>
            <td>15:30 - 16:00</td>
            <td>Resolução de Exercícios e Anotações</td>
            <td><span class="schedule-block-tag review">Revisão</span></td>
          </tr>
        `;
      } else {
        scheduleHTML += `
          <tr>
            <td rowspan="9" class="bold">${day}</td>
            <td>14:00 - 14:25</td>
            <td>Foco Redes/Telecom: <strong>${escapeHTML(primarySubject)}</strong></td>
            <td><span class="schedule-block-tag study">Estudo</span></td>
          </tr>
          <tr>
            <td>14:25 - 14:30</td>
            <td>Pausa curta</td>
            <td><span class="schedule-block-tag break">Pausa</span></td>
          </tr>
          <tr>
            <td>14:30 - 14:55</td>
            <td>Foco Programação/Sistemas: <strong>${escapeHTML(secondarySubject)}</strong></td>
            <td><span class="schedule-block-tag study">Estudo</span></td>
          </tr>
          <tr>
            <td>14:55 - 15:00</td>
            <td>Pausa curta</td>
            <td><span class="schedule-block-tag break">Pausa</span></td>
          </tr>
          <tr>
            <td>15:00 - 15:25</td>
            <td>Estudos Gerais Acadêmicos</td>
            <td><span class="schedule-block-tag study">Estudo</span></td>
          </tr>
          <tr>
            <td>15:25 - 15:30</td>
            <td>Pausa curta</td>
            <td><span class="schedule-block-tag break">Pausa</span></td>
          </tr>
          <tr>
            <td>15:30 - 15:55</td>
            <td>Revisão de Conteúdo Anteriores</td>
            <td><span class="schedule-block-tag review">Revisão</span></td>
          </tr>
          <tr>
            <td>15:55 - 16:00</td>
            <td>Pausa curta</td>
            <td><span class="schedule-block-tag break">Pausa</span></td>
          </tr>
          <tr>
            <td>16:00 - 16:30</td>
            <td>Fechamento e Preparação de Fichamentos</td>
            <td><span class="schedule-block-tag review">Revisão</span></td>
          </tr>
        `;
      }
    });
    
    scheduleHTML += `
        </tbody>
      </table>
    `;
    
    if (scheduleTableContainer) {
      scheduleTableContainer.innerHTML = scheduleHTML;
    }
  });
}

