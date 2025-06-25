// =========================================================================
// Город - функции и механики (УЛУЧШЕННАЯ ВЕРСИЯ)
// =========================================================================

/**
 * Модуль для управления функциональностью города в игре TapKraken
 * 
 * В городе игрок может:
 * - Строить и улучшать здания
 * - Наблюдать визуальную прогрессию зданий от простых до продвинутых
 * - Получать пассивный доход от построек
 * - Выполнять городские задания
 * - Участвовать в городских событиях
 */

// Типы зданий, доступные для постройки
const BUILDING_TYPES = {
  HOUSE: 'house', // Новое базовое здание - дом
  FARM: 'farm',
  MINE: 'mine',
  FACTORY: 'factory',
  RESEARCH: 'research',
  BANK: 'bank',
  POWER: 'power'
};

// Базовые параметры зданий
const BUILDINGS_CONFIG = {
  [BUILDING_TYPES.HOUSE]: {
    name: 'Жилой дом',
    icon: 'home',
    basePrice: 100,
    priceGrowth: 1.4,
    baseIncome: 1,
    incomeGrowth: 1.15,
    description: 'Жилище для жителей города Кракена',
    buildingStages: [
      { level: 1, description: 'Маленькая хижина с трещинами и ветхой крышей' },
      { level: 3, description: 'Деревянный домик с одной комнатой и дымоходом' },
      { level: 5, description: 'Кирпичный дом с черепичной крышей и небольшим садом' },
      { level: 7, description: 'Красивый двухэтажный особняк с балконами и террасой' },
      { level: 10, description: 'Роскошная вилла с бассейном, садом и стеклянными стенами' }
    ]
  },
  [BUILDING_TYPES.FARM]: {
    name: 'Ферма водорослей',
    icon: 'leaf',
    basePrice: 500,
    priceGrowth: 1.5,
    baseIncome: 5,
    incomeGrowth: 1.2,
    description: 'Выращивает питательные водоросли для кракена',
    buildingStages: [
      { level: 1, description: 'Простой пруд с несколькими растениями водорослей' },
      { level: 3, description: 'Открытые бассейны с системой фильтрации воды' },
      { level: 5, description: 'Автоматизированная ферма с теплицами для водорослей' },
      { level: 7, description: 'Комплекс с разными видами водорослей и системой орошения' },
      { level: 10, description: 'Высокотехнологичная биоферма с генетически улучшенными водорослями' }
    ]
  },
  [BUILDING_TYPES.MINE]: {
    name: 'Подводная шахта',
    icon: 'gem',
    basePrice: 3000,
    priceGrowth: 1.6,
    baseIncome: 20,
    incomeGrowth: 1.3,
    description: 'Добывает редкие минералы со дна океана',
    buildingStages: [
      { level: 1, description: 'Ветхая шахта с ручными инструментами и примитивной вентиляцией' },
      { level: 3, description: 'Улучшенная шахта с конвейерами и укрепленными стенами' },
      { level: 5, description: 'Современный комплекс с автоматическими буровыми машинами' },
      { level: 7, description: 'Продвинутая шахта с лазерными резаками и роботами-шахтерами' },
      { level: 10, description: 'Футуристичный комплекс с квантовыми экстракторами и телепортацией минералов' }
    ]
  },
  [BUILDING_TYPES.FACTORY]: {
    name: 'Фабрика амулетов',
    icon: 'industry',
    basePrice: 10000,
    priceGrowth: 1.7,
    baseIncome: 80,
    incomeGrowth: 1.4,
    description: 'Создает магические артефакты из морских сокровищ',
    buildingStages: [
      { level: 1, description: 'Старая мастерская с ручным производством амулетов' },
      { level: 3, description: 'Небольшая фабрика с первыми станками и плавильнями' },
      { level: 5, description: 'Полноценный завод с конвейерами и отделом контроля качества' },
      { level: 7, description: 'Современное предприятие с автоматизированным производством' },
      { level: 10, description: 'Волшебная фабрика с летающими инструментами и самонаводящимися материалами' }
    ]
  },
  [BUILDING_TYPES.RESEARCH]: {
    name: 'Исследовательский центр',
    icon: 'microscope',
    basePrice: 50000,
    priceGrowth: 1.8,
    baseIncome: 250,
    incomeGrowth: 1.5,
    description: 'Изучает древние мистические знания',
    buildingStages: [
      { level: 1, description: 'Библиотека с несколькими книгами и свитками' },
      { level: 3, description: 'Лаборатория с простым оборудованием и стеллажами артефактов' },
      { level: 5, description: 'Научный институт с отделами археологии и магических исследований' },
      { level: 7, description: 'Передовой комплекс с голографическими проекторами и порталами' },
      { level: 10, description: 'Межпространственная академия с доступом к альтернативным измерениям' }
    ]
  },
  [BUILDING_TYPES.BANK]: {
    name: 'Банк сокровищ',
    icon: 'landmark',
    basePrice: 250000,
    priceGrowth: 1.9,
    baseIncome: 1000,
    incomeGrowth: 1.6,
    description: 'Хранит и приумножает ваши богатства',
    buildingStages: [
      { level: 1, description: 'Деревянный сейф с простым замком и небольшим хранилищем' },
      { level: 3, description: 'Каменное здание с металлическими дверями и охраной' },
      { level: 5, description: 'Настоящий банк с хранилищем и системой учета сокровищ' },
      { level: 7, description: 'Крупный финансовый центр с подземными хранилищами и магической защитой' },
      { level: 10, description: 'Легендарный банк с бесконечным хранилищем в другом измерении' }
    ]
  },
  [BUILDING_TYPES.POWER]: {
    name: 'Энергетический храм',
    icon: 'bolt',
    basePrice: 1000000,
    priceGrowth: 2.0,
    baseIncome: 5000,
    incomeGrowth: 1.7,
    description: 'Черпает энергию из глубин океана, увеличивая доход',
    buildingStages: [
      { level: 1, description: 'Маленький храм с одним энергетическим кристаллом' },
      { level: 3, description: 'Устойчивая конструкция с несколькими энергетическими каналами' },
      { level: 5, description: 'Величественный храм с куполами и энергетическими башнями' },
      { level: 7, description: 'Мистический комплекс с левитирующими частями и силовыми полями' },
      { level: 10, description: 'Космический энергетический нексус с порталами и энергетическими вихрями' }
    ]
  }
};

// Создаем объект для доступа к функциям города из других скриптов
window.city = {
  openCityTab: openCityTab,
  renderCity: renderCity
};

// Состояние города игрока
let cityState = {
  // Уровень города
  level: 1,
  
  // Опыт города
  experience: 0,
  
  // Требуемый опыт для повышения уровня
  nextLevelExp: 1000,
  
  // Множитель дохода от города
  incomeMultiplier: 1,
  
  // Здания игрока по типам (ключ - тип, значение - объект здания)
  buildings: {},
  
  // История улучшений
  upgradeHistory: [],
  
  // Текущие городские задания
  currentTasks: [],
  
  // Время последнего сбора ресурсов
  lastCollected: Date.now(),
  
  // Накопленный, но не собранный доход
  unclaimedIncome: 0
};

// Инициализация зданий при первом запуске
function initializeBuildings() {
  // Проверяем, есть ли уже здания в cityState
  if (Object.keys(cityState.buildings).length === 0) {
    // Создаем начальные здания (все типы, но уровень 0)
    for (const type in BUILDING_TYPES) {
      const buildingType = BUILDING_TYPES[type];
      
      // Определяем, какое здание должно быть сразу разблокировано
      const isStartingBuilding = buildingType === BUILDING_TYPES.HOUSE;
      
      cityState.buildings[buildingType] = {
        type: buildingType,
        level: isStartingBuilding ? 1 : 0, // Дом уже построен (уровень 1)
        unlocked: isStartingBuilding, // Изначально доступен только дом
        income: isStartingBuilding ? BUILDINGS_CONFIG[buildingType].baseIncome : 0,
        lastCollected: Date.now(),
        // Добавляем текущую визуальную стадию здания (для анимации улучшений)
        visualStage: isStartingBuilding ? 1 : 0
      };
    }
  }
  
  // Рассчитываем накопленный доход для всех зданий
  calculateUnclaimedIncome();
}

// Расчет стоимости улучшения здания
function getBuildingUpgradePrice(buildingType, currentLevel) {
  const config = BUILDINGS_CONFIG[buildingType];
  // Для новых построек (level = 0) цена равна базовой
  if (currentLevel === 0) {
    return config.basePrice;
  }
  // Для существующих построек цена растет в геометрической прогрессии
  return Math.floor(config.basePrice * Math.pow(config.priceGrowth, currentLevel));
}

// Расчет дохода от здания
function getBuildingIncome(buildingType, level) {
  if (level === 0) return 0;
  
  const config = BUILDINGS_CONFIG[buildingType];
  // Базовый доход с учетом уровня
  const baseIncome = Math.floor(config.baseIncome * Math.pow(config.incomeGrowth, level - 1));
  
  // Применяем множитель дохода города
  return Math.floor(baseIncome * cityState.incomeMultiplier);
}

// Проверка, доступно ли здание для покупки
function isBuildingAvailable(buildingType) {
  // Дом доступен всегда
  if (buildingType === BUILDING_TYPES.HOUSE) {
    return true;
  }
  
  // Для других зданий проверяем требования
  const cityLevel = cityState.level;
  
  switch (buildingType) {
    case BUILDING_TYPES.FARM:
      return cityLevel >= 2;
    case BUILDING_TYPES.MINE:
      return cityLevel >= 3;
    case BUILDING_TYPES.FACTORY:
      return cityLevel >= 5;
    case BUILDING_TYPES.RESEARCH:
      return cityLevel >= 8;
    case BUILDING_TYPES.BANK:
      return cityLevel >= 12;
    case BUILDING_TYPES.POWER:
      return cityLevel >= 15;
    default:
      return false;
  }
}

// Получить требуемый уровень города для здания
function getBuildingRequiredLevel(buildingType) {
  switch (buildingType) {
    case BUILDING_TYPES.HOUSE:
      return 1; // Всегда доступен
    case BUILDING_TYPES.FARM:
      return 2;
    case BUILDING_TYPES.MINE:
      return 3;
    case BUILDING_TYPES.FACTORY:
      return 5;
    case BUILDING_TYPES.RESEARCH:
      return 8;
    case BUILDING_TYPES.BANK:
      return 12;
    case BUILDING_TYPES.POWER:
      return 15;
    default:
      return 999; // Недоступно
  }
}

// Определить текущую визуальную стадию здания по его уровню
function getBuildingVisualStage(buildingType, level) {
  if (level === 0) return 0;
  
  const config = BUILDINGS_CONFIG[buildingType];
  if (!config.buildingStages) return 1;
  
  // Ищем подходящую стадию по уровню
  for (let i = config.buildingStages.length - 1; i >= 0; i--) {
    if (level >= config.buildingStages[i].level) {
      return i + 1;
    }
  }
  
  return 1; // По умолчанию первая стадия
}

// Улучшение здания
function upgradeBuilding(buildingType) {
  const building = cityState.buildings[buildingType];
  
  // Проверяем, разблокировано ли здание
  if (!building.unlocked && !isBuildingAvailable(buildingType)) {
    console.log(`Здание ${BUILDINGS_CONFIG[buildingType].name} ещё не доступно`);
    showNotification(`Здание будет доступно на ${getBuildingRequiredLevel(buildingType)} уровне города`, "lock");
    return false;
  }
  
  // Максимальный уровень здания - 10
  if (building.level >= 10) {
    showNotification("Здание достигло максимального уровня!", "star");
    return false;
  }
  
  // Рассчитываем стоимость улучшения
  const upgradeCost = getBuildingUpgradePrice(buildingType, building.level);
  
  // Проверяем, достаточно ли монет
  if (score < upgradeCost) {
    console.log(`Недостаточно монет для улучшения ${BUILDINGS_CONFIG[buildingType].name}`);
    showNotification("Недостаточно монет для улучшения", "coins");
    return false;
  }
  
  // Запоминаем текущую визуальную стадию здания
  const oldVisualStage = building.visualStage;
  
  // Списываем стоимость улучшения
  score -= upgradeCost;
  updateScore();
  
  // Повышаем уровень здания
  building.level += 1;
  
  // Если это первый уровень, то помечаем здание как разблокированное
  if (building.level === 1) {
    building.unlocked = true;
  }
  
  // Обновляем доход от здания
  building.income = getBuildingIncome(buildingType, building.level);
  
  // Определяем новую визуальную стадию здания
  building.visualStage = getBuildingVisualStage(buildingType, building.level);
  
  // Добавляем запись в историю улучшений
  cityState.upgradeHistory.push({
    date: new Date().toISOString(),
    buildingType: buildingType,
    newLevel: building.level,
    cost: upgradeCost,
    visualStageChanged: oldVisualStage !== building.visualStage
  });
  
  // Добавляем опыт городу
  addCityExperience(Math.floor(upgradeCost / 10));
  
  // Сохраняем состояние города
  saveCityState();
  
  // Если изменилась визуальная стадия здания, показываем анимацию
  if (oldVisualStage !== building.visualStage) {
    // Запускаем анимацию улучшения здания
    playBuildingUpgradeAnimation(buildingType);
  }
  
  // Обновляем отображение города
  renderCity();
  
  console.log(`Здание ${BUILDINGS_CONFIG[buildingType].name} улучшено до уровня ${building.level}`);
  showNotification(`${BUILDINGS_CONFIG[buildingType].name} улучшено до уровня ${building.level}!`, "level-up");
  
  // Обновляем задание на покупку улучшений, если оно есть
  const upgradeTask = tasks.find(task => task.id === 'task3' && !task.completed);
  if (upgradeTask) {
    upgradeTask.current += 1;
    if (upgradeTask.current >= upgradeTask.target) {
      upgradeTask.completed = true;
      showNotification(`Задание выполнено! +${upgradeTask.reward} монет`, "check");
      score += upgradeTask.reward;
      updateScore();
    }
    renderTasks();
  }
  
  return true;
}

// Анимация улучшения здания
function playBuildingUpgradeAnimation(buildingType) {
  const building = cityState.buildings[buildingType];
  if (!building) return;
  
  // Находим элемент здания в DOM
  const buildingElem = document.querySelector(`.building-card[data-type="${buildingType}"]`);
  if (!buildingElem) return;
  
  // Добавляем класс для анимации
  buildingElem.classList.add('upgrading');
  
  // Создаем частицы для анимации
  for (let i = 0; i < 30; i++) {
    createUpgradeParticle(buildingElem);
  }
  
  // Показываем сообщение о новой визуальной стадии
  if (building.visualStage > 0) {
    const config = BUILDINGS_CONFIG[buildingType];
    const stageInfo = config.buildingStages[building.visualStage - 1];
    
    if (stageInfo) {
      const stageDescription = stageInfo.description;
      showNotification(`Новый внешний вид здания: ${stageDescription}`, "magic");
    }
  }
  
  // Через 2 секунды удаляем класс анимации
  setTimeout(() => {
    buildingElem.classList.remove('upgrading');
  }, 2000);
}

// Создать частицу для анимации улучшения
function createUpgradeParticle(buildingElem) {
  const particle = document.createElement('div');
  particle.className = 'upgrade-particle';
  
  // Случайный размер частицы
  const size = Math.random() * 10 + 5;
  particle.style.width = size + 'px';
  particle.style.height = size + 'px';
  
  // Случайный цвет (RGB-тема)
  const colors = ['#ff0033', '#0066ff', '#00ff66', '#ffcc00', '#00ccff', '#ff00cc'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  particle.style.backgroundColor = color;
  particle.style.boxShadow = `0 0 10px ${color}`;
  
  // Начальная позиция в центре элемента
  particle.style.left = '50%';
  particle.style.top = '50%';
  
  // Случайное направление движения
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * 100 + 50;
  const xSpeed = Math.cos(angle) * speed;
  const ySpeed = Math.sin(angle) * speed;
  
  // Добавляем частицу в элемент
  buildingElem.appendChild(particle);
  
  // Анимация движения и исчезновения
  setTimeout(() => {
    particle.style.transform = `translate(${xSpeed}px, ${ySpeed}px)`;
    particle.style.opacity = '0';
  }, 10);
  
  // Удаляем частицу после завершения анимации
  setTimeout(() => {
    particle.remove();
  }, 1500);
}

// Функция для сбора дохода со всех зданий
function collectAllIncome() {
  // Вычисляем несобранный доход
  calculateUnclaimedIncome();
  
  // Проверяем, есть ли несобранный доход
  if (cityState.unclaimedIncome <= 0) {
    showNotification("Нет дохода для сбора", "info");
    return false;
  }
  
  // Добавляем доход к счету
  score += cityState.unclaimedIncome;
  
  // Показываем анимацию сбора дохода
  animateCoinCollection(cityState.unclaimedIncome);
  
  // Обновляем счет
  updateScore();
  
  // Сбрасываем несобранный доход и обновляем время сбора
  const collectedAmount = cityState.unclaimedIncome;
  cityState.unclaimedIncome = 0;
  cityState.lastCollected = Date.now();
  
  // Показываем уведомление
  showNotification(`Собрано ${formatNumber(collectedAmount)} монет!`, "coins");
  
  // Сохраняем состояние
  saveCityState();
  
  // Обновляем отображение города
  renderCity();
  
  return true;
}

// Анимация сбора монет
function animateCoinCollection(amount) {
  // Находим элемент счета для анимации
  const scoreElement = document.getElementById('score');
  if (!scoreElement) return;
  
  // Создаем контейнер для анимации, если его еще нет
  let coinContainer = document.getElementById('coin-animation-container');
  if (!coinContainer) {
    coinContainer = document.createElement('div');
    coinContainer.id = 'coin-animation-container';
    coinContainer.style.position = 'absolute';
    coinContainer.style.top = '0';
    coinContainer.style.left = '0';
    coinContainer.style.width = '100%';
    coinContainer.style.height = '100%';
    coinContainer.style.pointerEvents = 'none';
    coinContainer.style.zIndex = '9999';
    document.body.appendChild(coinContainer);
  }
  
  // Получаем координаты кнопки сбора и счетчика монет
  const collectButton = document.querySelector('.collect-all-btn');
  if (!collectButton) return;
  
  const collectRect = collectButton.getBoundingClientRect();
  const scoreRect = scoreElement.getBoundingClientRect();
  
  // Создаем несколько летящих монет (количество зависит от суммы)
  const coinCount = Math.min(20, Math.max(5, Math.floor(amount / 100)));
  
  for (let i = 0; i < coinCount; i++) {
    // Создаем элемент монеты
    const coin = document.createElement('div');
    coin.className = 'flying-coin';
    
    // Стилизуем монету
    coin.style.position = 'absolute';
    coin.style.width = '20px';
    coin.style.height = '20px';
    coin.style.borderRadius = '50%';
    coin.style.background = 'radial-gradient(circle at 30% 30%, #ffec8b, #ffd700 30%, #b8860b)';
    coin.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.8)';
    coin.style.display = 'flex';
    coin.style.alignItems = 'center';
    coin.style.justifyContent = 'center';
    coin.style.fontSize = '12px';
    coin.style.fontWeight = 'bold';
    coin.style.color = '#734f19';
    coin.style.zIndex = '10000';
    coin.innerHTML = '$';
    
    // Случайная начальная позиция вокруг кнопки сбора
    const startX = collectRect.left + collectRect.width / 2 + (Math.random() - 0.5) * 40;
    const startY = collectRect.top + collectRect.height / 2 + (Math.random() - 0.5) * 40;
    
    coin.style.left = `${startX}px`;
    coin.style.top = `${startY}px`;
    
    // Добавляем монету в контейнер
    coinContainer.appendChild(coin);
    
    // Задержка перед началом анимации для каждой монеты
    const delay = Math.random() * 300;
    
    // Запускаем анимацию движения к счетчику
    setTimeout(() => {
      // Настраиваем переход
      coin.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
      
      // Конечная позиция (у счетчика монет)
      coin.style.left = `${scoreRect.left + scoreRect.width / 2}px`;
      coin.style.top = `${scoreRect.top + scoreRect.height / 2}px`;
      coin.style.opacity = '0.8';
      
      // Удаляем монету после завершения анимации
      setTimeout(() => {
        coin.style.opacity = '0';
        coin.style.transform = 'scale(0.5)';
        
        setTimeout(() => {
          coin.remove();
        }, 300);
      }, 700);
    }, delay);
  }
}

// Рассчитать несобранный доход
function calculateUnclaimedIncome() {
  const now = Date.now();
  const timeDiffSeconds = (now - cityState.lastCollected) / 1000;
  
  // Если прошло меньше секунды, не обновляем
  if (timeDiffSeconds < 1) return;
  
  // Рассчитываем доход от всех зданий за прошедшее время
  let totalIncomePerHour = getTotalCityIncomePerHour();
  
  // Переводим часовой доход в секундный и умножаем на прошедшие секунды
  const newIncome = Math.floor((totalIncomePerHour / 3600) * timeDiffSeconds);
  
  // Добавляем к уже накопленному доходу
  cityState.unclaimedIncome += newIncome;
  
  // Обновляем время последнего расчета
  cityState.lastCollected = now;
}

// Добавить опыт городу
function addCityExperience(amount) {
  cityState.experience += amount;
  
  // Проверяем, хватает ли опыта для следующего уровня
  while (cityState.experience >= cityState.nextLevelExp) {
    // Вычесть опыт для текущего уровня
    cityState.experience -= cityState.nextLevelExp;
    
    // Увеличить уровень
    cityState.level += 1;
    
    // Увеличить бонус к доходу (0.1 или 10% за уровень)
    cityState.incomeMultiplier = 1 + (cityState.level - 1) * 0.1;
    
    // Рассчитать опыт для следующего уровня (с возрастанием)
    cityState.nextLevelExp = Math.floor(1000 * Math.pow(1.5, cityState.level - 1));
    
    // Проверить разблокировку зданий
    checkAndUnlockBuildings();
    
    // Пересчитать доход от всех зданий с новым множителем
    for (const buildingType in cityState.buildings) {
      const building = cityState.buildings[buildingType];
      if (building.level > 0) {
        building.income = getBuildingIncome(buildingType, building.level);
      }
    }
    
    // Показать уведомление
    showNotification(`Город улучшен до уровня ${cityState.level}!`, "city-level-up");
    
    // Добавляем эффект повышения уровня
    playCityLevelUpEffect();
  }
  
  // Сохраняем состояние города
  saveCityState();
}

// Эффект повышения уровня города
function playCityLevelUpEffect() {
  // Находим заголовок города
  const cityHeader = document.querySelector('.city-header');
  if (!cityHeader) return;
  
  // Создаем эффект вспышки
  const flash = document.createElement('div');
  flash.className = 'city-level-up-flash';
  flash.style.position = 'absolute';
  flash.style.top = '0';
  flash.style.left = '0';
  flash.style.width = '100%';
  flash.style.height = '100%';
  flash.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
  flash.style.opacity = '0';
  flash.style.zIndex = '100';
  flash.style.pointerEvents = 'none';
  
  // Добавляем эффект в DOM
  document.getElementById('city-content').appendChild(flash);
  
  // Анимация вспышки
  setTimeout(() => {
    flash.style.transition = 'opacity 0.2s ease-in-out';
    flash.style.opacity = '0.8';
    
    setTimeout(() => {
      flash.style.opacity = '0';
      
      setTimeout(() => {
        flash.remove();
      }, 200);
    }, 200);
  }, 10);
  
  // Создаем текст с уровнем
  const levelText = document.createElement('div');
  levelText.className = 'city-level-up-text';
  levelText.textContent = `УРОВЕНЬ ${cityState.level}!`;
  levelText.style.position = 'absolute';
  levelText.style.top = '50%';
  levelText.style.left = '50%';
  levelText.style.transform = 'translate(-50%, -50%) scale(0.5)';
  levelText.style.color = '#ffcc00';
  levelText.style.textShadow = '0 0 10px rgba(255, 204, 0, 0.8), 0 0 20px rgba(255, 204, 0, 0.6)';
  levelText.style.fontSize = '48px';
  levelText.style.fontWeight = 'bold';
  levelText.style.zIndex = '101';
  levelText.style.opacity = '0';
  levelText.style.pointerEvents = 'none';
  
  // Добавляем текст в DOM
  document.getElementById('city-content').appendChild(levelText);
  
  // Анимация текста
  setTimeout(() => {
    levelText.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    levelText.style.opacity = '1';
    levelText.style.transform = 'translate(-50%, -50%) scale(1.2)';
    
    setTimeout(() => {
      levelText.style.opacity = '0';
      levelText.style.transform = 'translate(-50%, -50%) scale(2)';
      
      setTimeout(() => {
        levelText.remove();
      }, 500);
    }, 1500);
  }, 300);
  
  // Создаем частицы для украшения
  for (let i = 0; i < 50; i++) {
    createLevelUpParticle();
  }
}

// Создать частицу для анимации повышения уровня города
function createLevelUpParticle() {
  const cityContent = document.getElementById('city-content');
  if (!cityContent) return;
  
  const particle = document.createElement('div');
  particle.className = 'level-up-particle';
  
  // Случайный размер и цвет
  const size = Math.random() * 15 + 5;
  const colors = ['#ffcc00', '#ff3b30', '#0a84ff', '#34c759', '#ff9500', '#af52de'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  // Стилизуем частицу
  particle.style.position = 'absolute';
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.backgroundColor = color;
  particle.style.borderRadius = '50%';
  particle.style.boxShadow = `0 0 ${size/2}px ${color}`;
  particle.style.opacity = '0.8';
  particle.style.zIndex = '102';
  particle.style.pointerEvents = 'none';
  
  // Начальная позиция (в центре экрана)
  const rect = cityContent.getBoundingClientRect();
  const startX = rect.width / 2;
  const startY = rect.height / 2;
  
  particle.style.left = `${startX}px`;
  particle.style.top = `${startY}px`;
  
  // Добавляем в DOM
  cityContent.appendChild(particle);
  
  // Случайное направление и скорость
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * 300 + 100;
  const duration = Math.random() * 1.5 + 0.5;
  
  // Анимация разлета
  setTimeout(() => {
    particle.style.transition = `all ${duration}s cubic-bezier(0.165, 0.84, 0.44, 1)`;
    particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
    particle.style.opacity = '0';
    
    // Удаляем частицу после анимации
    setTimeout(() => {
      particle.remove();
    }, duration * 1000);
  }, 10);
}

// Проверить и разблокировать здания
function checkAndUnlockBuildings() {
  for (const type in BUILDING_TYPES) {
    const buildingType = BUILDING_TYPES[type];
    const building = cityState.buildings[buildingType];
    
    // Если здание есть, но еще не разблокировано
    if (building && !building.unlocked && isBuildingAvailable(buildingType)) {
      // Разблокируем здание
      building.unlocked = true;
      
      // Уведомляем игрока
      showNotification(`Новое здание доступно: ${BUILDINGS_CONFIG[buildingType].name}!`, "unlock");
    }
  }
}

// Получить общий доход города в час
function getTotalCityIncomePerHour() {
  let totalIncome = 0;
  
  for (const buildingType in cityState.buildings) {
    const building = cityState.buildings[buildingType];
    if (building.level > 0) {
      totalIncome += building.income;
    }
  }
  
  return totalIncome;
}

// Форматирование чисел (1000 -> 1K, 1000000 -> 1M)
function formatNumber(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Получить описание здания для текущей визуальной стадии
function getBuildingVisualDescription(buildingType, level) {
  if (level === 0) return "Не построено";
  
  const config = BUILDINGS_CONFIG[buildingType];
  if (!config.buildingStages) return "";
  
  // Определяем текущую стадию
  const visualStage = getBuildingVisualStage(buildingType, level);
  if (visualStage === 0) return "";
  
  // Возвращаем описание соответствующей стадии
  return config.buildingStages[visualStage - 1]?.description || "";
}

// Сохранение состояния города
function saveCityState() {
  localStorage.setItem('cityState', JSON.stringify(cityState));
}

// Загрузка состояния города
function loadCityState() {
  const savedState = localStorage.getItem('cityState');
  if (savedState) {
    try {
      cityState = JSON.parse(savedState);
      
      // Обновляем визуальные стадии для всех зданий после загрузки
      for (const buildingType in cityState.buildings) {
        const building = cityState.buildings[buildingType];
        if (building.level > 0) {
          building.visualStage = getBuildingVisualStage(buildingType, building.level);
        }
      }
    } catch (e) {
      console.error('Ошибка при загрузке состояния города:', e);
    }
  }
}

// Отрисовка города
function renderCity() {
  // Обновляем несобранный доход
  calculateUnclaimedIncome();
  
  // Получаем контейнер для контента города
  const cityContent = document.getElementById('city-content');
  if (!cityContent) return;
  
  // Очищаем контейнер
  cityContent.innerHTML = '';
  
  // Создаем фон с RGB эффектом
  const cityBackground = document.createElement('div');
  cityBackground.className = 'city-background';
  cityBackground.innerHTML = `
    <div class="city-background-grid"></div>
    <div class="city-background-overlay"></div>
  `;
  cityContent.appendChild(cityBackground);
  
  // Создаем элемент для информации о городе
  const cityInfoElement = document.createElement('div');
  cityInfoElement.className = 'city-info rgb-border';
  cityInfoElement.innerHTML = `
    <div class="city-level">
      <i class="fas fa-city rgb-glow"></i>
      <div class="level-info">
        <div class="city-level-title">Уровень города: <span class="rgb-text">${cityState.level}</span></div>
        <div class="city-progress-bar">
          <div class="city-progress rgb-gradient" style="width: ${(cityState.experience / cityState.nextLevelExp) * 100}%"></div>
        </div>
        <div class="city-exp-text">${formatNumber(cityState.experience)}/${formatNumber(cityState.nextLevelExp)}</div>
      </div>
    </div>
    <div class="city-income">
      <i class="fas fa-coins rgb-pulse"></i>
      <span>Бонус к доходу: <span class="rgb-text">+${Math.floor((cityState.incomeMultiplier - 1) * 100)}%</span></span>
    </div>
    <button class="collect-all-btn rgb-button" onclick="collectAllIncome()">
      <i class="fas fa-hand-holding-usd"></i>
      <span>Собрать доход: <span id="unclaimed-income">${formatNumber(cityState.unclaimedIncome)}</span></span>
    </button>
  `;
  cityContent.appendChild(cityInfoElement);
  
  // Создаем контейнер для зданий
  const buildingsContainer = document.createElement('div');
  buildingsContainer.className = 'buildings-container';
  cityContent.appendChild(buildingsContainer);
  
  // Отрисовываем каждое здание
  for (const type in BUILDING_TYPES) {
    const buildingType = BUILDING_TYPES[type];
    const building = cityState.buildings[buildingType];
    const config = BUILDINGS_CONFIG[buildingType];
    
    if (!building || !config) continue;
    
    // Стоимость улучшения
    const upgradeCost = getBuildingUpgradePrice(buildingType, building.level);
    
    // Описание текущей визуальной стадии
    const visualDescription = getBuildingVisualDescription(buildingType, building.level);
    
    // Создаем карточку здания
    const buildingCard = document.createElement('div');
    buildingCard.className = `building-card ${building.unlocked ? 'unlocked' : 'locked'}`;
    buildingCard.dataset.type = buildingType;
    
    // Определяем, может ли игрок улучшить здание
    const canUpgrade = building.unlocked && building.level < 10 && score >= upgradeCost;
    
    // Заполняем HTML содержимое карточки
    buildingCard.innerHTML = `
      <div class="building-header">
        <div class="building-name">
          <i class="fas fa-${config.icon}"></i>
          <span>${config.name}</span>
        </div>
        ${building.level > 0 ? 
          `<div class="building-level rgb-text">Уровень ${building.level}${building.level >= 10 ? ' (МАКС)' : ''}</div>` : 
          (building.unlocked ? 
            `<div class="building-level">Не построено</div>` : 
            `<div class="building-level locked">Закрыто до уровня ${getBuildingRequiredLevel(buildingType)}</div>`
          )
        }
      </div>
      <div class="building-image">
        ${building.level > 0 ? 
          `<div class="building-visual">${visualDescription}</div>` : 
          (building.unlocked ? 
            `<div class="building-visual empty">Пустой участок под строительство</div>` : 
            `<div class="building-visual locked">Участок недоступен</div>`
          )
        }
        ${building.level > 0 ? `<div class="visual-stage">Стадия ${building.visualStage}/5</div>` : ''}
      </div>
      <div class="building-info">
        <p>${config.description}</p>
        ${building.level > 0 ? 
          `<div class="building-income">
            <i class="fas fa-coins"></i> ${formatNumber(building.income)}/час
          </div>` : ''
        }
      </div>
      <div class="building-actions">
        ${building.unlocked && building.level < 10 ? 
          `<button class="upgrade-btn ${canUpgrade ? 'rgb-button' : 'disabled'}" 
                  onclick="${canUpgrade ? `upgradeBuilding('${buildingType}')` : ''}">
            ${building.level === 0 ? 'Построить' : 'Улучшить'}: ${formatNumber(upgradeCost)}
          </button>` : 
          (building.level >= 10 ? 
            `<div class="max-level-badge">МАКСИМАЛЬНЫЙ УРОВЕНЬ</div>` : 
            `<div class="locked-badge">
              <i class="fas fa-lock"></i> Уровень города ${getBuildingRequiredLevel(buildingType)}
            </div>`
          )
        }
      </div>
    `;
    
    // Добавляем карточку в контейнер
    buildingsContainer.appendChild(buildingCard);
  }
  
  // Создаем подвал с общей статистикой
  const cityFooter = document.createElement('div');
  cityFooter.className = 'city-footer rgb-border';
  cityFooter.innerHTML = `
    <div class="total-income">
      <i class="fas fa-chart-line rgb-glow"></i>
      <span>Общий доход: <span class="rgb-text">${formatNumber(getTotalCityIncomePerHour())}/час</span></span>
    </div>
  `;
  cityContent.appendChild(cityFooter);
}

// Открыть вкладку города
function openCityTab() {
  // Скрываем все вкладки
  document.querySelectorAll('.content-tab').forEach(tab => {
    tab.style.display = 'none';
  });
  
  // Показываем вкладку города
  const cityTab = document.getElementById('city-tab');
  if (cityTab) {
    cityTab.style.display = 'block';
  }
  
  // Обновляем кнопки навигации
  document.querySelectorAll('.nav-button').forEach(button => {
    button.classList.remove('active');
  });
  
  const cityButton = document.querySelector('.nav-button[data-tab="city"]');
  if (cityButton) {
    cityButton.classList.add('active');
  }
  
  // Рендерим интерфейс города
  renderCity();
}

// Создание вкладки города, если её нет в DOM
function createCityTab() {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  
  // Проверяем, существует ли уже вкладка города
  let cityTab = document.getElementById('city-tab');
  
  if (!cityTab) {
    cityTab = document.createElement('div');
    cityTab.id = 'city-tab';
    cityTab.className = 'content-tab';
    cityTab.style.display = 'none';
    
    // Добавляем заголовок
    const cityHeader = document.createElement('div');
    cityHeader.className = 'city-header';
    cityHeader.innerHTML = `
      <h2>Город Кракена</h2>
      <p>Стройте и улучшайте здания для получения пассивного дохода</p>
    `;
    
    cityTab.appendChild(cityHeader);
    
    // Добавляем контейнер для контента города
    const cityContent = document.createElement('div');
    cityContent.id = 'city-content';
    cityContent.className = 'city-content';
    
    cityTab.appendChild(cityContent);
    
    // Добавляем вкладку к основному контенту
    mainContent.appendChild(cityTab);
  }
  
  // Добавляем стили для города, если их еще нет
  if (!document.getElementById('city-styles')) {
    const cityStyles = document.createElement('style');
    cityStyles.id = 'city-styles';
    cityStyles.textContent = `
      /* Стили для города */
      .city-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        overflow: hidden;
      }
      
      .city-background-grid {
        position: absolute;
        top: 0;
        left: 0;
        width: 200%;
        height: 200%;
        background-image: linear-gradient(rgba(10, 21, 53, 0.3) 1px, transparent 1px), 
                          linear-gradient(90deg, rgba(10, 21, 53, 0.3) 1px, transparent 1px);
        background-size: 20px 20px;
        transform: perspective(300px) rotateX(30deg) scale(2);
        transform-origin: center top;
        animation: gridMove 20s linear infinite;
      }
      
      .city-background-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, rgba(10, 21, 53, 0.1) 0%, rgba(26, 10, 32, 0.8) 100%);
      }
      
      @keyframes gridMove {
        0% { transform: perspective(300px) rotateX(30deg) translateY(0) scale(2); }
        100% { transform: perspective(300px) rotateX(30deg) translateY(20px) scale(2); }
      }
      
      .city-content {
        display: flex;
        flex-direction: column;
        position: relative;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        padding-bottom: 20px;
      }
      
      .city-info {
        padding: 15px;
        margin: 15px;
        border-radius: 15px;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        position: relative;
        overflow: hidden;
      }
      
      .rgb-border {
        position: relative;
        border: 1px solid transparent;
        background-clip: padding-box;
        z-index: 1;
      }
      
      .rgb-border::before {
        content: "";
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(90deg, #ff0033, #0066ff, #00ff66, #ff0033);
        background-size: 400% 400%;
        z-index: -1;
        border-radius: 16px;
        animation: rgbBorder 6s ease infinite;
      }
      
      @keyframes rgbBorder {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      .city-level {
        display: flex;
        align-items: center;
        gap: 15px;
        flex: 1;
        min-width: 200px;
      }
      
      .city-level i {
        font-size: 24px;
        color: #0a84ff;
        text-shadow: 0 0 10px rgba(10, 132, 255, 0.7);
      }
      
      .rgb-glow {
        animation: rgbGlow 3s ease infinite;
      }
      
      @keyframes rgbGlow {
        0% { color: #ff0033; text-shadow: 0 0 10px rgba(255, 0, 51, 0.7); }
        33% { color: #0066ff; text-shadow: 0 0 10px rgba(0, 102, 255, 0.7); }
        66% { color: #00ff66; text-shadow: 0 0 10px rgba(0, 255, 102, 0.7); }
        100% { color: #ff0033; text-shadow: 0 0 10px rgba(255, 0, 51, 0.7); }
      }
      
      .rgb-pulse {
        animation: rgbPulse 2s ease infinite;
      }
      
      @keyframes rgbPulse {
        0% { transform: scale(1); color: #ff0033; }
        50% { transform: scale(1.2); color: #0066ff; }
        100% { transform: scale(1); color: #ff0033; }
      }
      
      .level-info {
        flex-grow: 1;
      }
      
      .city-level-title {
        font-size: 16px;
        margin-bottom: 5px;
      }
      
      .rgb-text {
        font-weight: bold;
        background: linear-gradient(90deg, #ff0033, #0066ff, #00ff66);
        background-size: 200% auto;
        color: transparent;
        -webkit-background-clip: text;
        background-clip: text;
        animation: rgbText 3s linear infinite;
      }
      
      @keyframes rgbText {
        0% { background-position: 0% center; }
        100% { background-position: 200% center; }
      }
      
      .city-progress-bar {
        width: 100%;
        height: 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
      }
      
      .city-progress {
        height: 100%;
        background: linear-gradient(90deg, #ff0033, #0066ff);
        background-size: 200% auto;
        animation: rgbGradient 3s linear infinite;
        transition: width 0.5s ease;
      }
      
      .rgb-gradient {
        background: linear-gradient(90deg, #ff0033, #0066ff, #00ff66);
        background-size: 200% auto;
        animation: rgbGradient 3s linear infinite;
      }
      
      @keyframes rgbGradient {
        0% { background-position: 0% center; }
        100% { background-position: 200% center; }
      }
      
      .city-exp-text {
        font-size: 12px;
        text-align: right;
        margin-top: 2px;
        opacity: 0.7;
      }
      
      .city-income {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
        min-width: 200px;
      }
      
      .city-income i {
        font-size: 18px;
        color: #ffcc00;
      }
      
      .collect-all-btn {
        padding: 10px 15px;
        border-radius: 30px;
        border: none;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        min-width: 200px;
        justify-content: center;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        font-weight: bold;
        transition: all 0.3s ease;
      }
      
      .rgb-button {
        position: relative;
        overflow: hidden;
        z-index: 1;
      }
      
      .rgb-button::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 200%;
        height: 100%;
        background: linear-gradient(90deg, #ff0033, #0066ff, #00ff66, #ff0033);
        background-size: 200% auto;
        z-index: -1;
        transition: transform 0.3s ease;
        animation: rgbButton 3s linear infinite;
      }
      
      .rgb-button:hover::before {
        transform: translateX(-25%);
      }
      
      .rgb-button:active {
        transform: scale(0.95);
      }
      
      @keyframes rgbButton {
        0% { background-position: 0% center; }
        100% { background-position: 200% center; }
      }
      
      /* Стили для контейнера зданий */
      .buildings-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 15px;
        padding: 15px;
        margin-bottom: 15px;
      }
      
      /* Стили для карточки здания */
      .building-card {
        background: rgba(0, 0, 0, 0.5);
        border-radius: 15px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transition: all 0.3s ease;
        position: relative;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .building-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
      }
      
      .building-card.locked {
        opacity: 0.7;
        filter: grayscale(50%);
      }
      
      .building-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px;
        background: rgba(0, 0, 0, 0.3);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .building-name {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .building-name i {
        font-size: 18px;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .building-level {
        font-size: 14px;
        color: #ffffff;
        padding: 3px 8px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.1);
      }
      
      .building-level.locked {
        color: #ff3b30;
        background: rgba(255, 59, 48, 0.2);
      }
      
      .building-image {
        height: 150px;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.2);
      }
      
      .building-visual {
        width: 90%;
        height: 90%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 10px;
        padding: 10px;
        color: white;
        text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
      }
      
      .building-visual.empty {
        background: rgba(128, 128, 128, 0.3);
        color: #aaaaaa;
      }
      
      .building-visual.locked {
        background: rgba(255, 59, 48, 0.2);
        color: #ffcccc;
      }
      
      .building-card:hover .building-visual {
        transform: scale(1.05);
      }
      
      .visual-stage {
        position: absolute;
        bottom: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.7);
        padding: 5px 10px;
        border-radius: 20px;
        font-size: 12px;
        color: #ffffff;
      }
      
      .building-info {
        padding: 15px;
        flex-grow: 1;
      }
      
      .building-info p {
        margin: 0 0 10px;
        font-size: 14px;
        opacity: 0.8;
        line-height: 1.4;
      }
      
      .building-income {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        color: #ffcc00;
        font-weight: bold;
      }
      
      .building-actions {
        padding: 0 15px 15px;
      }
      
      .upgrade-btn {
        width: 100%;
        padding: 12px;
        border-radius: 30px;
        border: none;
        font-weight: bold;
        font-size: 14px;
        text-align: center;
        cursor: pointer;
        color: white;
        background: rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;
      }
      
      .upgrade-btn:hover:not(.disabled) {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      }
      
      .upgrade-btn.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .max-level-badge {
        width: 100%;
        padding: 12px;
        border-radius: 30px;
        font-weight: bold;
        font-size: 14px;
        text-align: center;
        background: linear-gradient(90deg, #ffcc00, #ff9500);
        color: #333;
      }
      
      .locked-badge {
        width: 100%;
        padding: 12px;
        border-radius: 30px;
        font-weight: bold;
        font-size: 14px;
        text-align: center;
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      
      .locked-badge i {
        color: #ff3b30;
      }
      
      /* Стили для подвала города */
      .city-footer {
        padding: 15px;
        margin: 0 15px 15px;
        border-radius: 15px;
        background: rgba(0, 0, 0, 0.5);
      }
      
      .total-income {
        display: flex;
        align-items: center;
        gap: 15px;
        font-size: 16px;
      }
      
      .total-income i {
        font-size: 24px;
        color: #00c853;
        text-shadow: 0 0 10px rgba(0, 200, 83, 0.7);
      }
      
      /* Анимация улучшения здания */
      .building-card.upgrading {
        z-index: 10;
        animation: upgradeAnimation 2s ease;
      }
      
      @keyframes upgradeAnimation {
        0% { transform: scale(1); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); }
        50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(0, 0, 0, 0.5), 0 0 60px rgba(10, 132, 255, 0.7); }
        100% { transform: scale(1); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); }
      }
      
      .upgrade-particle {
        position: absolute;
        pointer-events: none;
        z-index: 20;
        transition: all 1.5s ease-out;
      }
      
      /* Летающие монеты для анимации сбора дохода */
      .flying-coin {
        position: absolute;
        z-index: 1000;
      }
      
      /* Адаптивность для планшетов */
      @media (max-width: 768px) {
        .city-info {
          flex-direction: column;
          align-items: stretch;
        }
        
        .buildings-container {
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        }
      }
      
      /* Адаптивность для мобильных */
      @media (max-width: 480px) {
        .buildings-container {
          grid-template-columns: 1fr;
        }
        
        .collect-all-btn {
          width: 100%;
        }
      }
    `;
    document.head.appendChild(cityStyles);
  }
}

// Инициализация города
document.addEventListener('DOMContentLoaded', function() {
  // Загружаем сохраненное состояние
  loadCityState();
  
  // Инициализируем здания
  initializeBuildings();
  
  // Создаем вкладку города, если её нет
  createCityTab();
  
  // Добавляем обработчик для кнопки города
  const cityButton = document.querySelector('.nav-button[data-tab="city"]');
  if (cityButton) {
    cityButton.addEventListener('click', openCityTab);
  }
  
  // Запускаем интервал для обновления несобранного дохода
  setInterval(() => {
    // Обновляем несобранный доход, если открыта вкладка города
    if (document.getElementById('city-tab').style.display === 'block') {
      calculateUnclaimedIncome();
      const unclaimedIncomeElement = document.getElementById('unclaimed-income');
      if (unclaimedIncomeElement) {
        unclaimedIncomeElement.textContent = formatNumber(cityState.unclaimedIncome);
      }
    }
  }, 5000); // Обновляем каждые 5 секунд
});

// Экспортируем функции и константы для использования в основном скрипте
window.city = {
  BUILDING_TYPES,
  BUILDINGS_CONFIG,
  cityState,
  upgradeBuilding,
  collectAllIncome,
  getTotalCityIncomePerHour,
  renderCity,
  openCityTab,
  getBuildingVisualStage
};