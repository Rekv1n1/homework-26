let data = {};
let activeBrand = 'mercedes'; // Активная вкладка по умолчанию

// Загружаем data.json через Axios
axios.get('data/data.json')
    .then(function(response) {
        data = response.data;
        console.log("Данные успешно загружены:", data);
        
        renderCards(activeBrand); // Первый вывод карточек
    })
    .catch(function(error) {
        console.error("Ошибка при загрузке data.json:", error);
    });

// Функция переключения вкладок брендов
function switchBrand(brand, element) {
    activeBrand = brand;

    // Переключаем класс active у кнопок вкладок
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');

    // Меняем заголовок секции под выбранный бренд
    const brandTitles = {
        'mercedes': 'Mercedes-Benz',
        'bmw': 'BMW',
        'porsche': 'Porsche'
    };
    document.getElementById('brand-title').textContent = brandTitles[brand];

    // Рендерим карточки выбранного бренда
    renderCards(activeBrand);
}

// Функция построения сетки карточек циклом
function renderCards(brand) {
    const cars = data[brand];
    let html = '';

    for (let i = 0; i < cars.length; i++) {
        const car = cars[i];

        // Бейдж «Осталась 1» если count равен 1
        let badgeHtml = '';
        if (car.count === 1) {
            badgeHtml = `<div class="badge">Осталась 1</div>`;
        }

        html += `
            <div class="card" onclick="openModal('${brand}', ${i})">
                ${badgeHtml}
                <img src="${car.image}" alt="${car.title}">
                <h3>${car.title}</h3>
                <p class="car-subtitle">Коллекция 2026</p>
                <div class="card-footer">
                    <span class="price">$${car.price.toLocaleString('en-US')}</span>
                    <button class="btn" onclick="event.stopPropagation(); openModal('${brand}', ${i})">Заказать</button>
                </div>
            </div>
        `;
    }

    document.querySelector('.cards').innerHTML = html;
}

// Открытие модального окна с деталями конкретной машины
function openModal(brand, index) {
    const car = data[brand][index];

    document.getElementById('modalImg').src = car.image;
    document.getElementById('modalImg').alt = car.title;
    document.getElementById('modalTitle').textContent = car.title;
    document.getElementById('modalPrice').textContent = `$${car.price.toLocaleString('en-US')}`;
    document.getElementById('modalDesc').textContent = car.description;
    document.getElementById('modalStock').textContent = `В наличии: ${car.count} шт.`;

    // Генерация кружков доступных цветов циклом
    let colorsHtml = '';
    for (let i = 0; i < car.availableColors.length; i++) {
        colorsHtml += `
            <span class="color-dot" style="background: ${car.availableColors[i]}"></span>
        `;
    }
    document.getElementById('modalColors').innerHTML = colorsHtml;

    // Привязываем событие на кнопку «Заказать» внутри модалки
    const orderBtn = document.getElementById('modalOrderBtn');
    orderBtn.onclick = function() {
        alert(`Заявка на ${car.title} принята!`);
        closeModal();
    };

    // Показываем модальное окно
    document.getElementById('modalOverlay').classList.add('open');
}

// Закрытие модального окна
function closeModal() {
    document.getElementById('modalOverlay').classList.remove('open');
}

// Закрытие модалки по клику на тёмную область вокруг неё
document.getElementById('modalOverlay').addEventListener('click', function(event) {
    if (event.target === this) {
        closeModal();
    }
});