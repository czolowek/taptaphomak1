// =========================================================================
// Исправление отображения города в TapKraken - полная версия с 1100+ строк
// =========================================================================

// Глобальные данные города
let cityLevel = 1;
let cityExperience = 0;
let cityExperienceNeeded = 100;
let cityUnclaimedIncome = 0;
let cityIncomeMultiplier = 1;
let cityLastUpdate = Date.now();

// Массив зданий с их параметрами
const buildings = [
  {
    id: 'house',
    name: 'Жилой дом',
    description: 'Жилище для жителей города Кракена',
    baseIncome: 10,
    incomeGrowth: 1.2,
    baseCost: 100,
    costGrowth: 1.5,
    level: 0,
    maxLevel: 10,
    unlocked: true,
    requiredLevel: 1,
    icon: 'home',
    iconColor: 'linear-gradient(135deg, #0a84ff, #34c759)',
    statLabel: 'Жители',
    statBase: 5,
    statGrowth: 1.5
  },
  {
    id: 'farm',
    name: 'Ферма водорослей',
    description: 'Выращивает питательные водоросли для кракена',
    baseIncome: 25,
    incomeGrowth: 1.3,
    baseCost: 500,
    costGrowth: 1.6,
    level: 0,
    maxLevel: 8,
    unlocked: false,
    requiredLevel: 2,
    icon: 'leaf',
    iconColor: 'linear-gradient(135deg, #34c759, #30d158)',
    statLabel: 'Урожай',
    statBase: 3,
    statGrowth: 1.7
  },
  {
    id: 'mine',
    name: 'Подводная шахта',
    description: 'Добывает редкие минералы со дна океана',
    baseIncome: 60,
    incomeGrowth: 1.4,
    baseCost: 2000,
    costGrowth: 1.65,
    level: 0,
    maxLevel: 7,
    unlocked: false,
    requiredLevel: 3,
    icon: 'gem',
    iconColor: 'linear-gradient(135deg, #ff3b30, #ff9500)',
    statLabel: 'Добыча',
    statBase: 2,
    statGrowth: 1.8
  },
  {
    id: 'lab',
    name: 'Исследовательский центр',
    description: 'Изучает древние мистические знания',
    baseIncome: 150,
    incomeGrowth: 1.5,
    baseCost: 8000,
    costGrowth: 1.7,
    level: 0,
    maxLevel: 6,
    unlocked: false,
    requiredLevel: 4,
    icon: 'flask',
    iconColor: 'linear-gradient(135deg, #af52de, #5e5ce6)',
    statLabel: 'Знания',
    statBase: 1,
    statGrowth: 2.0
  },
  {
    id: 'tower',
    name: 'Башня магии',
    description: 'Усиливает магические способности кракена',
    baseIncome: 300,
    incomeGrowth: 1.6,
    baseCost: 25000,
    costGrowth: 1.75,
    level: 0,
    maxLevel: 5,
    unlocked: false,
    requiredLevel: 5,
    icon: 'hat-wizard',
    iconColor: 'linear-gradient(135deg, #5e5ce6, #0a84ff)',
    statLabel: 'Сила',
    statBase: 5,
    statGrowth: 2.2
  },
  {
    id: 'temple',
    name: 'Храм древних',
    description: 'Место поклонения древним богам океана',
    baseIncome: 750,
    incomeGrowth: 1.7,
    baseCost: 100000,
    costGrowth: 1.8,
    level: 0,
    maxLevel: 5,
    unlocked: false,
    requiredLevel: 6,
    icon: 'place-of-worship',
    iconColor: 'linear-gradient(135deg, #ffcc00, #ff9500)',
    statLabel: 'Верующие',
    statBase: 3,
    statGrowth: 2.5
  },
  {
    id: 'portal',
    name: 'Портал в бездну',
    description: 'Соединяет мир Кракена с другими измерениями',
    baseIncome: 2000,
    incomeGrowth: 1.8,
    baseCost: 500000,
    costGrowth: 1.85,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    requiredLevel: 7,
    icon: 'portal',
    iconColor: 'linear-gradient(135deg, #ff375f, #ff3b30)',
    statLabel: 'Энергия',
    statBase: 1,
    statGrowth: 3.0
  }
];

// Функция для открытия города без ошибок
function openFixedCityTab() {
  console.log('Открываем городской интерфейс...');
  
  // Найдем оригинальный контейнер
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  
  // Проверим, есть ли уже вкладка города
  let cityTab = document.getElementById('fixed-city-tab');
  
  if (!cityTab) {
    // Создаем новую вкладку города если её еще нет
    cityTab = document.createElement('div');
    cityTab.id = 'fixed-city-tab';
    cityTab.className = 'fixed-tab';
    cityTab.style.position = 'fixed';
    cityTab.style.top = '0';
    cityTab.style.left = '0';
    cityTab.style.width = '100%';
    cityTab.style.height = '100%';
    cityTab.style.zIndex = '10000';
    cityTab.style.backgroundColor = '#0a1535';
    cityTab.style.backgroundImage = 'linear-gradient(135deg, #0a1535 0%, #1a0a20 100%)';
    cityTab.style.overflow = 'auto';
    cityTab.style.display = 'none';
    
    // Создаем фон города с сеткой
    const cityBackground = document.createElement('div');
    cityBackground.className = 'city-background';
    cityBackground.style.position = 'fixed';
    cityBackground.style.top = '0';
    cityBackground.style.left = '0';
    cityBackground.style.width = '100%';
    cityBackground.style.height = '100%';
    cityBackground.style.zIndex = '-1';
    
    // Создаем сетку
    const cityGrid = document.createElement('div');
    cityGrid.className = 'city-background-grid';
    cityGrid.style.position = 'absolute';
    cityGrid.style.top = '0';
    cityGrid.style.left = '0';
    cityGrid.style.width = '100%';
    cityGrid.style.height = '100%';
    cityGrid.style.backgroundImage = 'linear-gradient(rgba(10, 132, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(10, 132, 255, 0.1) 1px, transparent 1px)';
    cityGrid.style.backgroundSize = '20px 20px';
    cityGrid.style.transform = 'perspective(500px) rotateX(60deg)';
    cityGrid.style.transformOrigin = 'center top';
    
    // Создаем оверлей для градиента поверх сетки
    const cityOverlay = document.createElement('div');
    cityOverlay.className = 'city-background-overlay';
    cityOverlay.style.position = 'absolute';
    cityOverlay.style.top = '0';
    cityOverlay.style.left = '0';
    cityOverlay.style.width = '100%';
    cityOverlay.style.height = '100%';
    cityOverlay.style.background = 'linear-gradient(to bottom, transparent 0%, rgba(10, 21, 53, 0.8) 100%)';
    
    cityBackground.appendChild(cityGrid);
    cityBackground.appendChild(cityOverlay);
    cityTab.appendChild(cityBackground);
    
    // Создаем верхнюю панель города
    const cityHeader = document.createElement('div');
    cityHeader.className = 'city-header';
    cityHeader.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    cityHeader.style.padding = '10px';
    cityHeader.style.display = 'flex';
    cityHeader.style.justifyContent = 'center';
    cityHeader.style.alignItems = 'center';
    cityHeader.style.position = 'relative';
    cityHeader.style.color = 'white';
    cityHeader.style.fontFamily = 'Orbitron, sans-serif';
    cityHeader.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
    
    // Кнопка возврата
    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
    backButton.style.position = 'absolute';
    backButton.style.left = '10px';
    backButton.style.background = 'linear-gradient(90deg, #ff3b30, #0a84ff)';
    backButton.style.border = 'none';
    backButton.style.width = '40px';
    backButton.style.height = '40px';
    backButton.style.borderRadius = '50%';
    backButton.style.display = 'flex';
    backButton.style.justifyContent = 'center';
    backButton.style.alignItems = 'center';
    backButton.style.color = 'white';
    backButton.style.fontSize = '16px';
    backButton.style.cursor = 'pointer';
    backButton.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.3), 0 0 20px rgba(0, 132, 255, 0.3)';
    backButton.onclick = closeFixedCityTab;
    
    // Заголовок города
    const cityTitle = document.createElement('h2');
    cityTitle.id = 'city-title';
    cityTitle.textContent = 'Город Кракена';
    cityTitle.style.margin = '0';
    cityTitle.style.padding = '10px 0';
    cityTitle.style.textAlign = 'center';
    cityTitle.style.fontSize = '24px';
    cityTitle.style.fontWeight = 'bold';
    cityTitle.style.background = 'linear-gradient(90deg, #ff3b30, #0a84ff, #34c759)';
    cityTitle.style.backgroundSize = '200% auto';
    cityTitle.style.color = 'transparent';
    cityTitle.style.backgroundClip = 'text';
    cityTitle.style.webkitBackgroundClip = 'text';
    cityTitle.style.animation = 'gradientText 4s linear infinite';
    
    cityHeader.appendChild(backButton);
    cityHeader.appendChild(cityTitle);
    cityTab.appendChild(cityHeader);
    
    // Контейнер для контента города
    const cityContent = document.createElement('div');
    cityContent.id = 'fixed-city-content';
    cityContent.style.padding = '15px';
    cityContent.style.overflowY = 'auto';
    cityContent.style.maxHeight = 'calc(100vh - 60px)';
    
    // Контейнер для информации о городе
    const cityInfo = document.createElement('div');
    cityInfo.id = 'city-info';
    cityInfo.className = 'city-info';
    cityInfo.style.background = 'rgba(0, 0, 0, 0.3)';
    cityInfo.style.borderRadius = '10px';
    cityInfo.style.padding = '15px';
    cityInfo.style.marginBottom = '20px';
    cityInfo.style.display = 'flex';
    cityInfo.style.justifyContent = 'space-between';
    cityInfo.style.alignItems = 'center';
    cityInfo.style.flexWrap = 'wrap';
    cityInfo.style.gap = '15px';
    
    // Добавляем информацию о городе (будет заполнено позже)
    cityContent.appendChild(cityInfo);
    
    // Контейнер для сетки зданий
    const buildingsGrid = document.createElement('div');
    buildingsGrid.id = 'buildings-grid';
    buildingsGrid.className = 'buildings-grid';
    buildingsGrid.style.display = 'grid';
    buildingsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
    buildingsGrid.style.gap = '20px';
    
    // Добавляем контейнер зданий
    cityContent.appendChild(buildingsGrid);
    
    cityTab.appendChild(cityContent);
    
    // Создаем контейнер для уведомлений
    const notificationContainer = document.createElement('div');
    notificationContainer.id = 'city-notification';
    notificationContainer.className = 'notification';
    notificationContainer.style.position = 'fixed';
    notificationContainer.style.top = '20px';
    notificationContainer.style.right = '20px';
    notificationContainer.style.padding = '10px 20px';
    notificationContainer.style.background = 'rgba(0, 0, 0, 0.8)';
    notificationContainer.style.color = 'white';
    notificationContainer.style.borderRadius = '5px';
    notificationContainer.style.zIndex = '1001';
    notificationContainer.style.transform = 'translateX(150%)';
    notificationContainer.style.transition = 'transform 0.3s ease';
    
    cityTab.appendChild(notificationContainer);
    
    // Стили для анимаций
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes gradientText {
        0% { background-position: 0% center; }
        100% { background-position: 200% center; }
      }
      
      @keyframes upgradeAnimation {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      @keyframes floatingText {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-50px) scale(1.2); opacity: 0; }
      }
      
      @keyframes levelUpShake {
        0% { transform: translateX(0); }
        10% { transform: translateX(-5px); }
        20% { transform: translateX(5px); }
        30% { transform: translateX(-3px); }
        40% { transform: translateX(3px); }
        50% { transform: translateX(-1px); }
        60% { transform: translateX(1px); }
        100% { transform: translateX(0); }
      }
      
      @keyframes flash {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
      }
      
      .building-card {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        overflow: hidden;
        transition: transform 0.3s ease;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      }
      
      .building-card:hover {
        transform: translateY(-5px);
      }
      
      .fixed-tab {
        transition: opacity 0.3s ease;
      }
      
      .notification.visible {
        transform: translateX(0);
      }
      
      .upgrade-particle {
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        pointer-events: none;
        opacity: 0.8;
        animation: floatingParticle 1.5s ease-out forwards;
      }
      
      @keyframes floatingParticle {
        0% { transform: translate(0, 0) scale(1); opacity: 0.8; }
        100% { transform: translate(var(--x), var(--y)) scale(0); opacity: 0; }
      }
      
      .level-up-particle {
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        pointer-events: none;
        opacity: 0.8;
        animation: levelUpParticle 2s ease-out forwards;
      }
      
      @keyframes levelUpParticle {
        0% { transform: translate(0, 0) scale(1); opacity: 0.8; }
        100% { transform: translate(var(--x), var(--y)) rotate(var(--r)) scale(0); opacity: 0; }
      }
      
      .floating-text {
        position: fixed;
        font-weight: bold;
        pointer-events: none;
        z-index: 1002;
        text-shadow: 0 0 10px currentColor;
        animation: floatingText 1.5s ease-out forwards;
      }
    `;
    document.head.appendChild(styleElement);
    
    // Добавляем вкладку города в документ
    document.body.appendChild(cityTab);
  }
  
  // Показываем вкладку города
  cityTab.style.display = 'block';
  
  // Загружаем данные города
  loadCityData();
  
  // Рендерим город
  renderFixedCity();
  
  // Обновляем активную кнопку навигации
  document.querySelectorAll('.nav-button').forEach(button => {
    button.classList.remove('active');
  });
  
  const cityButton = document.querySelector('.nav-button[data-tab="city"]');
  if (cityButton) {
    cityButton.classList.add('active');
  }
}

// Функция для закрытия города
function closeFixedCityTab() {
  const cityTab = document.getElementById('fixed-city-tab');
  if (cityTab) {
    cityTab.style.display = 'none';
  }
  
  // Сохраняем данные города
  saveCityData();
  
  // Обновляем активную кнопку навигации
  document.querySelectorAll('.nav-button').forEach(button => {
    button.classList.remove('active');
  });
  
  const mainButton = document.querySelector('.nav-button[data-tab="main"]');
  if (mainButton) {
    mainButton.classList.add('active');
  }
}

// Функция для рендеринга города
function renderFixedCity() {
  // Сначала рассчитаем накопленный доход
  calculateUnclaimedIncome();
  
  // Обновляем заголовок города с уровнем
  const cityTitle = document.getElementById('city-title');
  if (cityTitle) {
    cityTitle.textContent = `Город Кракена (Уровень ${cityLevel})`;
  }
  
  // Обновляем информацию о городе
  renderCityInfo();
  
  // Обновляем список зданий
  renderCityBuildings();
  
  // Проверяем, можно ли разблокировать новые здания
  checkAndUnlockBuildings();
}

// Функция для рендеринга информации о городе
function renderCityInfo() {
  const cityInfo = document.getElementById('city-info');
  if (!cityInfo) return;
  
  // Считаем общий доход города в час
  const totalIncome = getTotalCityIncome();
  
  // Создаем HTML для информации о городе
  cityInfo.innerHTML = `
    <div style="display: flex; align-items: center; gap: 15px;">
      <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #ff3b30, #0a84ff); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(255, 0, 0, 0.3), 0 0 30px rgba(0, 132, 255, 0.3);">
        <i class="fas fa-city" style="font-size: 24px; color: white;"></i>
      </div>
      <div>
        <div style="font-size: 18px; font-weight: bold;">Уровень города: <span style="color: #0a84ff;">${cityLevel}</span></div>
        <div style="width: 150px; height: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 4px; margin-top: 5px; overflow: hidden;">
          <div style="height: 100%; width: ${Math.min(100, (cityExperience / cityExperienceNeeded) * 100)}%; background: linear-gradient(90deg, #ff3b30, #0a84ff, #34c759); background-size: 200% auto; animation: gradientText 4s linear infinite;"></div>
        </div>
        <div style="font-size: 12px; margin-top: 5px;">Опыт: ${formatCityNumber(Math.floor(cityExperience))}/${formatCityNumber(cityExperienceNeeded)}</div>
      </div>
    </div>
    
    <div style="display: flex; align-items: center; gap: 15px;">
      <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #ff9500, #ffcc00); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(255, 149, 0, 0.3), 0 0 30px rgba(255, 204, 0, 0.3);">
        <i class="fas fa-coins" style="font-size: 24px; color: white;"></i>
      </div>
      <div>
        <div style="font-size: 18px; font-weight: bold;">Доход города: <span style="color: #ffcc00;">${formatCityNumber(totalIncome)}</span>/час</div>
        <div style="font-size: 12px;">Множитель: x${cityIncomeMultiplier.toFixed(1)}</div>
      </div>
    </div>
    
    <button id="collect-income-button" style="background: linear-gradient(90deg, #34c759, #0a84ff); border: none; padding: 10px 15px; border-radius: 10px; color: white; font-weight: bold; display: flex; align-items: center; gap: 8px; cursor: pointer; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);">
      <i class="fas fa-hand-holding-dollar"></i> Собрать доход
      <span style="background: rgba(0, 0, 0, 0.3); padding: 2px 8px; border-radius: 10px; font-size: 12px;">${formatCityNumber(Math.floor(cityUnclaimedIncome))}</span>
    </button>
  `;
  
  // Добавляем обработчик клика для кнопки сбора дохода
  const collectButton = document.getElementById('collect-income-button');
  if (collectButton) {
    collectButton.addEventListener('click', collectAllFixedIncome);
  }
}

// Функция для рендеринга списка зданий
function renderCityBuildings() {
  const buildingsGrid = document.getElementById('buildings-grid');
  if (!buildingsGrid) return;
  
  // Очищаем контейнер
  buildingsGrid.innerHTML = '';
  
  // Для каждого здания создаем карточку
  buildings.forEach(building => {
    // Проверяем, разблокировано ли здание
    if (!building.unlocked) {
      // Если не разблокировано, показываем заблокированную карточку
      buildingsGrid.appendChild(createLockedBuildingCard(building));
    } else {
      // Если разблокировано, показываем обычную карточку
      buildingsGrid.appendChild(createBuildingCard(building));
    }
  });
}

// Функция для создания карточки здания
function createBuildingCard(building) {
  const card = document.createElement('div');
  card.className = 'building-card';
  card.id = `building-${building.id}`;
  
  // Получаем статистику здания
  const income = calculateBuildingIncome(building.id, building.level);
  const nextLevelIncome = calculateBuildingIncome(building.id, building.level + 1);
  const upgradeCost = getBuildingUpgradePrice(building.id, building.level);
  const visualStage = getVisualStageForLevel(building.id, building.level);
  
  // Статистика (жители, урожай и т.д.)
  const statValue = Math.floor(building.statBase * Math.pow(building.statGrowth, building.level));
  
  // Цвет заголовка
  const headerColor = building.iconColor.replace('linear-gradient', 'rgba').replace(/135deg,\s*/, '').replace(/,\s*[^,]+$/, ', 0.2)');
  
  card.innerHTML = `
    <div style="background: ${headerColor}; padding: 15px; display: flex; align-items: center; gap: 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
      <div style="width: 40px; height: 40px; background: ${building.iconColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
        <i class="fas fa-${building.icon}" style="color: white;"></i>
      </div>
      <div>
        <div style="font-weight: bold; font-size: 18px;">${building.name}</div>
        <div style="font-size: 12px; opacity: 0.7;">Уровень ${building.level}</div>
      </div>
    </div>
    <div style="height: 100px; display: flex; align-items: center; justify-content: center; background: ${headerColor.replace('0.2', '0.05')};" class="building-visual-container">
      <div class="building-visual" style="font-size: 60px; color: rgba(255, 255, 255, 0.5); text-align: center; width: 100%;">
        ${visualStage}
      </div>
    </div>
    <div style="padding: 15px;">
      <div style="font-size: 14px; margin-bottom: 10px;">${building.description}</div>
      <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 15px;">
        <div><i class="fas fa-coins" style="color: #ffcc00; margin-right: 5px;"></i> Доход: ${formatCityNumber(income)}/час</div>
        <div><i class="fas fa-${building.icon}" style="color: ${extractColor(building.iconColor)}; margin-right: 5px;"></i> ${building.statLabel}: ${statValue}</div>
      </div>
      <button class="building-upgrade-btn" data-building="${building.id}" style="width: 100%; background: ${building.iconColor}; border: none; padding: 10px; border-radius: 8px; color: white; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer;">
        <i class="fas fa-arrow-up"></i> Улучшить
        <span>${formatCityNumber(upgradeCost)} <i class="fas fa-coins" style="color: #ffcc00; font-size: 12px;"></i></span>
      </button>
      ${building.level < building.maxLevel ? `
        <div style="font-size: 12px; text-align: center; margin-top: 5px; opacity: 0.7;">
          Следующий уровень: +${formatCityNumber(nextLevelIncome - income)}/час
        </div>
      ` : `
        <div style="font-size: 12px; text-align: center; margin-top: 5px; opacity: 0.7;">
          Максимальный уровень достигнут
        </div>
      `}
    </div>
  `;
  
  // Добавляем обработчик клика для кнопки улучшения
  setTimeout(() => {
    const upgradeButton = card.querySelector('.building-upgrade-btn');
    if (upgradeButton) {
      upgradeButton.addEventListener('click', function() {
        const buildingId = this.getAttribute('data-building');
        upgradeFixedBuilding(buildingId);
      });
    }
  }, 0);
  
  return card;
}

// Функция для создания заблокированной карточки здания
function createLockedBuildingCard(building) {
  const card = document.createElement('div');
  card.className = 'building-card';
  card.id = `building-${building.id}-locked`;
  
  // Цвет заголовка (затемненный)
  const headerColor = building.iconColor.replace('linear-gradient', 'rgba').replace(/135deg,\s*/, '').replace(/,\s*[^,]+$/, ', 0.1)');
  
  card.innerHTML = `
    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 2; border-radius: 10px;">
      <i class="fas fa-lock" style="font-size: 40px; color: #ff3b30; margin-bottom: 15px; filter: drop-shadow(0 0 10px rgba(255, 59, 48, 0.7));"></i>
      <div style="text-align: center; color: white; font-size: 16px; font-weight: bold;">Требуется уровень города ${building.requiredLevel}</div>
    </div>
    
    <div style="background: ${headerColor}; padding: 15px; display: flex; align-items: center; gap: 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
      <div style="width: 40px; height: 40px; background: ${building.iconColor.replace(/rgb[^)]+\)/, 'rgba(100, 100, 100, 0.5)')}; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
        <i class="fas fa-${building.icon}" style="color: rgba(255, 255, 255, 0.5);"></i>
      </div>
      <div>
        <div style="font-weight: bold; font-size: 18px; opacity: 0.5;">${building.name}</div>
        <div style="font-size: 12px; opacity: 0.5;">Уровень 0</div>
      </div>
    </div>
    <div style="height: 100px; display: flex; align-items: center; justify-content: center; background: ${headerColor.replace('0.1', '0.05')};">
      <div style="font-size: 60px; color: rgba(255, 255, 255, 0.2);">
        <i class="fas fa-${building.icon}"></i>
      </div>
    </div>
    <div style="padding: 15px;">
      <div style="font-size: 14px; margin-bottom: 10px; opacity: 0.5;">${building.description}</div>
      <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 15px; opacity: 0.5;">
        <div><i class="fas fa-coins" style="color: rgba(255, 204, 0, 0.5); margin-right: 5px;"></i> Доход: ???/час</div>
        <div><i class="fas fa-${building.icon}" style="color: rgba(100, 100, 100, 0.5); margin-right: 5px;"></i> ${building.statLabel}: ???</div>
      </div>
      <button style="width: 100%; background: #333; border: none; padding: 10px; border-radius: 8px; color: white; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 10px; opacity: 0.5; cursor: not-allowed;">
        <i class="fas fa-lock"></i> Заблокировано
      </button>
    </div>
  `;
  
  return card;
}

// Функция получения визуального представления для уровня здания
function getVisualStageForLevel(buildingId, level) {
  // Если уровень 0, показываем только иконку
  if (level === 0) {
    const building = buildings.find(b => b.id === buildingId);
    return `<i class="fas fa-${building.icon}"></i>`;
  }
  
  // Генерируем визуальное представление в зависимости от типа здания
  switch (buildingId) {
    case 'house':
      if (level <= 3) {
        return `<i class="fas fa-home"></i>`;
      } else if (level <= 6) {
        return `<div style="display: flex; justify-content: center; gap: 5px;"><i class="fas fa-home"></i><i class="fas fa-home"></i></div><div style="font-size: 12px;">Жилой район</div>`;
      } else {
        return `<div style="display: flex; justify-content: center; gap: 5px;"><i class="fas fa-building"></i><i class="fas fa-building"></i></div><div style="font-size: 12px;">Жилой квартал</div>`;
      }
    case 'farm':
      if (level <= 3) {
        return `<i class="fas fa-leaf"></i>`;
      } else if (level <= 6) {
        return `<div style="display: flex; justify-content: center; gap: 5px;"><i class="fas fa-leaf"></i><i class="fas fa-leaf"></i></div><div style="font-size: 12px;">Крупная ферма</div>`;
      } else {
        return `<div style="display: flex; justify-content: center; gap: 5px;"><i class="fas fa-leaf"></i><i class="fas fa-leaf"></i><i class="fas fa-leaf"></i></div><div style="font-size: 12px;">Плантация</div>`;
      }
    case 'mine':
      if (level <= 3) {
        return `<i class="fas fa-gem"></i>`;
      } else if (level <= 5) {
        return `<div style="display: flex; justify-content: center; gap: 5px;"><i class="fas fa-gem"></i><i class="fas fa-gem"></i></div><div style="font-size: 12px;">Улучшенная шахта</div>`;
      } else {
        return `<div style="display: flex; justify-content: center; gap: 5px;"><i class="fas fa-gem"></i><i class="fas fa-bomb"></i><i class="fas fa-gem"></i></div><div style="font-size: 12px;">Глубинный карьер</div>`;
      }
    case 'lab':
      if (level <= 2) {
        return `<i class="fas fa-flask"></i>`;
      } else if (level <= 4) {
        return `<div style="display: flex; justify-content: center; gap: 5px;"><i class="fas fa-flask"></i><i class="fas fa-microscope"></i></div><div style="font-size: 12px;">Исследовательский центр</div>`;
      } else {
        return `<div style="display: flex; justify-content: center; gap: 5px;"><i class="fas fa-flask"></i><i class="fas fa-atom"></i><i class="fas fa-microscope"></i></div><div style="font-size: 12px;">Лаборатория</div>`;
      }
    case 'tower':
      if (level <= 2) {
        return `<i class="fas fa-hat-wizard"></i>`;
      } else if (level <= 4) {
        return `<div style="display: flex; justify-content: center; gap: 5px;"><i class="fas fa-hat-wizard"></i><i class="fas fa-magic"></i></div><div style="font-size: 12px;">Башня магии</div>`;
      } else {
        return `<div style="display: flex; justify-content: center; gap: 5px;"><i class="fas fa-hat-wizard"></i><i class="fas fa-dragon"></i><i class="fas fa-magic"></i></div><div style="font-size: 12px;">Магическая цитадель</div>`;
      }
    case 'temple':
      if (level <= 2) {
        return `<i class="fas fa-place-of-worship"></i>`;
      } else if (level <= 4) {
        return `<div style="display: flex; justify-content: center; gap: 5px;"><i class="fas fa-place-of-worship"></i><i class="fas fa-pray"></i></div><div style="font-size: 12px;">Святилище</div>`;
      } else {
        return `<div style="display: flex; justify-content: center; gap: 5px;"><i class="fas fa-place-of-worship"></i><i class="fas fa-om"></i><i class="fas fa-pray"></i></div><div style="font-size: 12px;">Храм древних</div>`;
      }
    case 'portal':
      if (level <= 1) {
        return `<i class="fas fa-door-open"></i>`;
      } else if (level === 2) {
        return `<div style="display: flex; justify-content: center; gap: 5px;"><i class="fas fa-door-open"></i><i class="fas fa-bolt"></i></div><div style="font-size: 12px;">Нестабильный портал</div>`;
      } else {
        return `<div style="display: flex; justify-content: center; gap: 5px;"><i class="fas fa-door-open"></i><i class="fas fa-bolt"></i><i class="fas fa-skull"></i></div><div style="font-size: 12px;">Врата бездны</div>`;
      }
    default:
      return `<i class="fas fa-question"></i>`;
  }
}

// Функция для получения стоимости улучшения здания
function getBuildingUpgradePrice(buildingId, level) {
  // Если здание уже на максимальном уровне, возвращаем очень большое число
  const building = buildings.find(b => b.id === buildingId);
  if (!building || level >= building.maxLevel) {
    return Number.MAX_SAFE_INTEGER;
  }
  
  // Базовая стоимость здания
  const baseCost = building.baseCost;
  // Множитель роста стоимости
  const costGrowth = building.costGrowth;
  
  // Формула: baseCost * (costGrowth ^ level)
  return Math.floor(baseCost * Math.pow(costGrowth, level));
}

// Функция для улучшения здания
function upgradeFixedBuilding(buildingId) {
  // Находим здание в массиве
  const buildingIndex = buildings.findIndex(b => b.id === buildingId);
  if (buildingIndex === -1) {
    console.error('Здание не найдено:', buildingId);
    return;
  }
  
  // Здание найдено
  const building = buildings[buildingIndex];
  
  // Проверяем, не достигнут ли максимальный уровень
  if (building.level >= building.maxLevel) {
    showCityNotification('Здание уже на максимальном уровне!', 'warning');
    return;
  }
  
  // Получаем стоимость улучшения
  const upgradeCost = getBuildingUpgradePrice(buildingId, building.level);
  
  // Проверяем, достаточно ли средств
  const score = parseInt(document.getElementById('score').textContent.replace(/,/g, '')) || 0;
  if (score < upgradeCost) {
    showCityNotification('Недостаточно средств для улучшения!', 'error');
    return;
  }
  
  // Списываем средства
  let newScore = score - upgradeCost;
  document.getElementById('score').textContent = formatCityNumber(newScore);
  
  // Запоминаем текущую визуальную стадию
  const oldStage = getVisualStageForLevel(buildingId, building.level);
  
  // Повышаем уровень здания
  buildings[buildingIndex].level += 1;
  
  // Получаем новую визуальную стадию
  const newStage = getVisualStageForLevel(buildingId, building.level);
  
  // Добавляем опыт городу (1/4 от стоимости улучшения)
  addCityExperience(Math.floor(upgradeCost / 4));
  
  // Показываем уведомление
  showCityNotification(`${building.name} улучшен до уровня ${building.level}!`, 'success');
  
  // Воспроизводим анимацию улучшения
  playBuildingUpgradeAnimation(buildingId, oldStage, newStage);
  
  // Обновляем город
  renderFixedCity();
  
  // Обновляем статистику дохода в час
  updateIncomeStats();
  
  // Сохраняем данные города
  saveCityData();
}

// Функция расчета дохода здания
function calculateBuildingIncome(buildingId, level) {
  // Если уровень 0, доход 0
  if (level === 0) return 0;
  
  // Находим здание в массиве
  const building = buildings.find(b => b.id === buildingId);
  if (!building) return 0;
  
  // Базовый доход здания
  const baseIncome = building.baseIncome;
  // Множитель роста дохода
  const incomeGrowth = building.incomeGrowth;
  
  // Формула: baseIncome * (incomeGrowth ^ (level - 1))
  const income = baseIncome * Math.pow(incomeGrowth, level - 1);
  
  // Применяем множитель дохода города
  return Math.floor(income * cityIncomeMultiplier);
}

// Функция воспроизведения анимации улучшения здания
function playBuildingUpgradeAnimation(buildingId, oldStage, newStage) {
  // Находим элемент здания
  const buildingElement = document.getElementById(`building-${buildingId}`);
  if (!buildingElement) return;
  
  // Добавляем класс анимации
  buildingElement.classList.add('upgrading');
  
  // Находим контейнер визуала здания
  const visualContainer = buildingElement.querySelector('.building-visual-container');
  if (!visualContainer) return;
  
  // Создаем эффект вспышки
  const flash = document.createElement('div');
  flash.className = 'level-up-flash';
  flash.style.position = 'absolute';
  flash.style.top = '0';
  flash.style.left = '0';
  flash.style.width = '100%';
  flash.style.height = '100%';
  flash.style.background = 'rgba(255, 255, 255, 0.5)';
  flash.style.opacity = '0';
  flash.style.animation = 'flash 0.5s ease-out';
  flash.style.pointerEvents = 'none';
  visualContainer.style.position = 'relative';
  visualContainer.appendChild(flash);
  
  // Создаем частицы улучшения
  createUpgradeParticles(buildingElement);
  
  // Находим визуал здания
  const visualElement = buildingElement.querySelector('.building-visual');
  if (visualElement) {
    // Меняем визуал здания на новый
    visualElement.innerHTML = newStage;
    
    // Анимируем изменение
    visualElement.style.animation = 'upgradeAnimation 0.5s ease-in-out';
    
    // Удаляем анимацию после завершения
    setTimeout(() => {
      visualElement.style.animation = '';
    }, 500);
  }
  
  // Удаляем класс анимации после завершения
  setTimeout(() => {
    buildingElement.classList.remove('upgrading');
    
    // Удаляем эффект вспышки
    if (flash.parentNode) {
      flash.parentNode.removeChild(flash);
    }
  }, 500);
}

// Функция создания частиц при улучшении здания
function createUpgradeParticles(buildingElement) {
  if (!buildingElement) return;
  
  // Получаем размеры и позицию здания
  const rect = buildingElement.getBoundingClientRect();
  
  // Цвета частиц
  const colors = ['#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#5ac8fa', '#0a84ff', '#af52de'];
  
  // Создаем 15 частиц
  for (let i = 0; i < 15; i++) {
    // Создаем элемент частицы
    const particle = document.createElement('div');
    particle.className = 'upgrade-particle';
    
    // Случайная позиция внутри здания
    const startX = Math.random() * rect.width;
    const startY = Math.random() * (rect.height / 2) + rect.height / 4;
    
    // Случайное смещение для анимации
    const endX = (Math.random() - 0.5) * 100;
    const endY = (Math.random() - 0.5) * 100;
    
    // Случайный цвет
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Случайный размер
    const size = 4 + Math.random() * 8;
    
    // Установка стилей
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
    
    // Добавляем CSS переменные для анимации
    particle.style.setProperty('--x', `${endX}px`);
    particle.style.setProperty('--y', `${endY}px`);
    
    // Добавляем частицу
    buildingElement.appendChild(particle);
    
    // Удаляем частицу после завершения анимации
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 1500);
  }
}

// Функция добавления опыта городу
function addCityExperience(amount) {
  // Добавляем опыт
  cityExperience += amount;
  
  // Проверяем, не достигнут ли следующий уровень
  while (cityExperience >= cityExperienceNeeded) {
    // Вычитаем необходимый опыт
    cityExperience -= cityExperienceNeeded;
    
    // Повышаем уровень города
    cityLevel += 1;
    
    // Увеличиваем требуемый опыт на следующий уровень (на 50% больше)
    cityExperienceNeeded = Math.floor(cityExperienceNeeded * 1.5);
    
    // Воспроизводим эффект повышения уровня
    playCityLevelUpEffect();
    
    // Проверяем, можно ли разблокировать новые здания
    checkAndUnlockBuildings();
    
    // Показываем уведомление
    showCityNotification(`Город достиг уровня ${cityLevel}!`, 'success');
  }
}

// Функция воспроизведения эффекта повышения уровня города
function playCityLevelUpEffect() {
  // Находим заголовок города
  const cityTitle = document.getElementById('city-title');
  if (!cityTitle) return;
  
  // Добавляем класс анимации
  cityTitle.classList.add('level-up');
  
  // Создаем эффект вспышки
  const cityTab = document.getElementById('fixed-city-tab');
  if (cityTab) {
    const flash = document.createElement('div');
    flash.className = 'level-up-flash';
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.background = 'rgba(255, 255, 255, 0.5)';
    flash.style.opacity = '0';
    flash.style.animation = 'flash 0.5s ease-out';
    flash.style.pointerEvents = 'none';
    flash.style.zIndex = '10001';
    cityTab.appendChild(flash);
    
    // Удаляем эффект вспышки после анимации
    setTimeout(() => {
      if (flash.parentNode) {
        flash.parentNode.removeChild(flash);
      }
    }, 500);
  }
  
  // Создаем частицы
  createLevelUpParticle();
  
  // Удаляем класс анимации после завершения
  setTimeout(() => {
    cityTitle.classList.remove('level-up');
  }, 500);
}

// Функция создания частиц при повышении уровня города
function createLevelUpParticle() {
  // Получаем заголовок города для размещения частиц
  const cityTitle = document.getElementById('city-title');
  if (!cityTitle) return;
  
  // Получаем размеры и позицию заголовка
  const rect = cityTitle.getBoundingClientRect();
  
  // Цвета частиц
  const colors = ['#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#5ac8fa', '#0a84ff', '#af52de'];
  
  // Создаем 30 частиц
  for (let i = 0; i < 30; i++) {
    // Создаем элемент частицы
    const particle = document.createElement('div');
    particle.className = 'level-up-particle';
    
    // Позиция по центру заголовка
    const startX = rect.width / 2;
    const startY = rect.height / 2;
    
    // Случайное смещение для анимации
    const endX = (Math.random() - 0.5) * 200;
    const endY = (Math.random() - 0.5) * 200;
    const rotation = Math.random() * 360;
    
    // Случайный цвет
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Случайный размер
    const size = 5 + Math.random() * 10;
    
    // Установка стилей
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
    
    // Добавляем CSS переменные для анимации
    particle.style.setProperty('--x', `${endX}px`);
    particle.style.setProperty('--y', `${endY}px`);
    particle.style.setProperty('--r', `${rotation}deg`);
    
    // Добавляем частицу
    cityTitle.appendChild(particle);
    
    // Удаляем частицу после завершения анимации
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 2000);
  }
}

// Функция отображения уведомления в городе
function showCityNotification(message, type = 'info') {
  // Находим контейнер уведомления
  const notificationContainer = document.getElementById('city-notification');
  if (!notificationContainer) return;
  
  // Устанавливаем содержимое уведомления
  let icon = '';
  switch (type) {
    case 'success':
      icon = '<i class="fas fa-check-circle" style="color: #34c759;"></i>';
      break;
    case 'error':
      icon = '<i class="fas fa-times-circle" style="color: #ff3b30;"></i>';
      break;
    case 'warning':
      icon = '<i class="fas fa-exclamation-triangle" style="color: #ffcc00;"></i>';
      break;
    default:
      icon = '<i class="fas fa-info-circle" style="color: #0a84ff;"></i>';
  }
  
  notificationContainer.innerHTML = `
    <div class="notification-content">
      ${icon}
      <span>${message}</span>
    </div>
  `;
  
  // Показываем уведомление
  notificationContainer.classList.add('visible');
  
  // Скрываем уведомление через 3 секунды
  setTimeout(() => {
    notificationContainer.classList.remove('visible');
  }, 3000);
}

// Функция форматирования чисел
function formatCityNumber(num) {
  // Если число меньше 1000, возвращаем как есть
  if (num < 1000) return num.toString();
  
  // Для больших чисел используем сокращения
  if (num < 1000000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  
  if (num < 1000000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  
  return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
}

// Функция для сбора всего дохода города
function collectAllFixedIncome() {
  // Проверяем, есть ли несобранный доход
  if (cityUnclaimedIncome <= 0) {
    showCityNotification('Нет доступного дохода для сбора!', 'warning');
    return;
  }
  
  // Получаем текущий счет игрока
  const scoreElement = document.getElementById('score');
  if (!scoreElement) return;
  
  const currentScore = parseInt(scoreElement.textContent.replace(/,/g, '')) || 0;
  
  // Округляем несобранный доход
  const incomeToCollect = Math.floor(cityUnclaimedIncome);
  
  // Увеличиваем счет игрока
  scoreElement.textContent = formatCityNumber(currentScore + incomeToCollect);
  
  // Сбрасываем несобранный доход
  cityUnclaimedIncome = 0;
  
  // Обновляем время последнего сбора
  cityLastUpdate = Date.now();
  
  // Показываем уведомление
  showCityNotification(`Собрано ${formatCityNumber(incomeToCollect)} монет!`, 'success');
  
  // Анимируем сбор монет
  animateCoinCollection(incomeToCollect);
  
  // Обновляем город
  renderFixedCity();
  
  // Сохраняем данные города
  saveCityData();
}

// Функция анимации сбора монет
function animateCoinCollection(amount) {
  // Находим кнопку сбора дохода
  const collectButton = document.getElementById('collect-income-button');
  if (!collectButton) return;
  
  // Позиция кнопки
  const rect = collectButton.getBoundingClientRect();
  
  // Создаем анимированный текст
  const floatingText = document.createElement('div');
  floatingText.className = 'floating-text';
  floatingText.textContent = `+${formatCityNumber(amount)}`;
  floatingText.style.left = `${rect.left + rect.width / 2}px`;
  floatingText.style.top = `${rect.top}px`;
  floatingText.style.color = '#34c759';
  
  // Добавляем в body
  document.body.appendChild(floatingText);
  
  // Удаляем после окончания анимации
  setTimeout(() => {
    if (floatingText.parentNode) {
      floatingText.parentNode.removeChild(floatingText);
    }
  }, 1500);
}

// Функция расчета накопленного дохода
function calculateUnclaimedIncome() {
  // Получаем текущее время
  const currentTime = Date.now();
  
  // Рассчитываем прошедшее время в часах
  const hoursPassed = (currentTime - cityLastUpdate) / (1000 * 60 * 60);
  
  // Рассчитываем доход за прошедшее время
  const income = getTotalCityIncome() * hoursPassed;
  
  // Добавляем к накопленному доходу
  cityUnclaimedIncome += income;
  
  // Обновляем время последнего обновления
  cityLastUpdate = currentTime;
}

// Функция проверки и разблокировки зданий
function checkAndUnlockBuildings() {
  let buildingsUnlocked = false;
  
  // Проверяем каждое здание
  buildings.forEach((building, index) => {
    // Если здание не разблокировано и уровень города достаточный
    if (!building.unlocked && cityLevel >= building.requiredLevel) {
      // Разблокируем здание
      buildings[index].unlocked = true;
      buildingsUnlocked = true;
      
      // Показываем уведомление
      showCityNotification(`Разблокировано новое здание: ${building.name}!`, 'success');
    }
  });
  
  // Если были разблокированы здания, обновляем город
  if (buildingsUnlocked) {
    renderFixedCity();
  }
}

// Функция получения общего дохода города в час
function getTotalCityIncome() {
  // Суммируем доходы всех зданий
  return buildings.reduce((total, building) => {
    return total + calculateBuildingIncome(building.id, building.level);
  }, 0);
}

// Функция обновления статистики дохода в главном интерфейсе
function updateIncomeStats() {
  // Находим элемент счетчика дохода в час
  const incomePerHour = document.getElementById('income-per-hour');
  if (!incomePerHour) return;
  
  // Обновляем счетчик
  incomePerHour.textContent = formatCityNumber(getTotalCityIncome());
}

// Функция извлечения цвета из градиента для использования в иконках
function extractColor(gradient) {
  // Простое извлечение цвета из строки градиента
  // Пример: 'linear-gradient(135deg, #ff3b30, #ff9500)' -> '#ff3b30'
  const match = gradient.match(/#[0-9a-f]{6}/i);
  return match ? match[0] : '#ffffff';
}

// Функция сохранения данных города
function saveCityData() {
  try {
    // Создаем объект с данными
    const cityData = {
      cityLevel,
      cityExperience,
      cityExperienceNeeded,
      cityUnclaimedIncome,
      cityIncomeMultiplier,
      cityLastUpdate,
      buildings: buildings.map(b => ({ id: b.id, level: b.level, unlocked: b.unlocked }))
    };
    
    // Сохраняем в localStorage
    localStorage.setItem('tapkrakenCityData', JSON.stringify(cityData));
    console.log('Данные города сохранены');
  } catch (error) {
    console.error('Ошибка при сохранении данных города:', error);
  }
}

// Функция загрузки данных города
function loadCityData() {
  try {
    // Получаем данные из localStorage
    const savedData = localStorage.getItem('tapkrakenCityData');
    
    // Если данных нет, используем значения по умолчанию
    if (!savedData) {
      console.log('Сохраненных данных города не найдено, используем значения по умолчанию');
      return;
    }
    
    // Парсим данные
    const cityData = JSON.parse(savedData);
    
    // Загружаем основные данные
    cityLevel = cityData.cityLevel || 1;
    cityExperience = cityData.cityExperience || 0;
    cityExperienceNeeded = cityData.cityExperienceNeeded || 100;
    cityUnclaimedIncome = cityData.cityUnclaimedIncome || 0;
    cityIncomeMultiplier = cityData.cityIncomeMultiplier || 1;
    cityLastUpdate = cityData.cityLastUpdate || Date.now();
    
    // Загружаем данные зданий
    if (cityData.buildings && Array.isArray(cityData.buildings)) {
      cityData.buildings.forEach(savedBuilding => {
        const index = buildings.findIndex(b => b.id === savedBuilding.id);
        if (index !== -1) {
          buildings[index].level = savedBuilding.level || 0;
          buildings[index].unlocked = savedBuilding.unlocked || false;
        }
      });
    }
    
    console.log('Данные города загружены');
  } catch (error) {
    console.error('Ошибка при загрузке данных города:', error);
  }
}

// Добавляем обработчики событий после загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
  // Находим все кнопки, открывающие город
  const cityButtons = document.querySelectorAll('.city-button, .nav-button[data-tab="city"]');
  
  // Добавляем обработчики для всех найденных кнопок
  cityButtons.forEach(button => {
    // Удаляем старые обработчики (если есть)
    const newButton = button.cloneNode(true);
    if (button.parentNode) {
      button.parentNode.replaceChild(newButton, button);
    }
    
    // Добавляем новый обработчик
    newButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      openFixedCityTab();
    });
  });
  
  // Загружаем данные города
  loadCityData();
});