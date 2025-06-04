// Імпортуємо необхідні модулі
const admin = require('firebase-admin');
const fs = require('fs');

// Ініціалізація Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json'); // Шлях до твого сервісного ключа

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Функція для міграції даних
async function migrateProductsToFirestore() {
    try {
        // Зчитуємо products.json із правильного шляху
        const productsData = JSON.parse(fs.readFileSync('./public/data/products.json', 'utf8'));

        // Перебираємо продукти
        for (let i = 0; i < productsData.length; i++) {
            const product = productsData[i];
            const productId = `${product.name.replace(/\s+/g, '-').toLowerCase()}-${i}`; // Унікальний ID на основі назви та індексу

            // Додаємо продукт до колекції 'products'
            await db.collection('products').doc(productId).set({
                name: product.name,
                price: product.price,
                discountPrice: product.discountPrice || null,
                availability: product.availability,
                rating: product.rating,
                image: product.image,
            });
            console.log(`Додано продукт: ${product.name} (ID: ${productId})`);
        }

        console.log('Міграція завершена успішно!');
    } catch (error) {
        console.error('Помилка під час міграції:', error);
    } finally {
        // Завершуємо процес
        process.exit(0);
    }
}

// Запускаємо міграцію
migrateProductsToFirestore();