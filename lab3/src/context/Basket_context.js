import { createContext, useState, useEffect } from 'react';

export const BasketContext = createContext();

export function BasketProvider({ children }) {
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        const existingItem = cart.find((item) => item.name === product.name);
        if (existingItem) {
            setCart(
                cart.map((item) =>
                    item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item
                )
            );
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
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