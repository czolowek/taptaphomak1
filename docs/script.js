// =========================================================================
// Глобальные переменные
// =========================================================================
let gameData = {
    score: 0,
    energy: 500,
    maxEnergy: 500,
    tapPower: 1,
    tapMultiplier: 1,
    energyRegen: 1,
    autoClicker: 0,
    hasPremium: false,
    totalTaps: 0,
    puzzlesCompleted: 0,
    upgradesPurchased: 0,
    lastSaveTime: Date.now(),
    lastEnergyUpdate: Date.now()
};

let boosterTimers = {
    double: null,
    energy: null
};

// Задания
let tasks = [
    {
        id: 'task1',
        title: 'Сделай 100 тапов',
        icon: 'hand-pointer',
        current: 0,
        target: 100,
        reward: 25,
        completed: false,
        type: 'taps'
    },
    {
        id: 'task2',
        title: 'Пройди 3 головоломки',
        icon: 'puzzle-piece',
        current: 0,
        target: 3,
        reward: 50,
        completed: false,
        type: 'puzzles'
    },
    {
        id: 'task3',
        title: 'Купи 1 улучшение',
        icon: 'store',
        current: 0,
        target: 1,
        reward: 30,
        completed: false,
        type: 'upgrades'
    },
    {
        id: 'task4',
        title: 'Заработай 1000 монет',
        icon: 'coins',
        current: 0,
        target: 1000,
        reward: 100,
        completed: false,
        type: 'score'
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
    }
];

// =========================================================================
// Инициализация игры
// =========================================================================
document.addEventListener('DOMContentLoaded', function() {
    checkDeviceType();
    initializeGame();
});

function checkDeviceType() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile) {
        document.getElementById('device-check').style.display = 'flex';
        document.getElementById('loading-screen').style.display = 'none';
        return;
    }
    
    startLoadingSequence();
}

function startLoadingSequence() {
    const startTime = Date.now();
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
    
    const minLoadTime = 3000;
    
    setTimeout(() => {
        const elapsed = Date.now() - startTime;
        const delay = Math.max(0, minLoadTime - elapsed);
        
        setTimeout(() => {
            document.getElementById('loading-screen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loading-screen').style.display = 'none';
                document.getElementById('main-content').style.display = 'flex';
                setTimeout(() => {
                    document.getElementById('main-content').classList.add('active');
                }, 50);
            }, 500);
            
            initUI();
            startGameIntervals();
        }, delay);
    }, 1000);
}

function initializeGame() {
    loadGameData();
    initBackgroundBubbles();
    setupEventListeners();
}

function setupEventListeners() {
    // Обработчик тапов по кракену
    const kraken = document.getElementById('kraken');
    if (kraken) {
        kraken.addEventListener('click', handleKrakenTap);
        kraken.addEventListener('touchstart', handleKrakenTap, { passive: false });
    }
    
    // Навигационные кнопки
    setupNavigationButtons();
    
    // Модальные окна
    setupModalEventListeners();
}

function setupNavigationButtons() {
    // Главная
    const mainBtn = document.getElementById('main-btn');
    if (mainBtn) {
        mainBtn.addEventListener('click', function() {
            setActiveNavButton(this);
            closeAllModals();
        });
    }
    
    // Задания
    const tasksBtn = document.getElementById('tasks-btn');
    if (tasksBtn) {
        tasksBtn.addEventListener('click', function() {
            setActiveNavButton(this);
            openModal('tasks-modal');
            renderTasks();
        });
    }
    
    // Друзья
    const friendsBtn = document.getElementById('friends-btn');
    if (friendsBtn) {
        friendsBtn.addEventListener('click', function() {
            setActiveNavButton(this);
            openModal('friends-modal');
            updateFriendsOnlineCount();
            renderFriendsList();
        });
    }
    
    // Рейтинг
    const leaderboardBtn = document.getElementById('leaderboard-btn');
    if (leaderboardBtn) {
        leaderboardBtn.addEventListener('click', function() {
            setActiveNavButton(this);
            openModal('leaderboard-modal');
            renderLeaderboard();
        });
    }
    
    // Головоломки
    const puzzleBtn = document.getElementById('puzzle-btn');
    if (puzzleBtn) {
        puzzleBtn.addEventListener('click', function() {
            setActiveNavButton(this);
            openPuzzle();
        });
    }
}

function setActiveNavButton(activeButton) {
    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.classList.remove('active');
    });
    activeButton.classList.add('active');
}

function setupModalEventListeners() {
    // Закрытие модальных окон
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
                // Возвращаем активность на главную кнопку
                setActiveNavButton(document.getElementById('main-btn'));
            }
        });
    });
    
    // Вкладки рейтинга
    document.querySelectorAll('.leaderboard-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.leaderboard-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const tabType = this.getAttribute('data-tab');
            renderLeaderboard(tabType);
        });
    });
    
    // Вкладки друзей
    document.querySelectorAll('.friends-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.friends-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const tabType = this.getAttribute('data-tab');
            renderFriendsList(tabType);
        });
    });
}

// =========================================================================
// Тапы и геймплей
// =========================================================================
function handleKrakenTap(event) {
    event.preventDefault();
    
    if (gameData.energy <= 0) {
        showNotification('Недостаточно энергии!', 'error');
        return;
    }
    
    // Уменьшаем энергию
    gameData.energy = Math.max(0, gameData.energy - 1);
    
    // Добавляем очки
    const earnedPoints = gameData.tapPower * gameData.tapMultiplier;
    gameData.score += earnedPoints;
    gameData.totalTaps++;
    
    // Обновляем прогресс заданий
    updateTaskProgress('taps', 1);
    updateTaskProgress('score', earnedPoints);
    
    // Визуальные эффекты
    animateKraken();
    createTapEffect(event);
    updateUI();
    
    // Тактильная отдача
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
    
    saveGameData();
}

function animateKraken() {
    const kraken = document.getElementById('kraken');
    if (kraken) {
        kraken.classList.add('tapped');
        
        setTimeout(() => {
            kraken.classList.remove('tapped');
        }, 150);
    }
}

function createTapEffect(event) {
    const container = document.getElementById('tap-effects');
    if (!container) return;
    
    const effect = document.createElement('div');
    effect.className = 'tap-effect';
    
    const earnedPoints = gameData.tapPower * gameData.tapMultiplier;
    effect.textContent = `+${earnedPoints}`;
    
    // Позиционируем эффект
    let x, y;
    if (event.touches && event.touches[0]) {
        x = event.touches[0].clientX;
        y = event.touches[0].clientY;
    } else {
        x = event.clientX;
        y = event.clientY;
    }
    
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    
    container.appendChild(effect);
    
    setTimeout(() => {
        if (effect.parentNode) {
            effect.remove();
        }
    }, 1000);
}

// =========================================================================
// Система энергии
// =========================================================================
function updateEnergy() {
    const now = Date.now();
    const timeDiff = now - gameData.lastEnergyUpdate;
    
    if (timeDiff >= 1000) { // Обновляем каждую секунду
        const secondsPassed = Math.floor(timeDiff / 1000);
        const energyToAdd = secondsPassed * gameData.energyRegen;
        
        gameData.energy = Math.min(gameData.maxEnergy, gameData.energy + energyToAdd);
        gameData.lastEnergyUpdate = now;
    }
    
    // Обновляем визуал
    const energyBar = document.getElementById('energy-bar');
    const energyText = document.getElementById('energy-text');
    
    if (energyBar && energyText) {
        const percentage = (gameData.energy / gameData.maxEnergy) * 100;
        energyBar.style.width = `${percentage}%`;
        energyText.textContent = `${Math.floor(gameData.energy)}/${gameData.maxEnergy}`;
        
        // Меняем цвет при низкой энергии
        if (percentage < 20) {
            energyBar.style.background = 'linear-gradient(90deg, #ff3b30, #ff6347)';
        } else {
            energyBar.style.background = 'linear-gradient(90deg, #18f2b2, #0bf)';
        }
    }
}

// =========================================================================
// Система заданий
// =========================================================================
function updateTaskProgress(type, amount) {
    tasks.forEach(task => {
        if (!task.completed && task.type === type) {
            task.current += amount;
            if (task.current >= task.target) {
                task.completed = true;
                gameData.score += task.reward;
                showNotification(`Задание выполнено! +${task.reward} монет`, 'success');
            }
        }
    });
}

function renderTasks() {
    const tasksList = document.getElementById('tasks-list');
    if (!tasksList) return;
    
    tasksList.innerHTML = '';
    
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        const progress = Math.min(100, (task.current / task.target) * 100);
        
        taskElement.innerHTML = `
            <div class="task-icon">
                <i class="fas fa-${task.icon}"></i>
            </div>
            <div class="task-content">
                <h3>${task.title}</h3>
                <div class="task-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <span class="progress-text">${task.current}/${task.target}</span>
                </div>
            </div>
            <div class="task-reward">
                <i class="fas fa-coins"></i>
                <span>${task.reward}</span>
            </div>
            ${task.completed ? '<div class="task-check"><i class="fas fa-check"></i></div>' : ''}
        `;
        
        tasksList.appendChild(taskElement);
    });
}

// =========================================================================
// Система друзей
// =========================================================================
function renderFriendsList(filter = 'all') {
    const friendsList = document.getElementById('friends-list');
    if (!friendsList) return;
    
    let filteredFriends = friends;
    
    if (filter === 'online') {
        filteredFriends = friends.filter(friend => friend.online);
    }
    
    friendsList.innerHTML = '';
    
    if (filteredFriends.length === 0) {
        friendsList.innerHTML = '<div class="empty-state">Нет друзей в этой категории</div>';
        return;
    }
    
    filteredFriends.forEach(friend => {
        const friendElement = document.createElement('div');
        friendElement.className = 'friend-item';
        
        friendElement.innerHTML = `
            <div class="friend-avatar ${friend.avatarColor}">
                <i class="fas fa-user"></i>
                ${friend.online ? '<div class="online-indicator"></div>' : ''}
            </div>
            <div class="friend-info">
                <h3>${friend.username}</h3>
                <div class="friend-stats">
                    <span class="level">Ур. ${friend.level}</span>
                    <span class="score">${formatNumber(friend.score)} монет</span>
                </div>
            </div>
            <div class="friend-actions">
                <button class="friend-action-btn">
                    <i class="fas fa-gift"></i>
                </button>
            </div>
        `;
        
        friendsList.appendChild(friendElement);
    });
}

function updateFriendsOnlineCount() {
    const onlineFriends = friends.filter(friend => friend.online).length;
    const badge = document.getElementById('friends-online-badge');
    if (badge) {
        badge.textContent = onlineFriends;
        badge.style.display = onlineFriends > 0 ? 'block' : 'none';
    }
}

// =========================================================================
// Система рейтинга
// =========================================================================
function renderLeaderboard(type = 'global') {
    const leaderboardList = document.getElementById('leaderboard-list');
    if (!leaderboardList) return;
    
    let data = [];
    
    switch (type) {
        case 'friends':
            data = [...friends].sort((a, b) => b.score - a.score);
            break;
        case 'teams':
            data = []; // Заглушка для команд
            break;
        default:
            data = [...leaderboard].sort((a, b) => b.score - a.score);
    }
    
    leaderboardList.innerHTML = '';
    
    if (data.length === 0) {
        leaderboardList.innerHTML = '<div class="empty-state">Нет данных для отображения</div>';
        return;
    }
    
    data.forEach((player, index) => {
        const playerElement = document.createElement('div');
        playerElement.className = 'leaderboard-item';
        
        let rankIcon = '';
        if (index === 0) rankIcon = '<i class="fas fa-crown gold"></i>';
        else if (index === 1) rankIcon = '<i class="fas fa-medal silver"></i>';
        else if (index === 2) rankIcon = '<i class="fas fa-medal bronze"></i>';
        
        playerElement.innerHTML = `
            <div class="rank">
                ${rankIcon || `#${index + 1}`}
            </div>
            <div class="player-avatar ${player.avatarColor || 'blue'}">
                <i class="fas fa-user"></i>
            </div>
            <div class="player-info">
                <h3>${player.username}</h3>
                <div class="player-stats">
                    ${player.level ? `<span class="level">Ур. ${player.level}</span>` : ''}
                    <span class="score">${formatNumber(player.score)} монет</span>
                </div>
            </div>
        `;
        
        leaderboardList.appendChild(playerElement);
    });
}

// =========================================================================
// Фоновые пузырьки
// =========================================================================
function initBackgroundBubbles() {
    const container = document.querySelector('.bubble-container');
    if (!container) return;
    
    setInterval(() => {
        createBubble(container);
    }, 3000);
}

function createBubble(container) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // Случайный размер
    const size = Math.random() * 30 + 10;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    
    // Случайная позиция по X
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.bottom = '0px';
    
    container.appendChild(bubble);
    
    // Удаляем пузырек после анимации
    setTimeout(() => {
        if (bubble.parentNode) {
            bubble.remove();
        }
    }, 15000);
}

// =========================================================================
// UI и утилиты
// =========================================================================
function initUI() {
    updateUI();
    updateEnergy();
    updateFriendsOnlineCount();
}

function updateUI() {
    updateScore();
    updateIncomeStats();
}

function updateScore() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = formatNumber(gameData.score);
        scoreElement.classList.add('score-updated');
        setTimeout(() => {
            scoreElement.classList.remove('score-updated');
        }, 300);
    }
}

function updateIncomeStats() {
    const tapPowerElement = document.getElementById('tap-power');
    const tapMultiplierElement = document.getElementById('tap-multiplier');
    const incomeElement = document.getElementById('income-per-second');
    
    if (tapPowerElement) {
        tapPowerElement.textContent = gameData.tapPower;
    }
    
    if (tapMultiplierElement) {
        tapMultiplierElement.textContent = gameData.tapMultiplier;
    }
    
    if (incomeElement) {
        incomeElement.textContent = gameData.autoClicker;
    }
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notifications-container') || createNotificationContainer();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    // Автоматически удаляем уведомление
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 3000);
}

function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notifications-container';
    document.body.appendChild(container);
    return container;
}

function openModal(modalId) {
    closeAllModals();
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
        modal.classList.remove('active');
    });
}

// =========================================================================
// Сохранение и загрузка данных
// =========================================================================
function saveGameData() {
    try {
        localStorage.setItem('tapkraken_game_data', JSON.stringify(gameData));
        localStorage.setItem('tapkraken_tasks', JSON.stringify(tasks));
    } catch (e) {
        console.warn('Не удалось сохранить данные игры');
    }
}

function loadGameData() {
    try {
        const savedData = localStorage.getItem('tapkraken_game_data');
        const savedTasks = localStorage.getItem('tapkraken_tasks');
        
        if (savedData) {
            const data = JSON.parse(savedData);
            gameData = { ...gameData, ...data };
        }
        
        if (savedTasks) {
            const tasksData = JSON.parse(savedTasks);
            tasks = tasksData;
        }
    } catch (e) {
        console.warn('Не удалось загрузить сохраненные данные');
    }
}

// =========================================================================
// Игровые интервалы
// =========================================================================
function startGameIntervals() {
    // Обновление энергии каждую секунду
    setInterval(updateEnergy, 1000);
    
    // Автосохранение каждые 30 секунд
    setInterval(saveGameData, 30000);
    
    // Автокликер (если есть)
    setInterval(() => {
        if (gameData.autoClicker > 0) {
            gameData.score += gameData.autoClicker;
            updateUI();
        }
    }, 1000);
}