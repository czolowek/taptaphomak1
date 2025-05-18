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
    avatarColor: 'blue',
    online: true
  },
  {
    id: 'friend2',
    username: 'OctoKing',
    level: 28,
    score: 52300,
    avatarColor: 'red',
    online: true
  },
  {
    id: 'friend3',
    username: 'TentacleMaster',
    level: 5,
    score: 3200,
    avatarColor: 'blue',
    online: false
  },
  {
    id: 'friend4',
    username: 'SeaMonster',
    level: 18,
    score: 25800,
    avatarColor: 'red',
    online: true
  },
  {
    id: 'friend5',
    username: 'DeepBlue',
    level: 7,
    score: 5100,
    avatarColor: 'blue',
    online: true
  },
  {
    id: 'friend6',
    username: 'RedTide',
    level: 15,
    score: 18200,
    avatarColor: 'red',
    online: false
  },
  {
    id: 'friend7',
    username: 'OceanRuler',
    level: 10,
    score: 8900,
    avatarColor: 'blue',
    online: true
  }
];

// Глобальные лидеры 
let leaderboard = [
  {
    id: 'leader1',
    username: 'KrakenMaster',
    level: 50,
    score: 1250000,
    avatarColor: 'red'
  },
  {
    id: 'leader2',
    username: 'DeepSeaKing',
    level: 48,
    score: 980000,
    avatarColor: 'blue'
  },
  {
    id: 'leader3',
    username: 'TentacleGod',
    level: 45,
    score: 850000,
    avatarColor: 'green'
  },
  {
    id: 'leader4',
    username: 'OceanLord',
    level: 42,
    score: 720000,
    avatarColor: 'blue'
  },
  {
    id: 'leader5',
    username: 'AbyssalDweller',
    level: 39,
    score: 650000,
    avatarColor: 'red'
  },
  // Добавляем друзей к общему списку лидеров
  ...friends.sort((a, b) => b.score - a.score)
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
  
  // Инициализируем пузырьки в фоне
  initBackgroundBubbles();
  
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
  
  // Обработчик для кнопки рейтинга
  document.getElementById('leaderboard-btn').addEventListener('click', function() {
    // Добавляем эффект нажатия для кнопки
    addButtonClickEffect(this);
    // Открываем модальное окно рейтинга
    openModal('leaderboard-modal');
    // Рендерим данные о лидерах
    renderLeaderboard();
  });
  
  // Обработчик для кнопки друзей
  document.getElementById('friends-btn').addEventListener('click', function() {
    // Добавляем эффект нажатия для кнопки
    addButtonClickEffect(this);
    // Открываем модальное окно друзей
    openModal('friends-modal');
    // Обновляем счетчик друзей онлайн
    updateFriendsOnlineCount();
    // Рендерим список друзей
    renderFriendsList();
  });
  
  // Обработчик для кнопки заданий
  document.getElementById('tasks-btn').addEventListener('click', function() {
    // Добавляем эффект нажатия для кнопки
    addButtonClickEffect(this);
    // Открываем модальное окно заданий
    openModal('tasks-modal');
  });
  
  // Обработчик для кнопки головоломки
  document.getElementById('puzzle-btn').addEventListener('click', function() {
    // Добавляем эффект нажатия для кнопки
    addButtonClickEffect(this);
    // Открываем модальное окно головоломки
    openPuzzle();
  });
  
  // Обработчики для закрытия модальных окон
  document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      // Находим ближайшее модальное окно
      const modal = this.closest('.modal');
      if (modal) {
        closeModal(modal.id);
      }
    });
  });
  
  // Обработчики вкладок для рейтинга
  document.querySelectorAll('.leaderboard-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      // Убираем активный класс со всех вкладок
      document.querySelectorAll('.leaderboard-tab').forEach(t => t.classList.remove('active'));
      // Добавляем активный класс на выбранную вкладку
      this.classList.add('active');
      
      // Обновляем содержимое в зависимости от выбранной вкладки
      const tabType = this.getAttribute('data-tab');
      if (tabType === 'global') {
        renderLeaderboard('global');
      } else if (tabType === 'friends') {
        renderLeaderboard('friends');
      } else if (tabType === 'teams') {
        renderLeaderboard('teams');
      }
    });
  });
  
  // Обработчики вкладок для друзей
  document.querySelectorAll('.friends-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      // Убираем активный класс со всех вкладок
      document.querySelectorAll('.friends-tab').forEach(t => t.classList.remove('active'));
      // Добавляем активный класс на выбранную вкладку
      this.classList.add('active');
      
      // Обновляем содержимое в зависимости от выбранной вкладки
      const tabType = this.getAttribute('data-tab');
      if (tabType === 'all') {
        renderFriendsList('all');
      } else if (tabType === 'online') {
        renderFriendsList('online');
      } else if (tabType === 'requests') {
        renderFriendsList('requests');
      }
    });
  });
});

// Функция для добавления эффекта клика на кнопку
function addButtonClickEffect(button) {
  // Добавляем класс для анимации нажатия
  button.classList.add('button-clicked');
  
  // Создаем эффект круговой волны
  const wave = document.createElement('div');
  wave.className = 'button-click-wave';
  button.appendChild(wave);
  
  // Создаем эффект свечения
  const glow = document.createElement('div');
  glow.className = 'button-click-glow';
  button.appendChild(glow);
  
  // Удаляем эффекты через некоторое время
  setTimeout(() => {
    button.classList.remove('button-clicked');
    wave.remove();
    glow.remove();
  }, 600);
  
  // Добавляем тактильную отдачу на мобильных устройствах, если поддерживается
  if (navigator.vibrate) {
    navigator.vibrate(30);
  }
}

// Инициализация пузырьков в фоне
function initBackgroundBubbles() {
  const bubbleContainer = document.querySelector('.bubble-container');
  
  // Создаем начальные пузырьки
  for (let i = 0; i < 20; i++) {
    createBubble(bubbleContainer);
  }
  
  // Регулярно добавляем новые пузырьки
  setInterval(() => {
    if (document.querySelector('.bubble-container')) {
      createBubble(document.querySelector('.bubble-container'));
    }
  }, 2000);
}

// Создание пузырька
function createBubble(container) {
  if (!container) return;
  
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  
  // Случайный размер и позиция
  const size = Math.random() * 30 + 10;
  const left = Math.random() * 100;
  
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubble.style.left = `${left}%`;
  bubble.style.bottom = '-50px';
  
  // Случайное направление движения
  const tx = (Math.random() - 0.5) * 200;
  bubble.style.setProperty('--tx', `${tx}px`);
  
  // Случайная продолжительность анимации
  const duration = Math.random() * 10 + 10;
  bubble.style.animationDuration = `${duration}s`;
  
  container.appendChild(bubble);
  
  // Удаляем пузырек после анимации
  setTimeout(() => {
    bubble.remove();
  }, duration * 1000);
}

// Инициализация UI элементов
function initUI() {
  // Обновляем все счетчики
  updateScore();
  updateEnergy();
  updateIncomeStats();
  
  // Инициализируем список задач
  renderTasks();
  
  // Инициализируем список друзей
  renderFriendsList();
  
  // Обновляем счетчик друзей онлайн
  updateFriendsOnlineCount();
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
  
  // Улучшенная симуляция активности друзей с более реалистичной моделью поведения
  setInterval(() => {
    // Получаем текущее время (для реалистичной симуляции активности)
    const now = new Date();
    const hour = now.getHours();
    
    // Вероятность онлайн в зависимости от времени суток
    let onlineProbability = 0.2; // базовая вероятность
    
    // Пик активности с 19 до 23 часов
    if (hour >= 19 && hour <= 23) {
      onlineProbability = 0.6;
    } 
    // Низкая активность ночью (с 0 до 6 утра)
    else if (hour >= 0 && hour <= 6) {
      onlineProbability = 0.05;
    }
    // Средняя активность в остальное время
    else {
      onlineProbability = 0.3;
    }
    
    // Обновляем статусы с учетом времени суток
    friends.forEach(friend => {
      // Вероятность изменения статуса: 15% для каждого друга
      if (Math.random() < 0.15) {
        // Если друг оффлайн, проверяем шанс выхода онлайн
        if (!friend.online) {
          friend.online = Math.random() < onlineProbability;
        } 
        // Если друг онлайн, проверяем шанс выхода из онлайна
        else {
          friend.online = Math.random() < (0.7 + (0.1 * Math.random())); // 70-80% шанс остаться онлайн
        }
        
        // Обновляем последнюю активность, если друг онлайн
        if (friend.online) {
          friend.lastActive = new Date().toISOString();
        }
      }
    });
    
    // Обновляем счетчик друзей онлайн
    const onlineCount = friends.filter(f => f.online).length;
    
    // Анимация обновления счетчика, если он изменился
    const countElement = document.getElementById('online-count');
    if (countElement.textContent != onlineCount) {
      countElement.classList.add('pulse-update');
      setTimeout(() => countElement.classList.remove('pulse-update'), 1000);
    }
    
    // Обновляем UI
    countElement.textContent = onlineCount;
    
    // Если открыто модальное окно друзей, обновляем полный список
    if (document.getElementById('friends-modal').classList.contains('active')) {
      updateFriendsOnlineCount();
      renderFriendsList();
    }
  }, 10000);
}

// =========================================================================
// Основные игровые функции
// =========================================================================

// Функция обработки клика по Кракену
function tap(event) {
  // Проверяем, достаточно ли энергии
  if (energy <= 0 && !boosterTimers.energy) {
    showNotification("Недостаточно энергии!", "bolt", "error");
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
      tapTask.completed = true;
      score += tapTask.reward;
      showNotification(`Задание выполнено! +${tapTask.reward} очков`, "check", "success");
    }
    renderTasks();
  }
  
  // Обновляем интерфейс
  updateScore();
  updateEnergy();
  
  // Создаем частицы и показываем +1/+1K для визуального эффекта
  createParticles(event);
  showScoreNumber(event, effectiveTapPower);
  
  // Сохраняем данные
  saveGameData();
}

// Функция отображения +1, +1K, +1M при нажатии
function showScoreNumber(event, amount) {
  const krakenContainer = document.getElementById('kraken-container');
  const tapEffects = document.getElementById('tap-effects');
  
  if (!krakenContainer || !tapEffects) return;
  
  // Получаем координаты клика
  const rect = krakenContainer.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  // Создаем элемент для показа числа
  const scoreNumber = document.createElement('div');
  scoreNumber.className = 'score-indicator';
  
  // Форматируем число (+1, +1K, +1M)
  let displayText;
  if (amount >= 1000000) {
    displayText = '+' + Math.floor(amount / 1000000) + 'M';
  } else if (amount >= 1000) {
    displayText = '+' + Math.floor(amount / 1000) + 'K';
  } else {
    displayText = '+' + amount;
  }
  
  // Устанавливаем текст и позицию
  scoreNumber.textContent = displayText;
  scoreNumber.style.left = `${x}px`;
  scoreNumber.style.top = `${y}px`;
  
  // Добавляем эффект в DOM
  tapEffects.appendChild(scoreNumber);
  
  // Удаляем после анимации
  setTimeout(() => {
    if (scoreNumber.parentNode === tapEffects) {
      tapEffects.removeChild(scoreNumber);
    }
  }, 1200);
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
  const particleCount = 20;
  for (let i = 0; i < particleCount; i++) {
    // Создаем частицу
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Случайный цвет (красный или синий с градиентом)
    const isRed = Math.random() > 0.5;
    if (isRed) {
      particle.style.background = 'radial-gradient(circle, rgba(255, 59, 48, 0.8) 0%, rgba(255, 59, 48, 0) 70%)';
    } else {
      particle.style.background = 'radial-gradient(circle, rgba(10, 132, 255, 0.8) 0%, rgba(10, 132, 255, 0) 70%)';
    }
    
    // Размер частицы
    const size = Math.random() * 30 + 10; // От 10 до 40 пикселей
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Начальная позиция
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    // Случайное направление и расстояние
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 100 + 30;
    const translateX = Math.cos(angle) * distance;
    const translateY = Math.sin(angle) * distance;
    
    // Случайное вращение
    const rotation = Math.random() * 360;
    
    // Анимируем движение с вращением
    particle.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg)`;
    
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
  
  // Добавляем случайное небольшое вращение при нажатии
  const randomRotation = (Math.random() - 0.5) * 5; // Случайное вращение от -2.5 до 2.5 градусов
  kraken.style.transform += ` rotate(${randomRotation}deg)`;
  
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
  const distance = Math.random() * 60 + 20;
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

// Обновление счета
function updateScore() {
  const scoreElement = document.getElementById('score');
  if (scoreElement) {
    scoreElement.textContent = formatNumber(score);
    
    // Анимация увеличения счета
    scoreElement.classList.add('score-updated');
    setTimeout(() => {
      scoreElement.classList.remove('score-updated');
    }, 300);
  }
}

// Обновление энергии
function updateEnergy() {
  const energyBar = document.getElementById('energy-bar');
  const energyText = document.getElementById('energy-text');
  
  if (energyBar && energyText) {
    // Процент заполнения шкалы энергии
    const energyPercent = (energy / maxEnergy) * 100;
    energyBar.style.width = `${energyPercent}%`;
    
    // Отображаем текущее / максимальное количество энергии
    energyText.textContent = `${Math.floor(energy)}/${maxEnergy}`;
    
    // Изменяем цвет при низком уровне энергии
    if (energyPercent < 20) {
      energyBar.style.background = 'linear-gradient(90deg, #ff3b30, #ff9500)';
    } else {
      energyBar.style.background = 'linear-gradient(90deg, #18f2b2, #0bf)';
    }
  }
}

// Обновление статистики дохода
function updateIncomeStats() {
  const tapPowerElement = document.getElementById('tap-power');
  const tapMultiplierElement = document.getElementById('tap-multiplier');
  const incomePerSecElement = document.getElementById('income-per-sec');
  
  if (tapPowerElement && tapMultiplierElement && incomePerSecElement) {
    tapPowerElement.textContent = tapPower;
    tapMultiplierElement.textContent = tapMultiplier;
    incomePerSecElement.textContent = autoClicker;
  }
}

// Форматирование чисел для удобного отображения
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num;
  }
}

// =========================================================================
// Функции работы с заданиями
// =========================================================================

// Рендер списка заданий
function renderTasks() {
  const tasksList = document.getElementById('tasks-list');
  if (!tasksList) return;
  
  // Очищаем список
  tasksList.innerHTML = '';
  
  // Добавляем каждое задание
  tasks.forEach(task => {
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${task.completed ? 'task-completed' : ''}`;
    
    // Вычисляем прогресс
    const progress = Math.min(100, (task.current / task.target) * 100);
    
    // Формируем HTML для задания
    taskItem.innerHTML = `
      <div class="task-header">
        <div class="task-icon ${task.icon === 'puzzle-piece' ? 'puzzle' : (task.icon === 'store' ? 'store' : '')}">
          <i class="fas fa-${task.icon}"></i>
        </div>
        <div class="task-title">${task.title}</div>
        <div class="task-reward">
          <i class="fas fa-coins"></i>
          ${task.reward}
        </div>
        ${task.completed ? '<div class="task-completed-icon"><i class="fas fa-check-circle"></i></div>' : ''}
      </div>
      <div class="task-progress-container">
        <div class="task-progress-bar" style="width: ${progress}%"></div>
      </div>
      <div class="task-progress-text">
        <span>${task.current}/${task.target}</span>
        <span>${Math.floor(progress)}%</span>
      </div>
    `;
    
    tasksList.appendChild(taskItem);
  });
  
  // Обновляем индикатор задач
  const tasksCount = tasks.filter(task => !task.completed).length;
  const indicator = document.querySelector('#tasks-btn .indicator');
  if (indicator) {
    indicator.textContent = tasksCount;
    // Скрываем индикатор, если нет активных заданий
    indicator.style.display = tasksCount > 0 ? 'flex' : 'none';
  }
}

// =========================================================================
// Функции работы с друзьями и рейтингом
// =========================================================================

// Обновление счетчика друзей онлайн
function updateFriendsOnlineCount() {
  const onlineCount = friends.filter(f => f.online).length;
  document.getElementById('online-count').textContent = onlineCount;
  document.getElementById('friends-online-count').textContent = onlineCount;
}

// Рендер списка друзей
function renderFriendsList(filter = 'all') {
  const friendsList = document.getElementById('friends-list');
  if (!friendsList) return;
  
  // Очищаем список
  friendsList.innerHTML = '';
  
  // Фильтруем друзей в зависимости от выбранной вкладки
  let filteredFriends = friends;
  if (filter === 'online') {
    filteredFriends = friends.filter(f => f.online);
  } else if (filter === 'requests') {
    // Здесь можно добавить логику для запросов в друзья
    filteredFriends = [
      { id: 'request1', username: 'NewFriend1', level: 5, score: 2500, avatarColor: 'blue', isRequest: true },
      { id: 'request2', username: 'NewFriend2', level: 8, score: 4800, avatarColor: 'red', isRequest: true }
    ];
  }
  
  // Сортируем по статусу онлайн (сначала онлайн) и по уровню
  filteredFriends.sort((a, b) => {
    if (a.online !== b.online) return b.online ? 1 : -1;
    return b.level - a.level;
  });
  
  // Добавляем каждого друга
  filteredFriends.forEach(friend => {
    const friendItem = document.createElement('div');
    friendItem.className = 'friend-item';
    
    // Получаем первую букву имени для аватара
    const initial = friend.username.charAt(0).toUpperCase();
    
    // Формируем HTML для друга
    friendItem.innerHTML = `
      <div class="friend-avatar ${friend.avatarColor || 'blue'}">
        ${initial}
        ${friend.online ? '<div class="friend-online-indicator"></div>' : ''}
      </div>
      <div class="friend-info">
        <div class="friend-name">
          ${friend.username}
          <div class="friend-level">Lvl ${friend.level}</div>
        </div>
        <div class="friend-status">
          ${friend.online ? 'Онлайн' : 'Не в сети'}
        </div>
        <div class="friend-score">
          <i class="fas fa-coins"></i>
          ${formatNumber(friend.score)}
        </div>
      </div>
      ${friend.isRequest ? `
        <div class="friend-actions">
          <button class="friend-action-btn accept"><i class="fas fa-check"></i></button>
          <button class="friend-action-btn decline"><i class="fas fa-times"></i></button>
        </div>
      ` : `
        <div class="friend-actions">
          <button class="friend-action-btn gift"><i class="fas fa-gift"></i></button>
          <button class="friend-action-btn message"><i class="fas fa-comment"></i></button>
        </div>
      `}
    `;
    
    // Добавляем обработчики для кнопок
    friendsList.appendChild(friendItem);
    
    // Добавляем обработчики для кнопок действий после добавления в DOM
    if (friend.isRequest) {
      const acceptBtn = friendItem.querySelector('.accept');
      const declineBtn = friendItem.querySelector('.decline');
      
      if (acceptBtn) {
        acceptBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          showNotification('Запрос в друзья принят!', 'user-plus', 'success');
          friendItem.remove();
          // Обновляем счетчик запросов
          const badge = document.querySelector('.friends-tab[data-tab="requests"] .badge');
          if (badge) {
            const count = parseInt(badge.textContent) - 1;
            badge.textContent = count > 0 ? count : '';
          }
        });
      }
      
      if (declineBtn) {
        declineBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          showNotification('Запрос в друзья отклонен', 'user-times', 'warning');
          friendItem.remove();
          // Обновляем счетчик запросов
          const badge = document.querySelector('.friends-tab[data-tab="requests"] .badge');
          if (badge) {
            const count = parseInt(badge.textContent) - 1;
            badge.textContent = count > 0 ? count : '';
          }
        });
      }
    } else {
      const giftBtn = friendItem.querySelector('.gift');
      const messageBtn = friendItem.querySelector('.message');
      
      if (giftBtn) {
        giftBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          showNotification('Подарок отправлен!', 'gift', 'success');
        });
      }
      
      if (messageBtn) {
        messageBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          showNotification('Сообщение отправлено!', 'comment', 'success');
        });
      }
    }
  });
}

// Рендер списка лидеров
function renderLeaderboard(type = 'global') {
  const leaderboardList = document.getElementById('leaderboard-list');
  if (!leaderboardList) return;
  
  // Очищаем список
  leaderboardList.innerHTML = '';
  
  // Фильтруем данные в зависимости от типа
  let data = [];
  
  if (type === 'global') {
    data = leaderboard;
  } else if (type === 'friends') {
    data = friends.sort((a, b) => b.score - a.score);
  }
  // Можно добавить 'teams', если понадобится
  
  // Добавляем каждого игрока
  data.forEach((player, index) => {
    const playerItem = document.createElement('div');
    playerItem.className = 'leaderboard-item';
    
    // Получаем первую букву имени для аватара
    const initial = player.username.charAt(0).toUpperCase();
    
    // Формируем HTML для игрока
    playerItem.innerHTML = `
      <div class="leaderboard-rank ${index < 3 ? `rank-${index + 1}` : ''}">
        ${index + 1}
      </div>
      <div class="leaderboard-avatar ${player.avatarColor || 'blue'}">
        ${initial}
      </div>
      <div class="leaderboard-info">
        <div class="leaderboard-name">${player.username}</div>
        <div class="leaderboard-level">Уровень ${player.level}</div>
      </div>
      <div class="leaderboard-score">
        <i class="fas fa-coins"></i>
        ${formatNumber(player.score)}
      </div>
    `;
    
    leaderboardList.appendChild(playerItem);
  });
}

// =========================================================================
// Функции работы с модальными окнами
// =========================================================================

// Открытие модального окна
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    // Добавляем класс активности
    modal.classList.add('active');
    
    // Анимация появления
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.style.opacity = '1';
    }, 10);
  }
}

// Закрытие модального окна
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    // Анимация исчезновения
    modal.style.opacity = '0';
    
    setTimeout(() => {
      modal.style.display = 'none';
      modal.classList.remove('active');
    }, 300);
  }
}

// =========================================================================
// Элементы модального окна головоломки
// =========================================================================
let puzzleModal = document.getElementById("puzzle-modal");
let puzzleContainer = document.getElementById("puzzle-container");
let puzzleProgressBar = document.getElementById("puzzle-progress");
let puzzleRewardElement = document.getElementById("puzzle-reward");
let timerElement = document.getElementById("timer");

// Переменные для игры
let puzzleInterval; // Интервал для таймера головоломки
let puzzleCells = []; // Массив ячеек головоломки
let selectedCells = []; // Выбранные ячейки для обмена
let currentDifficulty = 'easy'; // Текущая сложность
let matchedCellsCount = 0; // Количество совпавших ячеек
let puzzleScore = 0; // Очки за головоломку
let comboMultiplier = 1; // Множитель комбо

// Настройки сложности
const difficultySettings = {
  'easy': {
    gridSize: 3,
    colors: ['#FF3B30', '#0A84FF', '#34C759'],
    timeLimit: 60,
    baseReward: 50
  },
  'medium': {
    gridSize: 4,
    colors: ['#FF3B30', '#0A84FF', '#34C759', '#FFCC00'],
    timeLimit: 90,
    baseReward: 100
  },
  'hard': {
    gridSize: 5,
    colors: ['#FF3B30', '#0A84FF', '#34C759', '#FFCC00', '#AF52DE'],
    timeLimit: 120,
    baseReward: 200
  }
};

// Открытие модального окна головоломки
function openPuzzle() {
  if (puzzleModal) {
    openModal('puzzle-modal');
    startPuzzle('easy'); // По умолчанию уровень easy
  }
}

// Закрытие головоломки
function closePuzzle() {
  closeModal('puzzle-modal');
  clearInterval(puzzleInterval);
}

// Запуск головоломки по выбранному уровню сложности
function startPuzzle(difficulty) {
  // Очистка предыдущего состояния
  clearInterval(puzzleInterval);
  puzzleContainer.innerHTML = "";
  selectedCells = [];
  matchedCellsCount = 0;
  puzzleScore = 0;
  comboMultiplier = 1;
  
  // Устанавливаем текущую сложность
  currentDifficulty = difficulty;
  const settings = difficultySettings[difficulty];
  
  // Устанавливаем награду
  puzzleRewardElement.textContent = settings.baseReward;
  
  // Установка размера сетки в зависимости от сложности
  puzzleContainer.style.gridTemplateColumns = `repeat(${settings.gridSize}, 1fr)`;
  
  // Создаем и перемешиваем массив ячеек
  puzzleCells = [];
  const totalCells = settings.gridSize * settings.gridSize;
  
  for (let i = 0; i < totalCells; i++) {
    const colorIndex = i % settings.colors.length;
    puzzleCells.push({
      id: i,
      color: settings.colors[colorIndex],
      value: i + 1
    });
  }
  
  // Перемешиваем массив (алгоритм Фишера-Йейтса)
  for (let i = puzzleCells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [puzzleCells[i], puzzleCells[j]] = [puzzleCells[j], puzzleCells[i]];
  }
  
  // Создаем ячейки в DOM
  puzzleCells.forEach(cell => {
    const cellElement = document.createElement("div");
    cellElement.className = "puzzle-cell";
    cellElement.textContent = cell.value;
    cellElement.dataset.id = cell.id;
    cellElement.style.backgroundColor = cell.color;
    
    // Эффект свечения при наведении
    cellElement.addEventListener("mouseenter", () => {
      cellElement.style.boxShadow = `0 0 15px ${cell.color}`;
    });
    
    cellElement.addEventListener("mouseleave", () => {
      cellElement.style.boxShadow = "";
    });
    
    // Обработчик клика для выбора ячеек
    cellElement.addEventListener("click", () => handleCellClick(cell, cellElement));
    
    puzzleContainer.appendChild(cellElement);
  });
  
  // Сбрасываем прогресс
  puzzleProgressBar.style.width = "0%";
  
  // Запускаем таймер
  startPuzzleTimer(settings.timeLimit);
}

// Функция обработки клика по ячейке
function handleCellClick(cell, cellElement) {
  // Если уже выбрано 2 ячейки, очищаем выбор
  if (selectedCells.length === 2) {
    selectedCells = [];
    document.querySelectorAll(".puzzle-cell").forEach(el => {
      el.style.transform = "scale(1)";
      el.style.boxShadow = "";
    });
  }
  
  // Если ячейка уже выбрана, снимаем выбор
  const selectedIndex = selectedCells.findIndex(c => c.id === cell.id);
  if (selectedIndex !== -1) {
    selectedCells.splice(selectedIndex, 1);
    cellElement.style.transform = "scale(1)";
    cellElement.style.boxShadow = "";
    return;
  }
  
  // Добавляем ячейку к выбранным
  selectedCells.push({
    cell: cell,
    element: cellElement
  });
  
  // Визуальный эффект выбора
  cellElement.style.transform = "scale(1.1)";
  cellElement.style.boxShadow = `0 0 20px ${cell.color}`;
  
  // Если выбрано 2 ячейки, меняем их местами
  if (selectedCells.length === 2) {
    swapCells();
  }
}

// Функция обмена ячеек местами
function swapCells() {
  const first = selectedCells[0];
  const second = selectedCells[1];
  
  // Анимируем обмен
  first.element.style.transform = "scale(0.8)";
  second.element.style.transform = "scale(0.8)";
  
  setTimeout(() => {
    // Меняем цвета и значения
    const tempColor = first.element.style.backgroundColor;
    const tempValue = first.element.textContent;
    
    first.element.style.backgroundColor = second.element.style.backgroundColor;
    first.element.textContent = second.element.textContent;
    
    second.element.style.backgroundColor = tempColor;
    second.element.textContent = tempValue;
    
    first.element.style.transform = "scale(1)";
    second.element.style.transform = "scale(1)";
    
    // Убираем подсветку
    first.element.style.boxShadow = "";
    second.element.style.boxShadow = "";
    
    // Проверяем совпадения
    checkMatches();
    
    // Очищаем выбор
    selectedCells = [];
  }, 300);
}

// Проверка совпадений после обмена
function checkMatches() {
  const settings = difficultySettings[currentDifficulty];
  const gridSize = settings.gridSize;
  const cells = document.querySelectorAll(".puzzle-cell");
  let hasMatches = false;
  
  // Временная сетка для удобства проверки
  const grid = [];
  for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
      const index = i * gridSize + j;
      grid[i][j] = {
        color: cells[index].style.backgroundColor,
        element: cells[index]
      };
    }
  }
  
  // Проверка горизонтальных линий
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize - 2; j++) {
      if (grid[i][j].color === grid[i][j+1].color && grid[i][j].color === grid[i][j+2].color) {
        hasMatches = true;
        for (let k = j; k < j + 3; k++) {
          if (!grid[i][k].element.classList.contains("matched")) {
            grid[i][k].element.classList.add("matched");
            matchedCellsCount++;
            
            // Анимация для совпавших ячеек
            animateMatchedCell(grid[i][k].element);
          }
        }
      }
    }
  }
  
  // Проверка вертикальных линий
  for (let j = 0; j < gridSize; j++) {
    for (let i = 0; i < gridSize - 2; i++) {
      if (grid[i][j].color === grid[i+1][j].color && grid[i][j].color === grid[i+2][j].color) {
        hasMatches = true;
        for (let k = i; k < i + 3; k++) {
          if (!grid[k][j].element.classList.contains("matched")) {
            grid[k][j].element.classList.add("matched");
            matchedCellsCount++;
            
            // Анимация для совпавших ячеек
            animateMatchedCell(grid[k][j].element);
          }
        }
      }
    }
  }
  
  // Если есть совпадения, обновляем счет и прогресс
  if (hasMatches) {
    // Увеличиваем множитель комбо
    comboMultiplier += 0.2;
    
    // Добавляем очки
    const matchPoints = 5 * comboMultiplier;
    puzzleScore += matchPoints;
    
    // Показываем уведомление о комбо
    if (comboMultiplier > 1) {
      showNotification(`Комбо x${comboMultiplier.toFixed(1)}! +${matchPoints.toFixed(0)} очков`, "trophy", "success");
    }
    
    // Обновляем прогресс
    const totalCells = gridSize * gridSize;
    const progress = (matchedCellsCount / totalCells) * 100;
    puzzleProgressBar.style.width = `${Math.min(100, progress)}%`;
    
    // Если прогресс достиг 100%, завершаем головоломку
    if (progress >= 100) {
      puzzleCompleted();
    }
    
    // Если нет совпадений, сбрасываем множитель комбо
  } else {
    comboMultiplier = 1;
  }
}

// Анимация для совпавших ячеек
function animateMatchedCell(cellElement) {
  // Создаем эффект вспышки
  cellElement.style.animation = "none";
  cellElement.offsetHeight; // Trick to restart animation
  cellElement.style.animation = "pulse 0.5s ease-in-out";
  
  // Добавляем эффект свечения
  const color = cellElement.style.backgroundColor;
  cellElement.style.boxShadow = `0 0 20px ${color}`;
  
  // Уменьшаем непрозрачность со временем
  setTimeout(() => {
    cellElement.style.opacity = "0.7";
  }, 300);
}

// Таймер головоломки
function startPuzzleTimer(timeLimit) {
  let timeLeft = timeLimit;
  timerElement.innerText = timeLeft;
  
  clearInterval(puzzleInterval);
  
  puzzleInterval = setInterval(() => {
    timeLeft--;
    timerElement.innerText = timeLeft;
    
    // Изменение цвета таймера при истечении времени
    if (timeLeft <= 10) {
      timerElement.style.color = "#FF3B30";
    } else {
      timerElement.style.color = "";
    }
    
    if (timeLeft <= 0) {
      clearInterval(puzzleInterval);
      // Проверяем, прошли ли головоломку частично
      const settings = difficultySettings[currentDifficulty];
      const totalCells = settings.gridSize * settings.gridSize;
      const progress = (matchedCellsCount / totalCells) * 100;
      
      if (progress > 0) {
        const partialReward = Math.floor((settings.baseReward * progress) / 100);
        score += partialReward;
        updateScore();
        showNotification(`Время вышло! Получено ${partialReward} очков за ${Math.floor(progress)}% прогресса`, "hourglass-end", "warning");
      } else {
        showNotification("Время вышло! Попробуйте еще раз", "hourglass-end", "error");
      }
      
      // Закрываем головоломку
      setTimeout(() => {
        closePuzzle();
      }, 2000);
    }
  }, 1000);
}

// Завершение головоломки
function puzzleCompleted() {
  clearInterval(puzzleInterval);
  
  const settings = difficultySettings[currentDifficulty];
  const finalReward = Math.floor(settings.baseReward + puzzleScore);
  
  score += finalReward;
  updateScore();
  
  showNotification(`Головоломка пройдена! +${finalReward} очков`, "puzzle-piece", "success");
  
  // Обновляем задание для головоломок
  const puzzleTask = tasks.find(task => task.id === 'task2' && !task.completed);
  if (puzzleTask) {
    puzzleTask.current += 1;
    if (puzzleTask.current >= puzzleTask.target) {
      puzzleTask.completed = true;
      score += puzzleTask.reward;
      setTimeout(() => {
        showNotification(`Задание выполнено! +${puzzleTask.reward} очков`, "check", "success");
      }, 1000);
    }
    renderTasks();
  }
  
  // Закрываем головоломку через некоторое время
  setTimeout(() => {
    closePuzzle();
  }, 2000);
}

// =========================================================================
// Утилиты
// =========================================================================

// Показать уведомление
function showNotification(message, icon = "info-circle", type = "") {
  const container = document.getElementById('notifications-container');
  if (!container) return;
  
  // Создаем уведомление
  const notification = document.createElement('div');
  notification.className = 'notification';
  
  // Выбираем класс в зависимости от типа
  let iconClass = '';
  if (type === 'success') iconClass = 'success';
  else if (type === 'error') iconClass = 'error';
  else if (type === 'warning') iconClass = 'warning';
  
  // Формируем HTML для уведомления
  notification.innerHTML = `
    <div class="notification-icon ${iconClass}">
      <i class="fas fa-${icon}"></i>
    </div>
    <div class="notification-content">
      <div class="notification-message">${message}</div>
    </div>
  `;
  
  // Добавляем в контейнер
  container.appendChild(notification);
  
  // Удаляем через 3 секунды
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Загрузка и сохранение игровых данных
function loadGameData() {
  // Пытаемся загрузить данные из localStorage
  const savedData = localStorage.getItem('tapKrakenData');
  if (savedData) {
    try {
      const data = JSON.parse(savedData);
      
      // Загружаем основные параметры
      score = data.score || 0;
      energy = data.energy || 500;
      maxEnergy = data.maxEnergy || 500;
      tapPower = data.tapPower || 1;
      tapMultiplier = data.tapMultiplier || 1;
      energyRegen = data.energyRegen || 1;
      autoClicker = data.autoClicker || 0;
      hasPremium = data.hasPremium || false;
      
      // Загружаем задания
      if (data.tasks) {
        tasks = data.tasks;
      }
      
    } catch (error) {
      console.error('Error loading game data:', error);
    }
  }
}

function saveGameData() {
  // Собираем данные для сохранения
  const data = {
    score,
    energy,
    maxEnergy,
    tapPower,
    tapMultiplier,
    energyRegen,
    autoClicker,
    hasPremium,
    tasks
  };
  
  // Сохраняем в localStorage
  try {
    localStorage.setItem('tapKrakenData', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving game data:', error);
  }
}
