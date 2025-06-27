// Элементы модального окна головоломки
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

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  // Добавляем обработчик для кнопки открытия головоломки
  const openPuzzleBtn = document.getElementById("open-puzzle-btn");
  if (openPuzzleBtn) {
    openPuzzleBtn.addEventListener("click", openPuzzle);
  }
  
  // Находим элементы модального окна
  puzzleModal = document.getElementById("puzzle-modal");
  puzzleContainer = document.getElementById("puzzle-container");
  puzzleProgressBar = document.getElementById("puzzle-progress");
  puzzleRewardElement = document.getElementById("puzzle-reward");
  timerElement = document.getElementById("timer");
  
  // Добавляем обработчики для кнопок сложности
  const difficultyBtns = document.querySelectorAll(".difficulty-btn");
  difficultyBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      // Убираем активный класс со всех кнопок
      difficultyBtns.forEach(b => b.classList.remove("active"));
      // Добавляем активный класс на нажатую кнопку
      this.classList.add("active");
      // Запускаем головоломку с новой сложностью
      startPuzzle(this.textContent.toLowerCase());
    });
  });
});

// Открытие модального окна головоломки
function openPuzzle() {
  if (puzzleModal) {
    puzzleModal.style.display = "flex";
    startPuzzle('easy'); // По умолчанию уровень easy
    
    // Анимация появления
    setTimeout(() => {
      puzzleModal.style.opacity = "1";
    }, 10);
  }
}

// Закрытие головоломки
function closePuzzle() {
  if (puzzleModal) {
    puzzleModal.style.opacity = "0";
    
    setTimeout(() => {
      puzzleModal.style.display = "none";
      clearInterval(puzzleInterval);
    }, 300);
  }
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
      showNotification(`Комбо x${comboMultiplier.toFixed(1)}! +${matchPoints.toFixed(0)} очков`, "trophy");
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
      const gridSize = settings.gridSize;
      const totalCells = gridSize * gridSize;
      const progress = (matchedCellsCount / totalCells) * 100;
      
      if (progress >= 50) {
        // Если прогресс более 50%, даем частичную награду
        const partialReward = Math.floor(settings.baseReward * (progress / 100));
        puzzleProgressBar.style.width = `${progress}%`;
        
        showNotification(`Время вышло! Вы получаете ${partialReward} очков за частичное прохождение`, "hourglass");
        
        // Вызываем completeTask с частичной наградой
        if (typeof completePuzzle === "function") {
          completePuzzle(currentDifficulty, partialReward);
        }
        
        // Добавляем очки
        if (typeof updateScore === "function") {
          updateScore(partialReward);
        } else {
          // Резервный вариант, если функция updateScore не определена
          score += partialReward;
          document.getElementById("score").textContent = score;
        }
        
        setTimeout(() => {
          closePuzzle();
        }, 2000);
      } else {
        showNotification("Время вышло! Попробуйте еще раз", "times");
        setTimeout(() => {
          startPuzzle(currentDifficulty);
        }, 1500);
      }
    }
  }, 1000);
}

// Функция завершения головоломки
function puzzleCompleted() {
  clearInterval(puzzleInterval);
  
  // Получаем награду на основе сложности и заработанных очков
  const settings = difficultySettings[currentDifficulty];
  const finalReward = settings.baseReward + puzzleScore;
  
  // Показываем уведомление о победе
  showNotification(`Головоломка пройдена! +${finalReward} очков`, "trophy");
  
  // Добавляем награду в игру
  if (typeof completePuzzle === "function") {
    completePuzzle(currentDifficulty, finalReward);
  }
  
  // Добавляем очки
  if (typeof updateScore === "function") {
    updateScore(finalReward);
  } else {
    // Резервный вариант, если функция updateScore не определена
    score += finalReward;
    document.getElementById("score").textContent = score;
  }
  
  // Закрываем головоломку через некоторое время
  setTimeout(() => {
    closePuzzle();
  }, 2000);
}

// Функция отображения уведомления
function showNotification(message, icon) {
  const notificationContainer = document.getElementById("notification-container");
  
  if (!notificationContainer) return;
  
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
  
  notificationContainer.appendChild(notification);
  
  // Удаляем уведомление через 3 секунды
  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}