const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const path = require("path");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
const app = express();

// Middleware
app.use(cors({ origin: /^http:\/\/localhost:(3000|56568|3009)$/ })); // Дозволяємо запити з локальних портів
app.use(express.json());

// Хостинг статичних файлів з фронтенду
const publicPath = path.resolve(__dirname, '../frontend/public');
app.use(express.static(publicPath));

// Middleware для автентифікації
const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Валідація товару для списку бажань
const validateWishlistItem = (item) => {
    if (!item.id || !item.name || !item.price) {
        return false;
    }
    return true;
};

// Основні маршрути
app.get("/api/message", (req, res) => {
    res.json({ message: "Hello from the backend!" });
});

app.get("/api/users", async (req, res) => {
    try {
        const snapshot = await db.collection("users").get();
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});

// Реєстрація нового користувача
app.post("/api/register", async (req, res) => {
    const { email, password, lastName, firstName, middleName, phoneNumber } = req.body;
    try {
        const userRecord = await admin.auth().createUser({
            email,
            password,
        });
        await db.collection("users").doc(userRecord.uid).set({
            email,
            lastName,
            firstName,
            middleName,
            phoneNumber,
            wishlist: [],
        });
        res.status(201).json({ message: "User registered", uid: userRecord.uid });
    } catch (error) {
        console.error("Registration failed:", error);
        res.status(400).json({ message: "Registration failed", error: error.message });
    }
});

// Логін користувача
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const userCredential = await admin.auth().getUserByEmail(email);
        const token = await admin.auth().createCustomToken(userCredential.uid);
        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login failed:", error);
        res.status(400).json({ message: "Login failed", error: error.message });
    }
});

// Профіль користувача
app.get("/api/profile", verifyToken, async (req, res) => {
    try {
        const userDoc = await db.collection("users").doc(req.user.uid).get();
        if (!userDoc.exists) return res.status(404).json({ message: "User not found" });
        res.json(userDoc.data());
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
});

// Отримання списку бажань
app.get("/api/wishlist", verifyToken, async (req, res) => {
    try {
        const userDoc = await db.collection("users").doc(req.user.uid).get();
        if (!userDoc.exists) return res.status(404).json({ message: "User not found" });
        const wishlist = userDoc.data().wishlist || [];
        res.json(wishlist);
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({ message: "Error fetching wishlist", error: error.message });
    }
});

// Додавання товару до списку бажань
app.post("/api/wishlist", verifyToken, async (req, res) => {
    const { item } = req.body;
    if (!validateWishlistItem(item)) {
        return res.status(400).json({ message: "Invalid wishlist item" });
    }
    try {
        const userDoc = await db.collection("users").doc(req.user.uid).get();
        if (!userDoc.exists) return res.status(404).json({ message: "User not found" });
        const currentWishlist = userDoc.data().wishlist || [];
        if (currentWishlist.some(w => w.id === item.id)) {
            return res.status(400).json({ message: "Item already in wishlist" });
        }
        const updatedWishlist = [...currentWishlist, item];
        await db.collection("users").doc(req.user.uid).update({ wishlist: updatedWishlist });
        res.status(201).json({ message: "Item added to wishlist", wishlist: updatedWishlist });
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(500).json({ message: "Error adding to wishlist", error: error.message });
    }
});

// Перенесення товару до кошика
app.post("/api/move-to-cart", verifyToken, async (req, res) => {
    const { itemId } = req.body;
    if (!itemId) {
        return res.status(400).json({ message: "Item ID is required" });
    }
    try {
        const userDoc = await db.collection("users").doc(req.user.uid).get();
        if (!userDoc.exists) return res.status(404).json({ message: "User not found" });
        const currentWishlist = userDoc.data().wishlist || [];
        const itemToRemove = currentWishlist.find(item => item.id === itemId);
        if (!itemToRemove) {
            return res.status(404).json({ message: "Item not found in wishlist" });
        }
        const updatedWishlist = currentWishlist.filter(item => item.id !== itemId);
        await db.collection("users").doc(req.user.uid).update({ wishlist: updatedWishlist });
        res.status(200).json({ message: "Item moved to cart", wishlist: updatedWishlist });
    } catch (error) {
        console.error("Error moving to cart:", error);
        res.status(500).json({ message: "Error moving to cart", error: error.message });
    }
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});