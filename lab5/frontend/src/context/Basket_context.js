import { createContext, useState, useEffect } from 'react';

export const BasketContext = createContext();

export function BasketProvider({ children }) {
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart((prevCart) => {
            // Перевіряємо, чи товар уже є в кошику
            const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
            if (existingItemIndex !== -1) {
                // Якщо товар уже є, збільшуємо кількість
                const updatedCart = [...prevCart];
                updatedCart[existingItemIndex] = {
                    ...updatedCart[existingItemIndex],
                    quantity: updatedCart[existingItemIndex].quantity + 1,
                };
                return updatedCart;
            }
            // Якщо товару немає, додаємо його з quantity: 1
            const productToAdd = { ...product, quantity: 1 };
            if (product.discountPrice) {
                productToAdd.price = product.discountPrice; // Замінюємо price на discountPrice, якщо є
            }
            return [...prevCart, productToAdd];
        });
    };

    const updateQuantity = (index, newQuantity) => {
        if (newQuantity >= 1) {
            setCart(
                cart.map((item, i) => (i === index ? { ...item, quantity: newQuantity } : item))
            );
        }
    };

    const removeFromCart = (index) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    return (
        <BasketContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart }}>
            {children}
        </BasketContext.Provider>
    );
}