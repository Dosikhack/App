// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
let currentPrice = 0;
let currentQty = 1;
let currentProduct = "";

document.addEventListener("DOMContentLoaded", () => {
    tg.ready();
    tg.expand();
    
    // Настройка цветов шапки под темную тему
    tg.setHeaderColor('#09090B');
    tg.setBackgroundColor('#09090B');

    // Подгрузка данных пользователя Telegram (если открыто в TG)
    const user = tg.initDataUnsafe?.user;
    if (user) {
        document.getElementById('prof-name').textContent = user.first_name + (user.last_name ? ' ' + user.last_name : '');
        document.getElementById('prof-username').textContent = user.username ? `@${user.username}` : '';
        document.getElementById('user-id').textContent = `ID: ${user.id}`;
        
        // Получение аватарки пользователя через Bot API обычно делается на бэкенде,
        // Но структура UI подготовлена.
    }

    // Имитация баланса (в реальном приложении подтягивать с бэкенда elon.py)
    const balance = "25 000";
    document.getElementById('user-balance').textContent = balance;
    document.getElementById('prof-balance').textContent = `${balance} 💎`;

    // Инициализация Ripple Effect
    initRipple();
});

// Навигация (Bottom Nav)
function switchTab(tabId) {
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');

    // Скрываем все секции
    document.querySelectorAll('.page-view').forEach(el => {
        el.classList.remove('active');
    });
    // Показываем целевую
    document.getElementById(`tab-${tabId}`).classList.add('active');

    // Обновляем классы кнопок навигации
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.nav-btn[data-target="${tabId}"]`).classList.add('active');
}

// Открытие модалки товара
function openProduct(name, desc, version, price) {
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');

    currentProduct = name;
    currentPrice = price;
    currentQty = 1;

    document.getElementById('m-title').textContent = name;
    document.getElementById('m-desc').textContent = desc;
    document.getElementById('m-version').textContent = version;
    document.getElementById('m-price-unit').textContent = `${price} 💎`;
    
    updateTotal();

    document.getElementById('product-modal').classList.add('active');
}

function closeModal() {
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
    document.getElementById('product-modal').classList.remove('active');
}

// Управление количеством
function changeQty(delta) {
    let newQty = currentQty + delta;
    if (newQty >= 1 && newQty <= 10) {
        if (tg.HapticFeedback) tg.HapticFeedback.selectionChanged();
        currentQty = newQty;
        updateTotal();
    }
}

function updateTotal() {
    document.getElementById('m-qty').textContent = currentQty;
    document.getElementById('m-total').textContent = `${currentPrice * currentQty} 💎`;
}

// Подтверждение покупки
function confirmPurchase() {
    if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    
    // Закрываем окно товара
    closeModal();
    
    // Открываем окно успеха
    const successModal = document.getElementById('success-modal');
    successModal.classList.add('active');
    
    // Автоматическое закрытие через 2.5 сек
    setTimeout(() => {
        successModal.classList.remove('active');
        
        // Отправка данных боту для списания баланса в БД
        /*
        tg.sendData(JSON.stringify({
            action: 'buy',
            product: currentProduct,
            quantity: currentQty,
            total: currentPrice * currentQty
        }));
        */
    }, 2500);
}

// Ripple Effect (Микроанимация клика)
function initRipple() {
    document.addEventListener('click', function(e) {
        const target = e.target.closest('.ripple, .ripple-icon');
        if (!target) return;

        const circle = document.createElement('span');
        const diameter = Math.max(target.clientWidth, target.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - target.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${e.clientY - target.getBoundingClientRect().top - radius}px`;
        circle.classList.add('ripple-effect');

        // Стили для самого круга
        circle.style.position = 'absolute';
        circle.style.borderRadius = '50%';
        circle.style.transform = 'scale(0)';
        circle.style.animation = 'ripple-anim 0.6s linear';
        circle.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
        circle.style.pointerEvents = 'none';

        // Добавляем стили для контейнера, если их нет
        if (getComputedStyle(target).position === 'static') {
            target.style.position = 'relative';
        }
        target.style.overflow = 'hidden';

        target.appendChild(circle);

        setTimeout(() => {
            circle.remove();
        }, 600);
    });
}
