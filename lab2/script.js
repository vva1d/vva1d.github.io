document.addEventListener('DOMContentLoaded', () => {
    // Кошик для зберігання товарів
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Функція для збереження кошика в localStorage
    const saveCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    // Функція для завантаження та відображення товарів
    const displayProducts = () => {
        const productGrid = document.querySelector('.product-grid');
        if (!productGrid) {
            console.error('Елемент .product-grid не знайдено на сторінці');
            return;
        }

        console.log('Завантаження продуктів із ../lab2/json/products.json');
        fetch('../lab2/json/products.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Не вдалося завантажити products.json: ${response.statusText}`);
                }
                return response.json();
            })
            .then(products => {
                console.log('Завантажені продукти:', products);
                if (!products || products.length === 0) {
                    console.warn('Список продуктів порожній або не завантажився');
                    return;
                }

                let index = 0;
                while (index < products.length) {
                    const product = products[index];

                    // Відображаємо товари лише з "В наявності"
                    if (product.availability !== 'В наявності') {
                        console.log(`Товар ${product.name} не відображається: немає в наявності`);
                        index++;
                        continue;
                    }

                    // Перевірка для сторінки "Продукти": не відображаємо товари з акцією
                    const isProductsPage = window.location.pathname.includes('products.html');
                    if (isProductsPage && product.discountPrice !== null && product.discountPrice !== undefined) {
                        console.log(`Товар ${product.name} не відображається на products.html: має акцію`);
                        index++;
                        continue;
                    }

                    // Перевірка для сторінки "Акції": не відображаємо товари без акції
                    const isDiscountPage = window.location.pathname.includes('discounts.html');
                    if (isDiscountPage && (product.discountPrice === null || product.discountPrice === undefined)) {
                        console.log(`Товар ${product.name} не відображається на discounts.html: немає акції`);
                        index++;
                        continue;
                    }

                    console.log(`Відображення товару ${product.name}`);
                    const productCard = document.createElement('article');
                    productCard.className = 'product-card';

                    // На сторінці discounts.html відображаємо знижки
                    const priceToShow = isDiscountPage && product.discountPrice ? product.discountPrice : product.price;

                    const img = document.createElement('img');
                    const imagePath = `../lab1/images/${product.image}`;
                    console.log(`Спроба завантажити зображення: ${imagePath}`);
                    img.src = imagePath;
                    img.alt = product.name;
                    img.onerror = () => {
                        console.error(`Не вдалося завантажити зображення: ${img.src}`);
                        img.src = '../lab1/images/logowebsite.png';
                    };
                    img.onload = () => {
                        console.log(`Зображення успішно завантажено: ${img.src}`);
                    };

                    productCard.appendChild(img);
                    productCard.innerHTML += `
            <h3>${product.name}</h3>
            ${isDiscountPage && product.discountPrice ? `<p><strike>Ціна: ${product.price} грн</strike></p>` : ''}
            <p ${isDiscountPage && product.discountPrice ? 'class="new_price"' : ''}>Ціна: ${priceToShow} грн</p>
            <p>${product.availability}</p>
            <p>Рейтинг: ${'⭐'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}</p>
          `;

                    // Додаємо кнопку "Додати до кошика"
                    const addButton = document.createElement('button');
                    addButton.className = 'add-to-cart';
                    addButton.textContent = 'Додати до кошика';
                    addButton.addEventListener('click', () => addToCart(product, addButton));
                    productCard.appendChild(addButton);

                    const productCardBlock = document.createElement('div');
                    productCardBlock.className = 'product-card_block';
                    productCardBlock.appendChild(productCard);
                    productGrid.appendChild(productCardBlock);

                    index++;
                }

                // Оновлюємо стан кнопок після завантаження товарів
                updateAddToCartButtons();
            })
            .catch(error => console.error('Помилка завантаження продуктів:', error));
    };

    // Функція для додавання товару до кошика
    const addToCart = (product, button) => {
        const price = window.location.pathname.includes('discounts.html') && product.discountPrice
            ? product.discountPrice
            : product.price;

        const existingItem = cart.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name: product.name, price: price, quantity: 1 });
        }

        button.textContent = 'Товар у кошику';
        button.disabled = true;
        saveCart();
        updateCartDisplay();
    };

    // Функція для оновлення відображення кошика
    const updateCartDisplay = () => {
        const cartSection = document.querySelector('.cart-section');
        if (!cartSection) return;

        cartSection.innerHTML = '<h2>Кошик</h2>';
        if (cart.length === 0) {
            cartSection.innerHTML += '<p>Кошик порожній</p>';
            return;
        }

        const cartList = document.createElement('ul');
        let total = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const li = document.createElement('li');
            li.innerHTML = `
        <div class="cart-item">
          <span class="cart-item-name">${item.name} - ${item.price} грн</span>
          <input type="number" min="1" value="${item.quantity}" class="quantity-input" data-index="${index}">
          <span class="cart-item-total">Сума: ${itemTotal} грн</span>
          <button class="remove-item" data-index="${index}">Видалити</button>
        </div>
      `;
            cartList.appendChild(li);
        });

        cartSection.appendChild(cartList);
        cartSection.innerHTML += `<p><strong>Загальна сума: ${total} грн</strong></p>`;

        // Додаємо обробники подій для зміни кількості
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const index = e.target.dataset.index;
                const newQuantity = parseInt(e.target.value);
                if (newQuantity >= 1) {
                    cart[index].quantity = newQuantity;
                    saveCart();
                    updateCartDisplay();
                }
            });
        });

        // Додаємо обробники подій для видалення товарів
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                cart.splice(index, 1);
                saveCart();
                updateCartDisplay();
                updateAddToCartButtons();
            });
        });
    };

    // Функція для оновлення стану кнопок "Додати до кошика"
    const updateAddToCartButtons = () => {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const productName = card.querySelector('h3').textContent;
            const button = card.querySelector('.add-to-cart');
            if (button) {
                const inCart = cart.some(item => item.name === productName);
                if (inCart) {
                    button.textContent = 'Товар у кошику';
                    button.disabled = true;
                } else {
                    button.textContent = 'Додати до кошика';
                    button.disabled = false;
                }
            }
        });
    };

    // Ініціалізація
    console.log('Поточний шлях:', window.location.pathname);
    if (window.location.pathname.includes('products.html') || window.location.pathname.includes('discounts.html')) {
        console.log('Викликається displayProducts');
        displayProducts();
    } else {
        console.log('displayProducts не викликається: сторінка не products.html або discounts.html');
    }
    updateCartDisplay();
    updateAddToCartButtons();
});