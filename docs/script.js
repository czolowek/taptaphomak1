// =========================================================================
// Глобальные переменные
// =========================================================================
let score = 0;
let energy = 500;
let maxEnergy = 500;
let tapPower = 1;
let tapMultiplier = 1;
let energyRegen = 1;
let autoClicker = 0;
let hasPremium = false;
let boosterTimers = {
  double: null,
  energy: null
};

// Задания и друзья
let tasks = [
  {
    id: 'task1',
    title: 'Сделай 100 тапов',
    icon: 'hand-pointer',
    current: 0,
    target: 100,
    reward: 25,
    completed: false
  },
  {
    id: 'task2',
    title: 'Пройди 3 головоломки',
    icon: 'puzzle-piece',
    current: 0,
    target: 3,
    reward: 50,
    completed: false
  },
  {
    id: 'task3',
    title: 'Купи 1 улучшение',
    icon: 'store',
    current: 0,
    target: 1,
    reward: 30,
    completed: false
  }
];

let friends = [
  {
    id: 'friend1',
    username: 'Krakenzilla',
    level: 12,
    score: 10500,
    avatarColor: 'blue'
  },
  {
    id: 'friend2',
    username: 'OctoKing',
    level: 28,
    score: 52300,
    avatarColor: 'red'
  },
  {
    id: 'friend3',
    username: 'TentacleMaster',
    level: 5,
    score: 3200,
    avatarColor: 'blue'
  },
  {
    id: 'friend4',
    username: 'SeaMonster',
    level: 18,
    score: 25800,
    avatarColor: 'red'
  },
  {
    id: 'friend5',
    username: 'DeepBlue',
    level: 7,
    score: 5100,
    avatarColor: 'blue'
  }
];

// История призов в Lucky Drive
let prizeHistory = [];

// =========================================================================
// Инициализация игры
// =========================================================================
document.addEventListener('DOMContentLoaded', function() {
  // Проверяем устройство
  checkDeviceType();
  
  // Загружаем данные игры
  loadGameData();
  
  // Засекаем время загрузки для экрана загрузки
  const startTime = Date.now();
  
  // Анимация загрузки
  const loadingBar = document.getElementById('loading-progress-bar');
  let progress = 0;
  const loadingInterval = setInterval(() => {
    progress += Math.random() * 3;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);
    }
    loadingBar.style.width = `${progress}%`;
  }, 100);
  
  // Минимальное время показа экрана загрузки
  const minLoadTime = 3000;
  
  setTimeout(() => {
    const elapsed = Date.now() - startTime;
    const delay = Math.max(0, minLoadTime - elapsed);
    
    setTimeout(() => {
      // Скрываем экран загрузки
      document.getElementById('loading-screen').style.opacity = '0';
      setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('main-content').style.display = 'flex';
        setTimeout(() => {
          document.getElementById('main-content').classList.add('active');
        }, 50);
      }, 500);
      
      // Инициализируем элементы интерфейса
      initUI();
      
      // Запускаем интервалы для обновления игры
      startGameIntervals();
    }, delay);
  }, 1000);
  
  // Функция проверки типа устройства
  function checkDeviceType() {
    // Проверяем, является ли устройство мобильным
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile) {
      // Если не мобильное устройство, показываем экран проверки устройства
      document.getElementById('device-check').style.display = 'flex';
      document.getElementById('loading-screen').style.display = 'none';
    }
  }
  
  // Обработчики для навигации
  document.querySelectorAll('.nav-button').forEach(button => {
    button.addEventListener('click', function() {
      document.querySelectorAll('.nav-button').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      // Здесь можно добавить обработку смены вкладок, если нужно
    });
  });
  
  // Обработчики для вкладок в магазине
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
      // Убираем активный класс со всех вкладок
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      // Устанавливаем активный класс на выбранную вкладку
      this.classList.add('active');
      
      // Скрываем все контенты вкладок
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      // Показываем контент выбранной вкладки
      const tabId = this.getAttribute('data-tab');
      document.getElementById(`${tabId}-tab`).classList.add('active');
    });
  });
});

// Инициализация UI элементов
function initUI() {
  // Обновляем все счетчики
  updateScore();
  updateEnergy();
  updateIncomeStats();
  
  // Инициализируем список задач
  renderTasks();
  
  // Инициализируем список друзей
  renderFriends();
  
  // Инициализируем колесо удачи в Lucky Drive
  initLuckyDriveWheel();
}

// Запуск игровых интервалов
function startGameIntervals() {
  // Регенерация энергии и автокликер
  setInterval(() => {
    // Регенерация энергии
    if (energy < maxEnergy) {
      // Если активен бустер безлимитной энергии, не тратим энергию
      if (!boosterTimers.energy) {
        energy += energyRegen;
        if (energy > maxEnergy) energy = maxEnergy;
        updateEnergy();
      }
    }
    
    // Автокликер
    if (autoClicker > 0) {
      // Проверяем, активен ли двойной бустер
      const effectiveAutoClicker = boosterTimers.double ? autoClicker * 2 : autoClicker;
      score += effectiveAutoClicker;
      updateScore();
      
      // Создаем случайные частицы для визуального эффекта автокликера
      if (Math.random() < 0.3) {
        const krakenContainer = document.getElementById('kraken-container');
        if (krakenContainer) {
          const x = Math.random() * krakenContainer.offsetWidth;
          const y = Math.random() * krakenContainer.offsetHeight;
          createAutoClickParticle(x, y);
        }
      }
    }
    
    // Сохраняем данные
    saveGameData();
  }, 1000);
}

// =========================================================================
// Основные игровые функции
// =========================================================================

// Функция обработки клика по Кракену
function tap(event) {
  // Проверяем, достаточно ли энергии
  if (energy <= 0 && !boosterTimers.energy) {
    showNotification("Недостаточно энергии!", "bolt");
    return;
  }
  
  // Вычисляем эффективную мощность тапа с учетом бустера
  const effectiveTapPower = boosterTimers.double ? tapPower * 2 * tapMultiplier : tapPower * tapMultiplier;
  
  // Прибавляем очки
  score += effectiveTapPower;
  
  // Уменьшаем энергию (если нет бустера энергии)
  if (!boosterTimers.energy) {
    energy -= 1;
  }
  
  // Обновляем задание тапов
  const tapTask = tasks.find(task => task.id === 'task1' && !task.completed);
  if (tapTask && tapTask.current < tapTask.target) {
    tapTask.current += 1;
    // Проверяем, завершено ли задание
    if (tapTask.current >= tapTask.target) {
      showNotification(`Задание выполнено! +${tapTask.reward} очков`, "check");
    }
    renderTasks();
  }
  
  // Обновляем интерфейс
  updateScore();
  updateEnergy();
  
  // Создаем частицы для визуального эффекта
  createParticles(event);
  
  // Сохраняем данные
  saveGameData();
}

// Создание частиц при нажатии
function createParticles(event) {
  const krakenContainer = document.getElementById('kraken-container');
  const tapEffects = document.getElementById('tap-effects');
  
  if (!krakenContainer || !tapEffects) return;
  
  // Получаем координаты клика относительно контейнера
  const rect = krakenContainer.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  // Создаем несколько частиц
  const particleCount = 15;
  for (let i = 0; i < particleCount; i++) {
    // Создаем частицу
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Случайный цвет (красный или синий)
    const isRed = Math.random() > 0.5;
    particle.style.background = isRed 
      ? 'radial-gradient(circle, rgba(255, 59, 48, 0.8) 0%, rgba(255, 59, 48, 0) 70%)'
      : 'radial-gradient(circle, rgba(10, 132, 255, 0.8) 0%, rgba(10, 132, 255, 0) 70%)';
    
    // Размер частицы
    const size = Math.random() * 20 + 10; // От 10 до 30 пикселей
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Начальная позиция
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    // Случайное направление и расстояние
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 80 + 20;
    const translateX = Math.cos(angle) * distance;
    const translateY = Math.sin(angle) * distance;
    
    // Анимируем движение
    particle.style.transform = `translate(${translateX}px, ${translateY}px)`;
    
    // Добавляем в контейнер эффектов
    tapEffects.appendChild(particle);
    
    // Удаляем частицу после анимации
    setTimeout(() => {
      particle.remove();
    }, 800);
  }
  
  // Эффект пульсации Кракена
  const kraken = document.getElementById('kraken');
  kraken.style.transform = 'scale(1.1)';
  setTimeout(() => {
    kraken.style.transform = 'scale(1)';
  }, 200);
}

// Создание частиц для автокликера
function createAutoClickParticle(x, y) {
  const tapEffects = document.getElementById('tap-effects');
  
  if (!tapEffects) return;
  
  // Создаем частицу
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  // Используем синий цвет для автокликера
  particle.style.background = 'radial-gradient(circle, rgba(10, 132, 255, 0.6) 0%, rgba(10, 132, 255, 0) 70%)';
  
  // Размер частицы
  const size = 15;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  
  // Позиция
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  
  // Случайное направление и расстояние
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * 40 + 10;
  const translateX = Math.cos(angle) * distance;
  const translateY = Math.sin(angle) * distance;
  
  // Анимируем движение
  particle.style.transform = `translate(${translateX}px, ${translateY}px)`;
  
  // Добавляем в контейнер эффектов
  tapEffects.appendChild(particle);
  
  // Удаляем частицу после анимации
  setTimeout(() => {
    particle.remove();
  }, 800);
}

// =========================================================================
// Функции магазина
// =========================================================================

// Открытие магазина
function openShop() {
  document.getElementById('shop-modal').style.display = 'flex';
  setTimeout(() => {
    document.getElementById('shop-modal').style.opacity = '1';
  }, 10);
}

// Закрытие магазина
function closeShop() {
  document.getElementById('shop-modal').style.opacity = '0';
  setTimeout(() => {
    document.getElementById('shop-modal').style.display = 'none';
  }, 300);
}

// Покупка улучшения
function buyUpgrade(power, cost, energyCost) {
  if (score < cost) {
    showNotification("Недостаточно очков!", "times");
    return;
  }
  
  if (energy < energyCost && !boosterTimers.energy) {
    showNotification("Недостаточно энергии!", "bolt");
    return;
  }
  
  // Списываем стоимость
  score -= cost;
  
  // Списываем энергию, если нет бустера
  if (!boosterTimers.energy) {
    energy -= energyCost;
  }
  
  // Увеличиваем мощность тапа
  tapPower += power;
  
  // Обновляем задание покупки улучшения
  const upgradeTask = tasks.find(task => task.id === 'task3' && !task.completed);
  if (upgradeTask && upgradeTask.current < upgradeTask.target) {
    upgradeTask.current += 1;
    renderTasks();
  }
  
  // Обновляем интерфейс
  updateScore();
  updateEnergy();
  updateIncomeStats();
  
  // Показываем уведомление
  showNotification(`Улучшение куплено! +${power} к мощности тапа`, "level-up");
  
  // Сохраняем данные
  saveGameData();
}

// Покупка регенерации энергии
function buyEnergyRegen(amount, cost) {
  if (score < cost) {
    showNotification("Недостаточно очков!", "times");
    return;
  }
  
  // Списываем стоимость
  score -= cost;
  
  // Увеличиваем регенерацию энергии
  energyRegen += amount;
  
  // Обновляем задание покупки улучшения
  const upgradeTask = tasks.find(task => task.id === 'task3' && !task.completed);
  if (upgradeTask && upgradeTask.current < upgradeTask.target) {
    upgradeTask.current += 1;
    renderTasks();
  }
  
  // Обновляем интерфейс
  updateScore();
  
  // Показываем уведомление
  showNotification(`Регенерация энергии +${amount}!`, "bolt");
  
  // Сохраняем данные
  saveGameData();
}

// Покупка автокликера
function buyAutoClicker(amount, cost) {
  if (score < cost) {
    showNotification("Недостаточно очков!", "times");
    return;
  }
  
  // Списываем стоимость
  score -= cost;
  
  // Увеличиваем автокликер
  autoClicker += amount;
  
  // Обновляем задание покупки улучшения
  const upgradeTask = tasks.find(task => task.id === 'task3' && !task.completed);
  if (upgradeTask && upgradeTask.current < upgradeTask.target) {
    upgradeTask.current += 1;
    renderTasks();
  }
  
  // Обновляем интерфейс
  updateScore();
  updateIncomeStats();
  
  // Показываем уведомление
  showNotification(`Автокликер +${amount}/сек куплен!`, "robot");
  
  // Сохраняем данные
  saveGameData();
}

// Покупка бустера
function buyBooster(type, cost) {
  if (score < cost) {
    showNotification("Недостаточно очков!", "times");
    return;
  }
  
  let duration = 0;
  let message = "";
  
  // Списываем стоимость
  score -= cost;
  
  // Активируем бустер в зависимости от типа
  switch (type) {
    case 'double':
      duration = 60 * 60; // 1 час в секундах
      message = "2x множитель активирован на 1 час!";
      if (boosterTimers.double) {
        clearTimeout(boosterTimers.double.timeout);
      }
      boosterTimers.double = {
        endTime: Date.now() + duration * 1000,
        timeout: setTimeout(() => {
          boosterTimers.double = null;
          showNotification("2x множитель закончился", "clock");
          updateIncomeStats();
        }, duration * 1000)
      };
      break;
      
    case 'energy':
      duration = 30 * 60; // 30 минут в секундах
      message = "Безлимитная энергия на 30 минут!";
      if (boosterTimers.energy) {
        clearTimeout(boosterTimers.energy.timeout);
      }
      boosterTimers.energy = {
        endTime: Date.now() + duration * 1000,
        timeout: setTimeout(() => {
          boosterTimers.energy = null;
          showNotification("Безлимитная энергия закончилась", "battery-empty");
        }, duration * 1000)
      };
      break;
  }
  
  // Обновляем интерфейс
  updateScore();
  updateIncomeStats();
  
  // Показываем уведомление
  showNotification(message, "rocket");
  
  // Сохраняем данные
  saveGameData();
}

// Покупка премиума
function buyPremium(cost) {
  if (score < cost) {
    showNotification("Недостаточно очков!", "times");
    return;
  }
  
  if (hasPremium) {
    showNotification("У вас уже есть VIP статус!", "crown");
    return;
  }
  
  // Списываем стоимость
  score -= cost;
  
  // Активируем премиум
  hasPremium = true;
  tapMultiplier = 1.5; // +50% к доходу
  
  // Обновляем интерфейс
  updateScore();
  updateIncomeStats();
  
  // Показываем уведомление
  showNotification("VIP статус приобретен! +50% к доходу", "crown");
  
  // Сохраняем данные
  saveGameData();
}

// =========================================================================
// Функции головоломки
// =========================================================================

// Функция для связи с puzzle.js
function completePuzzle(difficulty, reward) {
  // Добавляем очки
  score += reward;
  
  // Обновляем задание прохождения головоломок
  const puzzleTask = tasks.find(task => task.id === 'task2' && !task.completed);
  if (puzzleTask && puzzleTask.current < puzzleTask.target) {
    puzzleTask.current += 1;
    renderTasks();
  }
  
  // Обновляем интерфейс
  updateScore();
  
  // Сохраняем данные
  saveGameData();
}

// =========================================================================
// Функции задач
// =========================================================================

// Открытие окна задач
function openTasks() {
  // Обновляем список задач
  renderTasks();
  
  // Показываем модальное окно
  document.getElementById('tasks-modal').style.display = 'flex';
  setTimeout(() => {
    document.getElementById('tasks-modal').style.opacity = '1';
  }, 10);
}

// Закрытие окна задач
function closeTasks() {
  document.getElementById('tasks-modal').style.opacity = '0';
  setTimeout(() => {
    document.getElementById('tasks-modal').style.display = 'none';
  }, 300);
}

// Рендеринг списка задач
function renderTasks() {
  const tasksContainer = document.getElementById('tasks-container');
  if (!tasksContainer) return;
  
  tasksContainer.innerHTML = '';
  
  tasks.forEach(task => {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    
    const progress = Math.min(100, (task.current / task.target) * 100);
    
    taskElement.innerHTML = `
      <div class="task-icon">
        <i class="fas fa-${task.icon}"></i>
      </div>
      <div class="task-info">
        <div class="task-title">${task.title}</div>
        <div class="task-progress-container">
          <div class="task-progress-bar" style="width: ${progress}%"></div>
        </div>
        <div class="task-progress-text">${task.current}/${task.target}</div>
      </div>
      <div class="task-reward">
        <i class="fas fa-coins"></i>
        ${task.reward}
      </div>
    `;
    
    // Добавляем кнопку завершения, если задание выполнено, но не забрана награда
    if (task.current >= task.target && !task.completed) {
      const completeButton = document.createElement('button');
      completeButton.className = 'task-complete-btn';
      completeButton.textContent = 'Забрать';
      completeButton.onclick = () => completeTask(task.id);
      taskElement.appendChild(completeButton);
    }
    
    // Если задание выполнено, делаем его полупрозрачным
    if (task.completed) {
      taskElement.style.opacity = '0.6';
    }
    
    tasksContainer.appendChild(taskElement);
  });
}

// Функция завершения задания
function completeTask(taskId) {
  const task = tasks.find(t => t.id === taskId);
  
  if (!task || task.completed || task.current < task.target) return;
  
  // Отмечаем задание как выполненное
  task.completed = true;
  
  // Добавляем награду
  score += task.reward;
  
  // Обновляем интерфейс
  updateScore();
  renderTasks();
  
  // Показываем уведомление
  showNotification(`Задание выполнено! +${task.reward} очков`, "check");
  
  // Сохраняем данные
  saveGameData();
}

// =========================================================================
// Функции друзей
// =========================================================================

// Открытие окна друзей
function openFriends() {
  // Обновляем список друзей
  renderFriends();
  
  // Показываем модальное окно
  document.getElementById('friends-modal').style.display = 'flex';
  setTimeout(() => {
    document.getElementById('friends-modal').style.opacity = '1';
  }, 10);
  
  // Добавляем обработчик для поиска
  const searchInput = document.getElementById('friends-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', filterFriends);
  }
}

// Закрытие окна друзей
function closeFriends() {
  document.getElementById('friends-modal').style.opacity = '0';
  setTimeout(() => {
    document.getElementById('friends-modal').style.display = 'none';
  }, 300);
}

// Рендеринг списка друзей
function renderFriends() {
  const friendsContainer = document.getElementById('friends-container');
  if (!friendsContainer) return;
  
  friendsContainer.innerHTML = '';
  
  friends.forEach(friend => {
    const friendElement = document.createElement('div');
    friendElement.className = 'friend-item';
    friendElement.dataset.username = friend.username.toLowerCase(); // Для поиска
    
    // Форматируем счет для отображения (K, M)
    const formattedScore = formatNumber(friend.score);
    
    friendElement.innerHTML = `
      <div class="friend-avatar ${friend.avatarColor}">
        <i class="fas fa-user"></i>
      </div>
      <div class="friend-info">
        <div class="friend-name">${friend.username}</div>
        <div class="friend-level">Уровень: ${friend.level}</div>
      </div>
      <div class="friend-gift" onclick="sendGift('${friend.id}')">
        <i class="fas fa-gift"></i>
      </div>
      <div class="friend-score">${formattedScore}</div>
    `;
    
    friendsContainer.appendChild(friendElement);
  });
}

// Фильтрация друзей при поиске
function filterFriends() {
  const searchInput = document.getElementById('friends-search-input');
  const query = searchInput.value.toLowerCase().trim();
  
  const friendElements = document.querySelectorAll('.friend-item');
  friendElements.forEach(element => {
    const username = element.dataset.username;
    if (username.includes(query)) {
      element.style.display = 'flex';
    } else {
      element.style.display = 'none';
    }
  });
}

// Отправка подарка другу
function sendGift(friendId) {
  showNotification("Подарок отправлен!", "gift");
}

// Открыть лидерборд
function openLeaderboard() {
  document.getElementById('leaderboard-modal').style.display = 'flex';
  renderLeaderboard('global');
  
  // Добавляем обработчики событий для вкладок
  const tabs = document.querySelectorAll('.leaderboard-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Удаляем активный класс у всех вкладок
      tabs.forEach(t => t.classList.remove('active'));
      // Добавляем активный класс кликнутой вкладке
      this.classList.add('active');
      // Рендерим соответствующий лидерборд
      renderLeaderboard(this.dataset.tab);
    });
  });
}

// Закрыть лидерборд
function closeLeaderboard() {
  document.getElementById('leaderboard-modal').style.display = 'none';
}

// Рендер лидерборда
function renderLeaderboard(type) {
  const container = document.getElementById('leaderboard-container');
  container.innerHTML = '';
  
  // Получаем данные в зависимости от типа лидерборда
  let leaderboardData = [];
  
  if (type === 'global') {
    // Данные глобального лидерборда
    leaderboardData = [
      { id: 1, username: 'CyberKraken', level: 42, score: 98765, isYou: false },
      { id: 2, username: 'RedOcean', level: 38, score: 87654, isYou: false },
      { id: 3, username: 'TentacleKing', level: 35, score: 76543, isYou: false },
      { id: 4, username: 'Player1', level: 30, score: 65432, isYou: true },
      { id: 5, username: 'DeepSea', level: 28, score: 54321, isYou: false },
      { id: 6, username: 'WaveMaster', level: 25, score: 43210, isYou: false },
      { id: 7, username: 'OceanRider', level: 22, score: 32109, isYou: false },
      { id: 8, username: 'AquaGamer', level: 20, score: 21098, isYou: false },
      { id: 9, username: 'DeepDiver', level: 18, score: 10987, isYou: false },
      { id: 10, username: 'SeaWanderer', level: 15, score: 9876, isYou: false }
    ];
  } else {
    // Данные лидерборда друзей
    leaderboardData = [
      { id: 4, username: 'Player1', level: 30, score: 65432, isYou: true },
      { id: 11, username: 'FriendA', level: 25, score: 45678, isYou: false },
      { id: 12, username: 'FriendB', level: 22, score: 34567, isYou: false },
      { id: 13, username: 'FriendC', level: 20, score: 23456, isYou: false },
      { id: 14, username: 'FriendD', level: 18, score: 12345, isYou: false }
    ];
  }
  
  // Рендерим лидерборд
  leaderboardData.forEach((player, index) => {
    const item = document.createElement('div');
    item.className = `leaderboard-item ${player.isYou ? 'leaderboard-you' : ''}`;
    
    const rankClass = index < 3 ? `rank-${index+1}` : '';
    
    item.innerHTML = `
      <div class="leaderboard-rank ${rankClass}">${index+1}</div>
      <div class="leaderboard-player">
        <div class="player-name">${player.username}</div>
        <div class="player-level">Уровень ${player.level}</div>
      </div>
      <div class="leaderboard-score">${formatNumber(player.score)}</div>
    `;
    
    container.appendChild(item);
  });
}

// Телеграм команды
function openTelegramCommands() {
  document.getElementById('telegram-commands-modal').style.display = 'flex';
}

function closeTelegramCommands() {
  document.getElementById('telegram-commands-modal').style.display = 'none';
}

// Функция для поделиться в тг бота
function shareToBots() {
  showNotification('Ссылка скопирована в буфер обмена!', 'link');
  
  // В реальном приложении мы бы использовали navigator.clipboard для копирования ссылки
  setTimeout(() => {
    showNotification('Отправьте ссылку друзьям в Telegram!', 'telegram');
  }, 1500);
}

// =========================================================================
// Функции Lucky Drive
// =========================================================================

// Открытие окна Lucky Drive
function openLuckyDrive() {
  document.getElementById('lucky-drive-modal').style.display = 'flex';
  setTimeout(() => {
    document.getElementById('lucky-drive-modal').style.opacity = '1';
  }, 10);
}

// Закрытие окна Lucky Drive
function closeLuckyDrive() {
  document.getElementById('lucky-drive-modal').style.opacity = '0';
  setTimeout(() => {
    document.getElementById('lucky-drive-modal').style.display = 'none';
  }, 300);
}

// Инициализация колеса Lucky Drive
function initLuckyDriveWheel() {
  // Здесь можно добавить инициализацию секторов колеса, если нужно
  
  // Рендерим историю призов
  renderPrizeHistory();
}

// Вращение колеса
function spinWheel() {
  // Отключаем кнопку на время вращения
  const spinButton = document.getElementById('spin-button');
  spinButton.disabled = true;
  
  // Случайный угол для остановки (5-10 оборотов + случайный сектор)
  const stopAngle = 1800 + Math.floor(Math.random() * 360);
  
  // Анимируем вращение
  const wheel = document.getElementById('wheel');
  wheel.style.transform = `rotate(${stopAngle}deg)`;
  
  // После остановки выдаем приз
  setTimeout(() => {
    // Определяем, какой сектор выпал (8 секторов по 45 градусов)
    const normalizedAngle = stopAngle % 360;
    const sector = Math.floor(normalizedAngle / 45);
    
    // Определяем приз в зависимости от сектора
    let prize = '';
    let icon = '';
    let bonusType = '';
    
    switch (sector) {
      case 0:
      case 4:
        // 100 монет
        prize = '100 монет';
        icon = 'coins';
        bonusType = 'coins';
        score += 100;
        break;
      case 1:
      case 5:
        // 25% энергии
        prize = '+25% энергии';
        icon = 'bolt';
        bonusType = 'energy';
        energy += Math.floor(maxEnergy * 0.25);
        if (energy > maxEnergy) energy = maxEnergy;
        break;
      case 2:
      case 6:
        // Бустер x2 на 10 минут
        prize = 'Бустер x2 на 10 минут';
        icon = 'rocket';
        bonusType = 'booster';
        // Активируем временный бустер
        const duration = 10 * 60; // 10 минут в секундах
        if (boosterTimers.double) {
          clearTimeout(boosterTimers.double.timeout);
        }
        boosterTimers.double = {
          endTime: Date.now() + duration * 1000,
          timeout: setTimeout(() => {
            boosterTimers.double = null;
            showNotification("2x множитель закончился", "clock");
            updateIncomeStats();
          }, duration * 1000)
        };
        break;
      case 3:
      case 7:
        // 50 монет
        prize = '50 монет';
        icon = 'coins';
        bonusType = 'coins';
        score += 50;
        break;
    }
    
    // Обновляем интерфейс
    updateScore();
    updateEnergy();
    updateIncomeStats();
    
    // Показываем уведомление о призе
    showNotification(`Вы выиграли: ${prize}!`, icon);
    
    // Добавляем в историю призов
    addPrizeToHistory(prize, icon, bonusType);
    
    // Возвращаем доступность кнопки
    spinButton.disabled = false;
    
    // Сохраняем данные
    saveGameData();
  }, 3000); // Время вращения колеса
}

// Добавление приза в историю
function addPrizeToHistory(prize, icon, type) {
  // Добавляем приз в начало массива
  prizeHistory.unshift({
    prize,
    icon,
    type,
    time: new Date().toLocaleTimeString()
  });
  
  // Ограничиваем историю 10 записями
  if (prizeHistory.length > 10) {
    prizeHistory.pop();
  }
  
  // Обновляем отображение истории
  renderPrizeHistory();
}

// Рендеринг истории призов
function renderPrizeHistory() {
  const historyList = document.getElementById('prize-history-list');
  if (!historyList) return;
  
  historyList.innerHTML = '';
  
  if (prizeHistory.length === 0) {
    historyList.innerHTML = '<div class="no-history">История пуста</div>';
    return;
  }
  
  prizeHistory.forEach(entry => {
    const item = document.createElement('div');
    item.className = `prize-item ${entry.type}`;
    item.innerHTML = `<i class="fas fa-${entry.icon}"></i> ${entry.prize} <span class="prize-time">${entry.time}</span>`;
    historyList.appendChild(item);
  });
}

// =========================================================================
// Вспомогательные функции
// =========================================================================

// Обновление отображения очков
function updateScore() {
  document.getElementById('score').textContent = formatNumber(score);
}

// Обновление отображения энергии
function updateEnergy() {
  document.getElementById('energy').textContent = Math.floor(energy);
  document.getElementById('max-energy').textContent = maxEnergy;
  
  // Обновляем полосу энергии
  const energyBar = document.getElementById('energy-bar');
  const energyPercentage = (energy / maxEnergy) * 100;
  energyBar.style.width = `${energyPercentage}%`;
  
  // Изменяем цвет при низкой энергии
  if (energyPercentage < 20) {
    energyBar.style.background = 'linear-gradient(90deg, #FF3B30, #FF9500)';
  } else {
    energyBar.style.background = 'linear-gradient(90deg, #00CCFF, #0066FF)';
  }
  
  // Показываем индикатор безлимитной энергии
  if (boosterTimers.energy) {
    document.getElementById('energy-text').style.color = '#00CCFF';
    document.querySelector('.energy-icon').style.color = '#00CCFF';
  } else {
    document.getElementById('energy-text').style.color = '';
    document.querySelector('.energy-icon').style.color = '';
  }
}

// Обновление статистики доходов
function updateIncomeStats() {
  // Доход в час от автокликера
  const hourlyIncome = autoClicker * 3600;
  // Применяем множитель, если активен бустер
  const effectiveHourlyIncome = boosterTimers.double ? hourlyIncome * 2 : hourlyIncome;
  
  document.getElementById('income-per-hour').textContent = formatNumber(effectiveHourlyIncome);
  
  // Доход за тап
  const tapIncome = tapPower * tapMultiplier;
  // Применяем множитель, если активен бустер
  const effectiveTapIncome = boosterTimers.double ? tapIncome * 2 : tapIncome;
  
  document.getElementById('income-per-tap').textContent = formatNumber(effectiveTapIncome);
  document.getElementById('tap-multiplier').textContent = tapMultiplier.toFixed(1);
}

// Функция форматирования чисел (1K, 1M и т.д.)
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Показ уведомления
function showNotification(message, icon = 'info') {
  const notificationContainer = document.getElementById('notification-container');
  
  if (!notificationContainer) return;
  
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
  
  notificationContainer.appendChild(notification);
  
  // Удаляем уведомление через 3 секунды
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// =========================================================================
// Сохранение и загрузка данных
// =========================================================================

// Сохранение данных игры
function saveGameData() {
  const gameData = {
    score,
    energy,
    maxEnergy,
    tapPower,
    tapMultiplier,
    energyRegen,
    autoClicker,
    tasks,
    hasPremium,
    prizeHistory,
    // Сохраняем состояние бустеров (только время окончания)
    boosters: {
      double: boosterTimers.double ? boosterTimers.double.endTime : null,
      energy: boosterTimers.energy ? boosterTimers.energy.endTime : null
    }
  };
  
  localStorage.setItem('tapKrakenGameData', JSON.stringify(gameData));
}

// Загрузка данных игры
function loadGameData() {
  const savedData = localStorage.getItem('tapKrakenGameData');
  
  if (savedData) {
    try {
      const gameData = JSON.parse(savedData);
      
      // Загружаем основные данные
      score = gameData.score || 0;
      energy = gameData.energy || 500;
      maxEnergy = gameData.maxEnergy || 500;
      tapPower = gameData.tapPower || 1;
      tapMultiplier = gameData.tapMultiplier || 1;
      energyRegen = gameData.energyRegen || 1;
      autoClicker = gameData.autoClicker || 0;
      hasPremium = gameData.hasPremium || false;
      
      // Загружаем задания
      if (gameData.tasks) {
        tasks = gameData.tasks;
      }
      
      // Загружаем историю призов
      if (gameData.prizeHistory) {
        prizeHistory = gameData.prizeHistory;
      }
      
      // Восстанавливаем бустеры
      if (gameData.boosters) {
        // Восстанавливаем двойной бустер, если время не истекло
        if (gameData.boosters.double && gameData.boosters.double > Date.now()) {
          const timeLeft = gameData.boosters.double - Date.now();
          boosterTimers.double = {
            endTime: gameData.boosters.double,
            timeout: setTimeout(() => {
              boosterTimers.double = null;
              showNotification("2x множитель закончился", "clock");
              updateIncomeStats();
            }, timeLeft)
          };
        }
        
        // Восстанавливаем бустер энергии, если время не истекло
        if (gameData.boosters.energy && gameData.boosters.energy > Date.now()) {
          const timeLeft = gameData.boosters.energy - Date.now();
          boosterTimers.energy = {
            endTime: gameData.boosters.energy,
            timeout: setTimeout(() => {
              boosterTimers.energy = null;
              showNotification("Безлимитная энергия закончилась", "battery-empty");
            }, timeLeft)
          };
        }
      }
      
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  }
}