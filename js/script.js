let data = {};
let activeBrand = 'mercedes';
let currentCar = null;

const brandNames = {
    mercedes: 'Mercedes-Benz',
    bmw: 'BMW',
    porsche: 'Porsche'
};

axios.get('data/data.json')
    .then(function (response) {
        data = response.data;
        console.log(data);
        renderCards(activeBrand);
    })
    .catch(function (error) {
        console.error('Не удалось загрузить data.json. Откройте проект через Live Server.', error);
    });

// ---------- Вкладки ----------
const tabs = document.querySelectorAll('.tab');

for (let i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener('click', function () {
        activeBrand = tabs[i].dataset.brand;

        for (let j = 0; j < tabs.length; j++) {
            tabs[j].classList.remove('active');
        }
        tabs[i].classList.add('active');

        renderCards(activeBrand);
    });
}

// ---------- Карточки ----------
function renderCards(brand) {
    const cars = data[brand];
    let html = '';

    for (let i = 0; i < cars.length; i++) {
        const car = cars[i];

        let badge = '';
        if (car.count === 1) {
            badge = '<span class="badge"><i class="badge-dot"></i>Осталась 1</span>';
        }

        html = html + `
      <div class="card" onclick="openModal('${brand}', ${i})">
        <div class="photo">
          <span class="ph">Фото: ${car.title}</span>
          <img src="${car.image}" alt="${car.title}" onerror="this.remove()">
          ${badge}
        </div>
        <h3>${car.title}</h3>
        <div class="card-bottom">
          <p class="price">$${car.price.toLocaleString('en-US')}</p>
          <button class="btn" onclick="event.stopPropagation(); orderCar('${car.title}')">Заказать</button>
        </div>
      </div>
    `;
    }

    document.querySelector('.cards').innerHTML = html;
    document.getElementById('brand-title').textContent = brandNames[brand];
    document.getElementById('brand-count').textContent = cars.length + ' моделей в салоне';
}

// ---------- Модальное окно ----------
function openModal(brand, index) {
    const car = data[brand][index];
    currentCar = car;

    let colorsHtml = '';
    for (let i = 0; i < car.availableColors.length; i++) {
        const selected = i === 0 ? ' selected' : '';
        colorsHtml = colorsHtml + `
      <span class="color-dot${selected}" style="background: ${car.availableColors[i]}"
            onclick="selectColor(this)"></span>
    `;
    }

    document.getElementById('modal-photo').innerHTML = `
    <span class="ph">Фото: ${car.title}</span>
    <img src="${car.image}" alt="${car.title}" onerror="this.remove()">
  `;
    document.getElementById('modal-brand').textContent = brandNames[brand];
    document.getElementById('modal-title').textContent = car.title;
    document.getElementById('modal-price').textContent = '$' + car.price.toLocaleString('en-US');
    document.getElementById('modal-desc').textContent = car.description;
    document.getElementById('modal-count').textContent = car.count + ' шт.';
    document.getElementById('modal-colors').innerHTML = colorsHtml;

    document.getElementById('modal').classList.add('open');
}

function closeModal() {
    document.getElementById('modal').classList.remove('open');
}

function selectColor(el) {
    const dots = document.querySelectorAll('#modal-colors .color-dot');
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove('selected');
    }
    el.classList.add('selected');
}

function orderCar(title) {
    alert('Заявка на ' + title + ' принята!');
}

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-order').addEventListener('click', function () {
    orderCar(currentCar.title);
});