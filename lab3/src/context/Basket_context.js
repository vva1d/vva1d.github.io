import { createContext, useState, useEffect } from 'react';

export const BasketContext = createContext();

export function BasketProvider({ children }) {
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart((prevCart) => {
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